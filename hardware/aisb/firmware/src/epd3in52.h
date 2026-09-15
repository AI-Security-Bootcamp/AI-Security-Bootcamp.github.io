#pragma once

#include <Arduino.h>
#include <SPI.h>

class Epd3in52 {
 public:
  static constexpr uint16_t kWidth = 240;
  static constexpr uint16_t kHeight = 360;
  static constexpr size_t kFrameBytes =
      static_cast<size_t>(kWidth) * kHeight / 8;
  static constexpr uint32_t kSpiFrequency = 2000000;

  Epd3in52(SPIClass &spi, int mosiPin, int clockPin, int chipSelectPin,
           int dataCommandPin, int resetPin, int busyNPin);

  void begin();
  void end();

  // Performs a full GC refresh and then puts the panel into deep sleep. The
  // input uses the panel's native 240x360, row-major format: 1=white, 0=black.
  bool programFrame(const uint8_t *frame,
                    uint32_t busyTimeoutMs = 15000);

 private:
  void hardwareReset();
  void initializeController();
  void loadGcWaveform();
  void sendCommand(uint8_t command);
  void sendData(uint8_t data);
  void sendData(const uint8_t *data, size_t length);
  bool refresh(uint32_t busyTimeoutMs);
  bool waitForBusyAssertion(uint32_t timeoutMs);
  bool waitUntilIdle(uint32_t timeoutMs);
  void sleep();

  SPIClass &spi_;
  int mosiPin_;
  int clockPin_;
  int chipSelectPin_;
  int dataCommandPin_;
  int resetPin_;
  int busyNPin_;
};
