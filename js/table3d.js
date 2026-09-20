/* Six at Seven — round dinner table, six seats, WebGL.
   Gated: skipped under 768px, prefers-reduced-motion, or no WebGL.
   Falls back to the CSS seat ring already in the DOM. */
(function () {
  'use strict';

  var canvas = document.getElementById('tableCanvas');
  var fallback = document.getElementById('stageFallback');
  var hint = document.getElementById('stageHint');
  if (!canvas || !fallback) return;

  var BRASS = 0xe0a850;

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
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  // Framed so all six chairs sit inside the circular canvas mask at every
  // rotation — the chair ring has radius 3.45 + half-depth, so verify after
  // changing R or the chair ring radius.
  camera.position.set(0, 7.0, 11.2);
  camera.lookAt(0, 0.35, 0);

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

  // ── lights: one warm pendant over the table, cool fill ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  var pendant = new THREE.PointLight(BRASS, 62, 22, 2);
  pendant.position.set(0, 4.2, 0);
  pendant.castShadow = true;
  pendant.shadow.mapSize.set(1024, 1024);
  scene.add(pendant);
  var fill = new THREE.DirectionalLight(0x8fb4ff, 0.5);
  fill.position.set(-5, 6, 5);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0xffffff, 0.3);
  rim.position.set(4, 2, -6);
  scene.add(rim);

  // ── group that spins ──
  var rig = new THREE.Group();
  scene.add(rig);

  var R = 2.55;             // table radius
  var wood = new THREE.MeshStandardMaterial({ color: 0x2c211a, roughness: 0.55, metalness: 0.12 });
  var brassMat = new THREE.MeshStandardMaterial({ color: BRASS, roughness: 0.3, metalness: 0.85 });
  var linen = new THREE.MeshStandardMaterial({ color: 0xf3efe7, roughness: 0.85, metalness: 0 });
  var dark = new THREE.MeshStandardMaterial({ color: 0x16181b, roughness: 0.7, metalness: 0.2 });

  // top
  var top = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.16, 72), wood);
  top.position.y = 0.9; top.castShadow = true; top.receiveShadow = true;
  rig.add(top);
  // brass edge band
  var band = new THREE.Mesh(new THREE.TorusGeometry(R, 0.045, 12, 80), brassMat);
  band.rotation.x = Math.PI / 2; band.position.y = 0.9;
  rig.add(band);
  // pedestal + base
  var col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.9, 24), dark);
  col.position.y = 0.42; col.castShadow = true;
  rig.add(col);
  var base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.1, 40), dark);
  base.position.y = 0.02; base.receiveShadow = true;
  rig.add(base);

  // floor to catch shadow
  var floor = new THREE.Mesh(
    new THREE.CircleGeometry(6.2, 64),
    new THREE.MeshStandardMaterial({ color: 0x0d0e10, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.03;
  floor.receiveShadow = true;
  scene.add(floor);

  // centrepiece: a small brass candle, lit
  var candle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.34, 18), linen);
  candle.position.y = 1.15; rig.add(candle);
  var holder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 20), brassMat);
  holder.position.y = 0.99; rig.add(holder);
  var flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd489 })
  );
  flame.position.y = 1.36; flame.scale.y = 1.7; rig.add(flame);
  var flameLight = new THREE.PointLight(0xffc46b, 5, 4, 2);
  flameLight.position.y = 1.4; rig.add(flameLight);

  // ── six covers: plate, chair, glass ──
  var SEATS = 6;
  var youIndex = 3;
  var chairs = [];
  for (var i = 0; i < SEATS; i++) {
    var a = (i / SEATS) * Math.PI * 2;
    var cx = Math.cos(a), cz = Math.sin(a);
    var isYou = i === youIndex;

    var plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.33, 0.3, 0.035, 32),
      isYou ? brassMat : linen
    );
    plate.position.set(cx * 1.75, 1.0, cz * 1.75);
    plate.castShadow = true;
    rig.add(plate);

    var glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.055, 0.26, 16),
      new THREE.MeshStandardMaterial({
        color: 0xbfd6e8, roughness: 0.08, metalness: 0.1,
        transparent: true, opacity: 0.45
      })
    );
    glass.position.set(cx * 1.4 - cz * 0.36, 1.11, cz * 1.4 + cx * 0.36);
    rig.add(glass);

    // cutlery
    for (var k = -1; k <= 1; k += 2) {
      var fk = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, 0.28), brassMat);
      fk.position.set(cx * 1.75 - cz * 0.46 * k, 0.995, cz * 1.75 + cx * 0.46 * k);
      fk.rotation.y = -a;
      rig.add(fk);
    }

    // chair: seat + back
    var chair = new THREE.Group();
    var seat = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.09, 0.62), isYou ? brassMat : wood);
    seat.position.y = 0.58; seat.castShadow = true;
    chair.add(seat);
    var back = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.78, 0.09), isYou ? brassMat : wood);
    back.position.set(0, 0.98, 0.3); back.castShadow = true;
    chair.add(back);
    for (var lx = -1; lx <= 1; lx += 2) {
      for (var lz = -1; lz <= 1; lz += 2) {
        var leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.56, 0.06), dark);
        leg.position.set(lx * 0.26, 0.28, lz * 0.26);
        chair.add(leg);
      }
    }
    chair.position.set(cx * 3.45, 0, cz * 3.45);
    chair.rotation.y = -a + Math.PI / 2;
    chair.userData.base = chair.position.y;
    chair.userData.phase = i * 0.9;
    chairs.push(chair);
    rig.add(chair);
  }

  // ── interaction: drag to spin, momentum ──
  var rot = 0, vel = 0.0016, dragging = false, lastX = 0;
  function down(x) { dragging = true; lastX = x; vel = 0; canvas.setAttribute('data-drag', '1'); }
  function move(x) { if (!dragging) return; var d = (x - lastX) * 0.006; rot += d; vel = d * 0.55; lastX = x; }
  function up() { dragging = false; canvas.removeAttribute('data-drag'); }

  canvas.addEventListener('pointerdown', function (e) { down(e.clientX); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', function (e) { move(e.clientX); });
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

  var t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    var t = (now - t0) / 1000;

    if (!dragging) {
      rot += vel;
      vel += (0.0016 - vel) * 0.02;   // ease back to idle spin
    }
    rig.rotation.y = rot;
    rig.position.y = Math.sin(t * 0.7) * 0.05;

    // chairs breathe slightly out of phase
    chairs.forEach(function (c) {
      c.position.y = Math.sin(t * 1.1 + c.userData.phase) * 0.035;
    });

    // candle flicker
    var f = 0.85 + Math.sin(t * 11) * 0.06 + Math.sin(t * 27) * 0.04;
    flameLight.intensity = 5 * f;
    flame.scale.set(f, 1.7 * f, f);

    renderer.render(scene, camera);
  }

  size();
  window.addEventListener('resize', size);
  requestAnimationFrame(frame);
  fallback.style.opacity = '0';
})();
