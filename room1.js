/* ============================================================
   HAVELI OF SHADOWS — ROOM 1 (Sone ka Kamra / bedroom)
   Room shell, window, doorway, furniture (charpai, trunk,
   almirah, mirror, bulb, bell, idol), cobwebs, and blood decor
   specific to Room 1.
   Requires engine.js to be loaded first.
   ============================================================ */

function buildBlood(){
  // helper: every pool/splatter/handprint gets its OWN freshly-generated
  // texture (never a cloned material sharing the same canvas), so no two
  // marks in the room look identical - shape, tone, and wear all vary.
  const pool = (w,h,x,z,rot,tone,opacity)=>{
    const mat = new THREE.MeshBasicMaterial({map:bloodPoolTexture(tone), transparent:true, depthWrite:false, opacity: opacity!==undefined?opacity:1});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), mat);
    m.rotation.x = -Math.PI/2;
    m.position.set(x, 0.012, z);
    m.rotation.z = rot;
    scene.add(m);
    return m;
  };
  const wallSplat = (w,h,x,y,z,rotY,rotX,tone,opacity)=>{
    const mat = new THREE.MeshBasicMaterial({map:bloodSplatterTexture(tone), transparent:true, depthWrite:false, opacity: opacity!==undefined?opacity:1});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), mat);
    if(rotY!==undefined) m.rotation.y = rotY;
    if(rotX!==undefined) m.rotation.x = rotX;
    m.position.set(x,y,z);
    scene.add(m);
    return m;
  };
  const floorDrip = (w,h,x,z,rot,tone,opacity)=>{
    const mat = new THREE.MeshBasicMaterial({map:bloodSplatterTexture(tone), transparent:true, depthWrite:false, opacity: opacity!==undefined?opacity:0.85});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), mat);
    m.rotation.x = -Math.PI/2;
    m.position.set(x, 0.011, z);
    m.rotation.z = rot;
    scene.add(m);
    return m;
  };
  const handprint = (w,x,y,z,rotY,rotZ,tone)=>{
    const mat = new THREE.MeshBasicMaterial({map:bloodHandprintTexture(tone), transparent:true, depthWrite:false});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,w), mat);
    if(rotY!==undefined) m.rotation.y = rotY;
    m.position.set(x,y,z);
    if(rotZ!==undefined) m.rotation.z = rotZ;
    scene.add(m);
    return m;
  };

  // a dark, half-dried pool on the floor near the foot of the bed / trunk
  pool(1.3,1.3, -ROOM_W/2+1.5, 0.55, 0.4, 'dried', 1);
  // a smaller fresher stain trailing away from it, as if something was dragged
  pool(0.65,0.55, -ROOM_W/2+1.0, -0.35, 1.1, 'wet', 0.95);
  // a larger old pool spreading out near the room's center
  pool(1.7,1.5, 0.2, 0.9, 2.0, 'old', 0.9);
  // a stain pooled beneath the almirah, east side of the room - long dried
  pool(1.1,1.0, ROOM_W/2-1.1, 2.3, 0.7, 'dried', 0.85);
  // a small fresh pool right by the doorway threshold
  pool(0.85,0.95, -0.3, -ROOM_D/2+0.6, 1.6, 'wet', 1);
  // extra old pool near the window, as if someone crawled toward the light
  pool(1.0,0.9, ROOM_W/2-2.0, -1.0, 2.6, 'old', 0.8);
  // pool beneath the hanging bell, center-back of the room - dried dark
  pool(0.75,0.85, 0.1, -2.3, 0.2, 'dried', 0.9);
  // fresh pool tucked beside the relocated charpai's new south-west corner
  pool(0.85,0.8, -ROOM_W/2+1.6, ROOM_D/2-1.0, 1.9, 'wet', 1);

  // a splatter sprayed up the west wall near the mirror - fresh, high contrast
  wallSplat(1.1,1.1, -ROOM_W/2+0.035, 1.25, -1.1, Math.PI/2, undefined, 'wet');
  // a second, older/browner splatter on the north wall beside the doorway
  wallSplat(1.0,1.0, -1.9, 1.1, -ROOM_D/2+0.03, undefined, undefined, 'dried', 0.9);
  // a splatter up the east wall near the almirah - faded, old
  wallSplat(0.9,0.9, ROOM_W/2-0.03, 1.3, 2.6, -Math.PI/2, undefined, 'old', 0.85);
  // a dark stain dripped down from the ceiling beams, above the center pool
  wallSplat(0.8,1.3, 0.2, ROOM_H-0.02, 0.9, undefined, Math.PI/2, 'dried', 0.9);
  // splatter thrown across the south wall, behind the player's start - fresh
  wallSplat(1.0,1.0, 0.6, 1.2, ROOM_D/2-0.03, Math.PI, undefined, 'wet', 0.95);
  // splatter across the trunk lid, close range spray - fresh, small, intense
  const trunkSplat = wallSplat(0.5,0.5, -ROOM_W/2+1.0, 0.545, -0.85, undefined, -Math.PI/2, 'wet');
  trunkSplat.rotation.z = Math.random()*Math.PI;

  // a dragged handprint smeared beside the doorway - fresh, dark
  handprint(0.4, -1.05, 1.1, -ROOM_D/2+0.03, undefined, -0.15, 'wet');
  // a second, older handprint dragged down the west wall near the bed
  handprint(0.35, -ROOM_W/2+0.03, 0.95, -1.7, Math.PI/2, 0.3, 'dried');
  // a third, faded handprint smeared on the almirah door, as if clawed at long ago
  handprint(0.3, ROOM_W/2-0.5, 1.0, 1.7, -Math.PI/2, 0.5, 'old');

  // faint dark droplets trailing across the floor between the two pools
  floorDrip(0.75,0.75, -ROOM_W/2+1.25, 0.1, Math.random()*Math.PI, 'dried', 0.85);

  // a dragged smear trail leading from the center pool toward the doorway,
  // as if something was pulled out of the room - fading tone the further it goes
  const trailSpots = [[0.1,0.0,'wet'],[0.0,-0.9,'dried'],[-0.1,-1.8,'dried'],[-0.2,-2.7,'old']];
  trailSpots.forEach(([x,z,tone])=>{
    floorDrip(0.4+Math.random()*0.15, 0.5+Math.random()*0.15, x, z, Math.random()*Math.PI, tone, 0.75+Math.random()*0.2);
  });

  // a second dragged smear trail leading from the corner pool toward the window
  const trailSpots2 = [[-ROOM_W/2+1.9,-2.6,'wet'],[ROOM_W/2-2.6,-1.8,'dried'],[ROOM_W/2-2.3,-1.3,'old']];
  trailSpots2.forEach(([x,z,tone])=>{
    floorDrip(0.35+Math.random()*0.15, 0.45+Math.random()*0.15, x, z, Math.random()*Math.PI, tone, 0.75+Math.random()*0.2);
  });
}


function almirahWoodTexture(baseColor, darkColor, opts){
  // a much higher-detail teak/sheesham wood texture built specifically for
  // the almirah: layered plank tones, tight directional grain, knots,
  // worm-holes, and edge-darkening so it reads as old, hand-finished wood
  // even at close range.
  opts = opts || {};
  const S = 1024;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = baseColor || '#3c2716'; ctx.fillRect(0,0,S,S);

  // base plank bands - each plank gets its own subtle tone shift
  const plankCount = opts.planks || 5;
  const plankW = S/plankCount;
  for(let p=0;p<plankCount;p++){
    const shift = (Math.random()-0.5)*18;
    ctx.fillStyle = `rgba(${shift>0?255:0},${shift>0?230:0},${shift>0?180:0},${Math.abs(shift)/140})`;
    ctx.fillRect(p*plankW,0,plankW,S);
  }

  // long directional grain fibres - many thin wavering lines
  for(let i=0;i<220;i++){
    const x = Math.random()*S;
    ctx.strokeStyle = `rgba(${Math.random()>0.5?18:70},${Math.random()>0.5?10:42},${4+Math.random()*12},${0.05+Math.random()*0.16})`;
    ctx.lineWidth = 0.6+Math.random()*1.8;
    ctx.beginPath();
    let x2=x;
    ctx.moveTo(x2,0);
    for(let y=0;y<S;y+=24){
      x2 += (Math.random()-0.5)*7;
      ctx.lineTo(x2,y);
    }
    ctx.stroke();
  }

  // tighter fine-grain fibres (higher frequency, lower opacity) for close-up detail
  for(let i=0;i<340;i++){
    const x = Math.random()*S;
    ctx.strokeStyle = `rgba(10,6,3,${0.03+Math.random()*0.06})`;
    ctx.lineWidth = 0.4+Math.random()*0.7;
    ctx.beginPath();
    let x2=x;
    ctx.moveTo(x2,0);
    for(let y=0;y<S;y+=48){
      x2 += (Math.random()-0.5)*4;
      ctx.lineTo(x2,y);
    }
    ctx.stroke();
  }

  // plank seams with slight bevel shadow/highlight pairing
  ctx.lineWidth = 3;
  for(let i=1;i<plankCount;i++){
    const x = i*plankW;
    ctx.strokeStyle = 'rgba(6,3,2,0.65)';
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,S); ctx.stroke();
    ctx.strokeStyle = 'rgba(80,55,30,0.18)';
    ctx.beginPath(); ctx.moveTo(x+2,0); ctx.lineTo(x+2,S); ctx.stroke();
  }

  // knots - concentric elliptical rings with dark centers
  const knotCount = opts.knots!==undefined? opts.knots : 5;
  for(let k=0;k<knotCount;k++){
    const kx = Math.random()*S, ky = Math.random()*S;
    const kr = 10+Math.random()*22;
    for(let ring=6;ring>0;ring--){
      const rr = kr*(ring/6);
      ctx.strokeStyle = `rgba(15,8,4,${0.5 - ring*0.06})`;
      ctx.lineWidth = 1+Math.random();
      ctx.beginPath();
      ctx.ellipse(kx,ky, rr, rr*(0.65+Math.random()*0.3), Math.random()*0.4, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(8,4,2,0.55)';
    ctx.beginPath(); ctx.ellipse(kx,ky,kr*0.18,kr*0.14,0,0,Math.PI*2); ctx.fill();
  }

  // tiny wormholes for age
  for(let i=0;i<14;i++){
    ctx.fillStyle = 'rgba(4,2,1,0.6)';
    ctx.beginPath(); ctx.arc(Math.random()*S, Math.random()*S, 0.8+Math.random()*1.4, 0, Math.PI*2); ctx.fill();
  }

  // grime speckle
  for(let i=0;i<4500;i++){
    ctx.fillStyle = `rgba(8,5,2,${Math.random()*0.14})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.1,1.1);
  }

  // subtle sheen streaks (hand-polished look, catches light unevenly)
  for(let i=0;i<10;i++){
    const gy = Math.random()*S;
    const grad = ctx.createLinearGradient(0,gy-40,0,gy+40);
    grad.addColorStop(0,'rgba(255,220,160,0)');
    grad.addColorStop(0.5,'rgba(255,220,160,0.05)');
    grad.addColorStop(1,'rgba(255,220,160,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,gy-40,S,80);
  }

  // edge vignette (ambient occlusion at panel borders)
  const vg = ctx.createRadialGradient(S/2,S/2,S*0.25,S/2,S/2,S*0.72);
  vg.addColorStop(0,'rgba(0,0,0,0)');
  vg.addColorStop(1,'rgba(0,0,0,0.4)');
  ctx.fillStyle = vg; ctx.fillRect(0,0,S,S);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = maxAniso;
  return tex;
}


function carvedRosetteTexture(size){
  // an embossed lotus-medallion carving, typical of haveli door panels -
  // shaded with light/dark arcs per petal so it reads as relief carving
  // rather than a flat painted decal.
  size = size || 512;
  const c = makeCanvas(size,size), ctx = c.getContext('2d');
  ctx.clearRect(0,0,size,size);
  const cx=size/2, cy=size/2, R=size*0.44;

  // recessed outer ring (carved groove)
  let g = ctx.createRadialGradient(cx,cy,R*0.86,cx,cy,R);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(0.6,'rgba(0,0,0,0.35)');
  g.addColorStop(1,'rgba(255,220,170,0.12)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill();

  // petals - two layers for depth
  const drawPetals = (count, rStart, rEnd, widthFrac, rot, baseAlpha)=>{
    for(let i=0;i<count;i++){
      const a = rot + (i/count)*Math.PI*2;
      ctx.save();
      ctx.translate(cx,cy);
      ctx.rotate(a);
      const grad = ctx.createLinearGradient(0,-rEnd,0,-rStart);
      grad.addColorStop(0,`rgba(20,12,6,${baseAlpha})`);
      grad.addColorStop(0.5,`rgba(90,55,25,${baseAlpha*0.5})`);
      grad.addColorStop(1,`rgba(10,6,3,${baseAlpha*0.9})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0,-rStart);
      ctx.quadraticCurveTo(rEnd*widthFrac, -(rStart+rEnd)/2, 0, -rEnd);
      ctx.quadraticCurveTo(-rEnd*widthFrac, -(rStart+rEnd)/2, 0, -rStart);
      ctx.fill();
      // highlight edge on one side of the petal for a carved look
      ctx.strokeStyle = `rgba(200,160,100,${baseAlpha*0.4})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0,-rStart);
      ctx.quadraticCurveTo(rEnd*widthFrac, -(rStart+rEnd)/2, 0, -rEnd);
      ctx.stroke();
      ctx.restore();
    }
  };
  drawPetals(8, R*0.3, R*0.92, 0.34, 0, 0.55);
  drawPetals(8, R*0.22, R*0.6, 0.28, Math.PI/8, 0.4);

  // central boss (raised carved dome)
  const boss = ctx.createRadialGradient(cx-R*0.06,cy-R*0.06,2,cx,cy,R*0.22);
  boss.addColorStop(0,'rgba(150,110,60,0.55)');
  boss.addColorStop(0.6,'rgba(40,24,12,0.6)');
  boss.addColorStop(1,'rgba(10,6,3,0.7)');
  ctx.fillStyle = boss;
  ctx.beginPath(); ctx.arc(cx,cy,R*0.22,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,R*0.22,0,Math.PI*2); ctx.stroke();

  // fine radial engraving lines around the boss
  for(let i=0;i<16;i++){
    const a = (i/16)*Math.PI*2;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*R*0.24, cy+Math.sin(a)*R*0.24);
    ctx.lineTo(cx+Math.cos(a)*R*0.3, cy+Math.sin(a)*R*0.3);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(c);
}


function tarnishedMirrorTexture(){
  // an aged, foxed mirror surface: mottled silvering loss, dark spots,
  // faint hairline cracks, and a dimmer, uneven reflective gradient
  const S = 512;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S*0.4,S*0.35,10,S*0.5,S*0.5,S*0.75);
  g.addColorStop(0,'#aab2ba'); g.addColorStop(0.5,'#7d838c'); g.addColorStop(1,'#3f4348');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);

  // foxing blotches - dark irregular age spots where the silvering has failed
  for(let i=0;i<22;i++){
    const x=Math.random()*S, y=Math.random()*S, r=8+Math.random()*36;
    const fg = ctx.createRadialGradient(x,y,0,x,y,r);
    fg.addColorStop(0,'rgba(20,16,10,0.55)');
    fg.addColorStop(0.6,'rgba(30,24,16,0.3)');
    fg.addColorStop(1,'rgba(30,24,16,0)');
    ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }

  // fine hairline cracks
  ctx.strokeStyle='rgba(10,10,10,0.5)';
  for(let i=0;i<10;i++){
    ctx.lineWidth=0.6+Math.random();
    let x=Math.random()*S, y=Math.random()*S;
    ctx.beginPath(); ctx.moveTo(x,y);
    const segs=3+Math.floor(Math.random()*4);
    for(let s=0;s<segs;s++){ x+=(Math.random()-0.5)*70; y+=(Math.random()-0.5)*70; ctx.lineTo(x,y); }
    ctx.stroke();
  }

  // faint speckled grime film over the whole surface
  for(let i=0;i<2000;i++){
    ctx.fillStyle = `rgba(20,18,14,${Math.random()*0.08})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1,1);
  }

  ctx.strokeStyle='rgba(0,0,0,0.55)'; ctx.lineWidth=6;
  ctx.strokeRect(3,3,S-6,S-6);
  return new THREE.CanvasTexture(c);
}


function agedBrassTexture(){
  const S=256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,S,S);
  g.addColorStop(0,'#a9822f'); g.addColorStop(0.5,'#7a5a20'); g.addColorStop(1,'#5c421a');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  for(let i=0;i<1600;i++){
    ctx.fillStyle = `rgba(${Math.random()>0.5?40:180},${Math.random()>0.5?30:140},${Math.random()>0.5?10:70},${Math.random()*0.12})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.4,1.4);
  }
  for(let i=0;i<8;i++){
    ctx.fillStyle='rgba(20,14,6,0.25)';
    ctx.beginPath(); ctx.arc(Math.random()*S,Math.random()*S,6+Math.random()*18,0,Math.PI*2); ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* ---------------- lighting ---------------- */


function buildRoomShell(){
  const wTex = wallTexture();
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat);
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat);
  ceil.rotation.x = Math.PI/2; ceil.position.y = ROOM_H;
  scene.add(ceil);

  wTex.repeat.set(4, 1.6);
  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat);
  southWall.position.set(0, ROOM_H/2, ROOM_D/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  buildEastWallWithWindow(wallMat);

  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat.clone());
  westWall.position.set(-ROOM_W/2, ROOM_H/2, 0);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // north wall built with a doorway gap -> see buildDoorway()

  // baseboard trim
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [[0,ROOM_D/2,ROOM_W,'z'],[ROOM_W/2,0,ROOM_D,'x'],[-ROOM_W/2,0,ROOM_D,'x']].forEach(([x,z,len,axis])=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(axis==='z'?len:0.1, 0.15, axis==='x'?len:0.1), trimMat);
    trim.position.set(x,0.08,z);
    scene.add(trim);
  });

  obstacles.push({minX:-ROOM_W/2, maxX:ROOM_W/2, minZ:-ROOM_D/2, maxZ:ROOM_D/2, isRoomBound:true});
}


function buildEastWallWithWindow(wallMat){
  // the east wall is built from four panels leaving a true rectangular
  // opening for the window (bottom sill strip, top lintel strip, and two
  // side bands flanking the gap) instead of a decoration glued onto a solid wall
  const x = ROOM_W/2;
  const mk = (w,h,py,pz)=>{
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), wallMat.clone());
    m.position.set(x,py,pz);
    m.rotation.y = -Math.PI/2;
    scene.add(m);
  };
  // bottom panel: floor to sill, full length
  mk(ROOM_D, WIN_SILL, WIN_SILL/2, 0);
  // top panel: lintel to ceiling, full length
  mk(ROOM_D, ROOM_H-WIN_LINTEL, WIN_LINTEL + (ROOM_H-WIN_LINTEL)/2, 0);
  // side band, south of window (larger half, away from the door)
  const southLen = ROOM_D/2 - (WIN_Z+WIN_W/2);
  mk(southLen, WIN_H, (WIN_SILL+WIN_LINTEL)/2, (WIN_Z+WIN_W/2) + southLen/2);
  // side band, north of window (toward the door)
  const northLen = (WIN_Z-WIN_W/2) - (-ROOM_D/2);
  mk(northLen, WIN_H, (WIN_SILL+WIN_LINTEL)/2, -ROOM_D/2 + northLen/2);
}


function buildDoorway(){
  // North wall split into two side panels leaving a 2.0 wide, 3.0 tall gap - the future connection point
  const wTex = wallTexture(); wTex.repeat.set(1.4,1.6);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95});
  const gapHalf = 0.75;
  const sideW = (ROOM_W/2) - gapHalf;

  const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM_H), wallMat);
  leftPanel.position.set(-(gapHalf + sideW/2), ROOM_H/2, -ROOM_D/2);
  scene.add(leftPanel);

  const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM_H), wallMat.clone());
  rightPanel.position.set(gapHalf + sideW/2, ROOM_H/2, -ROOM_D/2);
  scene.add(rightPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM_H-DOOR_H), wallMat.clone());
  lintel.position.set(0, DOOR_H+(ROOM_H-DOOR_H)/2, -ROOM_D/2);
  scene.add(lintel);

  // carved wooden door frame
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.18, DOOR_H+0.1, 0.3);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(-gapHalf-0.09, DOOR_H/2+0.05, -ROOM_D/2);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(gapHalf+0.09, DOOR_H/2+0.05, -ROOM_D/2);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.36, 0.18, 0.3), frameMat); ft.position.set(0,DOOR_H+0.1,-ROOM_D/2);
  scene.add(fl,fr,ft);

  // tattered curtain strips hanging in doorway (future rooms will remove/replace)
  const curtainMat = new THREE.MeshStandardMaterial({color:0x3a1414, roughness:1, side:THREE.DoubleSide, transparent:true, opacity:0.85});
  const stripCount = 7;
  for(let i=0;i<stripCount;i++){
    const w = (gapHalf*2)/stripCount;
    const h = (DOOR_H-0.1) - Math.random()*0.4;
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(w*0.92, h), curtainMat);
    const pivot = new THREE.Object3D();
    pivot.position.set(-gapHalf + w*(i+0.5), DOOR_H, -ROOM_D/2+0.05);
    strip.position.set(0, -h/2, 0);
    pivot.add(strip);
    pivot.userData.phase = Math.random()*10;
    scene.add(pivot);
    curtainStrips.push(pivot);
  }

  // beyond the door: now leads into the real corridor + room 2 (see buildCorridor/buildRoom2)
}


function moonTexture(){
  const c = makeCanvas(256,256), ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0e18'; ctx.fillRect(0,0,256,256);
  const g = ctx.createRadialGradient(150,90,4,150,90,58);
  g.addColorStop(0,'#fdfaf0'); g.addColorStop(0.7,'#d9dceb'); g.addColorStop(1,'rgba(180,190,220,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(150,90,58,0,7); ctx.fill();
  // craters
  ctx.fillStyle = 'rgba(160,165,180,0.5)';
  [[130,75,8],[165,100,5],[145,110,4],[170,70,3]].forEach(([x,y,r])=>{
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
  });
  // faint stars
  for(let i=0;i<60;i++){
    ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.8})`;
    ctx.fillRect(Math.random()*256, Math.random()*256, 1, 1);
  }
  return new THREE.CanvasTexture(c);
}


function buildJharokhaWindow(){
  // A real window: an actual gap in the east wall (see buildEastWallWithWindow),
  // with a recessed reveal, a stone sill, carved shutters, and the moon visible
  // through the glass beyond the lattice.
  const winCX = ROOM_W/2;
  const winCY = (WIN_SILL + WIN_LINTEL)/2;
  const winCenter = new THREE.Vector3(winCX, winCY, WIN_Z);
  const revealDepth = 0.4;

  const stoneMat = new THREE.MeshStandardMaterial({color:0x6b5334, roughness:0.9});

  // side jambs (the reveal walls of the recess)
  [WIN_Z-WIN_W/2, WIN_Z+WIN_W/2].forEach(z=>{
    const jamb = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, WIN_H, 0.06), stoneMat);
    jamb.position.set(winCX - revealDepth/2, winCY, z);
    scene.add(jamb);
  });
  // lintel (top) and sill (bottom) reveal surfaces
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(revealDepth, 0.06, WIN_W), stoneMat);
  lintel.position.set(winCX - revealDepth/2, WIN_LINTEL, WIN_Z);
  scene.add(lintel);

  // sill ledge, protruding into the room like a real windowsill
  const sill = new THREE.Mesh(new THREE.BoxGeometry(revealDepth+0.25, 0.07, WIN_W+0.3),
    new THREE.MeshStandardMaterial({color:0x5c4830, roughness:0.85}));
  sill.position.set(winCX - revealDepth/2 + 0.1, WIN_SILL, WIN_Z);
  sill.castShadow = true;
  scene.add(sill);

  // carved jali lattice set within the opening
  const barMat = new THREE.MeshStandardMaterial({color:0x4a3820, roughness:0.85});
  const latticeX = winCX - revealDepth*0.55;
  for(let i=-2;i<=2;i++){
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, WIN_H-0.1, 0.04), barMat);
    bar.position.set(latticeX, winCY, WIN_Z + i*(WIN_W/5));
    scene.add(bar);
  }
  for(let j=-2;j<=2;j++){
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, WIN_W-0.1), barMat);
    bar.position.set(latticeX, winCY + j*(WIN_H/5), WIN_Z);
    scene.add(bar);
  }

  // glass pane, set behind the lattice
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W-0.06, WIN_H-0.06),
    new THREE.MeshPhysicalMaterial({color:0x88a0c8, transparent:true, opacity:0.15, roughness:0.05, metalness:0.1}));
  glass.rotation.y = -Math.PI/2;
  glass.position.set(winCX - revealDepth*0.85, winCY, WIN_Z);
  scene.add(glass);

  // night sky and moon, visible just beyond the glass
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W+2, WIN_H+2),
    new THREE.MeshBasicMaterial({color:0x0b1526}));
  sky.rotation.y = -Math.PI/2;
  sky.position.set(winCX + 1.2, winCY, WIN_Z);
  scene.add(sky);

  const moon = new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.0),
    new THREE.MeshBasicMaterial({map:moonTexture(), transparent:true}));
  moon.rotation.y = -Math.PI/2;
  moon.position.set(winCX + 1.15, winCY + 0.35, WIN_Z - 0.45);
  scene.add(moon);

  // wooden shutters flanking the opening — one flung open, one hanging ajar
  const shutterMat = new THREE.MeshStandardMaterial({color:0x2f1d10, roughness:0.85});
  const shutterGeo = new THREE.BoxGeometry(0.04, WIN_H-0.05, WIN_W/2-0.03);
  const hingeSouth = new THREE.Object3D();
  hingeSouth.position.set(winCX - 0.02, winCY, WIN_Z + WIN_W/2);
  const shutterA = new THREE.Mesh(shutterGeo, shutterMat);
  shutterA.position.set(0,0,-(WIN_W/2-0.03)/2);
  hingeSouth.add(shutterA);
  hingeSouth.rotation.y = -1.3; // swung open, resting near the jamb
  scene.add(hingeSouth);

  const hingeNorth = new THREE.Object3D();
  hingeNorth.position.set(winCX - 0.02, winCY, WIN_Z - WIN_W/2);
  const shutterB = new THREE.Mesh(shutterGeo, shutterMat);
  shutterB.position.set(0,0,(WIN_W/2-0.03)/2);
  hingeNorth.add(shutterB);
  hingeNorth.rotation.y = 0.35; // hanging ajar, as if a draft moved it
  scene.add(hingeNorth);

  // actual light source: a cool spotlight shining inward and DOWNWARD from the
  // window onto the floor, so the beam has a real endpoint instead of floating.
  const winCY_forBeam = winCY;
  const floorTarget = new THREE.Vector3(winCX - 6.4, 0.0, WIN_Z + 1.1);
  const beamSource = new THREE.Vector3(winCX - revealDepth*0.6, winCY_forBeam, winCenter.z);
  const beamVec = floorTarget.clone().sub(beamSource);
  const beamLen = beamVec.length();
  const beamDir = beamVec.clone().normalize();

  const halfAngle = Math.atan2(Math.max(WIN_W, WIN_H)/2 + 0.25, beamLen*0.55);
  moonSpot = new THREE.SpotLight(0x6a80b8, 0.9, beamLen*1.35, halfAngle, 0.3, 1.5);
  moonSpot.position.copy(beamSource);
  moonSpot.target.position.copy(floorTarget);
  scene.add(moonSpot, moonSpot.target);

  // visible moonlight beam: a rectangular frustum built from the window's own
  // width/height so the glowing shaft exactly matches the opening it shines
  // through, tilted down along the real light direction and cut off exactly
  // at the floor - it lands and pools there instead of stopping in mid-air.
  const shaftGeo = buildLightFrustum(WIN_W-0.08, WIN_H-0.08, WIN_W*1.6, WIN_H*1.6, beamLen);
  const shaftMat = new THREE.MeshBasicMaterial({color:0x9fb3e0, transparent:true, opacity:0.08, side:THREE.DoubleSide, depthWrite:false, blending:THREE.AdditiveBlending});
  windowShaft = new THREE.Mesh(shaftGeo, shaftMat);
  windowShaft.position.copy(beamSource);
  windowShaft.quaternion.setFromUnitVectors(new THREE.Vector3(-1,0,0), beamDir);
  scene.add(windowShaft);

  // the glowing pool of moonlight where the beam actually meets the floor
  const poolMat = new THREE.MeshBasicMaterial({map:softDotTexture(), color:0x9fb3e0, transparent:true, opacity:0.55, blending:THREE.AdditiveBlending, depthWrite:false});
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W*2.6, WIN_H*3.0), poolMat);
  pool.rotation.x = -Math.PI/2;
  pool.rotation.z = Math.atan2(beamDir.x, beamDir.z);
  pool.position.set(floorTarget.x, 0.015, floorTarget.z);
  scene.add(pool);
}


function buildLightFrustum(nearW, nearH, farW, farH, length){
  // builds an open-sided frustum along local -X, with the near rectangle at
  // x=0 sized to the window opening and the far rectangle at x=-length
  const nw2=nearW/2, nh2=nearH/2, fw2=farW/2, fh2=farH/2;
  const n = [
    new THREE.Vector3(0,-nh2,-nw2), new THREE.Vector3(0,nh2,-nw2),
    new THREE.Vector3(0,nh2,nw2), new THREE.Vector3(0,-nh2,nw2)
  ];
  const f = [
    new THREE.Vector3(-length,-fh2,-fw2), new THREE.Vector3(-length,fh2,-fw2),
    new THREE.Vector3(-length,fh2,fw2), new THREE.Vector3(-length,-fh2,fw2)
  ];
  const positions = [];
  const quad = (a,b,c,d)=>{ [a,b,c, a,c,d].forEach(v=>positions.push(v.x,v.y,v.z)); };
  quad(n[0],n[1],f[1],f[0]);
  quad(n[1],n[2],f[2],f[1]);
  quad(n[2],n[3],f[3],f[2]);
  quad(n[3],n[0],f[0],f[3]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
  geo.computeVertexNormals();
  return geo;
}

/* ---------------- corridor + room 2 ---------------- */


function buildCharpai(){
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({color:0x3b2413, roughness:0.85});
  const legGeo = new THREE.CylinderGeometry(0.05,0.05,0.45,8);
  const legPositions = [[-0.72,-0.95],[0.72,-0.95],[-0.72,0.95],[0.72,0.95]];
  legPositions.forEach(([x,z])=>{
    const leg = new THREE.Mesh(legGeo, woodMat);
    leg.position.set(x,0.225,z); leg.castShadow=true;
    group.add(leg);
  });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6,0.09,2.1), woodMat);
  frame.position.set(0,0.45,0); frame.castShadow=true;
  group.add(frame);

  const ropeMat = new THREE.MeshStandardMaterial({map:ropeTexture(), roughness:1});
  const ropeTop = new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.0), ropeMat);
  ropeTop.rotation.x = -Math.PI/2; ropeTop.position.set(0,0.505,0);
  ropeTop.receiveShadow = true;
  group.add(ropeTop);

  // a rumpled blanket folded at the foot, for lived-in detail
  const blanketMat = new THREE.MeshStandardMaterial({color:0x5a1f1f, roughness:0.95});
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.55), blanketMat);
  blanket.position.set(0.02, 0.57, 0.72);
  blanket.rotation.z = 0.015;
  blanket.castShadow = true;
  group.add(blanket);

  // moved to the south-west corner this time, flush against the west wall
  // and the south wall (near the room's entrance side, opposite the doorway)
  group.position.set(-ROOM_W/2 + 0.85, 0, ROOM_D/2 - 1.1);
  group.rotation.y = 0;
  scene.add(group);
  obstacles.push(boxFor(group.position, 0.85, 1.15, 0.1));
}


function buildTrunk(){
  const mat = new THREE.MeshStandardMaterial({color:0x2e1d10, roughness:0.85, metalness:0.15});
  const pos = new THREE.Vector3(-ROOM_W/2 + 1.0, 0.26, -0.85);
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.3,0.5,0.5), mat);
  trunk.position.copy(pos);
  trunk.castShadow = true;
  scene.add(trunk);
  const lidTrim = new THREE.Mesh(new THREE.BoxGeometry(1.35,0.05,0.55), new THREE.MeshStandardMaterial({color:0x1a1108}));
  lidTrim.position.set(pos.x,0.53,pos.z);
  scene.add(lidTrim);
  // brass corner studs for a little shine against the light
  const studMat = new THREE.MeshStandardMaterial({color:0xb08d3c, metalness:0.8, roughness:0.35});
  [[-0.6,-0.22],[0.6,-0.22],[-0.6,0.22],[0.6,0.22]].forEach(([dx,dz])=>{
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.02,6,6), studMat);
    stud.position.set(pos.x+dx, pos.y+0.25, pos.z+dz);
    scene.add(stud);
  });
  obstacles.push(boxFor(pos, 0.7, 0.3, 0.05));
}


function buildTorch(){
  // a wooden torch found resting inside room 1's almirah, tucked in the
  // middle drawer that's already sitting ajar - the player's first usable
  // light source. Must be called AFTER buildAlmirah() since it attaches to
  // that drawer's interior box mesh.
  const drawer = almirahDrawers[1];
  if(!drawer){ return; } // safety: shouldn't happen given build order in main.js
  const box = drawer.box;
  const bw = box.geometry.parameters.width;   // drawer interior depth (x)
  const bd = box.geometry.parameters.depth;   // drawer interior width (z)
  const bh = box.geometry.parameters.height;  // drawer interior height (y)

  const group = new THREE.Group();

  const shaftMat = new THREE.MeshStandardMaterial({map:torchShaftTexture(), roughness:0.92});
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016,0.026,0.42,10), shaftMat);
  group.add(shaft);

  const wrapMat = new THREE.MeshStandardMaterial({color:0x1c1108, roughness:1});
  for(let i=0;i<3;i++){
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.024,0.006,6,10), wrapMat);
    band.rotation.x = Math.PI/2;
    band.position.y = -0.14 + i*0.05;
    group.add(band);
  }

  const clothMat = new THREE.MeshStandardMaterial({map:charredClothTexture(), roughness:1});
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.045,0.16,12,1,true), clothMat);
  cloth.position.y = 0.25;
  group.add(cloth);

  const strandMat = new THREE.MeshStandardMaterial({color:0x241a0e, roughness:1, side:THREE.DoubleSide});
  for(let i=0;i<6;i++){
    const a = (i/6)*Math.PI*2 + Math.random()*0.4;
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.018, 0.05+Math.random()*0.025), strandMat);
    strip.position.set(Math.cos(a)*0.032, 0.32, Math.sin(a)*0.032);
    strip.rotation.y = -a;
    strip.rotation.x = (Math.random()-0.5)*0.4;
    group.add(strip);
  }

  // a small dim ember rather than a full flame - it isn't lit until carried
  const flameTex = flameTexture();
  const emberMat = new THREE.SpriteMaterial({map:flameTex, color:0xff8a3c, opacity:0.55, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending});
  const ember = new THREE.Sprite(emberMat);
  ember.scale.set(0.08,0.12,1);
  ember.position.y = 0.34;
  group.add(ember);

  const emberLight = new THREE.PointLight(0xff8a3c, 0.3, 1.3, 2.2);
  emberLight.position.y = 0.34;
  group.add(emberLight);

  // lay the torch on its side inside the drawer (width-wise, where there's
  // the most room), resting near the top of the drawer's interior
  group.rotation.x = Math.PI/2;
  group.position.set(bw*0.05, bh/2 - 0.03, bd*0.08);
  box.add(group);

  const meshes = group.children.filter(m=>m.isMesh);
  meshes.forEach(m=>{ m.userData.isTorchPickup = true; });
  ember.userData.isTorchPickup = true;
  torchPickupMeshes = [...meshes, ember];
  torchPickupGroup = group;
  torchPickupEmberLight = emberLight;
}


function buildAlmirah(){
  // an ornate old wooden almirah standing against the east wall, south of the
  // window - built as a proper haveli-carpentry showpiece: fine wood grain,
  // a stepped/crowned cornice with brass finials, carved lotus medallions on
  // each door, hinge plates, ring-pull brass handles with escutcheons, raised
  // panel molding, a foxed antique mirror, and turned bulbous feet.
  const depthX = 0.5, heightY = 1.9, widthZ = 1.12;
  const pos = new THREE.Vector3(ROOM_W/2 - depthX/2 - 0.05, heightY/2 + 0.05, 1.7);
  const group = new THREE.Group();

  const brassMat = new THREE.MeshStandardMaterial({map:agedBrassTexture(), metalness:0.85, roughness:0.32});
  const darkWoodMat = new THREE.MeshStandardMaterial({color:0x1c120a, roughness:0.82});

  // ---- main carcass ----
  const bodyTex = almirahWoodTexture('#3c2716', null, {planks:5, knots:4});
  bodyTex.wrapS = bodyTex.wrapT = THREE.RepeatWrapping;
  const bodyMat = new THREE.MeshStandardMaterial({map:bodyTex, roughness:0.82, metalness:0.04});
  const body = new THREE.Mesh(new THREE.BoxGeometry(depthX, heightY*0.86, widthZ), bodyMat);
  body.position.y = -heightY*0.02;
  body.castShadow = true; body.receiveShadow = true;
  group.add(body);

  // side stiles (visible edge framing, front-left/right verticals) for a
  // built-up cabinetry look rather than a single flat slab
  const stileTex = almirahWoodTexture('#33200f', null, {planks:2, knots:1});
  const stileMat = new THREE.MeshStandardMaterial({map:stileTex, roughness:0.8});
  [-widthZ/2+0.025, widthZ/2-0.025].forEach(z=>{
    const stile = new THREE.Mesh(new THREE.BoxGeometry(depthX+0.015, heightY*0.86, 0.05), stileMat);
    stile.position.set(0, -heightY*0.02, z);
    group.add(stile);
  });

  // ---- crowned cornice (stepped molding + carved pediment plaque) ----
  const corniceBase = new THREE.Mesh(new THREE.BoxGeometry(depthX+0.1, 0.06, widthZ+0.14), darkWoodMat);
  corniceBase.position.set(0, heightY*0.86/2 - heightY*0.02 + 0.03, 0);
  group.add(corniceBase);
  const corniceMid = new THREE.Mesh(new THREE.BoxGeometry(depthX+0.03, 0.05, widthZ+0.05), darkWoodMat);
  corniceMid.position.set(-0.01, corniceBase.position.y + 0.055, 0);
  group.add(corniceMid);
  const corniceTop = new THREE.Mesh(new THREE.BoxGeometry(depthX+0.16, 0.045, widthZ+0.2), darkWoodMat);
  corniceTop.position.set(0.01, corniceMid.position.y + 0.05, 0);
  corniceTop.castShadow = true;
  group.add(corniceTop);

  // carved pediment medallion centered on the cornice face
  const pedimentTex = carvedRosetteTexture(384);
  const pediment = new THREE.Mesh(new THREE.PlaneGeometry(0.26,0.13),
    new THREE.MeshStandardMaterial({map:pedimentTex, transparent:true, roughness:0.7}));
  pediment.rotation.y = -Math.PI/2;
  pediment.position.set(-depthX/2-0.005, corniceMid.position.y - 0.01, 0);
  group.add(pediment);

  // brass finials at the three crown points
  const finialGeo = new THREE.SphereGeometry(0.026,10,10);
  [-widthZ/2+0.06, 0, widthZ/2-0.06].forEach(z=>{
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.01,0.05,8), brassMat);
    stem.position.set(-depthX*0.1, corniceTop.position.y + 0.045, z);
    group.add(stem);
    const finial = new THREE.Mesh(finialGeo, brassMat);
    finial.position.set(-depthX*0.1, corniceTop.position.y + 0.075, z);
    group.add(finial);
  });

  const doorTopY = corniceBase.position.y - 0.03;
  const doorH = heightY*0.62;
  const doorCY = doorTopY - doorH/2;

  // ---- door panels with raised molding frame + carved medallion + hinges ----
  const doorTex = almirahWoodTexture('#4a3018', null, {planks:2, knots:2});
  doorTex.wrapS = doorTex.wrapT = THREE.RepeatWrapping;
  const doorMat = new THREE.MeshStandardMaterial({map:doorTex, roughness:0.72, metalness:0.05});
  const frameStripMat = new THREE.MeshStandardMaterial({color:0x241608, roughness:0.75});

  const doorW = widthZ/2 - 0.02;
  const doorCenters = [-widthZ/4, widthZ/4];

  doorCenters.forEach((z, doorIdx)=>{
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-depthX/2-0.017, doorCY, z);
    group.add(doorGroup);

    // main door slab
    const doorGeo = new THREE.BoxGeometry(0.032, doorH, doorW);
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.castShadow = true;
    doorGroup.add(doorMesh);

    // raised outer molding frame (four thin strips forming a border, proud of the face)
    const frameThk = 0.05;
    const frameDepthOut = 0.008;
    const top = new THREE.Mesh(new THREE.BoxGeometry(frameDepthOut, frameThk, doorW-0.02), frameStripMat);
    top.position.set(0.02, doorH/2-frameThk/2-0.015, 0);
    doorGroup.add(top);
    const bot = top.clone(); bot.position.y = -(doorH/2-frameThk/2-0.015); doorGroup.add(bot);
    const left = new THREE.Mesh(new THREE.BoxGeometry(frameDepthOut, doorH-0.03, frameThk), frameStripMat);
    left.position.set(0.02, 0, -(doorW/2-frameThk/2-0.01));
    doorGroup.add(left);
    const right = left.clone(); right.position.z = (doorW/2-frameThk/2-0.01); doorGroup.add(right);

    // sunken inner panel (recessed rectangle - the carved "raised panel" look)
    const innerW = doorW-0.22, innerH = doorH-0.32;
    const innerPanelTex = almirahWoodTexture('#432b17', null, {planks:1, knots:1});
    const innerPanel = new THREE.Mesh(new THREE.BoxGeometry(0.014, innerH, innerW),
      new THREE.MeshStandardMaterial({map:innerPanelTex, roughness:0.78}));
    innerPanel.position.set(-0.006, 0, 0);
    doorGroup.add(innerPanel);
    // shadow groove ring around the recessed panel
    const grooveRing = new THREE.Mesh(new THREE.RingGeometry(Math.min(innerW,innerH)/2*0.98, Math.min(innerW,innerH)/2*1.1, 4, 1),
      new THREE.MeshBasicMaterial({color:0x0a0603, transparent:true, opacity:0.35, side:THREE.DoubleSide}));
    grooveRing.rotation.y = -Math.PI/2;
    grooveRing.rotation.z = Math.PI/4;
    grooveRing.position.set(0.001, 0, 0);
    doorGroup.add(grooveRing);

    // carved lotus medallion set into the panel center (both doors, for symmetry)
    const medTex = carvedRosetteTexture(384);
    const medallion = new THREE.Mesh(new THREE.PlaneGeometry(0.24,0.24),
      new THREE.MeshStandardMaterial({map:medTex, transparent:true, roughness:0.65, metalness:0.05}));
    medallion.rotation.y = -Math.PI/2;
    medallion.position.set(0.003, doorH*0.18, 0);
    doorGroup.add(medallion);

    // small brass hinge plates along the outer vertical edge (screen-accurate, 2 per door)
    const hingeOuterZ = doorIdx===0 ? -(doorW/2-0.01) : (doorW/2-0.01);
    [doorH*0.32, -doorH*0.32].forEach(hy=>{
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.02,0.09,0.03), brassMat);
      plate.position.set(0.02, hy, hingeOuterZ);
      doorGroup.add(plate);
      // tiny screw dots
      [[0.03,-0.032],[0.03,0.032]].forEach(([dx,dyy])=>{
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.003,0.004,6), darkWoodMat);
        screw.rotation.z = Math.PI/2;
        screw.position.set(0.02+dx, hy+dyy, hingeOuterZ);
        doorGroup.add(screw);
      });
    });

    doorGroup.userData.isDoor = true;
  });

  // ---- foxed antique mirror strip inset in the left door, with a bevel frame ----
  const mirrorW = 0.24, mirrorH = doorH*0.42;
  const mirrorBevel = new THREE.Mesh(new THREE.RingGeometry(0, Math.max(mirrorW,mirrorH)*0.02+0.135, 4, 1),
    brassMat);
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(-depthX/2-0.036, doorCY - doorH*0.05, -widthZ/4);
  group.add(mirrorGroup);

  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.006, mirrorH+0.03, mirrorW+0.03), brassMat);
  mirrorFrame.rotation.y = 0;
  mirrorGroup.add(mirrorFrame);

  const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(mirrorW, mirrorH),
    new THREE.MeshStandardMaterial({map:tarnishedMirrorTexture(), roughness:0.35, metalness:0.55}));
  mirrorGlass.rotation.y = -Math.PI/2;
  mirrorGlass.position.set(-0.006, 0, 0);
  mirrorGroup.add(mirrorGlass);

  // ---- ring-pull brass handles with backplate + escutcheon (keyhole plate) below ----
  [-widthZ/4-0.16, widthZ/4+0.16].forEach(z=>{
    const backplate = new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.028,0.006,16), brassMat);
    backplate.rotation.z = Math.PI/2;
    backplate.position.set(-depthX/2-0.032, doorCY + doorH*0.02, z);
    group.add(backplate);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.006, 8, 20), brassMat);
    ring.rotation.y = Math.PI/2;
    ring.position.set(-depthX/2-0.05, doorCY + doorH*0.02 - 0.02, z);
    group.add(ring);

    const escutcheon = new THREE.Mesh(new THREE.BoxGeometry(0.006,0.05,0.022), brassMat);
    escutcheon.position.set(-depthX/2-0.03, doorCY + doorH*0.02 - 0.09, z);
    group.add(escutcheon);
    const keyhole = new THREE.Mesh(new THREE.CircleGeometry(0.005,8),
      new THREE.MeshBasicMaterial({color:0x090604}));
    keyhole.rotation.y = -Math.PI/2;
    keyhole.position.set(-depthX/2-0.033, doorCY + doorH*0.02 - 0.09, z);
    group.add(keyhole);
  });

  // ---- drawer bank at the bottom — three real wooden drawers, now with
  // raised-panel fronts and brass drop-bail handles instead of plain knobs ----
  const drawerTex = almirahWoodTexture('#432c17', null, {planks:2, knots:1});
  const drawerFrontMat = new THREE.MeshStandardMaterial({map:drawerTex, roughness:0.78, metalness:0.05});
  const drawerBoxMat = new THREE.MeshStandardMaterial({color:0x1f140b, roughness:0.9});
  const drawerCount = 3;
  const bankTop = doorCY - doorH/2 - 0.015;
  const bankBottom = -heightY*0.86/2 - heightY*0.02 + 0.03;
  const drawerH = (bankTop - bankBottom)/drawerCount;
  const closedX = -0.02;
  const openX = closedX - 0.34;

  for(let i=0;i<drawerCount;i++){
    const cyPos = bankTop - drawerH*(i+0.5);
    const dGroup = new THREE.Object3D();
    dGroup.position.set(-depthX/2, cyPos, 0);
    group.add(dGroup);

    const front = new THREE.Mesh(new THREE.BoxGeometry(0.034, drawerH-0.02, widthZ-0.08), drawerFrontMat);
    front.position.set(closedX, 0, 0);
    front.castShadow = true;
    dGroup.add(front);

    // raised molding frame around the drawer front
    const dFrameMat = new THREE.MeshStandardMaterial({color:0x1e1208, roughness:0.75});
    const dfw = widthZ-0.08;
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.02, dfw-0.05), dFrameMat);
    topStrip.position.set(closedX+0.02, drawerH/2-0.03, 0);
    dGroup.add(topStrip);
    const botStrip = topStrip.clone(); botStrip.position.y = -(drawerH/2-0.03); dGroup.add(botStrip);

    // interior box, trailing behind the front so it slides out of the body
    const boxRelOffset = -depthX*0.35 - 0.02;
    const box = new THREE.Mesh(new THREE.BoxGeometry(depthX*0.7, drawerH-0.03, widthZ-0.16), drawerBoxMat);
    box.position.set(closedX + boxRelOffset, 0, 0);
    dGroup.add(box);

    // brass drop-bail handle: two posts + a swinging half-ring bail
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,0.02,8), brassMat);
    postL.rotation.z = Math.PI/2;
    postL.position.set(closedX-0.02, 0.05, -0.06);
    dGroup.add(postL);
    const postR = postL.clone(); postR.position.z = 0.06; dGroup.add(postR);

    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.006, 8, 16, Math.PI), brassMat);
    bail.rotation.x = Math.PI/2;
    bail.rotation.z = Math.PI;
    bail.position.set(closedX-0.03, 0.008, 0);
    dGroup.add(bail);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.018,8,8), brassMat);
    knob.position.set(closedX-0.03, 0, 0);
    dGroup.add(knob);

    const idx = almirahDrawers.length;
    front.userData.drawerIndex = idx;
    box.userData.drawerIndex = idx;
    knob.userData.drawerIndex = idx;
    bail.userData.drawerIndex = idx;

    almirahDrawers.push({
      front, box, knob, boxRelOffset,
      closedX, openX,
      extraMeshes:[bail, postL, postR, topStrip, botStrip],
      isOpen: (i===1), // middle drawer starts left ajar, unsettling detail
      current: (i===1) ? openX : closedX
    });
  }

  // ---- turned, bulbous wooden feet (lathe-profile, front pair visible) ----
  const footMat = new THREE.MeshStandardMaterial({color:0x1c1108, roughness:0.85});
  const footProfile = [
    {r:0.038, h:0.018}, // base disc
    {r:0.02,  h:0.014}, // waist
    {r:0.032, h:0.03},  // bulb
    {r:0.014, h:0.02},  // neck up into carcass
  ];
  [[-widthZ/2+0.09],[widthZ/2-0.09]].forEach(([z])=>{
    let y = -heightY/2 + 0.03;
    const footGroup = new THREE.Object3D();
    footGroup.position.set(-depthX/2+0.12, 0, z);
    group.add(footGroup);
    footProfile.forEach(seg=>{
      const m = new THREE.Mesh(new THREE.CylinderGeometry(seg.r, seg.r*1.15, seg.h, 10), footMat);
      m.position.y = y + seg.h/2;
      footGroup.add(m);
      y += seg.h;
    });
  });

  group.position.copy(pos);
  scene.add(group);
  obstacles.push(boxFor(pos, depthX/2+0.22, widthZ/2+0.02, 0.05));
}


function buildMirror(){
  const mat = new THREE.MeshStandardMaterial({map:crackTexture(), roughness:0.4, metalness:0.6});
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(0.75,1.0), mat);
  mirror.position.set(-ROOM_W/2+0.03, 1.65, -0.9);
  mirror.rotation.y = Math.PI/2;
  scene.add(mirror);
  const frame = new THREE.Mesh(new THREE.RingGeometry(0.56,0.64,24),
    new THREE.MeshStandardMaterial({color:0x2a1c0e, side:THREE.DoubleSide}));
  frame.position.set(-ROOM_W/2+0.02, 1.65, -0.9);
  frame.rotation.y = Math.PI/2;
  scene.add(frame);
}


function buildBulb(){
  // a single bare bulb hanging on a wire from the ceiling - the room's only electric light
  bulbPivot = new THREE.Object3D();
  bulbPivot.position.set(0.6, ROOM_H - 0.05, 0.5);
  scene.add(bulbPivot);

  const wireLen = 0.85;
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,wireLen,6),
    new THREE.MeshStandardMaterial({color:0x111111, roughness:0.6}));
  wire.position.y = -wireLen/2;
  bulbPivot.add(wire);

  const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.04,0.07,10),
    new THREE.MeshStandardMaterial({color:0x2a2a2a, metalness:0.7, roughness:0.4}));
  socket.position.y = -wireLen + 0.03;
  bulbPivot.add(socket);

  bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.09,16,16),
    new THREE.MeshStandardMaterial({color:0xfff2c8, emissive:0xffdd88, emissiveIntensity:1.4, roughness:0.3, transparent:true, opacity:0.95}));
  bulbMesh.position.y = -wireLen - 0.06;
  bulbPivot.add(bulbMesh);

  bulbLight = new THREE.PointLight(0xffb95a, 1.1, 6.5, 2.4);
  bulbLight.position.y = -wireLen - 0.06;
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(512,512);
  bulbPivot.add(bulbLight);
}


function buildBell(){
  bellPivot = new THREE.Object3D();
  bellPivot.position.set(0, ROOM_H-0.15, -2.6);
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.4,6),
    new THREE.MeshStandardMaterial({color:0x333333, metalness:0.8}));
  chain.position.y = -0.2;
  bellPivot.add(chain);
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.12,0.2,10,1,true),
    new THREE.MeshStandardMaterial({color:0xb08d3c, metalness:0.8, roughness:0.35, side:THREE.DoubleSide}));
  bell.position.y = -0.45;
  bellPivot.add(bell);
  scene.add(bellPivot);
}


function buildNicheIdol(){
  const nicheMat = new THREE.MeshStandardMaterial({color:0x241a10, roughness:1});
  const niche = new THREE.Mesh(new THREE.BoxGeometry(0.7,1.0,0.25), nicheMat);
  niche.position.set(1.9, 1.05, -ROOM_D/2+0.13);
  scene.add(niche);

  // crude broken humanoid idol silhouette
  const idolMat = new THREE.MeshStandardMaterial({color:0x171310, roughness:0.9});
  const idol = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.14,0.4,8), idolMat);
  torso.position.y=0.4;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), idolMat);
  head.position.y=0.68;
  head.scale.set(1,0.9,1);
  idol.add(torso,head);
  idol.position.set(1.9,0.3,-ROOM_D/2+0.27);
  idol.rotation.z = 0.18; // broken, leaning
  scene.add(idol);
}


function buildCobwebs(){
  const fanMat = (density,torn)=> new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const strandMat = ()=> new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false});

  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size), fanMat(density,torn));
    web.position.set(...pos);
    web.rotation.set(...rot);
    scene.add(web);
  };
  const strand = (w,h,pos,rot)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(w,h), strandMat());
    web.position.set(...pos);
    web.rotation.set(...rot);
    scene.add(web);
  };

  // --- big ceiling-corner fans, every corner of the room now, not just three ---
  fan(1.5, [-ROOM_W/2+0.05, ROOM_H-0.04, -ROOM_D/2+0.05], [0, Math.PI/4, 0], 9, 0.1);
  fan(1.45,[ROOM_W/2-0.05, ROOM_H-0.04, -ROOM_D/2+0.05], [0, -Math.PI/4+Math.PI/2, 0], 8, 0.15);
  fan(1.4, [-ROOM_W/2+0.05, ROOM_H-0.04, ROOM_D/2-0.05], [0, Math.PI/4-Math.PI/2, 0], 8, 0.05);
  fan(1.3, [ROOM_W/2-0.05, ROOM_H-0.04, ROOM_D/2-0.05], [0, Math.PI*0.75, 0], 7, 0.2);

  // --- mid-height wall corner fans (smaller, where walls meet) ---
  fan(0.85, [-ROOM_W/2+0.03, ROOM_H*0.55, -ROOM_D/2+0.03], [0, Math.PI/4, 0], 6, 0.2);
  fan(0.7,  [ROOM_W/2-0.03, ROOM_H*0.5, ROOM_D/2-0.03], [0, Math.PI*0.75, 0], 6, 0.25);
  fan(0.6,  [-ROOM_W/2+0.03, ROOM_H*0.42, 0.4], [0, Math.PI/2, 0], 5, 0.3);

  // --- webs tucked around the window reveal, thick with dust in a haunted room ---
  fan(0.55, [ROOM_W/2-0.02, WIN_LINTEL+0.15, WIN_Z-WIN_W/2-0.1], [0, -Math.PI/2, 0], 7, 0.1);
  fan(0.5,  [ROOM_W/2-0.02, WIN_LINTEL+0.15, WIN_Z+WIN_W/2+0.1], [0, -Math.PI/2+Math.PI, 0], 6, 0.2);
  strand(0.9,0.4, [ROOM_W/2-0.35, WIN_LINTEL+0.05, WIN_Z], [0,-Math.PI/2,0]);

  // --- doorway frame webs, hanging above the curtain strips ---
  fan(0.75, [-0.78, DOOR_H+0.05, -ROOM_D/2+0.05], [0, Math.PI/6, 0], 6, 0.15);
  fan(0.7,  [0.78, DOOR_H+0.05, -ROOM_D/2+0.05], [0, -Math.PI/6, 0], 6, 0.15);

  // --- draped over the almirah's top-front corners ---
  fan(0.5, [ROOM_W/2-0.5, 1.86, 2.15], [0, -Math.PI/2, 0], 6, 0.15);
  fan(0.42,[ROOM_W/2-0.5, 1.86, 1.25], [0, -Math.PI/2+Math.PI, 0], 5, 0.25);
  strand(0.7,0.35, [ROOM_W/2-0.28, 1.75, 1.7], [0,0,0]);

  // --- over the trunk, wall corner behind it ---
  fan(0.55, [-ROOM_W/2+0.35, 0.65, -1.05], [0, Math.PI/2, 0], 6, 0.2);
  strand(0.6,0.3, [-ROOM_W/2+0.6, 0.58, -0.85], [0,Math.PI/2,0]);

  // --- charpai corner, low and dusty near the floor ---
  fan(0.45, [-ROOM_W/2+0.3, 0.5, ROOM_D/2-1.9], [0, Math.PI/2, 0], 5, 0.3);
  fan(0.4,  [-ROOM_W/2+1.55, 0.48, ROOM_D/2-0.15], [Math.PI/2, 0, 0], 5, 0.3);

  // --- the niche idol, cobwebbed like it hasn't been touched in years ---
  fan(0.55, [1.9, 1.5, -ROOM_D/2+0.15], [0, 0, 0], 7, 0.1);
  strand(0.5,0.3, [1.65, 1.2, -ROOM_D/2+0.2], [0,0,0]);

  // --- long strand webs stretched across open ceiling gaps, corner to corner ---
  strand(2.4,0.6, [0.2, ROOM_H-0.15, -ROOM_D/2+0.4], [0,0,0]);
  strand(2.0,0.5, [-0.6, ROOM_H-0.18, 1.4], [0,Math.PI/2,0]);
  strand(1.6,0.45,[ROOM_W/2-0.15, ROOM_H-0.2, -0.3], [0,-Math.PI/2,0]);

  // --- mirror-side cobweb near the wall mirror ---
  fan(0.45, [-ROOM_W/2+0.03, 2.1, -0.35], [0, Math.PI/2, 0], 5, 0.25);

  // --- bell corner, up near the ceiling behind it ---
  fan(0.5, [0.35, ROOM_H-0.1, -2.85], [0, 0, 0], 6, 0.2);
}
