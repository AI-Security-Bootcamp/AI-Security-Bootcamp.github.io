#include <Arduino.h>
#include <USB.h>
#include <USBCDC.h>

#include <array>
#include <cstdio>
#include <cstring>

#include "epd3in52.h"

namespace {

constexpr int kEpdCs = D5;
constexpr int kEpdMosi = D6;
constexpr int kEpdSclk = D7;
constexpr int kEpdDc = D8;
constexpr int kEpdReset = D9;
constexpr int kEpdBusyN = D10;
constexpr int kTargetPowerEnable = D4;

constexpr uint32_t kFrameReceiveTimeoutMs = 15000;
constexpr uint32_t kDeepSleepSettleMs = 2000;
constexpr uint32_t kPowerOffSettleMs = 2000;
constexpr size_t kCommandCapacity = 64;

USBCDC ProgrammerSerial;
Epd3in52 display(SPI, kEpdMosi, kEpdSclk, kEpdCs, kEpdDc, kEpdReset,
                 kEpdBusyN);
std::array<uint8_t, Epd3in52::kFrameBytes> frameBuffer{};

char commandBuffer[kCommandCapacity] = {};
size_t commandLength = 0;
size_t frameBytesReceived = 0;
uint32_t frameReceiveStartedAt = 0;
bool receivingFrame = false;

void printInfo() {
  ProgrammerSerial.printf(
      "INFO waveshare=3.52in width=%u height=%u bytes=%u spi_hz=%lu "
      "busy=active-low\r\n",
      static_cast<unsigned>(Epd3in52::kWidth),
      static_cast<unsigned>(Epd3in52::kHeight),
      static_cast<unsigned>(Epd3in52::kFrameBytes),
      static_cast<unsigned long>(Epd3in52::kSpiFrequency));
}

void programBufferedFrame() {
  ProgrammerSerial.println("PROGRAMMING");

  // D4 controls the load-switch enable on the shared programmer adapter. A
  // direct 3V3 prototype still works; D4 is simply left unconnected there.
  digitalWrite(kTargetPowerEnable, HIGH);
  delay(20);
  display.begin();
  const bool refreshed = display.programFrame(frameBuffer.data());
  // Waveshare's reference waits two seconds after the 0x07/A5 deep-sleep
  // command.  Let the panel finish that transition before removing its rail.
  if (refreshed) delay(kDeepSleepSettleMs);
  display.end();
  digitalWrite(kTargetPowerEnable, LOW);
  // Do not announce safe probe removal until the switched supply has been off
  // long enough to settle.  On a timeout, cut power first and then wait too.
  delay(kPowerOffSettleMs);

  if (refreshed) {
    ProgrammerSerial.println("OK SLEEP POWER_OFF");
  } else {
    ProgrammerSerial.println("ERR BUSY_TIMEOUT POWER_OFF");
  }
}

void beginFrameReceive(size_t byteCount) {
  if (byteCount != Epd3in52::kFrameBytes) {
    ProgrammerSerial.printf("ERR FRAME_SIZE expected=%u\r\n",
                            static_cast<unsigned>(Epd3in52::kFrameBytes));
    return;
  }

  frameBytesReceived = 0;
  frameReceiveStartedAt = millis();
  receivingFrame = true;
  ProgrammerSerial.printf("SEND %u\r\n",
                          static_cast<unsigned>(Epd3in52::kFrameBytes));
}

void processCommand(const char *command) {
  if (strcmp(command, "PING") == 0) {
    ProgrammerSerial.println("PONG");
    return;
  }

  if (strcmp(command, "INFO") == 0) {
    printInfo();
    return;
  }

  if (strcmp(command, "WHITE") == 0) {
    frameBuffer.fill(0xff);
    programBufferedFrame();
    return;
  }

  unsigned long requestedBytes = 0;
  char trailing = '\0';
  if (sscanf(command, "FRAME %lu %c", &requestedBytes, &trailing) == 1) {
    beginFrameReceive(static_cast<size_t>(requestedBytes));
    return;
  }

  ProgrammerSerial.println(
      "ERR COMMAND use=PING|INFO|WHITE|FRAME_10800_BYTES");
}

void receiveFrameBytes() {
  while (ProgrammerSerial.available() > 0 &&
         frameBytesReceived < frameBuffer.size()) {
    const int nextByte = ProgrammerSerial.read();
    if (nextByte < 0) break;
    frameBuffer[frameBytesReceived++] = static_cast<uint8_t>(nextByte);
  }

  if (frameBytesReceived == frameBuffer.size()) {
    receivingFrame = false;
    programBufferedFrame();
    return;
  }

  if (millis() - frameReceiveStartedAt > kFrameReceiveTimeoutMs) {
    receivingFrame = false;
    ProgrammerSerial.printf("ERR FRAME_TIMEOUT received=%u expected=%u\r\n",
                            static_cast<unsigned>(frameBytesReceived),
                            static_cast<unsigned>(frameBuffer.size()));
  }
}

void receiveCommands() {
  while (ProgrammerSerial.available() > 0) {
    const int nextByte = ProgrammerSerial.read();
    if (nextByte < 0) return;

    const char character = static_cast<char>(nextByte);
    if (character == '\r') continue;

    if (character == '\n') {
      commandBuffer[commandLength] = '\0';
      if (commandLength > 0) processCommand(commandBuffer);
      commandLength = 0;

      // FRAME switches the parser to binary mode. Leave any already-buffered
      // frame bytes for receiveFrameBytes() so newline-like pixel data is not
      // interpreted as another command.
      if (receivingFrame) return;
      continue;
    }

    if (commandLength + 1 >= kCommandCapacity) {
      commandLength = 0;
      ProgrammerSerial.println("ERR COMMAND_TOO_LONG");
      continue;
    }

    commandBuffer[commandLength++] = character;
  }
}

}  // namespace

void setup() {
  pinMode(kTargetPowerEnable, OUTPUT);
  digitalWrite(kTargetPowerEnable, LOW);

  ProgrammerSerial.begin(115200);
  USB.manufacturerName("AISB");
  USB.productName("3.52in e-Paper Programmer");
  USB.usbPower(100);
  USB.begin();

  ProgrammerSerial.println("READY AISB-EPD-PROGRAMMER 2");
  printInfo();
}

void loop() {
  if (receivingFrame) {
    receiveFrameBytes();
  } else {
    receiveCommands();
  }
  delay(1);
}
