/*
 * Waveshare 3.52-inch black/white e-paper programmer driver.
 *
 * The controller initialization and GC waveform data are adapted from
 * Waveshare's MIT-licensed EPD_3in52 driver, version 1.0 (2022-05-07):
 * https://github.com/waveshareteam/e-Paper/tree/master/Arduino/epd3in52
 *
 * Copyright (c) Waveshare
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

#include "epd3in52.h"

namespace {

constexpr uint8_t kGcR20[] = {
    0x01, 0x0f, 0x0f, 0x0f, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

constexpr uint8_t kGcR21[] = {
    0x01, 0x4f, 0x8f, 0x0f, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

constexpr uint8_t kGcR22[] = {
    0x01, 0x0f, 0x8f, 0x0f, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

constexpr uint8_t kGcR23[] = {
    0x01, 0x4f, 0x8f, 0x4f, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

constexpr uint8_t kGcR24[] = {
    0x01, 0x0f, 0x8f, 0x4f, 0x01, 0x01, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

static_assert(sizeof(kGcR20) == 56);
static_assert(sizeof(kGcR21) == 42);
static_assert(sizeof(kGcR22) == 56);
static_assert(sizeof(kGcR23) == 56);
static_assert(sizeof(kGcR24) == 42);

}  // namespace

Epd3in52::Epd3in52(SPIClass &spi, int mosiPin, int clockPin,
                   int chipSelectPin, int dataCommandPin, int resetPin,
                   int busyNPin)
    : spi_(spi),
      mosiPin_(mosiPin),
      clockPin_(clockPin),
      chipSelectPin_(chipSelectPin),
      dataCommandPin_(dataCommandPin),
      resetPin_(resetPin),
      busyNPin_(busyNPin) {}

void Epd3in52::begin() {
  pinMode(chipSelectPin_, OUTPUT);
  pinMode(dataCommandPin_, OUTPUT);
  pinMode(resetPin_, OUTPUT);
  // BUSY_N is a push-pull panel output. Do not enable an MCU pull-up because
  // the programmer may be powered while the detachable badge is not.
  pinMode(busyNPin_, INPUT);

  digitalWrite(chipSelectPin_, HIGH);
  digitalWrite(dataCommandPin_, LOW);
  digitalWrite(resetPin_, LOW);

  spi_.begin(clockPin_, -1, mosiPin_, chipSelectPin_);
}

void Epd3in52::end() {
  digitalWrite(chipSelectPin_, HIGH);
  spi_.end();

  // Do not let an always-powered programmer backfeed a powered-down badge
  // through its SPI pins between registration operations.
  pinMode(mosiPin_, INPUT);
  pinMode(clockPin_, INPUT);
  pinMode(chipSelectPin_, INPUT);
  pinMode(dataCommandPin_, INPUT);
  pinMode(resetPin_, INPUT);
  pinMode(busyNPin_, INPUT);
}

bool Epd3in52::programFrame(const uint8_t *frame,
                           uint32_t busyTimeoutMs) {
  if (frame == nullptr) return false;

  initializeController();
  sendCommand(0x13);  // Data Start Transmission 2 / new image.
  sendData(frame, kFrameBytes);
  loadGcWaveform();

  const bool completed = refresh(busyTimeoutMs);
  if (completed) sleep();
  return completed;
}

void Epd3in52::hardwareReset() {
  digitalWrite(resetPin_, HIGH);
  delay(200);
  digitalWrite(resetPin_, LOW);
  delay(2);
  digitalWrite(resetPin_, HIGH);
  delay(200);
}

void Epd3in52::initializeController() {
  hardwareReset();

  sendCommand(0x00);  // Panel setting.
  sendData(0xff);
  sendData(0x01);

  sendCommand(0x01);  // Power setting.
  sendData(0x03);
  sendData(0x10);
  sendData(0x3f);
  sendData(0x3f);
  sendData(0x03);

  sendCommand(0x06);  // Booster soft start.
  sendData(0x37);
  sendData(0x3d);
  sendData(0x3d);

  sendCommand(0x60);  // TCON setting.
  sendData(0x22);

  sendCommand(0x82);  // VCOM DC setting.
  sendData(0x07);

  sendCommand(0x30);
  sendData(0x09);

  sendCommand(0xe3);  // Power saving.
  sendData(0x88);

  sendCommand(0x61);  // Resolution: 240 x 360.
  sendData(0xf0);
  sendData(0x01);
  sendData(0x68);

  sendCommand(0x50);
  sendData(0xb7);
}

void Epd3in52::loadGcWaveform() {
  sendCommand(0x20);
  sendData(kGcR20, sizeof(kGcR20));

  sendCommand(0x21);
  sendData(kGcR21, sizeof(kGcR21));

  sendCommand(0x24);
  sendData(kGcR24, sizeof(kGcR24));

  sendCommand(0x22);
  sendData(kGcR22, sizeof(kGcR22));

  // The Waveshare reference driver intentionally transfers the first 42
  // bytes of this 56-byte table for the initial GC waveform state.
  sendCommand(0x23);
  sendData(kGcR23, 42);
}

void Epd3in52::sendCommand(uint8_t command) {
  digitalWrite(dataCommandPin_, LOW);
  digitalWrite(chipSelectPin_, LOW);
  spi_.beginTransaction(
      SPISettings(kSpiFrequency, MSBFIRST, SPI_MODE0));
  spi_.transfer(command);
  spi_.endTransaction();
  digitalWrite(chipSelectPin_, HIGH);
}

void Epd3in52::sendData(uint8_t data) { sendData(&data, 1); }

void Epd3in52::sendData(const uint8_t *data, size_t length) {
  digitalWrite(dataCommandPin_, HIGH);
  digitalWrite(chipSelectPin_, LOW);
  spi_.beginTransaction(
      SPISettings(kSpiFrequency, MSBFIRST, SPI_MODE0));
  for (size_t index = 0; index < length; ++index) {
    spi_.transfer(data[index]);
  }
  spi_.endTransaction();
  digitalWrite(chipSelectPin_, HIGH);
}

bool Epd3in52::refresh(uint32_t busyTimeoutMs) {
  sendCommand(0x17);
  sendData(0xa5);
  // A missing badge leaves BUSY_N high. Requiring an active-low assertion
  // distinguishes that case from a refresh that completed implausibly fast.
  if (!waitForBusyAssertion(500)) return false;
  if (!waitUntilIdle(busyTimeoutMs)) return false;
  delay(200);
  return true;
}

bool Epd3in52::waitForBusyAssertion(uint32_t timeoutMs) {
  const uint32_t startedAt = millis();
  while (digitalRead(busyNPin_) != LOW) {
    if (millis() - startedAt >= timeoutMs) return false;
    delay(1);
  }
  return true;
}

bool Epd3in52::waitUntilIdle(uint32_t timeoutMs) {
  const uint32_t startedAt = millis();
  while (digitalRead(busyNPin_) == LOW) {
    if (millis() - startedAt >= timeoutMs) return false;
    delay(1);
  }
  return true;
}

void Epd3in52::sleep() {
  sendCommand(0x07);
  sendData(0xa5);
}
