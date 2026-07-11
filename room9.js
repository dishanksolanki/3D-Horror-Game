/* ============================================================
   HAVELI OF SHADOWS — ROOM 9 (the hall) + corridor9, the short
   2-metre passage that connects it to room 6's north wall.
   Requires engine.js and room6.js to be loaded first (room6.js
   already builds the doorway gap in its own north wall; this
   file builds the corridor itself and room 9 on the other end,
   including room 9's own south doorway that mirrors it).
   ============================================================ */

function buildCorridor9(){
  // a tight 2-metre stone passage linking room 6's north doorway to
  // room 9's south doorway - same construction language as the corridor
  // between room 1 and room 2, just wider to match room 9's grander gate.
  const centerZ = (CORR9_SOUTH_Z + CORR9_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(1, 1.3);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR9_W, CORR9_LEN), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR9_W, CORR9_LEN), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(0, CORR9_H, centerZ);
  scene.add(ceil);

  // solid side walls - these are the only walls of the corridor, so the
  // player can only ever pass through via the doorways at each end, never
  // through a side
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR9_LEN, CORR9_H), wallMat);
  westWall.position.set(-CORR9_W/2, CORR9_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR9_LEN, CORR9_H), wallMat.clone());
  eastWall.position.set(CORR9_W/2, CORR9_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // baseboard trim along both sides
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [-CORR9_W/2, CORR9_W/2].forEach(x=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,CORR9_LEN), trimMat);
    trim.position.set(x,0.08,centerZ);
    scene.add(trim);
  });

  // a single weak, unsteady lantern - same mood as the other passages
  const lantern = new THREE.PointLight(0xffb95a, 0.5, 4.2, 2.6);
  lantern.position.set(0, CORR9_H-0.18, centerZ);
  scene.add(lantern);
  corridor9Light = lantern;

  // cobwebs strung across the low ceiling and tucked in the corners
  const cw = (w,h,pos,rot)=>{
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    mesh.position.set(...pos); mesh.rotation.set(...rot);
    scene.add(mesh);
  };
  cw(CORR9_W*0.9, 0.5, [0, CORR9_H-0.1, centerZ], [0,0,0]);
  cw(0.6, 0.35, [-CORR9_W/2+0.04, CORR9_H*0.62, CORR9_SOUTH_Z-0.35], [0,Math.PI/2,0]);
  cw(0.55,0.32, [CORR9_W/2-0.04, CORR9_H*0.55, CORR9_NORTH_Z+0.35], [0,-Math.PI/2,0]);

  // walkable zone, overlapping slightly into room 6 and room 9 so the
  // transition through both doorways is seamless. Note this zone stops
  // exactly at the corridor's own width (CORR9_W) - it does NOT extend
  // sideways, so a player can never walk "through" the side walls, only
  // straight along the passage and out one of the two doorways.
  obstacles.push({minX:-CORR9_W/2, maxX:CORR9_W/2, minZ:CORR9_NORTH_Z-1.0, maxZ:CORR9_SOUTH_Z+1.0, isRoomBound:true});
}

function buildRoom9(){
  // room 9: the hall. Reached only via corridor9, off room 6's north
  // wall. East and west walls are solid dead ends for now - the south
  // wall carries the doorway back to corridor9, and the north wall now
  // carries a second doorway straight through into room 10.
  const cx = 0;
  const centerZ = (ROOM9_SOUTH_Z + ROOM9_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(5, 1.7);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_W, ROOM9_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_W, ROOM9_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM9_H, centerZ);
  scene.add(ceil);

  // north wall - now carries a doorway gap into room 10 (was a solid
  // dead-end). This is a DIRECT wall-shared doorway, not through a
  // corridor, so room 10 draws its own matching south-wall panels facing
  // back into this same gap (see room10.js) - a single shared wall would
  // only render from whichever side built it, since planes are one-sided.
  const nGapHalf = GATE10_GAPHALF;
  const nSideW = (ROOM9_W/2) - nGapHalf;
  const nTex = wallTexture(); nTex.repeat.set(1.6,1.7);
  const nMat = new THREE.MeshStandardMaterial({map:nTex, roughness:0.95, metalness:0.02});

  const nLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM9_H), nMat);
  nLeftPanel.position.set(cx-(nGapHalf+nSideW/2), ROOM9_H/2, ROOM9_NORTH_Z);
  scene.add(nLeftPanel);

  const nRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM9_H), nMat.clone());
  nRightPanel.position.set(cx+(nGapHalf+nSideW/2), ROOM9_H/2, ROOM9_NORTH_Z);
  scene.add(nRightPanel);

  const nLintel = new THREE.Mesh(new THREE.PlaneGeometry(nGapHalf*2+0.4, ROOM9_H-DOOR_H), nMat.clone());
  nLintel.position.set(cx, DOOR_H+(ROOM9_H-DOOR_H)/2, ROOM9_NORTH_Z);
  scene.add(nLintel);

  // carved wooden door frame on room 9's side of the opening
  const nFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const nFrameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const nfl = new THREE.Mesh(nFrameSide, nFrameMat); nfl.position.set(cx-nGapHalf-0.1, DOOR_H/2+0.05, ROOM9_NORTH_Z);
  const nfr = new THREE.Mesh(nFrameSide, nFrameMat); nfr.position.set(cx+nGapHalf+0.1, DOOR_H/2+0.05, ROOM9_NORTH_Z);
  const nft = new THREE.Mesh(new THREE.BoxGeometry(nGapHalf*2+0.32, 0.18, 0.3), nFrameMat); nft.position.set(cx, DOOR_H+0.1, ROOM9_NORTH_Z);
  scene.add(nfl, nfr, nft);

  // east wall - solid
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_D, ROOM9_H), wallMat.clone());
  eastWall.position.set(cx+ROOM9_W/2, ROOM9_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // west wall - solid
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_D, ROOM9_H), wallMat.clone());
  westWall.position.set(cx-ROOM9_W/2, ROOM9_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // south wall with a doorway gap matching corridor9's width, mirroring
  // the room1/room2 doorway pattern (this is the ONLY opening into room 9)
  const gapHalf = GATE9_GAPHALF;
  const sideW = (ROOM9_W/2) - gapHalf;
  const southTex = wallTexture(); southTex.repeat.set(1.6,1.7);
  const southMat = new THREE.MeshStandardMaterial({map:southTex, roughness:0.95});

  const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM9_H), southMat);
  leftPanel.position.set(cx-(gapHalf+sideW/2), ROOM9_H/2, ROOM9_SOUTH_Z);
  leftPanel.rotation.y = Math.PI;
  scene.add(leftPanel);

  const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM9_H), southMat.clone());
  rightPanel.position.set(cx+(gapHalf+sideW/2), ROOM9_H/2, ROOM9_SOUTH_Z);
  rightPanel.rotation.y = Math.PI;
  scene.add(rightPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM9_H-DOOR_H), southMat.clone());
  lintel.position.set(cx, DOOR_H+(ROOM9_H-DOOR_H)/2, ROOM9_SOUTH_Z);
  lintel.rotation.y = Math.PI;
  scene.add(lintel);

  // carved wooden door frame, a touch grander given room 9's scale
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.14, 0.34);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(cx-gapHalf-0.12, DOOR_H/2+0.07, ROOM9_SOUTH_Z);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(cx+gapHalf+0.12, DOOR_H/2+0.07, ROOM9_SOUTH_Z);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.44, 0.2, 0.34), frameMat); ft.position.set(cx, DOOR_H+0.12, ROOM9_SOUTH_Z);
  scene.add(fl,fr,ft);

  // baseboard trim - north trim now splits either side of the room 10
  // doorway instead of running solid across the whole wall
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimNL = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNL.position.set(cx-(nGapHalf+nSideW/2),0.08,ROOM9_NORTH_Z); scene.add(trimNL);
  const trimNR = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNR.position.set(cx+(nGapHalf+nSideW/2),0.08,ROOM9_NORTH_Z); scene.add(trimNR);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM9_D), trimMat);
  trimE.position.set(cx+ROOM9_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM9_D), trimMat);
  trimW.position.set(cx-ROOM9_W/2,0.08,centerZ); scene.add(trimW);

  // a pair of weak lanterns down the hall's length, befitting its size
  const lampA = new THREE.PointLight(0xffcf7a, 0.7, 6.5, 2.2);
  lampA.position.set(cx, ROOM9_H-0.3, ROOM9_SOUTH_Z-2.2);
  scene.add(lampA);
  room9Light = lampA;

  const lampB = new THREE.PointLight(0xffcf7a, 0.55, 6, 2.2);
  lampB.position.set(cx, ROOM9_H-0.3, ROOM9_NORTH_Z+2.4);
  scene.add(lampB);

  // cobwebs tucked into the far corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.3, [cx-ROOM9_W/2+0.05, ROOM9_H-0.04, ROOM9_NORTH_Z+0.05], [0, Math.PI/4, 0], 8, 0.15);
  fan(1.2, [cx+ROOM9_W/2-0.05, ROOM9_H-0.04, ROOM9_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 8, 0.2);

  // walkable zone - tight to room 9's own real walls (no padding), so
  // the solid east/west wall panels and the solid stretches either side
  // of both doorways actually block movement
  obstacles.push({minX:cx-ROOM9_W/2, maxX:cx+ROOM9_W/2, minZ:ROOM9_NORTH_Z, maxZ:ROOM9_SOUTH_Z, isRoomBound:true});

  // doorway bridge -> room 10 (north wall gap only). This is a direct,
  // no-corridor doorway, so - like room3's bridge into room5 - a narrow
  // zone spanning only the gap's width is pushed here, overlapping 1m
  // into each room, so the solid wall panels on either side of the gap
  // stay impassable while the gap itself feels seamless to cross.
  obstacles.push({minX:cx-nGapHalf, maxX:cx+nGapHalf, minZ:ROOM9_NORTH_Z-1.0, maxZ:ROOM9_NORTH_Z+1.0, isRoomBound:true});
}

/* ---------------- room 9 hall furniture ---------------- */

function makeStonePillar(radius, height, pos){
  const group = new THREE.Group();
  const stoneMat = new THREE.MeshStandardMaterial({color:0x2c261e, roughness:0.92});
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius*1.08, height, 12), stoneMat);
  shaft.position.y = height/2;
  shaft.castShadow = true; shaft.receiveShadow = true;
  group.add(shaft);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius*1.35, radius*1.4, 0.12, 12), stoneMat);
  base.position.y = 0.06;
  group.add(base);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius*1.3, radius*1.15, 0.12, 12), stoneMat);
  cap.position.y = height - 0.06;
  group.add(cap);
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function buildRoom9Furniture(){
  const cx = 0;

  // --- two rows of stone pillars flanking the hall's central walkway,
  // giving it the grand, processional feel a "hall" ought to have ---
  const pillarZs = [ROOM9_SOUTH_Z-2.4, ROOM9_SOUTH_Z-5.0, ROOM9_SOUTH_Z-7.6];
  pillarZs.forEach(z=>{
    makeStonePillar(0.18, ROOM9_H-0.05, [cx-2.1, 0, z]);
    makeStonePillar(0.18, ROOM9_H-0.05, [cx+2.1, 0, z]);
    obstacles.push(boxFor(new THREE.Vector3(cx-2.1,0,z), 0.28, 0.28, 0.05));
    obstacles.push(boxFor(new THREE.Vector3(cx+2.1,0,z), 0.28, 0.28, 0.05));
  });

  // --- a long, threadbare runner rug down the centre of the hall ---
  const rugMat = new THREE.MeshStandardMaterial({map:shrineClothTexture(), roughness:0.9, transparent:true});
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.4, ROOM9_D-1.6), rugMat);
  rug.rotation.x = -Math.PI/2;
  rug.position.set(cx, 0.006, (ROOM9_SOUTH_Z+ROOM9_NORTH_Z)/2);
  scene.add(rug);

  // --- cobwebs strung between the near pair of pillars, low over the
  // walkway, consistent with the rest of the neglected haveli ---
  const strand = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(cx, ROOM9_H-0.4, ROOM9_SOUTH_Z-2.4);
  scene.add(strand);
}
