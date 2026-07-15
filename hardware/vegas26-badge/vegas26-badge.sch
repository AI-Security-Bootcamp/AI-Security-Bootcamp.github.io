EESchema Schematic File Version 4
LIBS:power
LIBS:device
LIBS:Connector_Generic
LIBS:Transistor_FET
EELAYER 29 0
EELAYER END
$Descr A4 11693 8268
Sheet 1 1
Title "AISB Vegas 2026 Raw E-Paper Badge"
Date "2026-07-15"
Rev "2"
Comp "AI Security Bootcamp"
Comment1 "Prototype only - verify panel revision, J1 fit, and mirrored terminal order"
Comment2 "Raw 3.52in panel; passive support circuit; J3 probe plus optional J4 ribbon"
Comment3 "No MCU, battery, MIDI, or touch circuitry on the badge; external controllers only"
$EndDescr
Text Notes 650 650 0    118  ~ 24
REVISION 1 ARCHITECTURE
Text Notes 650 900 0    60   ~ 12
The 3.65 mm flex stays straight into right-facing front J1; footprint pads use panel numbering and mirror Hirose terminals.
Text Notes 650 1050 0    60   ~ 12
J3 power must be off before attaching/removing the probe. Update, deep-sleep the panel, then remove 3V3.
Text Notes 650 1200 0    60   ~ 12
Current V1.1 panel table calls pin 4 NC; C15 is retained only as a DNP prototype option.

Text Notes 700 1375 0    79   ~ 16
RAW WAVESHARE 3.52-INCH PANEL / 24-PIN 0.5 MM FLEX
$Comp
L Connector_Generic:Conn_01x24 J1
U 1 1 20000001
P 2100 2550
F 0 "J1" H 2180 2542 50  0000 L CNN
F 1 "RAW_EPD_FPC_24" H 2180 2451 50  0000 L CNN
F 2 "Badge:Hirose_FH34SRJ-24S-0.5SH_24P_P0.50mm_Horizontal" H 2100 2550 50  0001 C CNN
	1    2100 2550
	1    0    0    -1
$EndComp
Text Label 1350 1450 2    50   ~ 0
NC_1
Text Label 1350 1550 2    50   ~ 0
GDR
Text Label 1350 1650 2    50   ~ 0
RESE
Text Label 1350 1750 2    50   ~ 0
LEGACY_NC
Text Label 1350 1850 2    50   ~ 0
VDHR
Text Label 1350 1950 2    50   ~ 0
TSCL_NC
Text Label 1350 2050 2    50   ~ 0
TSDA_NC
Text Label 1350 2150 2    50   ~ 0
BS
Text Label 1350 2250 2    50   ~ 0
EPD_BUSY
Text Label 1350 2350 2    50   ~ 0
EPD_RST
Text Label 1350 2450 2    50   ~ 0
EPD_DC
Text Label 1350 2550 2    50   ~ 0
EPD_CS
Text Label 1350 2650 2    50   ~ 0
EPD_CLK
Text Label 1350 2750 2    50   ~ 0
EPD_MOSI
Text Label 1350 2850 2    50   ~ 0
3V3
Text Label 1350 2950 2    50   ~ 0
3V3
Text Label 1350 3050 2    50   ~ 0
DGND
Text Label 1350 3150 2    50   ~ 0
VDDD
Text Label 1350 3250 2    50   ~ 0
VPP
Text Label 1350 3350 2    50   ~ 0
VSH
Text Label 1350 3450 2    50   ~ 0
VGH
Text Label 1350 3550 2    50   ~ 0
VSL
Text Label 1350 3650 2    50   ~ 0
VGL
Text Label 1350 3750 2    50   ~ 0
VCOM
Wire Wire Line
	1350 1450 1900 1450
Wire Wire Line
	1350 1550 1900 1550
Wire Wire Line
	1350 1650 1900 1650
Wire Wire Line
	1350 1750 1900 1750
Wire Wire Line
	1350 1850 1900 1850
Wire Wire Line
	1350 1950 1900 1950
Wire Wire Line
	1350 2050 1900 2050
Wire Wire Line
	1350 2150 1900 2150
Wire Wire Line
	1350 2250 1900 2250
Wire Wire Line
	1350 2350 1900 2350
Wire Wire Line
	1350 2450 1900 2450
Wire Wire Line
	1350 2550 1900 2550
Wire Wire Line
	1350 2650 1900 2650
Wire Wire Line
	1350 2750 1900 2750
Wire Wire Line
	1350 2850 1900 2850
Wire Wire Line
	1350 2950 1900 2950
Wire Wire Line
	1350 3050 1900 3050
Wire Wire Line
	1350 3150 1900 3150
Wire Wire Line
	1350 3250 1900 3250
Wire Wire Line
	1350 3350 1900 3350
Wire Wire Line
	1350 3450 1900 3450
Wire Wire Line
	1350 3550 1900 3550
Wire Wire Line
	1350 3650 1900 3650
Wire Wire Line
	1350 3750 1900 3750
Text Notes 700 3975 0    50   ~ 10
Pins 1, 6 and 7 are not used. Pin 8 / BS is strapped to DGND through R13 for 4-wire SPI.

Text Notes 7900 1375 0    79   ~ 16
EXTERNAL CONTROLLER CONTACTS
$Comp
L Connector_Generic:Conn_01x10 J3
U 1 1 20000002
P 10200 1900
F 0 "J3" H 10280 1892 50  0000 L CNN
F 1 "TC2050_IDC_NL_DNL" H 10280 1801 50  0000 L CNN
F 2 "Connector:Tag-Connect_TC2050-IDC-NL_2x05_P1.27mm_Vertical" H 10200 1900 50  0001 C CNN
	1    10200 1900
	1    0    0    -1
$EndComp
Text Label 9400 1450 2    50   ~ 0
3V3
Text Label 9400 1550 2    50   ~ 0
DGND
Text Label 9400 1650 2    50   ~ 0
EXT_MOSI
Text Label 9400 1750 2    50   ~ 0
EXT_CLK
Text Label 9400 1850 2    50   ~ 0
EXT_CS
Text Label 9400 1950 2    50   ~ 0
EXT_DC
Text Label 9400 2050 2    50   ~ 0
EXT_RST
Text Label 9400 2150 2    50   ~ 0
EXT_BUSY
Text Label 9400 2250 2    50   ~ 0
DGND
Text Label 9400 2350 2    50   ~ 0
3V3
Wire Wire Line
	9400 1450 10000 1450
Wire Wire Line
	9400 1550 10000 1550
Wire Wire Line
	9400 1650 10000 1650
Wire Wire Line
	9400 1750 10000 1750
Wire Wire Line
	9400 1850 10000 1850
Wire Wire Line
	9400 1950 10000 1950
Wire Wire Line
	9400 2050 10000 2050
Wire Wire Line
	9400 2150 10000 2150
Wire Wire Line
	9400 2250 10000 2250
Wire Wire Line
	9400 2350 10000 2350
Text Notes 7900 2550 0    50   ~ 10
Physical pins: 1/10=3V3, 2/9=DGND, 3=MOSI, 4=CLK, 5=CS_N, 6=DC, 7=RST_N, 8=BUSY_N.
Text Notes 7900 2675 0    50   ~ 10
Contact pads have no solder paste. TC2050 cable is a reusable probe, not a populated badge part.

$Comp
L Connector_Generic:Conn_01x08 J4
U 1 1 20000003
P 10200 3300
F 0 "J4" H 10280 3292 50  0000 L CNN
F 1 "ESP_RIBBON_1x08_P2.54_DNP" H 10280 3201 50  0000 L CNN
F 2 "Badge:ESP_Ribbon_1x08_P2.54mm" H 10200 3300 50  0001 C CNN
	1    10200 3300
	1    0    0    -1
$EndComp
Text Label 9400 2950 2    50   ~ 0
3V3
Text Label 9400 3050 2    50   ~ 0
DGND
Text Label 9400 3150 2    50   ~ 0
EXT_BUSY
Text Label 9400 3250 2    50   ~ 0
EXT_RST
Text Label 9400 3350 2    50   ~ 0
EXT_DC
Text Label 9400 3450 2    50   ~ 0
EXT_CS
Text Label 9400 3550 2    50   ~ 0
EXT_MOSI
Text Label 9400 3650 2    50   ~ 0
EXT_CLK
Wire Wire Line
	9400 2950 10000 2950
Wire Wire Line
	9400 3050 10000 3050
Wire Wire Line
	9400 3150 10000 3150
Wire Wire Line
	9400 3250 10000 3250
Wire Wire Line
	9400 3350 10000 3350
Wire Wire Line
	9400 3450 10000 3450
Wire Wire Line
	9400 3550 10000 3550
Wire Wire Line
	9400 3650 10000 3650
Text Notes 7900 3825 0    50   ~ 10
J4: 1=3V3, 2=DGND, 3=BUSY_N, 4=RST_N, 5=DC, 6=CS_N, 7=MOSI, 8=SCLK. Never connect 5V.
Text Notes 7900 3950 0    50   ~ 10
Optional USB-powered Waveshare V3 uses a split female ribbon; its own 24-pin FPC stays empty. One controller only.

Text Notes 3300 1375 0    79   ~ 16
SPI CONDITIONING
$Comp
L Device:R R5
U 1 1 20000010
P 4300 1650
F 0 "R5" V 4093 1650 50  0000 C CNN
F 1 "100R" V 4184 1650 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 1650 50  0001 C CNN
	1    4300 1650
	0    1    1    0
$EndComp
Text Label 3850 1650 2    50   ~ 0
EPD_MOSI
Text Label 4750 1650 0    50   ~ 0
EXT_MOSI
Wire Wire Line
	3850 1650 4150 1650
Wire Wire Line
	4450 1650 4750 1650
$Comp
L Device:R R6
U 1 1 20000011
P 4300 1900
F 0 "R6" V 4093 1900 50  0000 C CNN
F 1 "100R" V 4184 1900 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 1900 50  0001 C CNN
	1    4300 1900
	0    1    1    0
$EndComp
Text Label 3850 1900 2    50   ~ 0
EPD_CLK
Text Label 4750 1900 0    50   ~ 0
EXT_CLK
Wire Wire Line
	3850 1900 4150 1900
Wire Wire Line
	4450 1900 4750 1900
$Comp
L Device:R R7
U 1 1 20000012
P 4300 2150
F 0 "R7" V 4093 2150 50  0000 C CNN
F 1 "100R" V 4184 2150 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 2150 50  0001 C CNN
	1    4300 2150
	0    1    1    0
$EndComp
Text Label 3850 2150 2    50   ~ 0
EPD_CS
Text Label 4750 2150 0    50   ~ 0
EXT_CS
Wire Wire Line
	3850 2150 4150 2150
Wire Wire Line
	4450 2150 4750 2150
$Comp
L Device:R R8
U 1 1 20000013
P 4300 2400
F 0 "R8" V 4093 2400 50  0000 C CNN
F 1 "100R" V 4184 2400 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 2400 50  0001 C CNN
	1    4300 2400
	0    1    1    0
$EndComp
Text Label 3850 2400 2    50   ~ 0
EPD_DC
Text Label 4750 2400 0    50   ~ 0
EXT_DC
Wire Wire Line
	3850 2400 4150 2400
Wire Wire Line
	4450 2400 4750 2400
$Comp
L Device:R R9
U 1 1 20000014
P 4300 2650
F 0 "R9" V 4093 2650 50  0000 C CNN
F 1 "100R" V 4184 2650 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 2650 50  0001 C CNN
	1    4300 2650
	0    1    1    0
$EndComp
Text Label 3850 2650 2    50   ~ 0
EPD_RST
Text Label 4750 2650 0    50   ~ 0
EXT_RST
Wire Wire Line
	3850 2650 4150 2650
Wire Wire Line
	4450 2650 4750 2650
$Comp
L Device:R R10
U 1 1 20000015
P 4300 2900
F 0 "R10" V 4093 2900 50  0000 C CNN
F 1 "1k" V 4184 2900 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 4230 2900 50  0001 C CNN
	1    4300 2900
	0    1    1    0
$EndComp
Text Label 3850 2900 2    50   ~ 0
EPD_BUSY
Text Label 4750 2900 0    50   ~ 0
EXT_BUSY
Wire Wire Line
	3850 2900 4150 2900
Wire Wire Line
	4450 2900 4750 2900
$Comp
L Device:R R11
U 1 1 20000016
P 5700 2150
F 0 "R11" V 5493 2150 50  0000 C CNN
F 1 "100k" V 5584 2150 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 5630 2150 50  0001 C CNN
	1    5700 2150
	0    1    1    0
$EndComp
Text Label 5250 2150 2    50   ~ 0
EPD_CS
Text Label 6150 2150 0    50   ~ 0
3V3
Wire Wire Line
	5250 2150 5550 2150
Wire Wire Line
	5850 2150 6150 2150
$Comp
L Device:R R12
U 1 1 20000017
P 5700 2650
F 0 "R12" V 5493 2650 50  0000 C CNN
F 1 "100k" V 5584 2650 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 5630 2650 50  0001 C CNN
	1    5700 2650
	0    1    1    0
$EndComp
Text Label 5250 2650 2    50   ~ 0
EPD_RST
Text Label 6150 2650 0    50   ~ 0
DGND
Wire Wire Line
	5250 2650 5550 2650
Wire Wire Line
	5850 2650 6150 2650
$Comp
L Device:R R13
U 1 1 20000018
P 5700 3150
F 0 "R13" V 5493 3150 50  0000 C CNN
F 1 "0R" V 5584 3150 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 5630 3150 50  0001 C CNN
	1    5700 3150
	0    1    1    0
$EndComp
Text Label 5250 3150 2    50   ~ 0
BS
Text Label 6150 3150 0    50   ~ 0
DGND
Wire Wire Line
	5250 3150 5550 3150
Wire Wire Line
	5850 3150 6150 3150

Text Notes 3150 4100 0    79   ~ 16
PANEL BOOST / CHARGE-PUMP SUPPORT
$Comp
L Device:L L2
U 1 1 20000020
P 4100 4500
F 0 "L2" V 4290 4500 50  0000 C CNN
F 1 "68uH" V 4199 4500 50  0000 C CNN
F 2 "Inductor_SMD:L_1210_3225Metric" H 4100 4500 50  0001 C CNN
	1    4100 4500
	0    -1   -1   0
$EndComp
Text Label 3650 4500 2    50   ~ 0
3V3
Text Label 4550 4500 0    50   ~ 0
SW
Wire Wire Line
	3650 4500 3950 4500
Wire Wire Line
	4250 4500 4550 4500
$Comp
L Transistor_FET:Q_NMOS_GSD Q1
U 1 1 20000021
P 5300 4550
F 0 "Q1" H 5504 4596 50  0000 L CNN
F 1 "BSS138" H 5504 4505 50  0000 L CNN
F 2 "Package_TO_SOT_SMD:SOT-23" H 5500 4650 50  0001 C CNN
	1    5300 4550
	1    0    0    -1
$EndComp
Text Label 4900 4550 2    50   ~ 0
GDR
Text Label 5400 4200 1    50   ~ 0
SW
Text Label 5400 4900 3    50   ~ 0
RESE
Wire Wire Line
	4900 4550 5100 4550
Wire Wire Line
	5400 4200 5400 4350
Wire Wire Line
	5400 4750 5400 4900
$Comp
L Device:R R4
U 1 1 20000022
P 6300 4400
F 0 "R4" V 6093 4400 50  0000 C CNN
F 1 "10k" V 6184 4400 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 6230 4400 50  0001 C CNN
	1    6300 4400
	0    1    1    0
$EndComp
Text Label 5850 4400 2    50   ~ 0
GDR
Text Label 6750 4400 0    50   ~ 0
DGND
Wire Wire Line
	5850 4400 6150 4400
Wire Wire Line
	6450 4400 6750 4400
$Comp
L Device:R R3
U 1 1 20000023
P 6300 4750
F 0 "R3" V 6093 4750 50  0000 C CNN
F 1 "3R" V 6184 4750 50  0000 C CNN
F 2 "Resistor_SMD:R_0603_1608Metric" V 6230 4750 50  0001 C CNN
	1    6300 4750
	0    1    1    0
$EndComp
Text Label 5850 4750 2    50   ~ 0
RESE
Text Label 6750 4750 0    50   ~ 0
DGND
Wire Wire Line
	5850 4750 6150 4750
Wire Wire Line
	6450 4750 6750 4750
$Comp
L Device:C C3
U 1 1 20000024
P 7600 4500
F 0 "C3" V 7348 4500 50  0000 C CNN
F 1 "4.7uF_50V" V 7439 4500 50  0000 C CNN
F 2 "Capacitor_SMD:C_1206_3216Metric" H 7638 4350 50  0001 C CNN
	1    7600 4500
	0    1    1    0
$EndComp
Text Label 7150 4500 2    50   ~ 0
SW
Text Label 8050 4500 0    50   ~ 0
CFLY
Wire Wire Line
	7150 4500 7450 4500
Wire Wire Line
	7750 4500 8050 4500
$Comp
L Device:D_Schottky D1
U 1 1 20000025
P 8900 4500
F 0 "D1" H 8900 4283 50  0000 C CNN
F 1 "MBR0530" H 8900 4374 50  0000 C CNN
F 2 "Diode_SMD:D_SOD-123" H 8900 4500 50  0001 C CNN
	1    8900 4500
	-1   0    0    1
$EndComp
Text Label 8450 4500 2    50   ~ 0
CFLY
Text Label 9350 4500 0    50   ~ 0
DGND
Wire Wire Line
	8450 4500 8750 4500
Wire Wire Line
	9050 4500 9350 4500
$Comp
L Device:D_Schottky D2
U 1 1 20000026
P 7600 4900
F 0 "D2" H 7600 4683 50  0000 C CNN
F 1 "MBR0530" H 7600 4774 50  0000 C CNN
F 2 "Diode_SMD:D_SOD-123" H 7600 4900 50  0001 C CNN
	1    7600 4900
	-1   0    0    1
$EndComp
Text Label 7150 4900 2    50   ~ 0
VGL
Text Label 8050 4900 0    50   ~ 0
CFLY
Wire Wire Line
	7150 4900 7450 4900
Wire Wire Line
	7750 4900 8050 4900
$Comp
L Device:D_Schottky D3
U 1 1 20000027
P 8900 4900
F 0 "D3" H 8900 4683 50  0000 C CNN
F 1 "MBR0530" H 8900 4774 50  0000 C CNN
F 2 "Diode_SMD:D_SOD-123" H 8900 4900 50  0001 C CNN
	1    8900 4900
	-1   0    0    1
$EndComp
Text Label 8450 4900 2    50   ~ 0
SW
Text Label 9350 4900 0    50   ~ 0
VGH
Wire Wire Line
	8450 4900 8750 4900
Wire Wire Line
	9050 4900 9350 4900
$Comp
L Device:C C2
U 1 1 20000028
P 10100 4600
F 0 "C2" H 10215 4646 50  0000 L CNN
F 1 "4.7uF_50V" H 10215 4555 50  0000 L CNN
F 2 "Capacitor_SMD:C_1206_3216Metric" H 10138 4450 50  0001 C CNN
	1    10100 4600
	1    0    0    -1
$EndComp
Text Label 10100 4300 1    50   ~ 0
3V3
Text Label 10100 4900 3    50   ~ 0
DGND
Wire Wire Line
	10100 4300 10100 4450
Wire Wire Line
	10100 4750 10100 4900

Text Notes 700 5300 0    79   ~ 16
PANEL RAIL CAPACITORS / ENTRY DECOUPLING
$Comp
L Device:C C4
U 1 1 20000030
P 1150 5750
F 0 "C4" H 1265 5796 50  0000 L CNN
F 1 "1uF_25V" H 1265 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 1188 5600 50  0001 C CNN
	1    1150 5750
	1    0    0    -1
$EndComp
Text Label 1150 5450 1    50   ~ 0
VDHR
Text Label 1150 6050 3    50   ~ 0
DGND
Wire Wire Line
	1150 5450 1150 5600
Wire Wire Line
	1150 5900 1150 6050
$Comp
L Device:C C5
U 1 1 20000031
P 2050 5750
F 0 "C5" H 2165 5796 50  0000 L CNN
F 1 "1uF_10V" H 2165 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 2088 5600 50  0001 C CNN
	1    2050 5750
	1    0    0    -1
$EndComp
Text Label 2050 5450 1    50   ~ 0
VDDD
Text Label 2050 6050 3    50   ~ 0
DGND
Wire Wire Line
	2050 5450 2050 5600
Wire Wire Line
	2050 5900 2050 6050
$Comp
L Device:C C6
U 1 1 20000032
P 2950 5750
F 0 "C6" H 3065 5796 50  0000 L CNN
F 1 "1uF_25V" H 3065 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 2988 5600 50  0001 C CNN
	1    2950 5750
	1    0    0    -1
$EndComp
Text Label 2950 5450 1    50   ~ 0
VPP
Text Label 2950 6050 3    50   ~ 0
DGND
Wire Wire Line
	2950 5450 2950 5600
Wire Wire Line
	2950 5900 2950 6050
$Comp
L Device:C C7
U 1 1 20000033
P 3850 5750
F 0 "C7" H 3965 5796 50  0000 L CNN
F 1 "1uF_25V" H 3965 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 3888 5600 50  0001 C CNN
	1    3850 5750
	1    0    0    -1
$EndComp
Text Label 3850 5450 1    50   ~ 0
VSH
Text Label 3850 6050 3    50   ~ 0
DGND
Wire Wire Line
	3850 5450 3850 5600
Wire Wire Line
	3850 5900 3850 6050
$Comp
L Device:C C8
U 1 1 20000034
P 4750 5750
F 0 "C8" H 4865 5796 50  0000 L CNN
F 1 "1uF_25V" H 4865 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 4788 5600 50  0001 C CNN
	1    4750 5750
	1    0    0    -1
$EndComp
Text Label 4750 5450 1    50   ~ 0
VGH
Text Label 4750 6050 3    50   ~ 0
DGND
Wire Wire Line
	4750 5450 4750 5600
Wire Wire Line
	4750 5900 4750 6050
$Comp
L Device:C C9
U 1 1 20000035
P 5650 5750
F 0 "C9" H 5765 5796 50  0000 L CNN
F 1 "1uF_25V" H 5765 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 5688 5600 50  0001 C CNN
	1    5650 5750
	1    0    0    -1
$EndComp
Text Label 5650 5450 1    50   ~ 0
VSL
Text Label 5650 6050 3    50   ~ 0
DGND
Wire Wire Line
	5650 5450 5650 5600
Wire Wire Line
	5650 5900 5650 6050
$Comp
L Device:C C10
U 1 1 20000036
P 6550 5750
F 0 "C10" H 6665 5796 50  0000 L CNN
F 1 "1uF_25V" H 6665 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 6588 5600 50  0001 C CNN
	1    6550 5750
	1    0    0    -1
$EndComp
Text Label 6550 5450 1    50   ~ 0
VGL
Text Label 6550 6050 3    50   ~ 0
DGND
Wire Wire Line
	6550 5450 6550 5600
Wire Wire Line
	6550 5900 6550 6050
$Comp
L Device:C C11
U 1 1 20000037
P 7450 5750
F 0 "C11" H 7565 5796 50  0000 L CNN
F 1 "1uF_25V" H 7565 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 7488 5600 50  0001 C CNN
	1    7450 5750
	1    0    0    -1
$EndComp
Text Label 7450 5450 1    50   ~ 0
VCOM
Text Label 7450 6050 3    50   ~ 0
DGND
Wire Wire Line
	7450 5450 7450 5600
Wire Wire Line
	7450 5900 7450 6050
$Comp
L Device:C C14
U 1 1 20000038
P 8350 5750
F 0 "C14" H 8465 5796 50  0000 L CNN
F 1 "1uF_10V" H 8465 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 8388 5600 50  0001 C CNN
	1    8350 5750
	1    0    0    -1
$EndComp
Text Label 8350 5450 1    50   ~ 0
3V3
Text Label 8350 6050 3    50   ~ 0
DGND
Wire Wire Line
	8350 5450 8350 5600
Wire Wire Line
	8350 5900 8350 6050
$Comp
L Device:C C15
U 1 1 20000039
P 9250 5750
F 0 "C15" H 9365 5796 50  0000 L CNN
F 1 "1uF_25V_DNP" H 9365 5705 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 9288 5600 50  0001 C CNN
	1    9250 5750
	1    0    0    -1
$EndComp
Text Label 9250 5450 1    50   ~ 0
LEGACY_NC
Text Label 9250 6050 3    50   ~ 0
DGND
Wire Wire Line
	9250 5450 9250 5600
Wire Wire Line
	9250 5900 9250 6050
$Comp
L Device:C C12
U 1 1 2000003A
P 10150 5550
F 0 "C12" H 10265 5596 50  0000 L CNN
F 1 "10uF_10V" H 10265 5505 50  0000 L CNN
F 2 "Capacitor_SMD:C_0805_2012Metric" H 10188 5400 50  0001 C CNN
	1    10150 5550
	1    0    0    -1
$EndComp
Text Label 10150 5250 1    50   ~ 0
3V3
Text Label 10150 5850 3    50   ~ 0
DGND
Wire Wire Line
	10150 5250 10150 5400
Wire Wire Line
	10150 5700 10150 5850
$Comp
L Device:C C13
U 1 1 2000003B
P 10800 5550
F 0 "C13" H 10915 5596 50  0000 L CNN
F 1 "100nF" H 10915 5505 50  0000 L CNN
F 2 "Capacitor_SMD:C_0603_1608Metric" H 10838 5400 50  0001 C CNN
	1    10800 5550
	1    0    0    -1
$EndComp
Text Label 10800 5250 1    50   ~ 0
3V3
Text Label 10800 5850 3    50   ~ 0
DGND
Wire Wire Line
	10800 5250 10800 5400
Wire Wire Line
	10800 5700 10800 5850

Text Notes 700 6550 0    79   ~ 16
PASSIVE ELECTROMAGNETIC PICKUP / AUDIO OUTPUT
$Comp
L Connector_Generic:Conn_01x02 J2
U 1 1 20000040
P 1100 7000
F 0 "J2" H 1018 7217 50  0000 C CNN
F 1 "AUDIO_PIGTAIL" H 1018 7126 50  0000 C CNN
F 2 "Badge:Audio_Pigtail_2Pin" H 1100 7000 50  0001 C CNN
	1    1100 7000
	-1   0    0    -1
$EndComp
$Comp
L Device:C C1
U 1 1 20000041
P 2100 7000
F 0 "C1" V 1848 7000 50  0000 C CNN
F 1 "4.7uF" V 1939 7000 50  0000 C CNN
F 2 "Capacitor_SMD:C_1206_3216Metric" H 2138 6850 50  0001 C CNN
	1    2100 7000
	0    1    1    0
$EndComp
$Comp
L Device:L L1
U 1 1 20000042
P 3000 7000
F 0 "L1" V 3190 7000 50  0000 C CNN
F 1 "PCB_SPIRAL_30T_X2" V 3099 7000 50  0000 C CNN
F 2 "Badge:Generated_PCB_Spiral" H 3000 7000 50  0001 C CNN
	1    3000 7000
	0    -1   -1   0
$EndComp
$Comp
L Device:R R2
U 1 1 20000043
P 3900 7000
F 0 "R2" V 3693 7000 50  0000 C CNN
F 1 "0R" V 3784 7000 50  0000 C CNN
F 2 "Resistor_SMD:R_0805_2012Metric" V 3830 7000 50  0001 C CNN
	1    3900 7000
	0    1    1    0
$EndComp
$Comp
L Device:R R1
U 1 1 20000044
P 1650 7350
F 0 "R1" H 1720 7396 50  0000 L CNN
F 1 "4.99k" H 1720 7305 50  0000 L CNN
F 2 "Resistor_SMD:R_0805_2012Metric" V 1580 7350 50  0001 C CNN
	1    1650 7350
	1    0    0    -1
$EndComp
Text Label 1400 7000 0    50   ~ 0
AUDIO_SIG
Text Label 1400 7100 0    50   ~ 0
AUDIO_GND
Wire Wire Line
	1300 7000 1950 7000
Wire Wire Line
	2250 7000 2850 7000
Wire Wire Line
	3150 7000 3750 7000
Wire Wire Line
	4050 7000 4350 7000
Wire Wire Line
	4350 7000 4350 7600
Wire Wire Line
	4350 7600 1650 7600
Wire Wire Line
	1650 7600 1650 7500
Wire Wire Line
	1300 7100 1450 7100
Wire Wire Line
	1450 7100 1450 7600
Wire Wire Line
	1450 7600 1650 7600
Wire Wire Line
	1650 7200 1650 7000
Connection ~ 1650 7000
Text Notes 5050 6900 0    50   ~ 10
L1 is 30 turns/layer, series-aiding; R2 bridges layers. Keep all copper pours out of the coil area.
Text Notes 5050 7100 0    50   ~ 10
C1 blocks microphone bias and extends low-frequency response; R1 is a nominal CTIA microphone load.
Text Notes 5050 7300 0    50   ~ 10
AUDIO_GND is isolated from DGND. Never probe exposed mains conductors or energized equipment interiors.

Text Notes 700 7900 0    50   ~ 10
PROTOTYPE GATE: buy and physically/electrically verify one exact V1.1 panel, J1 insertion, and pin 1 before release.
$EndSCHEMATC
