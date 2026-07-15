#include <Arduino.h>
#if !defined(WAVESHARE_ESP32_DRIVER_V3)
#include <USB.h>
#include <USBCDC.h>
#endif

#include <array>
#include <cstdio>
#include <cstring>

#include "epd3in52.h"

namespace {

#if defined(WAVESHARE_ESP32_DRIVER_V3)
// Fixed by the Waveshare e-Paper ESP32 Driver Board V3 schematic. On published
// Rev 3 hardware R35 is DNP, so GPIO4 does NOT switch the module's own EPD rail.
// The passive badge harness does not carry GPIO4. The module is powered only by
// USB-C, and its onboard FPC connector must remain empty.
constexpr int kEpdCs = 15;
constexpr int kEpdMosi = 14;
constexpr int kEpdSclk = 13;
constexpr int kEpdDc = 27;
constexpr int kEpdReset = 26;
constexpr int kEpdBusyN = 25;
constexpr const char *kControllerName = "waveshare-esp32-driver-v3";
constexpr const char *kPowerMode = "usb-continuous";
constexpr const char *kSuccessStatus = "OK SLEEP USB_POWERED";
constexpr const char *kBusyTimeoutStatus = "ERR BUSY_TIMEOUT USB_POWERED";
HardwareSerial &ProgrammerSerial = Serial;
#else
constexpr int kEpdCs = D5;
constexpr int kEpdMosi = D6;
constexpr int kEpdSclk = D7;
constexpr int kEpdDc = D8;
constexpr int kEpdReset = D9;
constexpr int kEpdBusyN = D10;
constexpr int kTargetPowerEnable = D4;
constexpr const char *kControllerName = "xiao-esp32s3";
constexpr const char *kPowerMode = "switched-target";
constexpr const char *kSuccessStatus = "OK SLEEP POWER_OFF";
constexpr const char *kBusyTimeoutStatus = "ERR BUSY_TIMEOUT POWER_OFF";
USBCDC ProgrammerSerial;
#endif

constexpr uint32_t kFrameReceiveTimeoutMs = 15000;
constexpr uint32_t kDeepSleepSettleMs = 2000;
constexpr uint32_t kPowerOffSettleMs = 2000;
constexpr size_t kCommandCapacity = 64;

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
      "INFO controller=%s waveshare=3.52in width=%u height=%u bytes=%u spi_hz=%lu "
      "busy=active-low power=%s\r\n",
      kControllerName,
      static_cast<unsigned>(Epd3in52::kWidth),
      static_cast<unsigned>(Epd3in52::kHeight),
      static_cast<unsigned>(Epd3in52::kFrameBytes),
      static_cast<unsigned long>(Epd3in52::kSpiFrequency), kPowerMode);
}

void configureTargetPower() {
#if !defined(WAVESHARE_ESP32_DRIVER_V3)
  pinMode(kTargetPowerEnable, OUTPUT);
  digitalWrite(kTargetPowerEnable, LOW);
#endif
}

void setTargetPower(bool enabled) {
#if defined(WAVESHARE_ESP32_DRIVER_V3)
  // Deliberate no-op: the passive harness has no power-enable conductor and
  // GPIO4 must remain untouched. USB-C continuously powers module and badge.
  (void)enabled;
#else
  digitalWrite(kTargetPowerEnable, enabled ? HIGH : LOW);
#endif
}

void programBufferedFrame() {
  ProgrammerSerial.println("PROGRAMMING");

  // XIAO D4 controls the shared adapter's target rail. This call is a no-op on
  // the USB-powered Waveshare target, whose passive harness omits GPIO4.
  setTargetPower(true);
  delay(20);
  display.begin();
  const bool refreshed = display.programFrame(frameBuffer.data());
  // Waveshare's reference waits two seconds after the 0x07/A5 deep-sleep
  // command. Let the panel finish that transition before the XIAO removes its
  // target rail or the continuously USB-powered target reports completion.
  if (refreshed) delay(kDeepSleepSettleMs);
  display.end();
  setTargetPower(false);
#if !defined(WAVESHARE_ESP32_DRIVER_V3)
  // Do not announce safe probe removal until the switched XIAO supply has been
  // off long enough to settle. On a timeout, cut power first and then wait too.
  delay(kPowerOffSettleMs);
#endif

  if (refreshed) {
    ProgrammerSerial.println(kSuccessStatus);
  } else {
    ProgrammerSerial.println(kBusyTimeoutStatus);
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
  configureTargetPower();

  ProgrammerSerial.begin(115200);
#if !defined(WAVESHARE_ESP32_DRIVER_V3)
  USB.manufacturerName("AISB");
  USB.productName("3.52in e-Paper Programmer");
  USB.usbPower(100);
  USB.begin();
#endif

  ProgrammerSerial.println("READY AISB-EPD-PROGRAMMER 3");
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
