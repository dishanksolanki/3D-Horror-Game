/* ============================================================
   HAVELI OF SHADOWS — ROOM 11 (a small, now-bare chamber) +
   corridor11, the extremely short 0.25-metre stone connector linking
   it to room 10's north wall. Room 11 also has its own openable/
   closable gate on the OPPOSITE (north) wall, with a short dead-end
   threshold beyond it - see buildRoom11Gate(). Requires engine.js and
   room10.js to be loaded first (room10.js already cuts the doorway
   gap into its own north wall; this file builds the short connector
   itself and room 11 on the other end, including room 11's own south
   doorway that mirrors it).
   ============================================================ */

function buildCorridor11(){
  // an unusually tight stone connector - just 0.25m long, more like a
  // thick doorway threshold than a proper passage (unlike corridor9's
  // full 2m stretch) - but built the same way: floor/ceiling/side walls,
  // its own lantern, and a walkable zone bridging both doorways.
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

  // solid side walls - short stubs given how tight this connector is,
  // but they still keep the player from slipping through the sides
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_LEN, CORR11_H), wallMat);
  westWall.position.set(-CORR11_W/2, CORR11_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_LEN, CORR11_H), wallMat.clone());
  eastWall.position.set(CORR11_W/2, CORR11_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // baseboard trim along both sides
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [-CORR11_W/2, CORR11_W/2].forEach(x=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,CORR11_LEN), trimMat);
    trim.position.set(x,0.08,centerZ);
    scene.add(trim);
  });

  // a single weak, guttering diya-style lantern set into the threshold
  const lantern = new THREE.PointLight(0xff9d4a, 0.45, 3.6, 2.6);
  lantern.position.set(0, CORR11_H-0.2, centerZ);
  scene.add(lantern);
  corridor11Light = lantern;

  // a torn cobweb strand across the tight opening, since almost nothing
  // ever passes through here
  const strand = new THREE.Mesh(new THREE.PlaneGeometry(CORR11_W*0.85, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(0, CORR11_H-0.45, centerZ);
  scene.add(strand);

  // walkable zone, overlapping slightly into room10 and room11 so the
  // transition through both doorways is seamless despite how short this
  // connector is. Stops exactly at CORR11_W sideways, same as every
  // other corridor's zone.
  obstacles.push({minX:-CORR11_W/2, maxX:CORR11_W/2, minZ:CORR11_NORTH_Z-1.0, maxZ:CORR11_SOUTH_Z+1.0, isRoomBound:true});
}

function buildRoom11(){
  // room 11: a small, now-bare chamber, reached only via corridor11 off
  // room 10's north wall. East and west walls are solid dead ends for
  // now - the south wall carries the doorway back through corridor11 to
  // room 10, and the north wall carries the openable/closable gate
  // (built in buildRoom11Gate() below).
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

  // north wall - now carries a gap for the gate (opposite room 11's
  // south/corridor11 connection), matching ROOM11_GATE_GAPHALF. The
  // door leaf itself, its hinge, and the little threshold beyond are
  // built in buildRoom11Gate() below.
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

  // carved stone frame around the gate opening, heavier-looking than
  // the wooden doorway frames elsewhere, to set the gate apart
  const gFrameMat = new THREE.MeshStandardMaterial({color:0x22190f, roughness:0.9});
  const gFrameSide = new THREE.BoxGeometry(0.28, DOOR_H+0.14, 0.2);
  const gfl = new THREE.Mesh(gFrameSide, gFrameMat); gfl.position.set(cx-gGapHalf-0.12, DOOR_H/2+0.07, ROOM11_NORTH_Z);
  const gfr = new THREE.Mesh(gFrameSide, gFrameMat); gfr.position.set(cx+gGapHalf+0.12, DOOR_H/2+0.07, ROOM11_NORTH_Z);
  const gft = new THREE.Mesh(new THREE.BoxGeometry(gGapHalf*2+0.4, 0.2, 0.34), gFrameMat); gft.position.set(cx, DOOR_H+0.12, ROOM11_NORTH_Z);
  scene.add(gfl, gfr, gft);

  // east wall - solid
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_D, ROOM11_H), wallMat.clone());
  eastWall.position.set(cx+ROOM11_W/2, ROOM11_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // west wall - solid
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_D, ROOM11_H), wallMat.clone());
  westWall.position.set(cx-ROOM11_W/2, ROOM11_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // south wall with a doorway gap matching corridor11's own width
  // (GATE11_GAPHALF) exactly, so the panels line up seamlessly with
  // room10's north-facing ones on the far side of the connector. These
  // panels face back INTO room 11 (rotation.y = PI).
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

  // carved wooden door frame on room 11's side of the same opening
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(cx-gapHalf-0.1, DOOR_H/2+0.05, ROOM11_SOUTH_Z);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(cx+gapHalf+0.1, DOOR_H/2+0.05, ROOM11_SOUTH_Z);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.32, 0.18, 0.3), frameMat); ft.position.set(cx, DOOR_H+0.1, ROOM11_SOUTH_Z);
  scene.add(fl,fr,ft);

  // baseboard trim - south trim splits either side of the doorway, the
  // other three walls are solid so their trim runs unbroken
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimSL = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSL.position.set(cx-(gapHalf+sideW/2),0.08,ROOM11_SOUTH_Z); scene.add(trimSL);
  const trimSR = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSR.position.set(cx+(gapHalf+sideW/2),0.08,ROOM11_SOUTH_Z); scene.add(trimSR);
  const trimNL = new THREE.Mesh(new THREE.BoxGeometry(gSideW,0.15,0.1), trimMat);
  trimNL.position.set(cx-(gGapHalf+gSideW/2),0.08,ROOM11_NORTH_Z); scene.add(trimNL);
  const trimNR = new THREE.Mesh(new THREE.BoxGeometry(gSideW,0.15,0.1), trimMat);
  trimNR.position.set(cx+(gGapHalf+gSideW/2),0.08,ROOM11_NORTH_Z); scene.add(trimNR);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM11_D), trimMat);
  trimE.position.set(cx+ROOM11_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM11_D), trimMat);
  trimW.position.set(cx-ROOM11_W/2,0.08,centerZ); scene.add(trimW);

  // a single weak, guttering lantern hung centrally, now that the room
  // is otherwise bare (its furniture removed)
  const lamp = new THREE.PointLight(0xff9748, 0.6, 5.5, 2.3);
  lamp.position.set(cx, ROOM11_H-0.3, centerZ);
  scene.add(lamp);
  room11Light = lamp;

  // cobwebs tucked into the far (north) corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.0, [cx-ROOM11_W/2+0.05, ROOM11_H-0.04, ROOM11_NORTH_Z+0.05], [0, Math.PI/4, 0], 7, 0.25);
  fan(0.95, [cx+ROOM11_W/2-0.05, ROOM11_H-0.04, ROOM11_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.3);

  // walkable zone - tight to room 11's own real walls (no padding), so
  // the solid east/west wall panels and the solid stretches either side
  // of the north gate actually block movement. The doorway crossing
  // back into corridor11 (south) is handled by corridor11's own bridge
  // zone. The gate's own obstacle + threshold zone are added in
  // buildRoom11Gate() below.
  obstacles.push({minX:cx-ROOM11_W/2, maxX:cx+ROOM11_W/2, minZ:ROOM11_NORTH_Z, maxZ:ROOM11_SOUTH_Z, isRoomBound:true});
}

/* ---------------- room 11 gate ---------------- */

function buildRoom11Gate(){
  // the gate itself: a hinged stone-bound wooden door filling the gap
  // cut into room 11's north wall (buildRoom11() above), plus a short,
  // fog-choked threshold just beyond it - dead-ended for now, ready for
  // a future room 12. The door opens/closes on click, same interaction
  // style as the almirah drawers and storage chest lids.
  const cx = 0;
  const gapHalf = ROOM11_GATE_GAPHALF;

  // --- the door leaf, hinged on its west edge (rotates on the Y axis) ---
  const hingeX = cx - gapHalf;
  const hingePivot = new THREE.Object3D();
  hingePivot.position.set(hingeX, 0, ROOM11_NORTH_Z);
  scene.add(hingePivot);

  const doorTex = woodTexture('#3a2513', null);
  const doorMat = new THREE.MeshStandardMaterial({map:doorTex, roughness:0.85});
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2, DOOR_H, 0.08), doorMat);
  doorMesh.position.set(gapHalf, DOOR_H/2, 0); // shifted so the door's own west edge sits at the hinge (local x=0)
  doorMesh.castShadow = true; doorMesh.receiveShadow = true;
  doorMesh.userData.gateIndex = gates.length;
  hingePivot.add(doorMesh);

  // a couple of iron cross-braces for a heavier, older look
  const braceMat = new THREE.MeshStandardMaterial({color:0x1c1a16, roughness:0.6, metalness:0.55});
  [0.35*DOOR_H, 0.75*DOOR_H].forEach(y=>{
    const brace = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2-0.06, 0.06, 0.1), braceMat);
    brace.position.set(gapHalf, y, 0.01);
    brace.userData.gateIndex = gates.length;
    hingePivot.add(brace);
  });

  // an iron ring handle on the door's free (east) edge
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
    openAngle: -Math.PI*0.62 // swings inward into room 11, same family as the storage chest lid
  });

  // an obstacle box sitting exactly at the gate, blocking movement
  // whenever the door is closed - skipped automatically in tryMove()
  // once the door has actually swung open (see engine.js)
  obstacles.push({
    minX: hingeX-0.05, maxX: hingeX+gapHalf*2+0.05,
    minZ: ROOM11_NORTH_Z-0.12, maxZ: ROOM11_NORTH_Z+0.12,
    isGate: true, gateRef: gates[gates.length-1]
  });

  // --- the short threshold beyond the gate: floor/ceiling/side walls
  // and a solid dead-end far wall, so opening the gate reveals a small
  // fog-choked space rather than a void ---
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

  // the dead-end far wall - solid for now
  const tFarWall = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2, ROOM11_H), tWallMat.clone());
  tFarWall.position.set(cx, ROOM11_H/2, ROOM11_GATE_FAR_Z);
  scene.add(tFarWall);

  // a single guttering, colder lantern - deeper and lonelier feeling
  // than anything in room 11 proper
  const tLantern = new THREE.PointLight(0x6a7a99, 0.35, 3.2, 2.8);
  tLantern.position.set(cx, ROOM11_H-0.25, tCenterZ);
  scene.add(tLantern);

  // a heavy cobweb curtain across the threshold, undisturbed for a
  // long time behind the closed gate
  const web = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*1.8, ROOM11_H*0.7),
    new THREE.MeshBasicMaterial({map:cobwebTextureVariant(9,0.1), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  web.position.set(cx, ROOM11_H*0.4, tCenterZ);
  scene.add(web);

  // walkable zone for the threshold, overlapping back into room 11 so
  // crossing the gate (once open) feels seamless
  obstacles.push({minX:cx-gapHalf, maxX:cx+gapHalf, minZ:ROOM11_GATE_FAR_Z, maxZ:ROOM11_NORTH_Z+0.5, isRoomBound:true});
}
