/* ============================================================
HAVELI OF SHADOWS — MAIN
Boots the whole haveli: builds every room in order, wires up
controls, and starts the render loop.
Load this file LAST, after engine.js, room1.js, room2.js,
room3.js, washroom1.js, room11.js, room12.js, and room13.js.
============================================================ */

// FIX: each build function used to be called directly, so the moment any
// one of them threw (undefined constant, missing variable, etc.) every
// call after it in init() never ran - you'd only ever see ONE error per
// reload. safeBuild() catches and logs the error instead of letting it
// stop the whole chain, so every broken room shows up in the console at
// once. Once everything is fixed, this wrapper is harmless to leave in.
function safeBuild(name, fn){
  try {
    fn();
  } catch(e){
    console.error(`[BUILD FAILED] ${name}:`, e.message);
  }
}

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

safeBuild('buildLighting', buildLighting);
safeBuild('buildRoomShell', buildRoomShell);
safeBuild('buildJharokhaWindow', buildJharokhaWindow);
safeBuild('buildDoorway', buildDoorway);
safeBuild('buildCharpai', buildCharpai);
safeBuild('buildTrunk', buildTrunk);
safeBuild('buildAlmirah', buildAlmirah);
safeBuild('buildTorch', buildTorch);
safeBuild('buildMirror', buildMirror);
safeBuild('buildBulb', buildBulb);
safeBuild('buildBell', buildBell);
safeBuild('buildNicheIdol', buildNicheIdol);
safeBuild('buildCobwebs', buildCobwebs);
safeBuild('buildBlood', buildBlood);
safeBuild('buildCorridor', buildCorridor);
safeBuild('buildRoom2', buildRoom2);
safeBuild('buildRoom2Furniture', buildRoom2Furniture);
safeBuild('buildCorridor2', buildCorridor2);
safeBuild('buildRoom3', buildRoom3);
safeBuild('buildRoom4', buildRoom4);

// --- room 11 wing: off room 2's back wall, then east/west to 12 & 13 ---
safeBuild('buildCorridor11', buildCorridor11);
safeBuild('buildRoom11', buildRoom11);
safeBuild('buildRoom11Gate', buildRoom11Gate);
safeBuild('buildCorridor12', buildCorridor12);
safeBuild('buildRoom12', buildRoom12);
safeBuild('buildCorridor13', buildCorridor13);
safeBuild('buildRoom13', buildRoom13);

window.addEventListener('resize', onResize);
setupControls();
const loading = document.getElementById('loading');
loading.style.opacity = 0;
setTimeout(()=>{ loading.style.display='none'; }, 650);
}
init();
animate();
