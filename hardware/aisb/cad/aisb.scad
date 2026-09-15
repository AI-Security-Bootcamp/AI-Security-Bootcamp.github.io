/*
  AISB Vegas 2026 badge - mechanical / visual assembly

  Units are millimetres.  X/Y positions are mapped directly from the KiCad
  design, with KiCad's top edge at +Y in this model.  The front of the badge
  is +Z and the component side is -Z.

  This is a presentation and fit-check model, not the PCB manufacturing source.
  The KiCad files remain authoritative for copper, drills and fabrication.
*/

// ---------- OpenSCAD Customizer ----------

mode = "assembled";              // [assembled,pcb_only,exploded,service_spine]
badge_name = "YOUR NAME";
badge_handle = "@handle / participant";
show_pickup_coil = true;
show_front_labels = true;
show_protector = true;
show_optional_waveshare = true;
show_j4_header = false;
exploded_step = 10;              // [4:1:25]
curve_resolution = 36;           // [16:4:96]

$fn = curve_resolution;

// ---------- KiCad-controlled dimensions ----------

board_w = 100;
board_h = 145;
board_t = 1.6;
board_corner_r = 5;

lanyard_center = [50, 8];
lanyard_hole_d = 6;

// Waveshare 3.52-inch raw panel, landscape with its FPC exiting left.  The
// active area is intentionally 2.725 mm right of the centred glass because
// the FPC-side inactive border is wider.  The actual electrical FPC protrudes
// only 3.65 +/- 0.30 mm; the drawing's 10 mm feature is a removable tape tab.
panel_center = [50, 94.205];
panel_outline = [84.70, 54.41];
panel_t = 1.18;
panel_corner_r = 0.35;
panel_adhesive_t = 0.10;
panel_adhesive_edge_inset = 0.25; // prototype; confirm cutter/adhesive lot
panel_adhesive_rail = 1.50;
panel_adhesive_notch_clearance = 0.50;

active_center = [52.725, 94.205];
active_area = [74.51, 49.67];
active_corner_r = 0.20;

fpc_center_y = 94.205;
fpc_width = 12.50;
// Bare flex is 0.10 +0.03 mm; the connector-contact stiffener is
// 0.30 +/-0.03 mm.  Use the backed thickness for the short service run so the
// preview does not understate the J1/spine cavity requirement.
fpc_t = 0.30;
fpc_front_z = board_t / 2 + panel_adhesive_t + fpc_t / 2;

// No-hole instrument viewport: a printed black spacer/bezel, a clear 0.5 mm
// polycarbonate lens, and a removable opaque spine over the flex and front ZIF.
protector_center = panel_center;
protector_outline = [88.00, 58.00];
protector_t = 0.50;
protector_corner_r = 1.5;
protector_frame_h = panel_adhesive_t + panel_t + 0.20;
protector_glass_clearance = [85.70, 55.41];
protector_opening = [75.35, 50.25];
protector_print_t = 0.035;
service_cap_y = fpc_width + 5.0;

// Front-side Hirose FH34SRJ-24S-0.5SH dual-contact ZIF approximation.  The
// mouth faces right, directly toward the panel tail.
zif_center = [3.60, fpc_center_y];
zif_body = [3.80, 14.00];
zif_h = 1.00;
zif_mouth_x = 5.50;
zif_signal_row_x = 5.00;
zif_retention_row_x = 1.70;
fpc_tip_x = 4.00;

// Rear, zero-height Tag-Connect TC2050-IDC-NL programming target (J3).
tc2050_center = [90, 137];
tc2050_pad_d = 0.787;
tc2050_hole_d = 0.991;
tc2050_silk_envelope = [6.2, 2.5];
tc2050_pads = [
    [-2.54, 0.635], [-1.27, 0.635], [0, 0.635], [1.27, 0.635], [2.54, 0.635],
    [2.54, -0.635], [1.27, -0.635], [0, -0.635], [-1.27, -0.635], [-2.54, -0.635]
];
tc2050_holes = [
    [-3.81, 0], [3.81, 1.016], [3.81, -1.016]
];

// Optional rear Waveshare e-Paper ESP32 Driver Board V3 cradle bay.  The stock
// underside 1x19 headers remain on the removable module but do not enter this
// carrier.  Insulating edge rails keep those pins clear and four routed slots
// retain the cradle/strap assembly.  USB-C faces the lower badge edge.
esp32_bay_center = [20.23, 120.875];
esp32_board_outline = [29.46, 48.25];
esp32_board_t = 1.60;
esp32_header_pitch = 2.54;
esp32_header_count = 19;
esp32_header_row_dx = 11.325;
esp32_header_first_y = 98.015;
esp32_header_pin = 0.635;          // nominal .025-inch square post
esp32_header_insulator = [2.54, 48.26];
esp32_header_insulator_h = 2.54;  // nominal; measure purchased V3
esp32_header_free_pin = 6.00;     // preview only; measure purchased V3
esp32_cradle_gap = 9.40;          // preview; trim rail/foam stack after measurement
esp32_cradle_rail_x = [6.40, 34.06];
esp32_cradle_rail_y = 127.5;
esp32_cradle_rail_size = [1.80, 29.0];
esp32_cradle_foam_t = 0.40;
esp32_mount_slot_size = [2.2, 6.0];
esp32_mount_slots = [
    [3.5, 131.5], [37, 131.5],
    [3.5, 139.5], [37, 139.5]
];

// Optional 3.3 V SPI ribbon/header.  This is the carrier's only direct
// electrical interface to the removable module; never bring module 5 V here.
j4_pin1 = [60, 140.5];
j4_pitch = 2.54;
j4_count = 8;
j4_pad_d = 2.0;
j4_drill_d = 1.0;
j4_body = [20.15, 2.70];

// ---------- Visual material palette ----------

pcb_black = [0.025, 0.030, 0.032];
pcb_edge = [0.045, 0.050, 0.052];
copper = [0.58, 0.31, 0.10];
masked_coil = [0.20, 0.16, 0.07];
enig_gold = [0.91, 0.67, 0.20];
silkscreen = [0.92, 0.93, 0.91];
epaper_white = [0.90, 0.89, 0.82];
epaper_ink = [0.045, 0.048, 0.046];
epaper_edge = [0.62, 0.64, 0.63];
flex_orange = [0.78, 0.46, 0.12];
protector_clear = [0.72, 0.88, 0.92, 0.28];
chip_black = [0.025, 0.025, 0.028];
metal = [0.64, 0.68, 0.70];
module_green = [0.04, 0.24, 0.18];
cradle_plastic = [0.72, 0.78, 0.72, 0.72];
cradle_foam = [0.12, 0.13, 0.14, 0.88];
strap_black = [0.04, 0.045, 0.05, 0.92];

// Map KiCad board coordinates (origin at top-left) into model coordinates.
function bx(x) = x - board_w / 2;
function by(y) = board_h / 2 - y;

// ---------- Reusable primitives ----------

module rounded_rect_2d(s = [10, 10], r = 1) {
    hull() {
        for (x = [-s[0] / 2 + r, s[0] / 2 - r])
            for (y = [-s[1] / 2 + r, s[1] / 2 - r])
                translate([x, y]) circle(r = r);
    }
}

module rounded_slab(s = [10, 10], r = 1, h = 1, z = 0) {
    translate([0, 0, z])
        linear_extrude(height = h)
            rounded_rect_2d(s, r);
}

// Overall X/Y dimensions, with semicircular ends along the longer axis.
module oval_2d(s = [6, 2.2]) {
    if (s[0] >= s[1])
        hull()
            for (x = [-(s[0] - s[1]) / 2, (s[0] - s[1]) / 2])
                translate([x, 0]) circle(d = s[1]);
    else
        hull()
            for (y = [-(s[1] - s[0]) / 2, (s[1] - s[0]) / 2])
                translate([0, y]) circle(d = s[0]);
}

module trace_2d(a, b, width = 0.25) {
    hull() {
        translate(a) circle(d = width, $fn = 12);
        translate(b) circle(d = width, $fn = 12);
    }
}

module front_text(label, x, y, size, thickness = 0.055) {
    translate([bx(x), by(y), board_t / 2 + 0.055])
        linear_extrude(height = thickness)
            text(label, size = size, halign = "center", valign = "center");
}

module back_slab_at(x, y, s, r, h, gap = 0) {
    translate([bx(x), by(y), -board_t / 2 - gap - h])
        linear_extrude(height = h)
            rounded_rect_2d(s, r);
}

// ---------- Exact mechanical PCB ----------

module bare_pcb() {
    color(pcb_black)
        translate([0, 0, -board_t / 2])
            linear_extrude(height = board_t)
                difference() {
                    rounded_rect_2d([board_w, board_h], board_corner_r);

                    translate([bx(lanyard_center[0]), by(lanyard_center[1])])
                        circle(d = lanyard_hole_d);

                    // TC2050-IDC-NL probe alignment holes.  The target has no
                    // connector body and adds no worn-badge thickness.
                    for (p = tc2050_holes)
                        translate([
                            bx(tc2050_center[0] + p[0]),
                            by(tc2050_center[1] + p[1])
                        ]) circle(d = tc2050_hole_d);

                    // Passive-pickup audio pigtail holes are retained.
                    for (y = [22, 27])
                        translate([bx(4.5), by(y)]) circle(d = 1.2);

                    // Four vertical 2.2 x 6.0 mm NPTH slots retain the
                    // removable, electrically insulating ESP32 cradle.
                    for (p = esp32_mount_slots)
                        translate([bx(p[0]), by(p[1])])
                            oval_2d(esp32_mount_slot_size);

                    // Optional J4 1x8 ribbon/header drills, pin 1 at x=60.
                    for (i = [0 : j4_count - 1])
                        translate([
                            bx(j4_pin1[0] + i * j4_pitch),
                            by(j4_pin1[1])
                        ]) circle(d = j4_drill_d);
                }
}

// ---------- PCB artwork and front-side parts ----------

function pickup_steps(i, count, pitch, chamfer) =
    i >= count ? [] :
    concat(
        [[90 - i * pitch - chamfer, 15 + i * pitch],
         [90 - i * pitch, 15 + i * pitch + chamfer],
         [90 - i * pitch, 64 - i * pitch - chamfer],
         [90 - i * pitch - chamfer, 64 - i * pitch],
         [10 + (i + 1) * pitch + chamfer, 64 - i * pitch],
         [10 + (i + 1) * pitch, 64 - i * pitch - chamfer],
         [10 + (i + 1) * pitch, 15 + (i + 1) * pitch + chamfer],
         [10 + (i + 1) * pitch + chamfer, 15 + (i + 1) * pitch]],
        pickup_steps(i + 1, count, pitch, chamfer)
    );

function pickup_path(count = 30, pitch = 0.50, chamfer = 1.5) =
    concat([[10 + chamfer, 15]], pickup_steps(0, count, pitch, chamfer));

function pickup_steps_ccw(i, count, pitch, chamfer) =
    i >= count ? [] :
    concat(
        [[10 + i * pitch, 15 + i * pitch + chamfer],
         [10 + i * pitch, 64 - i * pitch - chamfer],
         [10 + i * pitch + chamfer, 64 - i * pitch],
         [90 - i * pitch - chamfer, 64 - i * pitch],
         [90 - i * pitch, 64 - i * pitch - chamfer],
         [90 - i * pitch, 15 + (i + 1) * pitch + chamfer],
         [90 - i * pitch - chamfer, 15 + (i + 1) * pitch],
         [10 + (i + 1) * pitch + chamfer, 15 + (i + 1) * pitch]],
        pickup_steps_ccw(i + 1, count, pitch, chamfer)
    );

function pickup_path_ccw(count = 30, pitch = 0.50, chamfer = 1.5) =
    concat([[10 + chamfer, 15]], pickup_steps_ccw(0, count, pitch, chamfer));

module pickup_path_copper(path, z) {
    // Production copper is covered by black solder mask.  The muted colour is
    // only a visualization cue; it does not represent exposed ENIG.
    color(masked_coil)
        translate([0, 0, z])
            linear_extrude(height = 0.035)
                for (i = [0 : len(path) - 2])
                    trace_2d(
                        [bx(path[i][0]), by(path[i][1])],
                        [bx(path[i + 1][0]), by(path[i + 1][1])],
                        0.30
                    );
}

module pickup_coil() {
    // The rear layout alternates winding direction; after the inner-end R2
    // connection, current circulates in the same magnetic sense on both faces.
    pickup_path_copper(pickup_path(), board_t / 2 + 0.018);
    pickup_path_copper(pickup_path_ccw(), -board_t / 2 - 0.053);
}

module brand_accent() {
    color(enig_gold)
        // Raised slightly above the imported white master so the preview shows
        // the actual exposed-ENIG accent used by the standard PCB process.
        translate([bx(66.906), by(42.15), board_t / 2 + 0.115])
            linear_extrude(height = 0.05)
                rounded_rect_2d([2.9, 2.9], 0.06);
}

module audio_front_pads() {
    // Two audio-pigtail solder pads.
    color(enig_gold)
        for (y = [22, 27])
            translate([bx(4.5), by(y), board_t / 2 + 0.025])
                linear_extrude(height = 0.05)
                    difference() {
                        circle(d = 2.6);
                        circle(d = 1.2);
                    }
}

module front_silkscreen() {
    // Import outlined Space Grotesk geometry so the A and both B counters do
    // not depend on whichever fonts happen to be installed on this machine.
    logo_w = 37;
    logo_h = 11.648;
    color(silkscreen)
        translate([-logo_w / 2, by(38) - logo_h / 2, board_t / 2 + 0.055])
            linear_extrude(height = 0.055)
                resize([logo_w, logo_h])
                    import("../assets/aisb-wordmark.svg");

    color(silkscreen) {
        front_text("PASSIVE EM PICKUP / 30T PER LAYER", 27, 11.5, 0.85);
        front_text("AI SECURITY BOOTCAMP / LAS VEGAS 2026", 50, 47, 1.0);
        front_text("PROGRAM ON REAR / TC2050", 50, 137, 1.0);
        front_text("AUDIO", 5.5, 31, 0.8);
    }
}

module tc2050_target() {
    copper_t = 0.035;
    silk_t = 0.025;
    silk_w = 0.12;

    // Ten exposed B.Cu/B.Mask contacts; there is deliberately no paste.
    color(enig_gold)
        for (p = tc2050_pads)
            translate([
                bx(tc2050_center[0] + p[0]),
                by(tc2050_center[1] + p[1]),
                -board_t / 2 - copper_t
            ]) cylinder(d = tc2050_pad_d, h = copper_t);

    // Rear-silkscreen target envelope from the implemented KiCad footprint.
    color(silkscreen) {
        for (dy = [-1, 1])
            back_slab_at(
                tc2050_center[0],
                tc2050_center[1] + dy * (tc2050_silk_envelope[1] - silk_w) / 2,
                [tc2050_silk_envelope[0], silk_w],
                0.01,
                silk_t
            );
        for (dx = [-1, 1])
            back_slab_at(
                tc2050_center[0] + dx * (tc2050_silk_envelope[0] - silk_w) / 2,
                tc2050_center[1],
                [silk_w, tc2050_silk_envelope[1]],
                0.01,
                silk_t
            );
    }
}

module esp32_bay_marking() {
    // Rear-silkscreen fit envelope for the removable module and cradle.
    line = 0.22;
    color(silkscreen)
        translate([
            bx(esp32_bay_center[0]),
            by(esp32_bay_center[1]),
            -board_t / 2 - 0.025
        ])
            linear_extrude(height = 0.025)
                difference() {
                    rounded_rect_2d(esp32_board_outline, 0.7);
                    rounded_rect_2d(
                        [
                            esp32_board_outline[0] - line * 2,
                            esp32_board_outline[1] - line * 2
                        ],
                        0.55
                    );
                }
}

module j4_ribbon_header(gap = 0) {
    copper_t = 0.035;

    // Eight plated through-hole annuli: 3V3, GND, BUSY, RST, DC, CS, MOSI,
    // CLK.  The footprint is useful unpopulated; the black body/pins are
    // optional so the default preview remains a thin passive carrier.
    color(enig_gold)
        for (z = [board_t / 2, -board_t / 2 - copper_t])
            for (i = [0 : j4_count - 1])
                translate([
                    bx(j4_pin1[0] + i * j4_pitch),
                    by(j4_pin1[1]),
                    z
                ])
                    linear_extrude(height = copper_t)
                        difference() {
                            if (i == 0)
                                square([j4_pad_d, j4_pad_d], center = true);
                            else
                                circle(d = j4_pad_d);
                            circle(d = j4_drill_d);
                        }

    if (show_j4_header) {
        color(chip_black)
            back_slab_at(
                j4_pin1[0] + (j4_count - 1) * j4_pitch / 2,
                j4_pin1[1],
                j4_body,
                0.25,
                2.54,
                gap
            );
        color(metal)
            for (i = [0 : j4_count - 1])
                back_slab_at(
                    j4_pin1[0] + i * j4_pitch,
                    j4_pin1[1],
                    [0.64, 0.64],
                    0.05,
                    6.0,
                    gap + 1.2
                );
    }
}

module pcb_artwork() {
    if (show_pickup_coil) pickup_coil();
    brand_accent();
    audio_front_pads();
    tc2050_target();
    esp32_bay_marking();
    j4_ribbon_header();
    if (show_front_labels) front_silkscreen();
}

// ---------- Front-mounted raw e-paper assembly ----------

module panel_adhesive(lift = 0) {
    // Prototype transfer-adhesive frame matching viewport-cut-template.svg.
    // The open left notch keeps adhesive out of the straight FPC/J1 service
    // path. Cutter kerf, squeeze-out, and the delivered panel lot still need
    // a one-piece physical dry-fit before these dimensions are released.
    outer = [
        panel_outline[0] - 2 * panel_adhesive_edge_inset,
        panel_outline[1] - 2 * panel_adhesive_edge_inset
    ];
    inner = [
        outer[0] - 2 * panel_adhesive_rail,
        outer[1] - 2 * panel_adhesive_rail
    ];
    outer_left = panel_center[0] - outer[0] / 2;
    notch_h = fpc_width + 2 * panel_adhesive_notch_clearance;

    color([0.10, 0.10, 0.10, 0.75])
        translate([0, 0, board_t / 2 + lift])
            linear_extrude(height = panel_adhesive_t)
                difference() {
                    translate([bx(panel_center[0]), by(panel_center[1])])
                        rounded_rect_2d(outer, panel_corner_r);
                    translate([bx(panel_center[0]), by(panel_center[1])])
                        rounded_rect_2d(inner, 0.20);
                    translate([
                        bx(outer_left + panel_adhesive_rail / 2),
                        by(fpc_center_y)
                    ]) square([
                        panel_adhesive_rail + 0.50,
                        notch_h
                    ], center = true);
                }
}

module panel_front_fpc(lift = 0) {
    panel_left = panel_center[0] - panel_outline[0] / 2;
    span = panel_left - fpc_tip_x;

    color(flex_orange)
        translate([
            bx(fpc_tip_x + span / 2),
            by(fpc_center_y),
            fpc_front_z + lift
        ])
            cube([span, fpc_width, fpc_t], center = true);
}

module epaper_panel(lift = 0) {
    panel_z = board_t / 2 + panel_adhesive_t + lift;
    face_z = panel_z + panel_t;

    color(epaper_edge)
        translate([bx(panel_center[0]), by(panel_center[1]), panel_z])
            linear_extrude(height = panel_t)
                rounded_rect_2d(panel_outline, panel_corner_r);

    color(epaper_white)
        translate([bx(active_center[0]), by(active_center[1]), face_z + 0.006])
            linear_extrude(height = 0.020)
                rounded_rect_2d(active_area, active_corner_r);

    // The wider inactive/FPC-side rail is visible through the clear cover.
    color([0.24, 0.26, 0.25])
        translate([bx(11.55), by(panel_center[1]), face_z + 0.008])
            linear_extrude(height = 0.024)
                rounded_rect_2d([1.1, 47.8], 0.25);

    color(epaper_ink) {
        translate([bx(active_center[0]), by(87.8), face_z + 0.032])
            linear_extrude(height = 0.025)
                text(badge_name, size = 8.2, halign = "center", valign = "center");
        translate([bx(active_center[0]), by(101.3), face_z + 0.032])
            linear_extrude(height = 0.025)
                text(badge_handle, size = 3.1, halign = "center", valign = "center");
        translate([bx(active_center[0]), by(112.0), face_z + 0.032])
            linear_extrude(height = 0.025)
                text("AISB / LAS VEGAS 2026", size = 2.15, halign = "center", valign = "center");
    }

    panel_front_fpc(lift);
}

module panel_protector(lift = 0) {
    frame_z = board_t / 2 + lift;
    cover_z = frame_z + protector_frame_h;

    // A black spacer surrounds, but does not overlap, the fragile glass.
    // Transfer adhesive under this frame is the only attachment: no bezel
    // screws or PCB holes are needed.
    color([0.035, 0.038, 0.040])
        translate([0, 0, frame_z])
            linear_extrude(height = protector_frame_h)
                difference() {
                    translate([bx(protector_center[0]), by(protector_center[1])])
                        rounded_rect_2d(protector_outline, protector_corner_r);
                    translate([bx(panel_center[0]), by(panel_center[1])])
                        rounded_rect_2d(protector_glass_clearance, 0.55);
                }

    // Black printing on the lens underside masks the inactive glass and gives
    // the display its crisp instrument-panel viewport.
    color([0.025, 0.028, 0.030])
        translate([0, 0, cover_z - protector_print_t])
            linear_extrude(height = protector_print_t)
                difference() {
                    translate([bx(protector_center[0]), by(protector_center[1])])
                        rounded_rect_2d(protector_outline, protector_corner_r);
                    translate([bx(active_center[0]), by(active_center[1])])
                        rounded_rect_2d(protector_opening, 0.45);
                }

    // Clear hard-coated polycarbonate lens.  Printing the black border on its
    // underside makes the frame look crisp while protecting the ink.
    color(protector_clear)
        translate([bx(protector_center[0]), by(protector_center[1]), cover_z])
            linear_extrude(height = protector_t)
                rounded_rect_2d(protector_outline, protector_corner_r);
}

module panel_service_spine(lift = 0) {
    spine_left = 0.80;
    spine_right = 8.60;
    spine_w = spine_right - spine_left;
    spine_wall_t = 0.55;
    spine_top_t = 0.45;
    lens_top_z = board_t / 2 + protector_frame_h + protector_t + lift;
    board_front_z = board_t / 2 + lift;

    // This opaque removable spine bridges onto the lens and hides both the
    // front ZIF and the short flex.  Thin side/left rails create a component
    // cavity; removable transfer adhesive holds it without holes or magnets.
    color([0.055, 0.060, 0.063]) {
        translate([
            bx((spine_left + spine_right) / 2),
            by(fpc_center_y),
            lens_top_z + spine_top_t / 2
        ]) cube([spine_w, service_cap_y, spine_top_t], center = true);

        translate([
            bx(spine_left + spine_wall_t / 2),
            by(fpc_center_y),
            board_front_z + (lens_top_z - board_front_z) / 2
        ]) cube([
            spine_wall_t,
            service_cap_y,
            lens_top_z - board_front_z
        ], center = true);

        for (dy = [-1, 1])
            translate([
                bx((spine_left + spine_right) / 2),
                by(fpc_center_y) + dy * (service_cap_y - spine_wall_t) / 2,
                board_front_z + (lens_top_z - board_front_z) / 2
            ]) cube([
                spine_w,
                spine_wall_t,
                lens_top_z - board_front_z
            ], center = true);
    }
}

// ---------- Front panel interconnect and rear raw-panel parts ----------

module display_zif() {
    // Approximate low-profile, dual-contact Hirose FH34SRJ-24S-0.5SH body.
    // Its signal/mouth side faces right, only 2.15 mm from the glass edge;
    // the retention-tab row sits 3.3 mm behind it on the left.
    color(chip_black)
        translate([
            bx(zif_center[0]),
            by(zif_center[1]),
            board_t / 2
        ])
            linear_extrude(height = zif_h)
                rounded_rect_2d(zif_body, 0.30);

    color([0.78, 0.80, 0.78])
        translate([
            bx(zif_mouth_x - 0.22),
            by(fpc_center_y),
            fpc_front_z - 0.09
        ])
            linear_extrude(height = 0.18)
                rounded_rect_2d([0.44, 13.80], 0.12);

    // Signal-row cue at the approximate footprint coordinate.
    color(enig_gold)
        for (i = [0 : 23])
            translate([
                bx(zif_signal_row_x),
                by(fpc_center_y + (i - 11.5) * 0.5),
                board_t / 2 + 0.0175
            ]) cube([0.40, 0.22, 0.035], center = true);

    // Two retention-tab cues at the rear/left edge of the connector.
    color(enig_gold)
        for (dy = [-6.35, 6.35])
            translate([
                bx(zif_retention_row_x),
                by(fpc_center_y + dy),
                board_t / 2 + 0.0175
            ]) cube([0.70, 0.90, 0.035], center = true);
}

module rear_two_terminal(
    x,
    y,
    body = [1.8, 1.0],
    pad_spacing = 0.8,
    pad = [0.9, 1.0],
    height = 0.55,
    gap = 0,
    populated = true,
    shade = [0.50, 0.50, 0.46]
) {
    pad_t = 0.035;

    color(enig_gold)
        for (dx = [-pad_spacing, pad_spacing])
            back_slab_at(x + dx, y, pad, 0.12, pad_t, gap);

    if (populated)
        color(shade)
            back_slab_at(x, y, body, 0.16, height, gap + pad_t);
}

module raw_panel_components(gap = 0) {
    // Simplified bodies at the implemented rear-footprint coordinates.  The
    // generated KiCad board remains authoritative for pads and exact heights.

    // Q1, the 68 uH boost inductor, high-voltage capacitors, and D1.
    color(enig_gold)
        for (p = [[67, 72.05], [67, 73.95], [69, 73]])
            back_slab_at(p[0], p[1], [1.1, 1.0], 0.12, 0.035, gap);
    color(chip_black)
        back_slab_at(68, 73, [3.0, 3.0], 0.25, 0.9, gap + 0.035);

    rear_two_terminal(
        73, 69.5, [3.4, 2.7], 1.6, [1.5, 2.6], 1.8, gap, true, chip_black
    );
    rear_two_terminal(
        78, 73, [3.3, 1.8], 1.5, [1.5, 1.8], 0.8, gap
    );
    rear_two_terminal(
        84, 73, [4.0, 2.0], 1.4, [1.4, 1.8], 1.0, gap, true, chip_black
    );
    rear_two_terminal(
        90, 70, [3.3, 1.8], 1.5, [1.5, 1.8], 0.8, gap
    );

    // R4/R3 beside the power stage and the vertical SPI/rail passive bank.
    for (y = [71.6, 74.2])
        rear_two_terminal(59.4, y, gap = gap);
    rear_two_terminal(61.2, 76.8, [2.2, 1.4], 1.0, [1.1, 1.4], gap = gap, populated = false);
    rear_two_terminal(61.2, 79.4, [2.2, 1.4], 1.0, [1.1, 1.4], 0.65, gap);
    for (y = [87.2, 89.8, 92.4, 95, 97.6, 100.2, 102.8])
        rear_two_terminal(61, y, gap = gap);
    rear_two_terminal(61.2, 105.4, [2.2, 1.4], 1.0, [1.1, 1.4], 0.65, gap);
    for (y = [113.2, 115.8, 118.4, 121, 123.6, 126.2, 128.8])
        rear_two_terminal(61.2, y, [2.2, 1.4], 1.0, [1.1, 1.4], 0.65, gap);

    // Pull resistors, output diodes D3/D2, and the two 3V3 entry capacitors.
    for (y = [91, 96])
        rear_two_terminal(68, y, gap = gap);
    for (y = [121, 126.2])
        rear_two_terminal(
            75, y, [4.0, 2.0], 1.4, [1.4, 1.8], 1.0, gap, true, chip_black
        );
    rear_two_terminal(47, 126.5, gap = gap);
    rear_two_terminal(47, 130, [2.2, 1.4], 1.0, [1.1, 1.4], 0.65, gap);

}

module rear_passive(gap = 0) {
    // Pickup-network parts are rear-mounted in the generated KiCad design.
    // C1 is 1206 at (7,17); R1 is 0805 at (7.5,24); R2 is 0805 at (31,34).
    rear_two_terminal(
        7, 17, [3.3, 1.8], 1.5, [1.5, 1.8], 0.8, gap
    );
    rear_two_terminal(7.5, 24, [2.2, 1.4], 1.0, [1.1, 1.4], 0.55, gap);
    rear_two_terminal(31, 34, [2.2, 1.4], 1.0, [1.1, 1.4], 0.55, gap);
}

module insulating_esp32_cradle(gap = 0) {
    rail_h = esp32_cradle_gap - esp32_cradle_foam_t;
    guard_h = esp32_cradle_gap + esp32_board_t + 2.7;

    // Narrow longitudinal rails contact only the module's PCB edge strips;
    // the stock header rows and populated centre remain over open air.
    color(cradle_plastic)
        for (x = esp32_cradle_rail_x)
            back_slab_at(
                x,
                esp32_cradle_rail_y,
                esp32_cradle_rail_size,
                0.32,
                rail_h,
                gap
            );
    color(cradle_foam)
        for (x = esp32_cradle_rail_x)
            back_slab_at(
                x,
                esp32_cradle_rail_y,
                esp32_cradle_rail_size,
                0.32,
                esp32_cradle_foam_t,
                gap + rail_h
            );

    // Four outside shoulders align with the routed slots.  Two removable
    // non-metallic straps pass through the slot pairs and over the shoulders,
    // clear of the header pins and carrier copper.
    color(cradle_plastic)
        for (y = [131.5, 139.5])
            for (x = [5.05, 35.41])
                back_slab_at(x, y, [1.10, 4.8], 0.28, guard_h, gap);
    color(strap_black)
        for (y = [131.5, 139.5])
            back_slab_at(
                20.25,
                y,
                [35.70, 1.65],
                0.55,
                0.45,
                gap + guard_h
            );
}

module optional_waveshare_module(gap = 0) {
    // Ghosted removable fit envelope.  The module is wired to J4 by an
    // external 3.3 V SPI ribbon; its 38 stock header pins never enter the
    // carrier.  Pin length and cradle height require a purchased-V3 dry fit.
    mount_gap = gap + esp32_cradle_gap;
    pin_stack = esp32_header_insulator_h + esp32_header_free_pin;

    color([module_green[0], module_green[1], module_green[2], 0.30])
        back_slab_at(
            esp32_bay_center[0],
            esp32_bay_center[1],
            esp32_board_outline,
            0.7,
            esp32_board_t,
            mount_gap
        );

    // Stock .025-inch-square male rows remain wholly above the carrier.
    color([enig_gold[0], enig_gold[1], enig_gold[2], 0.34])
        for (dx = [-esp32_header_row_dx, esp32_header_row_dx])
            for (i = [0 : esp32_header_count - 1])
                back_slab_at(
                    esp32_bay_center[0] + dx,
                    esp32_header_first_y + i * esp32_header_pitch,
                    [esp32_header_pin, esp32_header_pin],
                    0.05,
                    pin_stack,
                    mount_gap - pin_stack
                );
    color([0.86, 0.67, 0.10, 0.30])
        for (dx = [-esp32_header_row_dx, esp32_header_row_dx])
            back_slab_at(
                esp32_bay_center[0] + dx,
                esp32_bay_center[1],
                esp32_header_insulator,
                0.18,
                esp32_header_insulator_h,
                mount_gap - esp32_header_insulator_h
            );

    // PCB antenna at the top, ESP32 can in the middle, USB-C projecting below.
    color([0.09, 0.42, 0.28, 0.30])
        back_slab_at(esp32_bay_center[0], 103.8, [24, 11.5], 0.5, 0.30,
                     mount_gap + esp32_board_t);
    color([metal[0], metal[1], metal[2], 0.32])
        back_slab_at(esp32_bay_center[0], 119, [17, 16], 0.8, 2.4,
                     mount_gap + esp32_board_t);
    color([chip_black[0], chip_black[1], chip_black[2], 0.36])
        back_slab_at(esp32_bay_center[0], 134, [8, 7], 0.5, 1.6,
                     mount_gap + esp32_board_t);
    color([metal[0], metal[1], metal[2], 0.40])
        back_slab_at(esp32_bay_center[0], 146.3, [9.2, 7.0], 0.9, 3.2,
                     mount_gap + esp32_board_t);
}

// ---------- Views ----------

module assembled_badge() {
    bare_pcb();
    pcb_artwork();
    panel_adhesive();
    epaper_panel();
    if (show_protector) panel_protector();
    display_zif();
    if (show_protector) panel_service_spine();
    raw_panel_components();
    rear_passive();
    insulating_esp32_cradle();
    if (show_optional_waveshare) optional_waveshare_module();
}

module pcb_only_badge() {
    bare_pcb();
    pcb_artwork();
}

module exploded_badge() {
    bare_pcb();
    pcb_artwork();

    // Front layers move forward; the rear raw-panel set and removable cradle
    // move back.
    panel_adhesive(exploded_step * 0.35);
    epaper_panel(exploded_step);
    if (show_protector) panel_protector(exploded_step * 2);
    display_zif();
    if (show_protector) panel_service_spine(exploded_step * 2);
    raw_panel_components(exploded_step);
    rear_passive(exploded_step);
    insulating_esp32_cradle(exploded_step);
    if (show_optional_waveshare)
        optional_waveshare_module(exploded_step * 2);
}

module service_spine_part() {
    // Isolate the removable part at the origin for a printable STL export.
    translate([
        -bx((0.80 + 8.60) / 2),
        -by(fpc_center_y),
        -board_t / 2
    ]) panel_service_spine();
}

if (mode == "pcb_only")
    pcb_only_badge();
else if (mode == "exploded")
    exploded_badge();
else if (mode == "service_spine")
    service_spine_part();
else
    assembled_badge();
