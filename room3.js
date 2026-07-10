/* ============================================================
   HAVELI OF SHADOWS — ROOM 3 + the east branch corridor that
   opens off Room 2's east wall.
   Requires engine.js and room2.js to be loaded first.
============================================================ */

function buildCorridor2(){
  // a second passage, running EAST from a new gate in room 2's own east
  // wall, out to room 3's doorway. Aligned to room 2's z-center so room 3
  // sits flush beside room 2. Same materials/scale language as the first
  // corridor so it reads as part of the same haveli.
  const centerX = (CORR2_WEST_X + CORR2_EAST_X)/2;

  const wTex = wallTexture(); wTex.repeat.set(1, 1.3);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR2_LEN, CORR2_GAPHALF*2), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, ROOM2_CENTER_Z);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR2_LEN, CORR2_GAPHALF*2), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, CORR2_H, ROOM2_CENTER_Z);
  scene.add(ceil);

  // south wall (runs east-west, along local length)
  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR2_LEN, CORR2_H), wallMat);
  southWall.position.set(centerX, CORR2_H/2, CORR2_SOUTH_Z);
  scene.add(southWall);

  // north wall
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR2_LEN, CORR2_H), wallMat.clone());
  northWall.position.set(centerX, CORR2_H/2, CORR2_NORTH_Z);
  northWall.rotation.y = Math.PI;
  scene.add(northWall);

  // baseboard trim along both sides
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [CORR2_SOUTH_Z, CORR2_NORTH_Z].forEach(z=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(CORR2_LEN,0.15,0.1), trimMat);
    trim.position.set(centerX,0.08,z);
    scene.add(trim);
  });

  // a single weak bulb, matching the mood of the first corridor
  const lantern = new THREE.PointLight(0xffb95a, 0.5, 4.2, 2.6);
  lantern.position.set(centerX, CORR2_H-0.18, ROOM2_CENTER_Z);
  scene.add(lantern);
  corridor2Light = lantern;

  // cobwebs tucked in the corners
  const cw = (w,h,pos,rot)=>{
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    mesh.position.set(...pos); mesh.rotation.set(...rot);
    scene.add(mesh);
  };
  cw((CORR2_GAPHALF*2)*0.9, 0.5, [centerX, CORR2_H-0.1, ROOM2_CENTER_Z], [0,Math.PI/2,0]);

  // walkable zone, overlapping slightly into the main corridor and room 3
  obstacles.push({minX:CORR2_WEST_X-1.0, maxX:CORR2_EAST_X+1.0, minZ:CORR2_SOUTH_Z, maxZ:CORR2_NORTH_Z, isRoomBound:true});
}

function buildRoom3(){
  // room 3: sits flush beside room 2 (same z-center), entered from the
  // corridor2 branch that opens off room 2's own east wall. West wall
  // carries that doorway. East wall now also carries a doorway, opening
  // straight into room 5 (no corridor between them). North/south walls
  // are still solid dead-ends for now.
  const cz = ROOM3_CENTER_Z;
  const centerX = (ROOM3_WEST_X + ROOM3_EAST_X)/2;

  const wTex = wallTexture(); wTex.repeat.set(4, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM3_D, ROOM3_W), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM3_D, ROOM3_W), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, ROOM3_H, cz);
  scene.add(ceil);

  // east wall with a doorway gap -> straight into room 5
  const eGapHalf = DOOR35_GAPHALF;
  const eSideD = (ROOM3_W/2) - eGapHalf;
  const eastTex = wallTexture(); eastTex.repeat.set(1.4,1.5);
  const eastMat = new THREE.MeshStandardMaterial({map:eastTex, roughness:0.95, metalness:0.02, side:THREE.DoubleSide});

  const eNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM3_H), eastMat);
  eNearPanel.position.set(ROOM3_EAST_X, ROOM3_H/2, cz-(eGapHalf+eSideD/2));
  eNearPanel.rotation.y = -Math.PI/2;
  scene.add(eNearPanel);

  const eFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM3_H), eastMat.clone());
  eFarPanel.position.set(ROOM3_EAST_X, ROOM3_H/2, cz+(eGapHalf+eSideD/2));
  eFarPanel.rotation.y = -Math.PI/2;
  scene.add(eFarPanel);

  const eLintel = new THREE.Mesh(new THREE.PlaneGeometry(eGapHalf*2+0.4, ROOM3_H-DOOR_H), eastMat.clone());
  eLintel.position.set(ROOM3_EAST_X, DOOR_H+(ROOM3_H-DOOR_H)/2, cz);
  eLintel.rotation.y = -Math.PI/2;
  scene.add(eLintel);

  // carved wooden door frame (east doorway)
  const eFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const eFrameSide = new THREE.BoxGeometry(0.3, DOOR_H+0.1, 0.18);
  const efn = new THREE.Mesh(eFrameSide, eFrameMat); efn.position.set(ROOM3_EAST_X, DOOR_H/2+0.05, cz-eGapHalf-0.09);
  const efs = new THREE.Mesh(eFrameSide, eFrameMat); efs.position.set(ROOM3_EAST_X, DOOR_H/2+0.05, cz+eGapHalf+0.09);
  const eft = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,eGapHalf*2+0.36), eFrameMat); eft.position.set(ROOM3_EAST_X,DOOR_H+0.1,cz);
  scene.add(efn,efs,eft);

  // north and south walls, solid for now
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM3_D, ROOM3_H), wallMat.clone());
  northWall.position.set(centerX, ROOM3_H/2, cz-ROOM3_W/2);
  scene.add(northWall);

  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM3_D, ROOM3_H), wallMat.clone());
  southWall.position.set(centerX, ROOM3_H/2, cz+ROOM3_W/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // west wall with a doorway gap matching corridor2's width, mirroring the
  // room1/room2 doorway pattern
  const gapHalf = CORR2_GAPHALF;
  const sideD = (ROOM3_W/2) - gapHalf;
  const westTex = wallTexture(); westTex.repeat.set(1.4,1.5);
  const westMat = new THREE.MeshStandardMaterial({map:westTex, roughness:0.95});

  const nearPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM3_H), westMat);
  nearPanel.position.set(ROOM3_WEST_X, ROOM3_H/2, cz-(gapHalf+sideD/2));
  nearPanel.rotation.y = Math.PI/2;
  scene.add(nearPanel);

  const farPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM3_H), westMat.clone());
  farPanel.position.set(ROOM3_WEST_X, ROOM3_H/2, cz+(gapHalf+sideD/2));
  farPanel.rotation.y = Math.PI/2;
  scene.add(farPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM3_H-DOOR_H), westMat.clone());
  lintel.position.set(ROOM3_WEST_X, DOOR_H+(ROOM3_H-DOOR_H)/2, cz);
  lintel.rotation.y = Math.PI/2;
  scene.add(lintel);

  // carved wooden door frame
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.3, DOOR_H+0.1, 0.18);
  const fn = new THREE.Mesh(frameSide, frameMat); fn.position.set(ROOM3_WEST_X, DOOR_H/2+0.05, cz-gapHalf-0.09);
  const fs = new THREE.Mesh(frameSide, frameMat); fs.position.set(ROOM3_WEST_X, DOOR_H/2+0.05, cz+gapHalf+0.09);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,gapHalf*2+0.36), frameMat); ft.position.set(ROOM3_WEST_X,DOOR_H+0.1,cz);
  scene.add(fn,fs,ft);

  // baseboard trim
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM3_D,0.15,0.1), trimMat);
  trimN.position.set(centerX,0.08,cz-ROOM3_W/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM3_D,0.15,0.1), trimMat);
  trimS.position.set(centerX,0.08,cz+ROOM3_W/2); scene.add(trimS);

  // a single weak bulb, same placeholder lighting used for room 2 before its
  // furniture pass
  const bulb = new THREE.PointLight(0xffcf7a, 0.8, 6, 2.2);
  bulb.position.set(centerX, ROOM3_H-0.25, cz);
  scene.add(bulb);
  room3Light = bulb;

  // cobwebs in the corners
  const fanMat = (density,torn)=> new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size), fanMat(density,torn));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.2, [ROOM3_WEST_X+0.05, ROOM3_H-0.04, cz-ROOM3_W/2+0.05], [0, Math.PI/4, 0], 7, 0.2);
  fan(1.1, [ROOM3_WEST_X+0.03, ROOM3_H-0.04, cz+ROOM3_W/2-0.05], [0, -Math.PI/4, 0], 6, 0.2);

  // walkable zone - stops exactly at the wall on every side
  obstacles.push({minX:ROOM3_WEST_X, maxX:ROOM3_EAST_X, minZ:cz-ROOM3_W/2, maxZ:cz+ROOM3_W/2, isRoomBound:true});

  // a narrow bridge zone, only as wide as the doorway gap itself, so the
  // player can only cross into room 5 through the actual opening and is
  // blocked everywhere else along the shared wall
  obstacles.push({minX:ROOM3_EAST_X-0.6, maxX:ROOM5_WEST_X+0.6, minZ:cz-eGapHalf, maxZ:cz+eGapHalf, isRoomBound:true});
}
