/* ============================================================
   HAVELI OF SHADOWS — MAIN
   Boots the whole haveli: builds every room in order, wires up
   controls, and starts the render loop.
   Load this file LAST, after engine.js, room1.js, room2.js,
   room3.js, and washroom1.js.
============================================================ */

function init(){
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030304, 0.105);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.05, 60);
  pitchObject = new THREE.Object3D();
  pitchObject.add(camera);
  yawObject = new THREE.Object3D();
  yawObject.position.set(0, 1.65, ROOM_D/2 - 2.2);
  yawObject.add(pitchObject);
  scene.add(yawObject);

  buildFlashlight();

  renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.72;
  maxAniso = renderer.capabilities.getMaxAnisotropy();
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // run each room/prop builder inside a try/catch so a missing constant or
  // a bug in one function (e.g. an unfinished room) can't take down the
  // whole game - it just logs to console and everything else still loads
  function safe(fn){
    if(typeof fn !== 'function'){
      console.warn('[haveli] skipped - not defined:', fn);
      return;
    }
    try{ fn(); }
    catch(err){ console.error('[haveli] error in ' + (fn.name||'anonymous') + '():', err); }
  }

  safe(buildLighting);
  safe(buildRoomShell);
  safe(buildJharokhaWindow);
  safe(buildDoorway);
  safe(buildCharpai);
  safe(buildTrunk);
  safe(buildAlmirah);
  safe(buildMirror);
  safe(buildBulb);
  safe(buildBell);
  safe(buildNicheIdol);
  safe(buildCobwebs);
  safe(buildBlood);
  safe(buildCorridor);
  safe(buildRoom2);
  safe(buildRoom2Furniture);
  safe(buildCorridor2);
  safe(buildRoom3);
  safe(buildRoom4);
  safe(typeof buildRoom5 !== 'undefined' ? buildRoom5 : null);
  safe(typeof buildRoom6 !== 'undefined' ? buildRoom6 : null);
  safe(typeof buildWashroom1 !== 'undefined' ? buildWashroom1 : null);

  window.addEventListener('resize', onResize);
  setupControls();

  const loading = document.getElementById('loading');
  loading.style.opacity = 0;
  setTimeout(()=>{ loading.style.display='none'; }, 650);
}

init();
animate();
