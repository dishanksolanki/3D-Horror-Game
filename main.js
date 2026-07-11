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

  buildLighting();
  buildRoomShell();
  buildJharokhaWindow();
  buildDoorway();
  buildCharpai();
  buildTrunk();
  buildAlmirah();
  buildMirror();
  buildBulb();
  buildBell();
  buildNicheIdol();
  buildCobwebs();
  buildBlood();
  buildCorridor();
  buildRoom2();
  buildRoom2Furniture();
  buildCorridor2();
  buildRoom3();
  buildRoom4();

  window.addEventListener('resize', onResize);
  setupControls();

  const loading = document.getElementById('loading');
  loading.style.opacity = 0;
  setTimeout(()=>{ loading.style.display='none'; }, 650);
}

init();
animate();
