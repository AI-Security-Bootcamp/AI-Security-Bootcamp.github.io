# Passive magnetic pickup design

## Selected geometry

The badge uses one large, air-core, chamfered rectangular spiral occupying the
metal-free upper board area. It is a **magnetic near-field search coil**, not a
radio antenna:

| Parameter | Value |
|---|---:|
| outer winding envelope | 80 x 49 mm (`x=10..90`, `y=15..64`) |
| winding | 30 turns on F.Cu + 30 turns on B.Cu |
| connection | aligned, series-aiding at the inner ends through R2 |
| copper | 0.30 mm trace, 0.20 mm space, nominal 1 oz |
| corner treatment | 1.5 mm 45-degree chamfers |
| clear centre | approximately 50 x 19 mm |
| calculated copper length | approximately 11.73 m total |
| calculated 1 oz DC resistance | approximately 19.3 ohms |
| calculated turn-area sum | approximately 0.138 m2-turn |

All winding copper stays beneath continuous solder mask. The gold/copper colour
in preview artwork is an explanatory visualization, not a fabrication mask
opening. Exposing 0.20 mm-spaced turns would let fingers, sweat, lanyard metal,
or debris short turns and reduce sensitivity.

The turn-area sum predicts about 52 uV RMS per 1 uT RMS at 60 Hz and 0.87 mV
RMS per 1 uT RMS at 1 kHz. These are uniform-field calculations from Faraday's
law, not guaranteed levels near a real laptop or cable.

Compared with the original 12-turn-per-layer layout, the revised winding has
about 1.9 times the theoretical open-circuit voltage, a gain of about 5.6 dB.
Its estimated inductance is roughly 0.2-0.3 mH, but a physical prototype must
be measured because inter-layer coupling and nearby materials matter.

## Why this shape

Sensitivity is proportional to frequency, the magnetic field normal to the
board, and the **sum of the area enclosed by every turn**. A circle is the most
efficient shape for a freely chosen footprint, but a 49 mm circle would throw
away most of this badge's available 80 mm width. The rectangular spiral wins
here because it fills the actual mechanical envelope. Small chamfers reduce
copper length and improve appearance with negligible loss of enclosed area.

A serpentine/meander trace is not a substitute: adjacent loops alternate
direction and cancel much of the wanted flux. A figure-eight winding is useful
when rejecting uniform mains hum and sensing local field gradients is the main
goal, but it is intentionally less sensitive to ambient fields. The single
large spiral is the better default for a passive sound-exploration badge.

The design choices follow measured planar-coil work showing that sensitivity
scales with total turn area, while thermal noise grows with conductor length,
and that large coils with narrow manufacturing-safe trace/space generally
improve signal-to-noise ratio. Relevant sources:

- [Cavaliere et al., planar inductive sensor optimization](https://doi.org/10.3390/s21082822)
- [Texas Instruments planar-coil design report](https://www.ti.com/lit/an/snoa930c/snoa930c.pdf)
- [Ulvr, Design of PCB search coils](https://doi.org/10.1063/1.4991643)
- [Mohan et al., planar spiral inductance expressions](https://stanford.edu/~boyd/papers/pdf/inductance_expressions.pdf)

## Passive audio network

`C1` is 4.7 uF so the microphone-bias blocking network does not discard most
50/60 Hz content. With the Android reference 2.2 kohm bias source and the
on-board 4.99 kohm load, the approximate high-pass corner is 22 Hz. `R1` gives
the jack a microphone-like DC load; Android requires at least 1 kohm and uses
5 kohm in its reference example. See the
[Android headset specification](https://source.android.com/docs/core/interaction/accessories/headset/plug-headset-spec).

Keep `R1` populated for CTIA phone/computer microphone or inexpensive USB
microphone inputs. For a verified high-impedance line or instrument input,
`R1` may be omitted, but that build may no longer be detected as a headset
microphone. No tuning capacitor is fitted: the broad, naturally rising audio
response is more useful for exploratory listening than a narrow resonance.

Use a short twisted pair or shielded cable from `J2`. Do not refresh the
e-paper while recording; its switching converter will dominate the pickup.

## Orientation and use

The coil responds to the magnetic-field component passing perpendicular to the
badge face. Put the upper half of the badge near the device under test, then
rotate and tilt it for the loudest sound. A large loop gives maximum ambient
sensitivity; a smaller handheld loop would give better spatial resolution for
finding one particular chip or trace.

Use a microphone input or USB microphone adapter with gain. A line input may
be too insensitive. For CTIA TRRS wiring, `J2.1` goes to the microphone contact
(sleeve) and `J2.2` goes to headset ground (ring 2).

This is an isolated sensor, not electrical test equipment. Keep it outside
enclosures and away from exposed conductors, mains terminals, damaged cables,
and other hazardous-energy sources.

## Prototype acceptance checks

1. With the audio cable disconnected, measure between the coil-side pad of
   `C1` (pad 2) and `J2.2`. Expect approximately 15-25 ohms. An open reading
   indicates a broken winding/R2; a much lower value suggests shorted turns.
2. Measure inductance and self-resonance with an LCR meter or impedance
   analyzer. Target roughly 0.2-0.3 mH and require self-resonance above 200 kHz.
3. Inject a repeatable field with an insulated 20-50 turn test loop driven by
   a low-voltage signal generator through a current-limiting resistor. Record
   output at 60 Hz, 1 kHz, and 10 kHz with the same spacing and orientation.
4. Confirm the output does not change when the display/programmer ground is
   touched; `AUDIO_GND` must remain isolated from `DGND`.
5. Check one board before and after display refresh. Record only after the
   programmer is removed and the e-paper circuit is unpowered.
