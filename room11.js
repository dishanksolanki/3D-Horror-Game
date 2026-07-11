/* ============================================================
HAVELI OF SHADOWS — ROOM 11

Opens off room 2's north (back) wall via corridor11, an
extremely short 0.25-metre stone connector - just a thick
doorway threshold rather than a proper passage. Room 11 also
has its own openable/closable gate on the opposite (north) wall,
leading to a short dead-end threshold. Room 11 additionally
branches EAST to room 12 (via corridor12) and WEST to room 13
(via corridor13), each also a 0.25m connector - see room12.js
and room13.js. Requires engine.js to be loaded first.
============================================================ */

function buildCorridor11(){
  const centerZ = (CORR11_SOUTH_Z + CORR11_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(0.5, 1.3);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_W, CORR11_LEN), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_W, CORR11_LEN), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(0, CORR11_H, centerZ);
  scene.add(ceil);

  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_LEN, CORR11_H), wallMat);
  westWall.position.set(-CORR11_W/2, CORR11_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_LEN, CORR11_H), wallMat.clone());
  eastWall.position.set(CORR11_W/2, CORR11_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [-CORR11_W/2, CORR11_W/2].forEach(x=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,CORR11_LEN), trimMat);
    trim.position.set(x,0.08,centerZ);
    scene.add(trim);
  });

  const lantern = new THREE.PointLight(0xff9d4a, 0.45, 3.6, 2.6);
  lantern.position.set(0, CORR11_H-0.2, centerZ);
  scene.add(lantern);
  corridor11Light = lantern;

  const strand = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_W*0.85, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(0, CORR11_H-0.45, centerZ);
  scene.add(strand);

  obstacles.push({minX:-CORR11_W/2, maxX:CORR11_W/2, minZ:CORR11_NORTH_Z-1.0, maxZ:CORR11_SOUTH_Z+1.0, isRoomBound:true});
}

function buildRoom11(){
  const cx = 0;
  const centerZ = (ROOM11_SOUTH_Z + ROOM11_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(3.4, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_W, ROOM11_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_W, ROOM11_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM11_H, centerZ);
  scene.add(ceil);

  // --- north wall - carries the gap for the gate (opposite room 11's
  // south/corridor11 connection). Door leaf, hinge, threshold built in
  // buildRoom11Gate() below. ---
  const gGapHalf = ROOM11_GATE_GAPHALF;
  const gSideW = (ROOM11_W/2) - gGapHalf;
  const gTex = wallTexture(); gTex.repeat.set(1.4,1.5);
  const gMat = new THREE.MeshStandardMaterial({map:gTex, roughness:0.95, metalness:0.02});

  const gLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(gSideW, ROOM11_H), gMat);
  gLeftPanel.position.set(cx-(gGapHalf+gSideW/2), ROOM11_H/2, ROOM11_NORTH_Z);
  scene.add(gLeftPanel);

  const gRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(gSideW, ROOM11_H), gMat.clone());
  gRightPanel.position.set(cx+(gGapHalf+gSideW/2), ROOM11_H/2, ROOM11_NORTH_Z);
  scene.add(gRightPanel);

  const gLintel = new THREE.Mesh(new THREE.PlaneGeometry(gGapHalf*2+0.4, ROOM11_H-DOOR_H), gMat.clone());
  gLintel.position.set(cx, DOOR_H+(ROOM11_H-DOOR_H)/2, ROOM11_NORTH_Z);
  scene.add(gLintel);

  const gFrameMat = new THREE.MeshStandardMaterial({color:0x22190f, roughness:0.9});
  const gFrameSide = new THREE.BoxGeometry(0.28, DOOR_H+0.14, 0.2);
  const gfl = new THREE.Mesh(gFrameSide, gFrameMat); gfl.position.set(cx-gGapHalf-0.12, DOOR_H/2+0.07, ROOM11_NORTH_Z);
  const gfr = new THREE.Mesh(gFrameSide, gFrameMat); gfr.position.set(cx+gGapHalf+0.12, DOOR_H/2+0.07, ROOM11_NORTH_Z);
  const gft = new THREE.Mesh(new THREE.BoxGeometry(gGapHalf*2+0.4, 0.2, 0.34), gFrameMat); gft.position.set(cx, DOOR_H+0.12, ROOM11_NORTH_Z);
  scene.add(gfl, gfr, gft);

  // --- east wall - carries doorway gap to corridor12 -> room12 ---
  const eGapHalf = GATE12_GAPHALF;
  const eSideD = (ROOM11_D/2) - eGapHalf;
  const eTex = wallTexture(); eTex.repeat.set(1.6,1.5);
  const eMat = new THREE.MeshStandardMaterial({map:eTex, roughness:0.95});

  const eTop = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM11_H), eMat);
  eTop.position.set(cx+ROOM11_W/2, ROOM11_H/2, centerZ-(eGapHalf+eSideD/2));
  eTop.rotation.y = -Math.PI/2;
  scene.add(eTop);

  const eBot = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM11_H), eMat.clone());
  eBot.position.set(cx+ROOM11_W/2, ROOM11_H/2, centerZ+(eGapHalf+eSideD/2));
  eBot.rotation.y = -Math.PI/2;
  scene.add(eBot);

  const eLintel = new THREE.Mesh(new THREE.PlaneGeometry(eGapHalf*2+0.4, ROOM11_H-DOOR_H), eMat.clone());
  eLintel.position.set(cx+ROOM11_W/2, DOOR_H+(ROOM11_H-DOOR_H)/2, centerZ);
  eLintel.rotation.y = -Math.PI/2;
  scene.add(eLintel);

  const eFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const eFrameSide = new THREE.BoxGeometry(0.16, DOOR_H+0.1, 0.24);
  const efl = new THREE.Mesh(eFrameSide, eFrameMat); efl.position.set(cx+ROOM11_W/2, DOOR_H/2+0.05, centerZ-eGapHalf-0.1);
  const efr = new THREE.Mesh(eFrameSide, eFrameMat); efr.position.set(cx+ROOM11_W/2, DOOR_H/2+0.05, centerZ+eGapHalf+0.1);
  const eft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, eGapHalf*2+0.32), eFrameMat); eft.position.set(cx+ROOM11_W/2, DOOR_H+0.1, centerZ);
  scene.add(efl, efr, eft);

  // --- west wall - carries doorway gap to corridor13 -> room13 ---
  const wGapHalf = GATE13_GAPHALF;
  const wSideD = (ROOM11_D/2) - wGapHalf;
  const wTex2 = wallTexture(); wTex2.repeat.set(1.6,1.5);
  const wMat2 = new THREE.MeshStandardMaterial({map:wTex2, roughness:0.95});

  const wTop = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM11_H), wMat2);
  wTop.position.set(cx-ROOM11_W/2, ROOM11_H/2, centerZ-(wGapHalf+wSideD/2));
  wTop.rotation.y = Math.PI/2;
  scene.add(wTop);

  const wBot = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM11_H), wMat2.clone());
  wBot.position.set(cx-ROOM11_W/2, ROOM11_H/2, centerZ+(wGapHalf+wSideD/2));
  wBot.rotation.y = Math.PI/2;
  scene.add(wBot);

  const wLintel = new THREE.Mesh(new THREE.PlaneGeometry(wGapHalf*2+0.4, ROOM11_H-DOOR_H), wMat2.clone());
  wLintel.position.set(cx-ROOM11_W/2, DOOR_H+(ROOM11_H-DOOR_H)/2, centerZ);
  wLintel.rotation.y = Math.PI/2;
  scene.add(wLintel);

  const wFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const wFrameSide = new THREE.BoxGeometry(0.16, DOOR_H+0.1, 0.24);
  const wfl = new THREE.Mesh(wFrameSide, wFrameMat); wfl.position.set(cx-ROOM11_W/2, DOOR_H/2+0.05, centerZ-wGapHalf-0.1);
  const wfr = new THREE.Mesh(wFrameSide, wFrameMat); wfr.position.set(cx-ROOM11_W/2, DOOR_H/2+0.05, centerZ+wGapHalf+0.1);
  const wft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, wGapHalf*2+0.32), wFrameMat); wft.position.set(cx-ROOM11_W/2, DOOR_H+0.1, centerZ);
  scene.add(wfl, wfr, wft);

  // --- south wall with doorway gap matching corridor11's width (GATE11_GAPHALF) ---
  const gapHalf = GATE11_GAPHALF;
  const sideW = (ROOM11_W/2) - gapHalf;
  const southTex = wallTexture(); southTex.repeat.set(1.6,1.5);
  const southMat = new THREE.MeshStandardMaterial({map:southTex, roughness:0.95});

  const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM11_H), southMat);
  leftPanel.position.set(cx-(gapHalf+sideW/2), ROOM11_H/2, ROOM11_SOUTH_Z);
  leftPanel.rotation.y = Math.PI;
  scene.add(leftPanel);

  const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM11_H), southMat.clone());
  rightPanel.position.set(cx+(gapHalf+sideW/2), ROOM11_H/2, ROOM11_SOUTH_Z);
  rightPanel.rotation.y = Math.PI;
  scene.add(rightPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM11_H-DOOR_H), southMat.clone());
  lintel.position.set(cx, DOOR_H+(ROOM11_H-DOOR_H)/2, ROOM11_SOUTH_Z);
  lintel.rotation.y = Math.PI;
  scene.add(lintel);

  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(cx-gapHalf-0.1, DOOR_H/2+0.05, ROOM11_SOUTH_Z);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(cx+gapHalf+0.1, DOOR_H/2+0.05, ROOM11_SOUTH_Z);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.32, 0.18, 0.3), frameMat); ft.position.set(cx, DOOR_H+0.1, ROOM11_SOUTH_Z);
  scene.add(fl,fr,ft);

  // baseboard trim (split around all four doorways)
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimSL = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSL.position.set(cx-(gapHalf+sideW/2),0.08,ROOM11_SOUTH_Z); scene.add(trimSL);
  const trimSR = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSR.position.set(cx+(gapHalf+sideW/2),0.08,ROOM11_SOUTH_Z); scene.add(trimSR);
  const trimNL = new THREE.Mesh(new THREE.BoxGeometry(gSideW,0.15,0.1), trimMat);
  trimNL.position.set(cx-(gGapHalf+gSideW/2),0.08,ROOM11_NORTH_Z); scene.add(trimNL);
  const trimNR = new THREE.Mesh(new THREE.BoxGeometry(gSideW,0.15,0.1), trimMat);
  trimNR.position.set(cx+(gGapHalf+gSideW/2),0.08,ROOM11_NORTH_Z); scene.add(trimNR);
  const trimET = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimET.position.set(cx+ROOM11_W/2,0.08,centerZ-(eGapHalf+eSideD/2)); scene.add(trimET);
  const trimEB = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimEB.position.set(cx+ROOM11_W/2,0.08,centerZ+(eGapHalf+eSideD/2)); scene.add(trimEB);
  const trimWT = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,wSideD), trimMat);
  trimWT.position.set(cx-ROOM11_W/2,0.08,centerZ-(wGapHalf+wSideD/2)); scene.add(trimWT);
  const trimWB = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,wSideD), trimMat);
  trimWB.position.set(cx-ROOM11_W/2,0.08,centerZ+(wGapHalf+wSideD/2)); scene.add(trimWB);

  const lamp = new THREE.PointLight(0xff9748, 0.6, 5.5, 2.3);
  lamp.position.set(cx, ROOM11_H-0.3, centerZ);
  scene.add(lamp);
  room11Light = lamp;

  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.0, [cx-ROOM11_W/2+0.05, ROOM11_H-0.04, ROOM11_NORTH_Z+0.05], [0, Math.PI/4, 0], 7, 0.25);
  fan(0.95, [cx+ROOM11_W/2-0.05, ROOM11_H-0.04, ROOM11_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.3);

  // walkable zone - tight to room 11's real walls; each doorway crossing
  // (south into corridor11, east into corridor12, west into corridor13,
  // north through the gate) is handled by that connector's own bridge zone
  obstacles.push({minX:cx-ROOM11_W/2, maxX:cx+ROOM11_W/2, minZ:ROOM11_NORTH_Z, maxZ:ROOM11_SOUTH_Z, isRoomBound:true});
}

/* ---------------- room 11 gate ---------------- */
function buildRoom11Gate(){
  const cx = 0;
  const gapHalf = ROOM11_GATE_GAPHALF;

  const hingeX = cx - gapHalf;
  const hingePivot = new THREE.Object3D();
  hingePivot.position.set(hingeX, 0, ROOM11_NORTH_Z);
  scene.add(hingePivot);

  const doorTex = woodTexture('#3a2513', null);
  const doorMat = new THREE.MeshStandardMaterial({map:doorTex, roughness:0.85});
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2, DOOR_H, 0.08), doorMat);
  doorMesh.position.set(gapHalf, DOOR_H/2, 0);
  doorMesh.castShadow = true; doorMesh.receiveShadow = true;
  doorMesh.userData.gateIndex = gates.length;
  hingePivot.add(doorMesh);

  const braceMat = new THREE.MeshStandardMaterial({color:0x1c1a16, roughness:0.6, metalness:0.55});
  [0.35*DOOR_H, 0.75*DOOR_H].forEach(y=>{
    const brace = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2-0.06, 0.06, 0.1), braceMat);
    brace.position.set(gapHalf, y, 0.01);
    brace.userData.gateIndex = gates.length;
    hingePivot.add(brace);
  });

  const handleMat = new THREE.MeshStandardMaterial({color:0x1c1c1c, roughness:0.5, metalness:0.7});
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06,0.015,8,16), handleMat);
  handle.position.set(gapHalf*2-0.12, DOOR_H/2, 0.06);
  handle.rotation.x = Math.PI/2;
  handle.userData.gateIndex = gates.length;
  hingePivot.add(handle);

  gates.push({
    hingePivot, doorMesh, handle,
    isOpen: false,
    current: 0,
    openAngle: -Math.PI*0.62
  });

  obstacles.push({
    minX: hingeX-0.05, maxX: hingeX+gapHalf*2+0.05,
    minZ: ROOM11_NORTH_Z-0.12, maxZ: ROOM11_NORTH_Z+0.12,
    isGate: true, gateRef: gates[gates.length-1]
  });

  // --- short dead-end threshold beyond the gate ---
  const tCenterZ = (ROOM11_NORTH_Z + ROOM11_GATE_FAR_Z)/2;
  const tWTex = wallTexture(); tWTex.repeat.set(0.7, 1.3);
  const tWallMat = new THREE.MeshStandardMaterial({map:tWTex, roughness:0.97, metalness:0.02});
  const tFloorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.92});
  const tCeilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const tFloor = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2, ROOM11_GATE_DEPTH), tFloorMat);
  tFloor.rotation.x = -Math.PI/2;
  tFloor.position.set(cx, 0, tCenterZ);
  tFloor.receiveShadow = true;
  scene.add(tFloor);

  const tCeil = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2, ROOM11_GATE_DEPTH), tCeilMat);
  tCeil.rotation.x = Math.PI/2;
  tCeil.position.set(cx, ROOM11_H, tCenterZ);
  scene.add(tCeil);

  const tWestWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_GATE_DEPTH, ROOM11_H), tWallMat);
  tWestWall.position.set(cx-gapHalf, ROOM11_H/2, tCenterZ);
  tWestWall.rotation.y = Math.PI/2;
  scene.add(tWestWall);

  const tEastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_GATE_DEPTH, ROOM11_H), tWallMat.clone());
  tEastWall.position.set(cx+gapHalf, ROOM11_H/2, tCenterZ);
  tEastWall.rotation.y = -Math.PI/2;
  scene.add(tEastWall);

  // far wall - solid dead end (this threshold doesn't lead anywhere further)
  const farWall = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2, ROOM11_H), tWallMat.clone());
  farWall.position.set(cx, ROOM11_H/2, ROOM11_GATE_FAR_Z);
  scene.add(farWall);

  const tLantern = new THREE.PointLight(0x6a7a99, 0.35, 3.2, 2.8);
  tLantern.position.set(cx, ROOM11_H-0.25, tCenterZ);
  scene.add(tLantern);

  const web = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*1.8, ROOM11_H*0.7),
    new THREE.MeshBasicMaterial({map:cobwebTextureVariant(9,0.1), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  web.position.set(cx, ROOM11_H*0.4, tCenterZ);
  scene.add(web);

  obstacles.push({minX:cx-gapHalf, maxX:cx+gapHalf, minZ:ROOM11_GATE_FAR_Z, maxZ:ROOM11_NORTH_Z+0.5, isRoomBound:true});
}
