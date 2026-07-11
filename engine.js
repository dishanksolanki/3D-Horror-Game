/* ============================================================
   HAVELI OF SHADOWS — SHARED ENGINE
   Scene/camera/renderer setup, shared state, procedural
   texture generators used by more than one room, generic
   lighting helpers, player controls, movement/collision,
   and the render loop.
   Loaded BEFORE the room1.js / room2.js / room3.js /
   washroom1.js / room6.js files, and BEFORE main.js.
   ============================================================ */

let scene, camera, renderer, clock;
let yawObject, pitchObject;
let moveF=false, moveB=false, moveL=false, moveR=false;
let velocity = new THREE.Vector3();
let obstacles = []; // {minX,maxX,minZ,maxZ}

const ROOM_W = 6.4, ROOM_D = 7.6, ROOM_H = 3.2;
const WIN_Z = -1.5, WIN_W = 1.4, WIN_H = 1.4, WIN_SILL = 0.9;
const WIN_LINTEL = WIN_SILL + WIN_H;
const DOOR_H = 2.1;
const PLAYER_R = 0.4;

const CORR_LEN = 2.0, CORR_W = 1.5, CORR_H = 2.3;
const ROOM2_W = 5.6, ROOM2_D = 6.2, ROOM2_H = 3.05;

const ROOM1_NORTH_Z = -ROOM_D/2; // room 1's north wall (doorway) z
const CORR_SOUTH_Z = ROOM1_NORTH_Z; // corridor starts here
const CORR_NORTH_Z = ROOM1_NORTH_Z - CORR_LEN; // corridor ends here
const ROOM2_SOUTH_Z = CORR_NORTH_Z; // room 2's south wall (doorway) z
const ROOM2_NORTH_Z = ROOM2_SOUTH_Z - ROOM2_D; // room 2's back wall z

/* ---- east branch: opens off room 2's east wall -> corridor2 -> room 3 ---- */
const ROOM2_CENTER_Z = (ROOM2_SOUTH_Z + ROOM2_NORTH_Z)/2;
const CORR2_GAPHALF = CORR_W/2; // the gate opening matches the main corridor's width
const CORR2_LEN = 2.8; // how far east the branch travels (increased so room 3 clears room 2's wall comfortably)
const CORR2_H = 2.3;
const CORR2_SOUTH_Z = ROOM2_CENTER_Z - CORR2_GAPHALF; // branch corridor's south wall z
const CORR2_NORTH_Z = ROOM2_CENTER_Z + CORR2_GAPHALF; // branch corridor's north wall z
const CORR2_WEST_X = ROOM2_W/2; // starts right at room 2's east wall
const CORR2_EAST_X = CORR2_WEST_X + CORR2_LEN; // ends here -> room 3's west doorway
const ROOM3_W = 5.2, ROOM3_D = 5.6, ROOM3_H = 3.05;
const ROOM3_WEST_X = CORR2_EAST_X; // room 3's west wall (doorway) x
const ROOM3_EAST_X = ROOM3_WEST_X + ROOM3_W;
const ROOM3_CENTER_Z = ROOM2_CENTER_Z; // exactly aligned with room 2, sitting flush beside it

/* ---- room 4: a cramped washroom opening directly off room 2's west wall,
   no corridor - deliberately the smallest room in the haveli so far ---- */
const GATE4_GAPHALF = 0.6; // narrower doorway than the other rooms
const ROOM4_W = 3.0, ROOM4_D = 3.0, ROOM4_H = 2.5;
const ROOM4_EAST_X = -ROOM2_W/2; // shares room 2's own west wall
const ROOM4_WEST_X = ROOM4_EAST_X - ROOM4_W;
const ROOM4_CENTER_Z = ROOM2_CENTER_Z; // doorway centered on room 2's z-axis

/* ---- room 5: opens directly off room 3's east wall, no corridor in
   between - straight-through doorway aligned with room 3's own z-axis ---- */
const ROOM5_GAPHALF = 0.75;
const ROOM5_D = 4.6, ROOM5_W = 4.0, ROOM5_H = 2.95; // D = x-extent (width), W = z-extent (depth)
const ROOM5_WEST_X = ROOM3_EAST_X; // shares room 3's own east wall
const ROOM5_EAST_X = ROOM5_WEST_X + ROOM5_D;
const ROOM5_CENTER_Z = ROOM3_CENTER_Z; // straight-through alignment with room 3

/* ---- room 6: a small ancestral shrine opening directly off room 2's
   north (back) wall - the "future rooms can open through it" dead-end
   from room 2's shell finally opens up here ---- */
const GATE6_GAPHALF = 0.75;
const ROOM6_W = 4.2, ROOM6_D = 4.6, ROOM6_H = 2.9;
const ROOM6_SOUTH_Z = ROOM2_NORTH_Z; // shares room 2's own north wall
const ROOM6_NORTH_Z = ROOM6_SOUTH_Z - ROOM6_D; // room 6's back wall z

/* ---- room 7: ordinary bedroom, opens off room 6's east wall ---- */
const GATE7_GAPHALF = 0.6;
const ROOM7_W = 5.6, ROOM7_D = 5.2, ROOM7_H = ROOM6_H;
const ROOM7_WEST_X = ROOM6_W/2; // shares room 6's own east wall
const ROOM7_EAST_X = ROOM7_WEST_X + ROOM7_W;
const ROOM7_CENTER_Z = (ROOM6_SOUTH_Z + ROOM6_NORTH_Z)/2; // aligned with room 6

/* ---- room 8: storeroom, opens off room 6's west wall ---- */
const GATE8_GAPHALF = 0.6;
const ROOM8_W = 5.6, ROOM8_D = 5.2, ROOM8_H = ROOM6_H;
const ROOM8_EAST_X = -ROOM6_W/2; // shares room 6's own west wall
const ROOM8_WEST_X = ROOM8_EAST_X - ROOM8_W;
const ROOM8_CENTER_Z = (ROOM6_SOUTH_Z + ROOM6_NORTH_Z)/2; // aligned with room 6

/* ---- room 9: a grand hall connected to room 6's north wall by a short
   2-metre stone corridor (corridor9), the same way room 1 connects to
   room 2 - NOT a direct through-the-wall doorway like rooms 6/7/8 ---- */
const GATE9_GAPHALF = 1.0; // wide, grand doorway befitting a hall
const CORR9_LEN = 2.0, CORR9_W = GATE9_GAPHALF*2, CORR9_H = 2.5;
const CORR9_SOUTH_Z = ROOM6_NORTH_Z; // corridor starts at room 6's own north wall
const CORR9_NORTH_Z = CORR9_SOUTH_Z - CORR9_LEN; // corridor ends here
const ROOM9_W = 7.0, ROOM9_D = 9.0, ROOM9_H = 3.4;
const ROOM9_SOUTH_Z = CORR9_NORTH_Z; // room 9's south wall (doorway) z
const ROOM9_NORTH_Z = ROOM9_SOUTH_Z - ROOM9_D;

let bulbLight, bulbMesh, bulbPivot, bellPivot, curtainStrips=[];
let corridorLight, room2Light, corridor2Light, room3Light, room4Light, room5Light, room6Light, corridor9Light, room9Light;
let moonSpot, windowShaft;
let maxAniso = 1;
let bobTimer = 0;
let audioCtx, droneGain;
let almirahDrawers = [];
let roomBoxes = [];
let raycaster = new THREE.Raycaster();
raycaster.far = 3.2;
const screenCenter = new THREE.Vector2(0,0);

/* ---------------- procedural textures ---------------- */

function makeCanvas(w,h){
  const c = document.createElement('canvas'); c.width=w; c.height=h;
  return c;
}

function wallTexture(){
  const S = 1024;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = '#7d6144'; ctx.fillRect(0,0,S,S);
  // rough stone block seams
  ctx.strokeStyle='rgba(25,17,10,0.5)'; ctx.lineWidth=2;
  const blockW = S/6, blockH = S/8;
  for(let r=0;r<8;r++){
    const offset = (r%2)*blockW/2;
    for(let cIdx=-1;cIdx<7;cIdx++){
      ctx.strokeRect(cIdx*blockW+offset, r*blockH, blockW, blockH);
    }
  }
  // grime gradient
  const g = ctx.createRadialGradient(S/2,S/2,S*0.1,S/2,S/2,S*0.78);
  g.addColorStop(0,'rgba(90,65,40,0)'); g.addColorStop(1,'rgba(15,10,7,0.7)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  // plaster speckle (fine noise for high-frequency detail up close)
  for(let i=0;i<14000;i++){
    ctx.fillStyle = `rgba(${20+Math.random()*45},${15+Math.random()*32},${10+Math.random()*22},${Math.random()*0.22})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.4, 1.4);
  }
  // cracks
  ctx.strokeStyle='rgba(12,8,6,0.6)';
  for(let i=0;i<20;i++){
    ctx.lineWidth = 0.8+Math.random()*2.2;
    let x=Math.random()*S, y=Math.random()*S;
    ctx.beginPath(); ctx.moveTo(x,y);
    const segs = 5+Math.floor(Math.random()*7);
    for(let s=0;s<segs;s++){
      x += (Math.random()-0.5)*140; y += (Math.random()-0.5)*140;
      ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // damp stains
  for(let i=0;i<9;i++){
    const rx=Math.random()*S, ry=Math.random()*S, rr=60+Math.random()*160;
    const gg = ctx.createRadialGradient(rx,ry,0,rx,ry,rr);
    gg.addColorStop(0,'rgba(8,18,8,0.28)'); gg.addColorStop(1,'rgba(8,18,8,0)');
    ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(rx,ry,rr,0,7); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAniso;
  return tex;
}

function floorTexture(){
  const S = 1024;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  // base is duller and patchier than a fresh tile floor - old worn stone
  ctx.fillStyle = '#26201a'; ctx.fillRect(0,0,S,S);
  const grid=6;
  const tileW = S/grid;
  // paint each tile with its own aged tone - uneven wear, not a uniform new floor
  for(let r=0;r<grid;r++) for(let cIdx=0;cIdx<grid;cIdx++){
    const shade = 26 + Math.random()*22;
    const tint = Math.random()*10 - 5;
    ctx.fillStyle = `rgb(${shade+tint+12},${shade+tint+6},${shade+tint})`;
    ctx.fillRect(cIdx*tileW, r*tileW, tileW, tileW);
  }
  // grout lines - dark and slightly wavering with age
  ctx.strokeStyle='rgba(5,3,2,0.6)';
  for(let i=0;i<=grid;i++){
    ctx.lineWidth = 2.5+Math.random()*1.5;
    ctx.beginPath();
    let x=i*tileW; ctx.moveTo(x,0);
    for(let y=0;y<=S;y+=64){ x += (Math.random()-0.5)*3; ctx.lineTo(x,y); }
    ctx.stroke();
    ctx.lineWidth = 2.5+Math.random()*1.5;
    ctx.beginPath();
    let y2=i*tileW; ctx.moveTo(0,y2);
    for(let x2=0;x2<=S;x2+=64){ y2 += (Math.random()-0.5)*3; ctx.lineTo(x2,y2); }
    ctx.stroke();
  }
  // chipped/broken tile corners
  for(let i=0;i<26;i++){
    const r = Math.floor(Math.random()*grid), cI = Math.floor(Math.random()*grid);
    const cx = cI*tileW + (Math.random()<0.5?0:tileW);
    const cy = r*tileW + (Math.random()<0.5?0:tileW);
    ctx.fillStyle = 'rgba(4,2,1,0.5)';
    ctx.beginPath(); ctx.moveTo(cx,cy);
    const rad = 8+Math.random()*18;
    for(let a=0;a<6;a++){ ctx.lineTo(cx+(Math.random()-0.5)*rad*2, cy+(Math.random()-0.5)*rad*2); }
    ctx.closePath(); ctx.fill();
  }
  // heavy grime speckle
  for(let i=0;i<9000;i++){
    ctx.fillStyle = `rgba(${6+Math.random()*20},${4+Math.random()*14},${2+Math.random()*10},${Math.random()*0.32})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.3, 1.3);
  }
  // dark damp/mildew patches soaked into the stone
  for(let i=0;i<14;i++){
    const rx=Math.random()*S, ry=Math.random()*S, rr=50+Math.random()*180;
    const gg = ctx.createRadialGradient(rx,ry,0,rx,ry,rr);
    gg.addColorStop(0,'rgba(6,10,6,0.35)'); gg.addColorStop(1,'rgba(6,10,6,0)');
    ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(rx,ry,rr,0,7); ctx.fill();
  }
  // scuffed foot-traffic streaks worn into the stone
  ctx.strokeStyle = 'rgba(60,48,34,0.1)';
  for(let i=0;i<10;i++){
    ctx.lineWidth = 20+Math.random()*40;
    ctx.beginPath();
    let x=Math.random()*S, y=Math.random()*S;
    ctx.moveTo(x,y);
    for(let s=0;s<4;s++){ x+=(Math.random()-0.5)*300; y+=(Math.random()-0.5)*300; ctx.lineTo(x,y); }
    ctx.stroke();
  }
  // faded, worn rangoli mandala in center - old and barely legible, not fresh paint
  ctx.save();
  ctx.translate(S/2,S/2);
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#6e2a2a'; ctx.lineWidth=2;
  for(let ring=0; ring<3; ring++){
    ctx.beginPath(); ctx.arc(0,0,80+ring*70,0,7); ctx.stroke();
  }
  for(let i=0;i<12;i++){
    ctx.rotate(Math.PI/6);
    ctx.beginPath(); ctx.moveTo(0,80); ctx.lineTo(0,300); ctx.strokeStyle='#7a5528'; ctx.stroke();
  }
  ctx.restore();
  // fine surface cracks running across several tiles
  ctx.strokeStyle='rgba(3,2,1,0.55)';
  for(let i=0;i<16;i++){
    ctx.lineWidth = 0.8+Math.random()*1.8;
    let x=Math.random()*S, y=Math.random()*S;
    ctx.beginPath(); ctx.moveTo(x,y);
    const segs = 5+Math.floor(Math.random()*8);
    for(let s=0;s<segs;s++){ x+=(Math.random()-0.5)*100; y+=(Math.random()-0.5)*100; ctx.lineTo(x,y); }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3,3.6);
  tex.anisotropy = maxAniso;
  return tex;
}

function ceilingTexture(){
  const c = makeCanvas(256,256), ctx = c.getContext('2d');
  ctx.fillStyle='#241a12'; ctx.fillRect(0,0,256,256);
  for(let i=0;i<256;i+=32){
    ctx.fillStyle = i%64===0? '#2c2016':'#1e150e';
    ctx.fillRect(0,i,256,30);
  }
  for(let i=0;i<800;i++){
    ctx.fillStyle=`rgba(0,0,0,${Math.random()*0.3})`;
    ctx.fillRect(Math.random()*256,Math.random()*256,1,1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4,4);
  tex.anisotropy = maxAniso;
  return tex;
}

function ropeTexture(){
  const c = makeCanvas(256,256), ctx = c.getContext('2d');
  ctx.fillStyle='#5a4128'; ctx.fillRect(0,0,256,256);
  ctx.strokeStyle='rgba(30,20,10,0.6)'; ctx.lineWidth=3;
  for(let i=-256;i<256;i+=14){
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+256,256); ctx.stroke();
  }
  for(let i=-256;i<256;i+=14){
    ctx.beginPath(); ctx.moveTo(i+256,0); ctx.lineTo(i,256); ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function crackTexture(){
  const c = makeCanvas(256,256), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128,128,10,128,128,150);
  g.addColorStop(0,'#cfd6da'); g.addColorStop(1,'#5b6266');
  ctx.fillStyle=g; ctx.fillRect(0,0,256,256);
  ctx.strokeStyle='rgba(10,10,10,0.7)';
  for(let i=0;i<14;i++){
    ctx.lineWidth=0.8+Math.random();
    ctx.beginPath(); ctx.moveTo(128,128);
    let x=128,y=128;
    const segs=4+Math.floor(Math.random()*4);
    for(let s=0;s<segs;s++){
      x+=(Math.random()-0.5)*90; y+=(Math.random()-0.5)*90;
      ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=8;
  ctx.strokeRect(4,4,248,248);
  return new THREE.CanvasTexture(c);
}

function cobwebTexture(){
  const c = makeCanvas(256,256), ctx=c.getContext('2d');
  ctx.clearRect(0,0,256,256);
  ctx.strokeStyle='rgba(230,230,230,0.55)'; ctx.lineWidth=1;
  const cx=0, cy=0;
  for(let i=0;i<8;i++){
    const a = (i/8)*Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*260, cy+Math.sin(a)*260);
    ctx.stroke();
  }
  for(let r=20;r<260;r+=26){
    ctx.beginPath();
    for(let i=0;i<=8;i++){
      const a=(i/8)*Math.PI/2;
      const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function softDotTexture(){
  const c = makeCanvas(64,64), ctx=c.getContext('2d');
  const g = ctx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,240,210,0.9)'); g.addColorStop(1,'rgba(255,240,210,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,64,64);
  return new THREE.CanvasTexture(c);
}

function bloodPoolTexture(tone){
  // an irregular pool with a wet or dried look depending on tone:
  // 'wet' = fresh, near-black red, glossy centre
  // 'dried' = older, rust-brown crust, matte
  // 'old' = very faded, almost charcoal, sun/air-dried long ago
  tone = tone || 'wet';
  const S = 256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.clearRect(0,0,S,S);
  const cx=S/2, cy=S/2;
  ctx.save();
  ctx.translate(cx,cy);
  ctx.beginPath();
  const points = 13 + Math.floor(Math.random()*9); // vary edge complexity per pool
  const radiusScale = 0.22 + Math.random()*0.14; // vary overall silhouette size/shape
  const squash = 0.72 + Math.random()*0.3;
  for(let i=0;i<=points;i++){
    const a = (i/points)*Math.PI*2;
    const r = S*radiusScale*(0.62+Math.random()*0.65);
    const x = Math.cos(a)*r, y=Math.sin(a)*r*squash;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  let centerColor, midColor, crustColor, highlightColor;
  if(tone==='dried'){
    centerColor='rgba(30,10,5,1)'; midColor='rgba(17,6,3,0.95)'; crustColor='rgba(11,4,2,0.85)'; highlightColor='rgba(45,16,8,0.05)';
  } else if(tone==='old'){
    centerColor='rgba(15,9,8,1)'; midColor='rgba(9,5,5,0.92)'; crustColor='rgba(5,3,3,0.75)'; highlightColor='rgba(22,12,10,0.03)';
  } else {
    centerColor='rgba(5,0,0,1)'; midColor='rgba(2,0,0,0.98)'; crustColor='rgba(1,0,0,0.88)'; highlightColor='rgba(22,3,3,0.08)';
  }
  const g = ctx.createRadialGradient(0,0,4,0,0,S*radiusScale*1.2);
  g.addColorStop(0,centerColor);
  g.addColorStop(0.55,midColor);
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = crustColor;
  ctx.lineWidth = 2+Math.random()*2.5;
  ctx.stroke();
  const tendrils = 3+Math.floor(Math.random()*6);
  for(let i=0;i<tendrils;i++){
    const a = Math.random()*Math.PI*2;
    ctx.strokeStyle = crustColor;
    ctx.lineWidth = 1.5+Math.random()*3.5;
    ctx.beginPath();
    let x=Math.cos(a)*S*radiusScale*0.9, y=Math.sin(a)*S*radiusScale*0.78;
    ctx.moveTo(x,y);
    const len = 14+Math.random()*48;
    x += Math.cos(a)*len; y += Math.sin(a)*len*0.6;
    ctx.lineTo(x,y);
    ctx.stroke();
  }
  if(tone!=='old'){
    const hi = ctx.createRadialGradient(-S*0.08,-S*0.08,2,-S*0.08,-S*0.08,S*0.12);
    hi.addColorStop(0,highlightColor); hi.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hi; ctx.beginPath(); ctx.arc(-S*0.08,-S*0.08,S*0.12,0,7); ctx.fill();
  }
  ctx.restore();
  return new THREE.CanvasTexture(c);
}

function bloodSplatterTexture(tone){
  // scattered droplets and thin spray lines, for splashes on walls/furniture
  tone = tone || 'wet';
  const S = 256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.clearRect(0,0,S,S);
  const cx=S*(0.18+Math.random()*0.4), cy=S*(0.55+Math.random()*0.3);
  const dropCount = 22 + Math.floor(Math.random()*30);
  const spread = S*(0.45+Math.random()*0.3);
  let rB,gB,bB,aB;
  if(tone==='dried'){ rB=24; gB=8; bB=4; aB=0.65; }
  else if(tone==='old'){ rB=13; gB=8; bB=7; aB=0.5; }
  else { rB=4; gB=0; bB=0; aB=0.8; }
  for(let i=0;i<dropCount;i++){
    const a = Math.random()*Math.PI*2;
    const dist = Math.random()*Math.random()*spread;
    const x = cx + Math.cos(a)*dist;
    const y = cy + Math.sin(a)*dist*0.7 - dist*0.35;
    const r = 1+Math.random()*(6*(1-dist/spread));
    if(r<=0) continue;
    ctx.fillStyle = `rgba(${rB+Math.random()*6},${gB+Math.random()*3},${bB+Math.random()*3},${aB+Math.random()*0.2})`;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    if(r>3 && Math.random()<0.6){
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = r*0.5;
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.lineTo(x+(Math.random()-0.5)*4, y+8+Math.random()*22);
      ctx.stroke();
    }
  }
  return new THREE.CanvasTexture(c);
}

function bloodHandprintTexture(tone){
  // a smeared handprint - a palm blob plus five dragged finger streaks
  tone = tone || 'wet';
  const S = 256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.clearRect(0,0,S,S);
  let col;
  if(tone==='dried') col='rgba(20,7,3,0.86)';
  else if(tone==='old') col='rgba(11,7,6,0.78)';
  else col='rgba(3,0,0,0.92)';
  ctx.fillStyle = col;
  ctx.save();
  const scaleV = 0.8+Math.random()*0.35;
  ctx.translate(S*0.5, S*0.62);
  ctx.beginPath(); ctx.ellipse(0,0, S*0.16*scaleV, S*0.13*scaleV, 0, 0, Math.PI*2); ctx.fill();
  const fingerAngles = [-0.55,-0.28,0,0.28,0.6];
  fingerAngles.forEach((a)=>{
    const len = S*(0.2+Math.random()*0.1);
    ctx.save();
    ctx.rotate(a + (Math.random()-0.5)*0.12);
    ctx.beginPath();
    ctx.ellipse(0,-S*0.14*scaleV - len*0.4, S*0.032*scaleV, len*0.5, 0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
  return new THREE.CanvasTexture(c);
}

function woodTexture(baseColor, darkColor){
  const S = 512;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = baseColor || '#3b2413'; ctx.fillRect(0,0,S,S);
  // vertical grain streaks
  for(let i=0;i<70;i++){
    const x = Math.random()*S;
    const w = 1+Math.random()*3;
    ctx.strokeStyle = `rgba(${Math.random()>0.5?20:60},${Math.random()>0.5?12:35},${5+Math.random()*10},${0.08+Math.random()*0.18})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    let x2=x;
    ctx.moveTo(x2,0);
    for(let y=0;y<S;y+=32){
      x2 += (Math.random()-0.5)*10;
      ctx.lineTo(x2,y);
    }
    ctx.stroke();
  }
  // plank seams
  ctx.strokeStyle = darkColor || 'rgba(15,9,5,0.7)';
  ctx.lineWidth = 3;
  for(let i=1;i<4;i++){
    ctx.beginPath(); ctx.moveTo(i*S/4,0); ctx.lineTo(i*S/4,S); ctx.stroke();
  }
  // grime/wear
  for(let i=0;i<3000;i++){
    ctx.fillStyle = `rgba(10,6,3,${Math.random()*0.15})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.2,1.2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = maxAniso;
  return tex;
}

/* ---------------- almirah detail textures ---------------- */

function buildLighting(){
  const amb = new THREE.AmbientLight(0x1a140d, 0.22);
  scene.add(amb);
  const moon = new THREE.DirectionalLight(0x2a3550, 0.12);
  moon.position.set(-6, 8, -4);
  scene.add(moon);
}

/* ---------------- shell ---------------- */

function cobwebTextureVariant(density, tornAmount){
  // a variant cobweb generator with adjustable thread density and a
  // torn/ragged look, so webs scattered through the room don't all
  // look like identical copy-pasted decals
  density = density || 8;
  tornAmount = tornAmount || 0;
  const c = makeCanvas(256,256), ctx=c.getContext('2d');
  ctx.clearRect(0,0,256,256);
  ctx.strokeStyle='rgba(225,225,220,0.5)'; ctx.lineWidth=1;
  const cx=0, cy=0;
  const radials = [];
  for(let i=0;i<density;i++){
    const a = (i/density)*Math.PI/2 + (Math.random()-0.5)*0.08;
    radials.push(a);
    if(Math.random()<tornAmount) continue; // some strands torn away
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*260, cy+Math.sin(a)*260);
    ctx.stroke();
  }
  for(let r=16;r<260;r+=22){
    ctx.beginPath();
    let started=false;
    for(let i=0;i<=density;i++){
      const a = radials[i] !== undefined ? radials[i] : (i/density)*Math.PI/2;
      if(Math.random()<tornAmount*0.5){ started=false; continue; }
      const jitter = (Math.random()-0.5)*6;
      const x=cx+Math.cos(a)*(r+jitter), y=cy+Math.sin(a)*(r+jitter);
      if(!started){ ctx.moveTo(x,y); started=true; } else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // a few dust-caught clumps along the strands
  for(let i=0;i<6;i++){
    ctx.fillStyle = 'rgba(200,195,180,0.35)';
    ctx.beginPath(); ctx.arc(Math.random()*220, Math.random()*220, 1.5+Math.random()*2.5, 0, Math.PI*2); ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

function strandWebTexture(){
  // a thin, mostly-empty strand web for stretching across open gaps
  // (between furniture, across a beam, corner-to-corner) rather than a
  // full corner fan
  const c = makeCanvas(256,128), ctx=c.getContext('2d');
  ctx.clearRect(0,0,256,128);
  ctx.strokeStyle='rgba(230,230,225,0.45)'; ctx.lineWidth=1;
  const strands = 3+Math.floor(Math.random()*3);
  for(let i=0;i<strands;i++){
    const y0 = Math.random()*30, y1 = 98+Math.random()*30;
    ctx.beginPath();
    ctx.moveTo(0,y0);
    const midY = (y0+y1)/2 + (Math.random()-0.5)*20;
    ctx.quadraticCurveTo(128, midY+10, 256, y1);
    ctx.stroke();
  }
  // a few cross-links between strands
  for(let i=0;i<5;i++){
    const x=Math.random()*256;
    ctx.beginPath();
    ctx.moveTo(x, Math.random()*40);
    ctx.lineTo(x+(Math.random()-0.5)*30, 90+Math.random()*30);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function boxFor(pos, hx, hz, pad){
  return {minX:pos.x-hx-pad, maxX:pos.x+hx+pad, minZ:pos.z-hz-pad, maxZ:pos.z+hz+pad};
}

/* ---------------- controls ---------------- */

function setupControls(){
  const overlay = document.getElementById('overlay');
  overlay.addEventListener('click', ()=>{
    document.body.requestPointerLock();
    startAudio();
  });
  document.addEventListener('pointerlockchange', ()=>{
    if(document.pointerLockElement === document.body){
      overlay.style.opacity = 0; overlay.style.pointerEvents='none';
    } else {
      overlay.style.opacity = 1; overlay.style.pointerEvents='auto';
    }
  });
  document.addEventListener('mousemove', (e)=>{
    if(document.pointerLockElement !== document.body) return;
    yawObject.rotation.y -= e.movementX * 0.0022;
    pitchObject.rotation.x -= e.movementY * 0.0022;
    pitchObject.rotation.x = Math.max(-1.3, Math.min(1.3, pitchObject.rotation.x));
  });
  document.addEventListener('keydown', (e)=>{
    switch(e.code){
      case 'KeyW': case 'ArrowUp': moveF=true; break;
      case 'KeyS': case 'ArrowDown': moveB=true; break;
      case 'KeyA': case 'ArrowLeft': moveL=true; break;
      case 'KeyD': case 'ArrowRight': moveR=true; break;
    }
  });
  document.addEventListener('keyup', (e)=>{
    switch(e.code){
      case 'KeyW': case 'ArrowUp': moveF=false; break;
      case 'KeyS': case 'ArrowDown': moveB=false; break;
      case 'KeyA': case 'ArrowLeft': moveL=false; break;
      case 'KeyD': case 'ArrowRight': moveR=false; break;
    }
  });
  // click to open/close whichever almirah drawer the player is looking at
  document.addEventListener('mousedown', (e)=>{
    if(document.pointerLockElement !== document.body) return;
    if(e.button !== 0) return;
    raycaster.setFromCamera(screenCenter, camera);
    const meshes = [];
    almirahDrawers.forEach(d=>{
      meshes.push(d.front, d.box, d.knob);
      if(d.extraMeshes) meshes.push(...d.extraMeshes);
    });
    roomBoxes.forEach(b=>meshes.push(b.lid, b.body, b.clasp, b.claspRing));
    const hits = raycaster.intersectObjects(meshes, false);
    if(hits.length){
      const hit = hits[0].object.userData;
      if(hit.drawerIndex !== undefined){
        const d = almirahDrawers[hit.drawerIndex];
        d.isOpen = !d.isOpen;
      } else if(hit.boxIndex !== undefined){
        const b = roomBoxes[hit.boxIndex];
        b.isOpen = !b.isOpen;
      }
    }
  });
}

function startAudio(){
  if(audioCtx) return;
  try{
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const bufferSize = 2*audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let last=0;
    for(let i=0;i<bufferSize;i++){
      const white = Math.random()*2-1;
      last = (last + 0.02*white)/1.02;
      data[i] = last*4.5;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer; noise.loop = true;
    droneGain = audioCtx.createGain(); droneGain.gain.value = 0.05;
    const filter = audioCtx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=220;
    noise.connect(filter); filter.connect(droneGain); droneGain.connect(audioCtx.destination);
    noise.start();
  }catch(e){ /* audio optional */ }
}

/* ---------------- collision + movement ---------------- */

function tryMove(dx, dz){
  const newX = yawObject.position.x + dx;
  const newZ = yawObject.position.z + dz;
  // player must be inside at least one walkable zone (room1, the corridor,
  // room2, etc - each pushed as an isRoomBound entry). Zones are authored to
  // overlap slightly at doorways so movement between them is seamless.
  const zones = obstacles.filter(o=>o.isRoomBound);
  const inside = zones.some(z =>
    newX > z.minX+PLAYER_R && newX < z.maxX-PLAYER_R &&
    newZ > z.minZ+PLAYER_R && newZ < z.maxZ-PLAYER_R
  );
  if(!inside) return;
  // block against furniture/pillars
  for(const o of obstacles){
    if(o.isRoomBound) continue;
    if(newX > o.minX-PLAYER_R && newX < o.maxX+PLAYER_R && newZ > o.minZ-PLAYER_R && newZ < o.maxZ+PLAYER_R){
      return;
    }
  }
  yawObject.position.x = newX;
  yawObject.position.z = newZ;
}

/* ---------------- animate ---------------- */

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // movement
  const speed = 2.6 * dt;
  const forward = new THREE.Vector3(Math.sin(yawObject.rotation.y), 0, Math.cos(yawObject.rotation.y));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);
  let dx=0, dz=0;
  if(moveF){ dx -= forward.x*speed; dz -= forward.z*speed; }
  if(moveB){ dx += forward.x*speed; dz += forward.z*speed; }
  if(moveL){ dx -= right.x*speed; dz -= right.z*speed; }
  if(moveR){ dx += right.x*speed; dz += right.z*speed; }
  if(dx||dz) tryMove(dx,dz);

  // bulb flicker + gentle swing
  if(bulbLight){
    const flicker = Math.random() < 0.02 ? Math.random()*0.4 : 0; // occasional stutter
    bulbLight.intensity = 0.95 + Math.sin(t*3.3)*0.12 - flicker;
    bulbMesh.material.emissiveIntensity = 0.85 + Math.sin(t*3.3)*0.1 - flicker*2;
    bulbPivot.rotation.z = Math.sin(t*0.7)*0.06;
    bulbPivot.rotation.x = Math.sin(t*0.55+1)*0.04;
  }

  // moonlight subtle shimmer
  if(moonSpot) moonSpot.intensity = 0.7 + Math.sin(t*0.5)*0.06;

  if(corridorLight){
    const cFlicker = Math.random() < 0.03 ? Math.random()*0.3 : 0;
    corridorLight.intensity = 0.42 + Math.sin(t*2.1)*0.08 - cFlicker;
  }

  if(room2Light){
    const rFlicker = Math.random() < 0.025 ? Math.random()*0.35 : 0;
    room2Light.intensity = 0.7 + Math.sin(t*2.7+1.3)*0.1 - rFlicker;
  }

  if(windowShaft) windowShaft.material.opacity = 0.06 + Math.sin(t*0.5)*0.015;

  if(room4Light){
    const fFlicker = Math.random() < 0.04 ? Math.random()*0.25 : 0;
    room4Light.intensity = 0.55 + Math.sin(t*4.2)*0.09 - fFlicker;
  }

  if(room5Light){
    const r5Flicker = Math.random() < 0.03 ? Math.random()*0.3 : 0;
    room5Light.intensity = 0.75 + Math.sin(t*3.0)*0.1 - r5Flicker;
  }

  if(room6Light){
    // meant to feel like a cluster of unsteady oil lamps rather than a
    // single bulb - a shorter, twitchier flicker cycle than the rest of
    // the haveli's electric-style lights
    const sFlicker = Math.random() < 0.06 ? Math.random()*0.3 : 0;
    room6Light.intensity = 0.5 + Math.sin(t*5.4)*0.12 + Math.sin(t*1.7)*0.08 - sFlicker;
  }

  if(corridor9Light){
    const c9Flicker = Math.random() < 0.03 ? Math.random()*0.3 : 0;
    corridor9Light.intensity = 0.42 + Math.sin(t*2.1)*0.08 - c9Flicker;
  }

  if(room9Light){
    const r9Flicker = Math.random() < 0.025 ? Math.random()*0.3 : 0;
    room9Light.intensity = 0.7 + Math.sin(t*2.4+0.6)*0.1 - r9Flicker;
  }

  // bell sway
  if(bellPivot) bellPivot.rotation.z = Math.sin(t*0.8)*0.05;

  // curtain sway
  curtainStrips.forEach((p,i)=>{
    p.rotation.z = Math.sin(t*0.6 + p.userData.phase)*0.08;
    p.rotation.x = Math.sin(t*0.4 + p.userData.phase)*0.04;
  });

  // head bob while moving, for a more grounded, higher-quality feel
  const isMoving = (moveF||moveB||moveL||moveR);
  if(isMoving){
    bobTimer += dt*6.5;
    camera.position.y = Math.sin(bobTimer)*0.035;
    camera.position.x = Math.cos(bobTimer*0.5)*0.015;
  } else {
    camera.position.y += (0-camera.position.y)*Math.min(1,dt*6);
    camera.position.x += (0-camera.position.x)*Math.min(1,dt*6);
  }

  // almirah drawers sliding open/closed
  if(almirahDrawers.length || roomBoxes.length){
    let looking = false;
    if(document.pointerLockElement === document.body){
      raycaster.setFromCamera(screenCenter, camera);
      const meshes = [];
      almirahDrawers.forEach(d=>{
        meshes.push(d.front, d.box, d.knob);
        if(d.extraMeshes) meshes.push(...d.extraMeshes);
      });
      roomBoxes.forEach(b=>meshes.push(b.lid, b.body, b.clasp, b.claspRing));
      looking = raycaster.intersectObjects(meshes, false).length > 0;
    }
    const hint = document.getElementById('interact-hint');
    if(hint) hint.style.opacity = looking ? 1 : 0;

    almirahDrawers.forEach(d=>{
      const target = d.isOpen ? d.openX : d.closedX;
      d.current += (target - d.current) * Math.min(1, dt*4.5);
      const delta = d.current - d.closedX;
      d.front.position.x = d.current;
      d.box.position.x = d.current + d.boxRelOffset;
      d.knob.position.x = d.current - 0.03;
      if(d.extraMeshes){
        d.extraMeshes.forEach(m=>{ m.position.x += 0; });
        // bail, posts, and molding strips are children of the same drawer
        // pivot as front/box/knob, so shift them by the same delta from
        // their originally-authored closed-position offsets
        const [bail, postL, postR, topStrip, botStrip] = d.extraMeshes;
        bail.position.x = (d.closedX - 0.03) + delta;
        postL.position.x = (d.closedX - 0.02) + delta;
        postR.position.x = (d.closedX - 0.02) + delta;
        topStrip.position.x = (d.closedX + 0.02) + delta;
        botStrip.position.x = (d.closedX + 0.02) + delta;
      }
    });

    // storage chest lid, hinged open/closed with the same smooth ease
    roomBoxes.forEach(b=>{
      const target = b.isOpen ? b.openAngle : 0;
      b.current += (target - b.current) * Math.min(1, dt*4.5);
      b.hingePivot.rotation.x = b.current;
    });
  }

  renderer.render(scene, camera);
}

function onResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
