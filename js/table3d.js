/* Six at Seven — the table, in WebGL.
   Gated: skipped under 768px, prefers-reduced-motion, or no WebGL.
   Falls back to the CSS seat-ring already sitting in the DOM.

   Design notes:
   - Everything round is LATHE geometry (stemmed glasses, rimmed plates, the
     draped cloth). Boxes read as a toy; turned profiles read as a set table.
   - The CAMERA orbits; the table does not spin. A spinning object looks like a
     product turntable, an orbiting camera looks like a room you are walking
     around.
   - The six seats fill one at a time on a loop. That is the product story — we
     build the table — so the hero animates the pitch instead of decorating it.
*/
(function () {
  'use strict';

  var canvas = document.getElementById('tableCanvas');
  var fallback = document.getElementById('stageFallback');
  var hint = document.getElementById('stageHint');
  if (!canvas || !fallback) return;

  /* Scene palette — mirrors the CSS tokens in css/style.css.
     Keep in sync with :root; these are the only colours in this file. */
  var C = {
    cherry: 0x8c2f32,  /* --accent-fill, marks the YOU seat */
    wood:   0x6d4a3d,  /* walnut top */
    cloth:  0xfffaf3,  /* --card, the linen drape */
    oat:    0xd7c6b4,
    greige: 0xaf9c8e,
    metal:  0x8a7d70,
    glass:  0xe8dfd2,
    flame:  0xffcf7a,
    sun:    0xfff4e6,
    sky:    0xe6dcd0
  };

  function buildFallback() {
    canvas.style.display = 'none';
    if (hint) hint.textContent = 'a table for six · Thursdays';
    var labels = ['01', '02', '03', 'YOU', '05', '06'];
    var r = 38; // % radius
    labels.forEach(function (t, i) {
      var a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
      var el = document.createElement('span');
      el.className = 'seat' + (t === 'YOU' ? ' you' : '');
      el.textContent = t;
      el.style.left = 'calc(' + (50 + Math.cos(a) * r) + '% - 22px)';
      el.style.top = 'calc(' + (50 + Math.sin(a) * r) + '% - 22px)';
      fallback.appendChild(el);
    });
  }

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 768;

  if (reduced || small || !webglOK() || typeof THREE === 'undefined') {
    buildFallback();
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) { buildFallback(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  function size() {
    var w = canvas.clientWidth || 440;
    renderer.setSize(w, w, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  // ── lights: a bright room, with the candle still reading warm ──
  scene.add(new THREE.HemisphereLight(C.sun, C.oat, 1.0));
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  // Only the key casts. A second casting light stacks a heavy ellipse under
  // the table that reads as a grey disc on a pale page.
  var key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(-7, 13, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 42;
  key.shadow.camera.left = -11; key.shadow.camera.right = 11;
  key.shadow.camera.top = 11; key.shadow.camera.bottom = -11;
  key.shadow.bias = -0.0006;
  scene.add(key);

  var fillL = new THREE.DirectionalLight(C.sky, 0.5);
  fillL.position.set(6, 4, 4);
  scene.add(fillL);
  var rim = new THREE.DirectionalLight(0xffffff, 0.4);
  rim.position.set(3, 3, -7);
  scene.add(rim);

  var pendant = new THREE.PointLight(C.flame, 26, 24, 2);
  pendant.position.set(0, 5.6, 0);
  pendant.castShadow = false;
  scene.add(pendant);

  var rig = new THREE.Group();
  scene.add(rig);

  // ── materials ──
  var matCloth  = new THREE.MeshStandardMaterial({ color: C.cloth, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  var matWood   = new THREE.MeshStandardMaterial({ color: C.wood, roughness: 0.55, metalness: 0.08 });
  var matCherry = new THREE.MeshStandardMaterial({ color: C.cherry, roughness: 0.42, metalness: 0.15, side: THREE.DoubleSide });
  var matMetal  = new THREE.MeshStandardMaterial({ color: C.metal, roughness: 0.38, metalness: 0.65, side: THREE.DoubleSide });
  var matPlate  = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.04, side: THREE.DoubleSide });
  var matGlass  = new THREE.MeshStandardMaterial({
    color: C.glass, roughness: 0.05, metalness: 0,
    transparent: true, opacity: 0.42, side: THREE.DoubleSide
  });

  // LatheGeometry winds its faces from the point order. A profile listed from
  // the axis outwards produces DOWNWARD-facing normals, so a flat top renders
  // invisible from above and you see straight through to whatever is beneath.
  // Every profile here is therefore rendered DoubleSide rather than relying on
  // getting the winding right per shape.
  function lathe(points, seg, mat) {
    var v = points.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    return new THREE.Mesh(new THREE.LatheGeometry(v, seg || 48), mat);
  }

  var R = 2.55;    // table radius
  var TOP = 2.55;  // surface height. R*2/TOP = 2.0, the real dining-table
                   // ratio; at 1.02 it was 5.0 and read as a pouf.

  // ── the table: walnut top, linen drape, turned pedestal ──
  var top = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.1, 80), matWood);
  top.position.y = TOP - 0.02;
  top.castShadow = true; top.receiveShadow = true;
  rig.add(top);

  // draped cloth — flares as it falls, so it reads as fabric, not a tube
  // Profile measured, not guessed: the hem must fall ~0.78 from a top at 1.02
  // (hem near y=0.28) and stay within ~+0.10 of R, or the drape renders as a
  // fat slab instead of fabric.
  // Half-drop (1.15 = 0.45 of table height), so the pedestal stays visible.
  // A floor-length cloth on a round table renders as a featureless drum.
  var cloth = lathe([
    [0.0, 0.0], [R * 0.6, 0.0], [R * 0.94, 0.0], [R, -0.02], [R + 0.02, -0.1],
    [R + 0.015, -0.45], [R + 0.04, -0.82], [R + 0.09, -1.06], [R + 0.14, -1.15]
  ], 96, matCloth);
  cloth.position.y = TOP + 0.04;
  cloth.castShadow = true; cloth.receiveShadow = true;
  rig.add(cloth);

  var ped = lathe([
    [0.0, 0.0], [0.86, 0.0], [0.9, 0.12], [0.62, 0.3], [0.3, 0.5],
    [0.24, 1.1], [0.22, 1.6], [0.3, 1.9], [0.26, 2.3], [0.0, 2.45]
  ], 44, matMetal);
  ped.castShadow = true;
  rig.add(ped);

  // ── centrepiece ──
  var holder = lathe([
    [0, 0], [0.22, 0.0], [0.24, 0.03], [0.1, 0.06], [0.085, 0.1], [0, 0.1]
  ], 32, matMetal);
  holder.position.y = TOP + 0.05;
  rig.add(holder);

  var candle = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.4, 24), matCloth);
  candle.position.y = TOP + 0.26;
  candle.castShadow = true;
  rig.add(candle);

  var flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 14, 14),
    new THREE.MeshBasicMaterial({ color: C.flame })
  );
  flame.position.y = TOP + 0.5;
  flame.scale.y = 1.9;
  rig.add(flame);

  // soft halo so the candle glows rather than merely existing
  var halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: C.flame, transparent: true, opacity: 0.16 })
  );
  halo.position.copy(flame.position);
  rig.add(halo);

  var flameLight = new THREE.PointLight(C.flame, 5.0, 6, 2);
  flameLight.position.y = TOP + 0.52;
  rig.add(flameLight);

  // ── six covers ──
  var SEATS = 6;
  var YOU = 3;
  var seats = [];

  var plateProfile = [
    [0.0, 0.0], [0.18, 0.004], [0.27, 0.022], [0.315, 0.042],
    [0.32, 0.052], [0.278, 0.04], [0.17, 0.02], [0.0, 0.014]
  ];
  var glassProfile = [
    [0.0, 0.0], [0.135, 0.0], [0.14, 0.012], [0.028, 0.035],
    [0.022, 0.2], [0.035, 0.225], [0.115, 0.3], [0.142, 0.4],
    [0.145, 0.48], [0.132, 0.48], [0.128, 0.4], [0.1, 0.31], [0.016, 0.235]
  ];

  for (var i = 0; i < SEATS; i++) {
    var a = (i / SEATS) * Math.PI * 2;
    var cx = Math.cos(a), cz = Math.sin(a);
    var you = i === YOU;
    var g = new THREE.Group();

    var plate = lathe(plateProfile, 40, you ? matCherry : matPlate);
    plate.position.set(cx * 1.72, TOP + 0.05, cz * 1.72);
    plate.castShadow = true; plate.receiveShadow = true;
    g.add(plate);

    var glass = lathe(glassProfile, 32, matGlass);
    glass.position.set(cx * 1.4 - cz * 0.44, TOP + 0.05, cz * 1.4 + cx * 0.44);
    g.add(glass);

    // knife and fork flanking the cover
    (function (cx, cz, a) {
      [-1, 1].forEach(function (k) {
        var c = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.01, 0.3), matMetal);
        c.position.set(cx * 1.68 - cz * 0.45 * k, TOP + 0.055, cz * 1.72 + cx * 0.45 * k);
        c.rotation.y = -a;
        g.add(c);
      });
    })(cx, cz, a);

    // chair: curved back rail on turned legs
    var chair = new THREE.Group();
    var seatPad = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.72, 0.14, 28), you ? matCherry : matWood);
    seatPad.position.y = 1.53; seatPad.castShadow = true;
    chair.add(seatPad);

    var railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.46, 2.74, -0.36),
      new THREE.Vector3(-0.34, 2.80, -0.60),
      new THREE.Vector3(0.00, 2.82, -0.70),
      new THREE.Vector3(0.34, 2.80, -0.60),
      new THREE.Vector3(0.46, 2.74, -0.36)
    ]);
    var backRail = new THREE.Mesh(
      new THREE.TubeGeometry(railCurve, 28, 0.07, 10, false),
      you ? matCherry : matWood
    );
    backRail.castShadow = true;
    chair.add(backRail);

    // two spindles fill the back so it is a chair, not an open frame
    [-0.16, 0.16].forEach(function (sx) {
      var sp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 1.12, 10),
        you ? matCherry : matWood
      );
      sp.position.set(sx, 2.2, -0.6);
      sp.castShadow = true;
      chair.add(sp);
    });

    (function (chair, you) {
      [-0.46, 0.46].forEach(function (ox) {
        var post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.27, 12), you ? matCherry : matWood);
        post.position.set(ox, 2.14, -0.4);
        post.castShadow = true;
        chair.add(post);
      });
    })(chair, you);

    for (var lx = -1; lx <= 1; lx += 2) {
      for (var lz = -1; lz <= 1; lz += 2) {
        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 1.53, 12), matMetal);
        leg.position.set(lx * 0.5, 0.765, lz * 0.5);
        leg.castShadow = true;
        chair.add(leg);
      }
    }
    chair.position.set(cx * 3.57, 0, cz * 3.57);
    chair.rotation.y = -a - Math.PI / 2;
    g.add(chair);

    // the "seated" marker: a ring on the cloth that blooms as the seat fills
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.36, 0.42, 40),
      new THREE.MeshBasicMaterial({
        color: you ? C.cherry : C.greige,
        transparent: true, opacity: 0, side: THREE.DoubleSide
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(cx * 1.68, TOP + 0.061, cz * 1.72);
    g.add(ring);

    rig.add(g);
    seats.push({ chair: chair, plate: plate, ring: ring, you: you });
  }

  // Shadow-only floor: renders the received shadow and nothing else, so the
  // table sits on the page instead of on a grey disc.
  var floor = new THREE.Mesh(
    new THREE.CircleGeometry(9, 64),
    new THREE.ShadowMaterial({ opacity: 0.15 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // ── camera orbit: drag to steer, momentum eases back to idle ──
  var ang = -0.5, vel = 0.0022, dragging = false, lastX = 0;
  var DIST = 16.1, HEIGHT = 9.0;

  canvas.addEventListener('pointerdown', function (e) {
    dragging = true; lastX = e.clientX; vel = 0;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var d = (e.clientX - lastX) * 0.006;
    ang -= d; vel = -d * 0.5; lastX = e.clientX;
  });
  function release() { dragging = false; }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

  // ── seating sequence: one seat every 0.85s, hold, then reset ──
  var SEAT_EVERY = 0.85, HOLD = 3.2;
  var CYCLE = SEATS * SEAT_EVERY + HOLD;

  function ease(x) { return 1 - Math.pow(1 - x, 3); }

  var t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - t0) / 1000;

    if (!dragging) { ang += vel; vel += (0.0022 - vel) * 0.02; }

    camera.position.set(
      Math.sin(ang) * DIST,
      HEIGHT + Math.sin(t * 0.25) * 0.6,
      Math.cos(ang) * DIST
    );
    camera.lookAt(0, 1.58, 0);

    var ct = t % CYCLE;
    seats.forEach(function (s, idx) {
      var start = idx * SEAT_EVERY;
      var p = Math.max(0, Math.min(1, (ct - start) / 0.7));
      if (ct > CYCLE - 0.5) p *= Math.max(0, (CYCLE - ct) / 0.5); // fade out together
      var f = ease(p);
      s.ring.material.opacity = f * (s.you ? 0.85 : 0.5);
      s.ring.scale.setScalar(0.85 + f * 0.15);
      s.chair.position.y = (1 - f) * -0.3;       // chair eases into place
      s.chair.scale.setScalar(0.94 + f * 0.06);
      s.plate.position.y = TOP + 0.05 + Math.sin(t * 1.2 + idx) * 0.004 * f;
    });

    // candle flicker
    var fl = 0.86 + Math.sin(t * 11) * 0.06 + Math.sin(t * 27) * 0.04;
    flameLight.intensity = 5.0 * fl;
    flame.scale.set(fl, 1.9 * fl, fl);
    halo.scale.setScalar(fl * (1 + Math.sin(t * 2.1) * 0.05));
    halo.material.opacity = 0.14 * fl;

    rig.position.y = Math.sin(t * 0.6) * 0.04;

    renderer.render(scene, camera);
  }

  size();
  window.addEventListener('resize', size);
  requestAnimationFrame(frame);
  fallback.style.opacity = '0';
})();
