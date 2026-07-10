/* ============================================================
   HAVELI OF SHADOWS — ROOM 2 (storage room) + connecting
   corridor from Room 1.
   Requires engine.js and room1.js to be loaded first.
   ============================================================ */

function buildCorridor(){
  // a tight 2-metre stone passage linking room 1's doorway to room 2's
  // doorway, aligned to the same width as the doorway gap so the frame
  // reads as one continuous opening.
  const centerZ = (CORR_SOUTH_Z + CORR_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(1, 1.3);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR_W, CORR_LEN), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR_W, CORR_LEN), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(0, CORR_H, centerZ);
  scene.add(ceil);

  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR_LEN, CORR_H), wallMat);
  westWall.position.set(-CORR_W/2, CORR_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR_LEN, CORR_H), wallMat.clone());
  eastWall.position.set(CORR_W/2, CORR_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // baseboard trim along both sides
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [-CORR_W/2, CORR_W/2].forEach(x=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,CORR_LEN), trimMat);
    trim.position.set(x,0.08,centerZ);
    scene.add(trim);
  });

  // a single weak, unsteady bulb - the passage is meant to feel like the
  // darkest, narrowest part of the house
  const lantern = new THREE.PointLight(0xffb95a, 0.5, 4.2, 2.6);
  lantern.position.set(0, CORR_H-0.18, centerZ);
  scene.add(lantern);
  corridorLight = lantern;

  // cobwebs strung across the low ceiling and tucked in the corners
  const cw = (w,h,pos,rot)=>{
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    mesh.position.set(...pos); mesh.rotation.set(...rot);
    scene.add(mesh);
  };
  cw(CORR_W*0.9, 0.5, [0, CORR_H-0.1, centerZ], [0,0,0]);
  cw(0.6, 0.35, [-CORR_W/2+0.04, CORR_H*0.62, CORR_SOUTH_Z-0.35], [0,Math.PI/2,0]);
  cw(0.55,0.32, [CORR_W/2-0.04, CORR_H*0.55, CORR_NORTH_Z+0.35], [0,-Math.PI/2,0]);

  // walkable zone, overlapping slightly into room 1 and room 2 so the
  // transition through both doorways is seamless
  obstacles.push({minX:-CORR_W/2, maxX:CORR_W/2, minZ:CORR_NORTH_Z-1.0, maxZ:CORR_SOUTH_Z+1.0, isRoomBound:true});
}

/* ---------------- east branch: corridor2 + room 3 ---------------- */
function buildRoom2(){
  // room 2: a second haveli chamber beyond the corridor. Shell built with the
  // same materials/language as room 1 - furniture and detailing to follow.
  const cx = 0;
  const centerZ = (ROOM2_SOUTH_Z + ROOM2_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(4, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM2_W, ROOM2_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM2_W, ROOM2_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM2_H, centerZ);
  scene.add(ceil);

  // north (back) wall - now opens into room 6, the small ancestral shrine.
  // Built with a doorway gap in the same panel+lintel+frame style used
  // for every other doorway in the haveli, instead of the old solid slab.
  const nGapHalf = GATE6_GAPHALF;
  const nSideW = (ROOM2_W/2) - nGapHalf;
  const nTex = wallTexture(); nTex.repeat.set(1.4,1.5);
  const nMat = new THREE.MeshStandardMaterial({map:nTex, roughness:0.95, metalness:0.02, side:THREE.DoubleSide});

  const nLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM2_H), nMat);
  nLeftPanel.position.set(cx-(nGapHalf+nSideW/2), ROOM2_H/2, ROOM2_NORTH_Z);
  scene.add(nLeftPanel);

  const nRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM2_H), nMat.clone());
  nRightPanel.position.set(cx+(nGapHalf+nSideW/2), ROOM2_H/2, ROOM2_NORTH_Z);
  scene.add(nRightPanel);

  const nDoorH = DOOR_H*0.85; // a slightly lower, older doorway befitting a shrine
  const nLintel = new THREE.Mesh(new THREE.PlaneGeometry(nGapHalf*2+0.4, ROOM2_H-nDoorH), nMat.clone());
  nLintel.position.set(cx, nDoorH+(ROOM2_H-nDoorH)/2, ROOM2_NORTH_Z);
  scene.add(nLintel);

  const nFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const nFrameSide = new THREE.BoxGeometry(0.2, nDoorH+0.1, 0.3);
  const nfl = new THREE.Mesh(nFrameSide, nFrameMat); nfl.position.set(cx-nGapHalf-0.1, nDoorH/2+0.05, ROOM2_NORTH_Z);
  const nfr = new THREE.Mesh(nFrameSide, nFrameMat); nfr.position.set(cx+nGapHalf+0.1, nDoorH/2+0.05, ROOM2_NORTH_Z);
  const nft = new THREE.Mesh(new THREE.BoxGeometry(nGapHalf*2+0.4, 0.18, 0.3), nFrameMat); nft.position.set(cx, nDoorH+0.1, ROOM2_NORTH_Z);
  scene.add(nfl,nfr,nft);

  // east wall carries a doorway gap -> corridor2 -> room 3, matching the
  // panel+lintel+frame pattern used for every other doorway in the haveli
  const eGapHalf = CORR2_GAPHALF;
  const eSideD = (ROOM2_D/2) - eGapHalf;
  const eTex = wallTexture(); eTex.repeat.set(1.4,1.5);
  const eMat = new THREE.MeshStandardMaterial({map:eTex, roughness:0.95, metalness:0.02});

  const eNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM2_H), eMat);
  eNearPanel.position.set(cx+ROOM2_W/2, ROOM2_H/2, centerZ-(eGapHalf+eSideD/2));
  eNearPanel.rotation.y = -Math.PI/2;
  scene.add(eNearPanel);

  const eFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM2_H), eMat.clone());
  eFarPanel.position.set(cx+ROOM2_W/2, ROOM2_H/2, centerZ+(eGapHalf+eSideD/2));
  eFarPanel.rotation.y = -Math.PI/2;
  scene.add(eFarPanel);

  const eLintel = new THREE.Mesh(new THREE.PlaneGeometry(eGapHalf*2+0.4, ROOM2_H-DOOR_H), eMat.clone());
  eLintel.position.set(cx+ROOM2_W/2, DOOR_H+(ROOM2_H-DOOR_H)/2, centerZ);
  eLintel.rotation.y = -Math.PI/2;
  scene.add(eLintel);

  const eFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const eFrameSide = new THREE.BoxGeometry(0.3, DOOR_H+0.1, 0.18);
  const efn = new THREE.Mesh(eFrameSide, eFrameMat); efn.position.set(cx+ROOM2_W/2, DOOR_H/2+0.05, centerZ-eGapHalf-0.09);
  const efs = new THREE.Mesh(eFrameSide, eFrameMat); efs.position.set(cx+ROOM2_W/2, DOOR_H/2+0.05, centerZ+eGapHalf+0.09);
  const eft = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,eGapHalf*2+0.36), eFrameMat); eft.position.set(cx+ROOM2_W/2,DOOR_H+0.1,centerZ);
  scene.add(efn,efs,eft);

  // west wall carries a doorway gap -> room 4, the small nook opening
  // directly off this room (no corridor - it's right through the wall)
  const wGapHalf = GATE4_GAPHALF;
  const wSideD = (ROOM2_D/2) - wGapHalf;
  const wTex2 = wallTexture(); wTex2.repeat.set(1.4,1.5);
  const wMat2 = new THREE.MeshStandardMaterial({map:wTex2, roughness:0.95, metalness:0.02});

  const wNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM2_H), wMat2);
  wNearPanel.position.set(cx-ROOM2_W/2, ROOM2_H/2, centerZ-(wGapHalf+wSideD/2));
  wNearPanel.rotation.y = Math.PI/2;
  scene.add(wNearPanel);

  const wFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM2_H), wMat2.clone());
  wFarPanel.position.set(cx-ROOM2_W/2, ROOM2_H/2, centerZ+(wGapHalf+wSideD/2));
  wFarPanel.rotation.y = Math.PI/2;
  scene.add(wFarPanel);

  const doorH4 = DOOR_H*0.85; // this doorway is a little lower, matching room 4's cramped scale
  const wLintel = new THREE.Mesh(new THREE.PlaneGeometry(wGapHalf*2+0.3, ROOM2_H-doorH4), wMat2.clone());
  wLintel.position.set(cx-ROOM2_W/2, doorH4+(ROOM2_H-doorH4)/2, centerZ);
  wLintel.rotation.y = Math.PI/2;
  scene.add(wLintel);

  const wFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const wFrameSide = new THREE.BoxGeometry(0.24, doorH4+0.1, 0.16);
  const wfn = new THREE.Mesh(wFrameSide, wFrameMat); wfn.position.set(cx-ROOM2_W/2, doorH4/2+0.05, centerZ-wGapHalf-0.08);
  const wfs = new THREE.Mesh(wFrameSide, wFrameMat); wfs.position.set(cx-ROOM2_W/2, doorH4/2+0.05, centerZ+wGapHalf+0.08);
  const wft = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.16,wGapHalf*2+0.32), wFrameMat); wft.position.set(cx-ROOM2_W/2,doorH4+0.08,centerZ);
  scene.add(wfn,wfs,wft);

  // south wall with a doorway gap matching the corridor's width, mirroring
  // room 1's north doorway
  const gapHalf = CORR_W/2;
  const sideW = (ROOM2_W/2) - gapHalf;
  const southTex = wallTexture(); southTex.repeat.set(1.4,1.5);
  const southMat = new THREE.MeshStandardMaterial({map:southTex, roughness:0.95});

  const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM2_H), southMat);
  leftPanel.position.set(cx-(gapHalf+sideW/2), ROOM2_H/2, ROOM2_SOUTH_Z);
  leftPanel.rotation.y = Math.PI;
  scene.add(leftPanel);

  const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM2_H), southMat.clone());
  rightPanel.position.set(cx+(gapHalf+sideW/2), ROOM2_H/2, ROOM2_SOUTH_Z);
  rightPanel.rotation.y = Math.PI;
  scene.add(rightPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM2_H-DOOR_H), southMat.clone());
  lintel.position.set(cx, DOOR_H+(ROOM2_H-DOOR_H)/2, ROOM2_SOUTH_Z);
  lintel.rotation.y = Math.PI;
  scene.add(lintel);

  // carved wooden door frame matching room 1's doorway style
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.18, DOOR_H+0.1, 0.3);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(cx-gapHalf-0.09, DOOR_H/2+0.05, ROOM2_SOUTH_Z);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(cx+gapHalf+0.09, DOOR_H/2+0.05, ROOM2_SOUTH_Z);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.36, 0.18, 0.3), frameMat); ft.position.set(cx,DOOR_H+0.1,ROOM2_SOUTH_Z);
  scene.add(fl,fr,ft);

  // baseboard trim - north wall trim is now split either side of the new
  // room 6 doorway instead of running solid across the whole wall
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimNL = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNL.position.set(cx-(nGapHalf+nSideW/2),0.08,ROOM2_NORTH_Z); scene.add(trimNL);
  const trimNR = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNR.position.set(cx+(nGapHalf+nSideW/2),0.08,ROOM2_NORTH_Z); scene.add(trimNR);

  // a single weak bulb so the room isn't pure black while it's still empty -
  // furniture and proper lighting design will follow in a later pass
  const bulb = new THREE.PointLight(0xffcf7a, 0.8, 6, 2.2);
  bulb.position.set(cx+0.4, ROOM2_H-0.25, centerZ);
  scene.add(bulb);
  room2Light = bulb;

  // cobwebs in the corners, consistent with the rest of the haveli
  const fanMat = (density,torn)=> new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size), fanMat(density,torn));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.3, [cx-ROOM2_W/2+0.05, ROOM2_H-0.04, ROOM2_NORTH_Z+0.05], [0, Math.PI/4, 0], 8, 0.15);
  fan(1.2, [cx+ROOM2_W/2-0.05, ROOM2_H-0.04, ROOM2_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.2);
  fan(0.9, [cx-ROOM2_W/2+0.03, ROOM2_H-0.04, ROOM2_SOUTH_Z-0.05], [0, Math.PI/4-Math.PI/2, 0], 6, 0.2);
  fan(0.9, [cx+ROOM2_W/2-0.03, ROOM2_H-0.04, ROOM2_SOUTH_Z-0.05], [0, Math.PI*0.75, 0], 6, 0.25);

  obstacles.push({minX:cx-ROOM2_W/2, maxX:cx+ROOM2_W/2, minZ:ROOM2_NORTH_Z, maxZ:ROOM2_SOUTH_Z, isRoomBound:true});
}

/* ---------------- room 2 storage props ---------------- */

function terracottaTexture(){
  const S = 256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,S);
  g.addColorStop(0,'#8a4a2e'); g.addColorStop(0.5,'#6f381f'); g.addColorStop(1,'#4a2414');
  ctx.fillStyle = g; ctx.fillRect(0,0,S,S);
  // potter's-wheel throwing rings
  ctx.strokeStyle = 'rgba(30,12,6,0.35)';
  for(let y=6;y<S;y+=9){
    ctx.lineWidth = 1+Math.random()*1.5;
    ctx.beginPath();
    let x=0;
    ctx.moveTo(x,y+Math.sin(x*0.05)*1.5);
    for(x=0;x<S;x+=16){ ctx.lineTo(x,y+Math.sin(x*0.09+y)*1.5); }
    ctx.stroke();
  }
  // speckle and firing blotches
  for(let i=0;i<1800;i++){
    ctx.fillStyle = `rgba(${20+Math.random()*40},${8+Math.random()*20},${4+Math.random()*10},${Math.random()*0.2})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.4,1.4);
  }
  for(let i=0;i<6;i++){
    ctx.fillStyle = 'rgba(15,6,3,0.3)';
    ctx.beginPath(); ctx.arc(Math.random()*S,Math.random()*S, 10+Math.random()*26,0,Math.PI*2); ctx.fill();
  }
  // fine cracks in the glaze
  ctx.strokeStyle='rgba(10,4,2,0.4)';
  for(let i=0;i<8;i++){
    ctx.lineWidth=0.6+Math.random();
    let x=Math.random()*S,y=Math.random()*S;
    ctx.beginPath(); ctx.moveTo(x,y);
    for(let s=0;s<4;s++){ x+=(Math.random()-0.5)*40; y+=(Math.random()-0.5)*40; ctx.lineTo(x,y); }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = maxAniso;
  return tex;
}

function burlapTexture(){
  const S = 256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = '#7a6540'; ctx.fillRect(0,0,S,S);
  // woven cross-hatch pattern
  ctx.strokeStyle = 'rgba(50,38,20,0.35)';
  ctx.lineWidth = 1.2;
  for(let i=-S;i<S*2;i+=6){
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i+S,S); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(110,92,58,0.25)';
  for(let i=-S;i<S*2;i+=6){
    ctx.beginPath(); ctx.moveTo(i+S,0); ctx.lineTo(i,S); ctx.stroke();
  }
  // grime, stains, frayed patches
  for(let i=0;i<2200;i++){
    ctx.fillStyle = `rgba(30,22,10,${Math.random()*0.18})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.3,1.3);
  }
  for(let i=0;i<5;i++){
    const x=Math.random()*S, y=Math.random()*S, r=10+Math.random()*24;
    const gg = ctx.createRadialGradient(x,y,0,x,y,r);
    gg.addColorStop(0,'rgba(20,14,6,0.3)'); gg.addColorStop(1,'rgba(20,14,6,0)');
    ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAniso;
  return tex;
}

function strawTexture(){
  const c = makeCanvas(256,256), ctx = c.getContext('2d');
  ctx.clearRect(0,0,256,256);
  for(let i=0;i<140;i++){
    const x=Math.random()*256, y=Math.random()*256;
    const len = 14+Math.random()*30;
    const a = Math.random()*Math.PI*2;
    ctx.strokeStyle = `rgba(${140+Math.random()*60},${110+Math.random()*50},${40+Math.random()*30},${0.35+Math.random()*0.3})`;
    ctx.lineWidth = 0.8+Math.random()*1.2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x+Math.cos(a)*len, y+Math.sin(a)*len);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function rustyMetalTexture(){
  const S=256;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = '#2a2420'; ctx.fillRect(0,0,S,S);
  for(let i=0;i<10;i++){
    const x=Math.random()*S,y=Math.random()*S,r=10+Math.random()*30;
    const gg = ctx.createRadialGradient(x,y,0,x,y,r);
    gg.addColorStop(0,'rgba(140,70,25,0.45)'); gg.addColorStop(1,'rgba(140,70,25,0)');
    ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  for(let i=0;i<1400;i++){
    ctx.fillStyle = `rgba(${Math.random()>0.5?80:15},${Math.random()>0.5?40:12},${Math.random()>0.5?15:8},${Math.random()*0.2})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.3,1.3);
  }
  return new THREE.CanvasTexture(c);
}

function makeCrate(w,h,d,pos,rotY){
  const group = new THREE.Group();
  const crateTex = almirahWoodTexture('#5e4326', null, {planks:3, knots:1});
  crateTex.wrapS = crateTex.wrapT = THREE.RepeatWrapping;
  const mat = new THREE.MeshStandardMaterial({map:crateTex, roughness:0.88, metalness:0.03});
  const box = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
  box.castShadow = true; box.receiveShadow = true;
  group.add(box);
  const edgeMat = new THREE.MeshStandardMaterial({color:0x1c1108, roughness:0.85});
  const postGeo = new THREE.BoxGeometry(0.03,h+0.015,0.03);
  [[-w/2+0.015,-d/2+0.015],[w/2-0.015,-d/2+0.015],[-w/2+0.015,d/2-0.015],[w/2-0.015,d/2-0.015]].forEach(([x,z])=>{
    const post = new THREE.Mesh(postGeo, edgeMat);
    post.position.set(x,0,z);
    group.add(post);
  });
  [-h*0.26, h*0.26].forEach(y=>{
    const band = new THREE.Mesh(new THREE.BoxGeometry(w+0.015,0.022,d+0.015), edgeMat);
    band.position.set(0,y,0);
    group.add(band);
  });
  group.position.set(...pos);
  if(rotY) group.rotation.y = rotY;
  scene.add(group);
  return {group, w, h, d};
}

function makeSack(scale, pos, rotY){
  const group = new THREE.Group();
  const tex = burlapTexture();
  const mat = new THREE.MeshStandardMaterial({map:tex, roughness:0.95});
  const r = 0.3*scale;
  const body = new THREE.Mesh(new THREE.SphereGeometry(r,12,10), mat);
  body.scale.set(1, 0.8, 1);
  body.position.y = r*0.8;
  body.castShadow = true;
  group.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(r*0.28,r*0.42,r*0.5,8), mat);
  neck.position.y = r*0.8 + r*0.8*0.55;
  group.add(neck);
  const tieMat = new THREE.MeshStandardMaterial({color:0x2a2015, roughness:0.85});
  const tie = new THREE.Mesh(new THREE.TorusGeometry(r*0.3,0.012,6,12), tieMat);
  tie.rotation.x = Math.PI/2;
  tie.position.y = neck.position.y + r*0.16;
  group.add(tie);
  group.position.set(...pos);
  if(rotY) group.rotation.y = rotY;
  scene.add(group);
  return group;
}

function makePot(scale, pos){
  const group = new THREE.Group();
  const tex = terracottaTexture();
  const mat = new THREE.MeshStandardMaterial({map:tex, roughness:0.82});
  const r = 0.26*scale;
  const body = new THREE.Mesh(new THREE.SphereGeometry(r,16,12), mat);
  body.scale.set(1, 0.92, 1);
  body.position.y = r*0.86;
  body.castShadow = true;
  group.add(body);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(r*0.34,r*0.56,r*0.55,12), mat);
  neck.position.y = body.position.y + r*0.92*0.72;
  group.add(neck);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r*0.34,0.018*scale,8,16), mat);
  rim.rotation.x = Math.PI/2;
  rim.position.y = neck.position.y + r*0.26;
  group.add(rim);
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeLadder(len, pos, rotY, leanAngle){
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color:0x2c1c0f, roughness:0.88});
  const railGeo = new THREE.BoxGeometry(0.04,len,0.05);
  const rail1 = new THREE.Mesh(railGeo,mat); rail1.position.x=-0.19; rail1.castShadow=true;
  const rail2 = new THREE.Mesh(railGeo,mat); rail2.position.x=0.19; rail2.castShadow=true;
  group.add(rail1,rail2);
  const rungCount = Math.max(3,Math.floor(len/0.3));
  for(let i=1;i<rungCount;i++){
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.4,8), mat);
    rung.rotation.z = Math.PI/2;
    rung.position.set(0, -len/2 + i*(len/rungCount), 0);
    group.add(rung);
  }
  group.position.set(...pos);
  group.rotation.y = rotY||0;
  group.rotation.x = leanAngle||0;
  scene.add(group);
  return group;
}

function makeCartWheel(radius, pos, rotY, rotZ){
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({color:0x241a10, roughness:0.85});
  const rustMat = new THREE.MeshStandardMaterial({map:rustyMetalTexture(), metalness:0.5, roughness:0.6});
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius,0.032,8,20), rustMat);
  group.add(rim);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.1,10), woodMat);
  hub.rotation.z = Math.PI/2;
  group.add(hub);
  const spokeCount = 8;
  for(let i=0;i<spokeCount;i++){
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius*1.85,0.022,0.022), woodMat);
    spoke.rotation.z = (i/spokeCount)*Math.PI;
    group.add(spoke);
  }
  group.rotation.y = Math.PI/2; // stand the wheel's disc parallel to the wall
  group.rotation.z = rotZ!==undefined ? rotZ : 0.12;
  if(rotY) group.rotation.y += rotY;
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeHangingLantern(pos){
  const group = new THREE.Group();
  const rustTex = rustyMetalTexture();
  const chainMat = new THREE.MeshStandardMaterial({map:rustTex, metalness:0.55, roughness:0.6});
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,0.5,6), chainMat);
  chain.position.y = -0.25;
  group.add(chain);
  const cageCount = 6;
  for(let i=0;i<cageCount;i++){
    const a = (i/cageCount)*Math.PI*2;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.16,6), chainMat);
    bar.position.set(Math.cos(a)*0.06, -0.56, Math.sin(a)*0.06);
    group.add(bar);
  }
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),
    new THREE.MeshStandardMaterial({color:0xffcf7a, emissive:0xff9944, emissiveIntensity:0.55, transparent:true, opacity:0.55}));
  glass.position.y = -0.56;
  group.add(glass);
  const light = new THREE.PointLight(0xff9944, 0.35, 3.2, 2.4);
  light.position.y = -0.56;
  group.add(light);
  group.position.set(...pos);
  scene.add(group);
  return {group, light};
}

function makeRopeCoil(radius, pos){
  const mat = new THREE.MeshStandardMaterial({map:ropeTexture(), roughness:0.95});
  const group = new THREE.Group();
  for(let i=0;i<3;i++){
    const coil = new THREE.Mesh(new THREE.TorusGeometry(radius-i*0.03, 0.035, 8, 20), mat);
    coil.rotation.x = Math.PI/2;
    coil.position.y = 0.02 + i*0.025;
    group.add(coil);
  }
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeStrawPatch(size, pos, rot){
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size,size*0.7),
    new THREE.MeshBasicMaterial({map:strawTexture(), transparent:true, depthWrite:false}));
  mesh.rotation.x = -Math.PI/2;
  mesh.position.set(pos[0], 0.008, pos[1]);
  mesh.rotation.z = rot||0;
  scene.add(mesh);
  return mesh;
}

function makeShelvingUnit(w, h, d, pos, rotY){
  const group = new THREE.Group();
  const woodTex = almirahWoodTexture('#3a2513', null, {planks:2, knots:1});
  const frameMat = new THREE.MeshStandardMaterial({map:woodTex, roughness:0.85});
  const postGeo = new THREE.BoxGeometry(0.05,h,0.05);
  [[-w/2+0.03,-d/2+0.03],[w/2-0.03,-d/2+0.03],[-w/2+0.03,d/2-0.03],[w/2-0.03,d/2-0.03]].forEach(([x,z])=>{
    const post = new THREE.Mesh(postGeo, frameMat);
    post.position.set(x,0,z);
    post.castShadow = true;
    group.add(post);
  });
  const shelfCount = 3;
  for(let i=0;i<shelfCount;i++){
    const y = -h/2 + (h/(shelfCount-1))*i + 0.05;
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w-0.05,0.03,d-0.05), frameMat);
    shelf.position.set(0,y,0);
    shelf.receiveShadow = true;
    group.add(shelf);
  }
  group.position.set(...pos);
  if(rotY) group.rotation.y = rotY;
  scene.add(group);
  return group;
}

function makeOldTable(w,h,d,pos,rotY){
  const group = new THREE.Group();
  const woodTex = almirahWoodTexture('#3f2a17', null, {planks:2, knots:1});
  const mat = new THREE.MeshStandardMaterial({map:woodTex, roughness:0.85});
  const top = new THREE.Mesh(new THREE.BoxGeometry(w,0.05,d), mat);
  top.position.y = h;
  top.castShadow = true;
  group.add(top);
  const legMat = new THREE.MeshStandardMaterial({color:0x1e130a, roughness:0.85});
  [[-w/2+0.06,-d/2+0.06],[w/2-0.06,-d/2+0.06],[-w/2+0.06,d/2-0.06],[w/2-0.06,d/2-0.06]].forEach(([x,z])=>{
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05,h,0.05), legMat);
    leg.position.set(x,h/2,z);
    group.add(leg);
  });
  group.position.set(...pos);
  if(rotY) group.rotation.y = rotY;
  scene.add(group);
  return group;
}

function makeGlassJar(scale, pos){
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({color:0x7a8f6a, transparent:true, opacity:0.35, roughness:0.15, metalness:0.05});
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.05*scale,0.055*scale,0.14*scale,10), mat);
  jar.position.y = 0.07*scale;
  group.add(jar);
  const lidMat = new THREE.MeshStandardMaterial({color:0x2a2015, roughness:0.7});
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.052*scale,0.052*scale,0.02*scale,10), lidMat);
  lid.position.y = 0.14*scale+0.01*scale;
  group.add(lid);
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeOpenableBox(w,h,d,pos,rotY){
  // an old wooden storage chest with a hinged lid the player can click to
  // open/close, like the almirah drawers but rotating instead of sliding
  const group = new THREE.Group();
  const woodTex = almirahWoodTexture('#4a3018', null, {planks:3, knots:2});
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  const mat = new THREE.MeshStandardMaterial({map:woodTex, roughness:0.85, metalness:0.03});
  const bracketMat = new THREE.MeshStandardMaterial({map:agedBrassTexture(), metalness:0.75, roughness:0.4});
  const bodyH = h*0.72;
  const body = new THREE.Mesh(new THREE.BoxGeometry(w,bodyH,d), mat);
  body.position.y = bodyH/2;
  body.castShadow = true; body.receiveShadow = true;
  group.add(body);
  // an inner dark cavity visible once the lid lifts, so it isn't just a
  // solid block underneath
  const cavity = new THREE.Mesh(new THREE.BoxGeometry(w-0.04, bodyH-0.03, d-0.04),
    new THREE.MeshStandardMaterial({color:0x0c0805, roughness:1}));
  cavity.position.y = bodyH/2 + 0.008;
  group.add(cavity);
  // corner brackets and a banded strap around the body for a reinforced,
  // well-travelled storage-chest look
  const cornerGeo = new THREE.BoxGeometry(0.03, bodyH+0.01, 0.03);
  [[-w/2+0.015,-d/2+0.015],[w/2-0.015,-d/2+0.015],[-w/2+0.015,d/2-0.015],[w/2-0.015,d/2-0.015]].forEach(([x,z])=>{
    const corner = new THREE.Mesh(cornerGeo, bracketMat);
    corner.position.set(x,bodyH/2,z);
    group.add(corner);
  });
  const strap = new THREE.Mesh(new THREE.BoxGeometry(w+0.015, 0.035, d+0.015), bracketMat);
  strap.position.y = bodyH*0.55;
  group.add(strap);
  // lid, hinged at the back top edge
  const lidH = h*0.24;
  const hingePivot = new THREE.Object3D();
  hingePivot.position.set(0, bodyH, -d/2);
  group.add(hingePivot);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(w+0.02, lidH, d+0.02), mat);
  lid.position.set(0, lidH/2, d/2);
  lid.castShadow = true;
  hingePivot.add(lid);
  const lidTrim = new THREE.Mesh(new THREE.BoxGeometry(w+0.03, 0.02, d+0.03), bracketMat);
  lidTrim.position.set(0, lidH, d/2);
  hingePivot.add(lidTrim);
  // a small brass clasp/latch on the front, above the body
  const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.07,0.06,0.02), bracketMat);
  clasp.position.set(0, bodyH-0.015, d/2+0.015);
  group.add(clasp);
  const claspRing = new THREE.Mesh(new THREE.TorusGeometry(0.02,0.006,6,12), bracketMat);
  claspRing.position.set(0, bodyH-0.015, d/2+0.03);
  group.add(claspRing);
  group.position.set(...pos);
  if(rotY) group.rotation.y = rotY;
  scene.add(group);
  const idx = roomBoxes.length;
  lid.userData.boxIndex = idx;
  body.userData.boxIndex = idx;
  clasp.userData.boxIndex = idx;
  claspRing.userData.boxIndex = idx;
  roomBoxes.push({
    hingePivot, lid, body, clasp, claspRing,
    isOpen: false,
    current: 0,
    openAngle: -Math.PI*0.6
  });
  return group;
}

function buildRoom2Furniture(){
  const cx = 0;
  // --- crate stacks against the west wall ---
  const crateA1 = makeCrate(0.55,0.4,0.5, [-2.15,0.2,-6.6], 0.1);
  const crateA2 = makeCrate(0.45,0.35,0.42, [-2.05,0.575,-6.75], -0.15);
  const crateA3 = makeCrate(0.4,0.32,0.38, [-2.3,0.16,-7.2], 0.3);
  obstacles.push(boxFor(new THREE.Vector3(-2.15,0,-6.85), 0.45, 0.55, 0.1));

  const crateB1 = makeCrate(0.5,0.42,0.48, [-1.6,0.21,-10.3], -0.2);
  const crateB2 = makeCrate(0.4,0.34,0.4, [-1.75,0.55,-10.15], 0.25);
  obstacles.push(boxFor(new THREE.Vector3(-1.65,0,-10.25), 0.4, 0.4, 0.1));

  // loose scattered single crates elsewhere for clutter
  makeCrate(0.42,0.32,0.4, [-0.9,0.16,-10.2], 0.4);
  makeCrate(0.36,0.28,0.34, [0.7,0.14,-11.1], -0.35);
  obstacles.push(boxFor(new THREE.Vector3(-0.9,0,-10.2), 0.3, 0.3, 0.08));
  obstacles.push(boxFor(new THREE.Vector3(0.7,0,-11.1), 0.25, 0.25, 0.08));

  // --- grain sack pile against the east wall, near the entrance ---
  makeSack(1.0, [2.05,0,-6.55], 0.2);
  makeSack(0.9, [2.35,0,-6.75], -0.4);
  makeSack(0.95,[2.15,0,-7.0], 0.6);
  makeSack(0.8, [2.4,0,-6.35], 0.1);
  obstacles.push(boxFor(new THREE.Vector3(2.2,0,-6.65), 0.55, 0.55, 0.08));

  // --- clay storage pots (matkas) further along the east wall, kept clear
  // of the new doorway gap that now opens partway down this wall ---
  makePot(1.2, [2.3,0,-10.7]);
  makePot(0.95,[2.55,0,-11.1]);
  makePot(1.05,[2.35,0,-11.4]);
  obstacles.push(boxFor(new THREE.Vector3(2.4,0,-11.05), 0.5, 0.6, 0.08));

  // --- open wooden shelving unit against the west wall, deep in the room,
  // holding a few small crates and glass storage jars ---
  makeShelvingUnit(0.35, 1.7, 1.6, [-2.62,0.85,-11.1], 0);
  makeGlassJar(1.1, [-2.62,1.42,-11.5]);
  makeGlassJar(0.9, [-2.62,1.42,-11.15]);
  makeGlassJar(1.0, [-2.62,1.42,-10.8]);
  makeGlassJar(0.85,[-2.62,0.92,-11.4]);
  makeGlassJar(0.95,[-2.62,0.92,-11.0]);
  obstacles.push(boxFor(new THREE.Vector3(-2.62,0,-11.1), 0.25, 0.85, 0.06));

  // --- an old ladder leaning against the back (north) wall ---
  makeLadder(2.6, [1.0, 1.25, -11.75], 0, 0.24);

  // --- a broken cart wheel leaning against the east wall ---
  makeCartWheel(0.42, [2.68,0.44,-10.6], 0, 0.1);

  // --- a rickety table with jars, off to the side so it doesn't block the aisle ---
  makeOldTable(0.9,0.72,0.55, [1.1,0,-8.1], 0.15);
  makeGlassJar(1.0, [1.05,0.72+0.02,-8.0]);
  makeGlassJar(0.85,[1.3,0.72+0.02,-8.2]);
  obstacles.push(boxFor(new THREE.Vector3(1.1,0,-8.1), 0.5, 0.35, 0.08));

  // --- a coil of old rope tucked by the entrance-side crates ---
  makeRopeCoil(0.22, [-1.55,0.02,-7.05]);

  // --- a rusty lantern hanging from a ceiling beam, dimly lighting the middle of the room ---
  makeHangingLantern([0.4, ROOM2_H-0.05, -8.4]);

  // --- an old wooden storage chest with a hinged lid, openable by the player ---
  makeOpenableBox(0.62, 0.42, 0.44, [1.75,0,-6.9], -0.3);
  obstacles.push(boxFor(new THREE.Vector3(1.75,0,-6.9), 0.36, 0.28, 0.08));

  // --- straw scattered on the floor near the crates and sacks, lived-in clutter ---
  makeStrawPatch(0.9, [-1.7,-6.9], 0.3);
  makeStrawPatch(0.7, [1.7,-6.5], -0.4);
  makeStrawPatch(0.8, [-1.9,-9.4], 0.5);
  makeStrawPatch(0.6, [2.0,-9.3], -0.2);
}
