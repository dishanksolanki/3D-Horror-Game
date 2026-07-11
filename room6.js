/* ============================================================
   HAVELI OF SHADOWS — ROOM 6 (the ancestor's shrine)
   Opens directly off room 2's north wall - no corridor, the
   doorway sits right in the wall the shrine shares with room 2.
   Requires engine.js and room2.js to be loaded first (room2.js
   builds the shared doorway wall; this file only needs to add
   the other three walls, floor, ceiling, and furniture).

   UPDATE: room6 is no longer a dead end on the east/west sides.
   room7.js opens off this room's east wall and room8.js opens
   off this room's west wall (see the notes in those files), so
   both walls now carry a doorway gap (GATE7_GAPHALF / GATE8_GAPHALF,
   both defined in engine.js) instead of being built solid.
   Requires room7.js and room8.js to be loaded after this file.
============================================================ */
function buildRoom6(){
  const cx = 0;
  const centerZ = (ROOM6_SOUTH_Z + ROOM6_NORTH_Z)/2;

  const wTex = wallTexture(); wTex.repeat.set(3, 1.4);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM6_W, ROOM6_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM6_W, ROOM6_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM6_H, centerZ);
  scene.add(ceil);

  // north wall - solid, backs the shrine altar
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM6_W, ROOM6_H), wallMat);
  northWall.position.set(cx, ROOM6_H/2, ROOM6_NORTH_Z);
  scene.add(northWall);

  // east wall - carries a doorway gap -> room 7, matching the
  // panel+lintel+frame pattern used for every other doorway in the haveli
  const eGapHalf = GATE7_GAPHALF;
  const eSideD = (ROOM6_D/2) - eGapHalf;
  const eTex = wallTexture(); eTex.repeat.set(1.4, 1.5);
  const eMat = new THREE.MeshStandardMaterial({map:eTex, roughness:0.95, metalness:0.02});

  const eNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM6_H), eMat);
  eNearPanel.position.set(cx+ROOM6_W/2, ROOM6_H/2, centerZ-(eGapHalf+eSideD/2));
  eNearPanel.rotation.y = -Math.PI/2;
  scene.add(eNearPanel);

  const eFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM6_H), eMat.clone());
  eFarPanel.position.set(cx+ROOM6_W/2, ROOM6_H/2, centerZ+(eGapHalf+eSideD/2));
  eFarPanel.rotation.y = -Math.PI/2;
  scene.add(eFarPanel);

  const eLintel = new THREE.Mesh(new THREE.PlaneGeometry(eGapHalf*2+0.4, ROOM6_H-DOOR_H), eMat.clone());
  eLintel.position.set(cx+ROOM6_W/2, DOOR_H+(ROOM6_H-DOOR_H)/2, centerZ);
  eLintel.rotation.y = -Math.PI/2;
  scene.add(eLintel);

  const eFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const eFrameSide = new THREE.BoxGeometry(0.3, DOOR_H+0.1, 0.18);
  const efn = new THREE.Mesh(eFrameSide, eFrameMat); efn.position.set(cx+ROOM6_W/2, DOOR_H/2+0.05, centerZ-eGapHalf-0.09);
  const efs = new THREE.Mesh(eFrameSide, eFrameMat); efs.position.set(cx+ROOM6_W/2, DOOR_H/2+0.05, centerZ+eGapHalf+0.09);
  const eft = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,eGapHalf*2+0.36), eFrameMat); eft.position.set(cx+ROOM6_W/2,DOOR_H+0.1,centerZ);
  scene.add(efn,efs,eft);

  // west wall - carries a doorway gap -> room 8, same pattern
  const wGapHalf = GATE8_GAPHALF;
  const wSideD = (ROOM6_D/2) - wGapHalf;
  const wTex2 = wallTexture(); wTex2.repeat.set(1.4, 1.5);
  const wMat2 = new THREE.MeshStandardMaterial({map:wTex2, roughness:0.95, metalness:0.02});

  const wNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM6_H), wMat2);
  wNearPanel.position.set(cx-ROOM6_W/2, ROOM6_H/2, centerZ-(wGapHalf+wSideD/2));
  wNearPanel.rotation.y = Math.PI/2;
  scene.add(wNearPanel);

  const wFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(wSideD, ROOM6_H), wMat2.clone());
  wFarPanel.position.set(cx-ROOM6_W/2, ROOM6_H/2, centerZ+(wGapHalf+wSideD/2));
  wFarPanel.rotation.y = Math.PI/2;
  scene.add(wFarPanel);

  const wLintel = new THREE.Mesh(new THREE.PlaneGeometry(wGapHalf*2+0.4, ROOM6_H-DOOR_H), wMat2.clone());
  wLintel.position.set(cx-ROOM6_W/2, DOOR_H+(ROOM6_H-DOOR_H)/2, centerZ);
  wLintel.rotation.y = Math.PI/2;
  scene.add(wLintel);

  const wFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const wFrameSide = new THREE.BoxGeometry(0.3, DOOR_H+0.1, 0.18);
  const wfn = new THREE.Mesh(wFrameSide, wFrameMat); wfn.position.set(cx-ROOM6_W/2, DOOR_H/2+0.05, centerZ-wGapHalf-0.09);
  const wfs = new THREE.Mesh(wFrameSide, wFrameMat); wfs.position.set(cx-ROOM6_W/2, DOOR_H/2+0.05, centerZ+wGapHalf+0.09);
  const wft = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.18,wGapHalf*2+0.36), wFrameMat); wft.position.set(cx-ROOM6_W/2,DOOR_H+0.1,centerZ);
  scene.add(wfn,wfs,wft);

  // note: the south wall (the doorway back into room 2) is built once, by
  // buildRoom2() in room2.js, so it isn't duplicated here.

  // baseboard trim - the north wall trim runs solid (no doorway there);
  // the east/west trims are split either side of their new doorway gaps
  // instead of running solid across the whole wall. The south threshold
  // trim is already laid down by room 2's own doorway construction.
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM6_W,0.15,0.1), trimMat);
  trimN.position.set(cx,0.08,ROOM6_NORTH_Z); scene.add(trimN);

  const trimENear = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimENear.position.set(cx+ROOM6_W/2,0.08,centerZ-(eGapHalf+eSideD/2)); scene.add(trimENear);
  const trimEFar = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimEFar.position.set(cx+ROOM6_W/2,0.08,centerZ+(eGapHalf+eSideD/2)); scene.add(trimEFar);

  const trimWNear = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,wSideD), trimMat);
  trimWNear.position.set(cx-ROOM6_W/2,0.08,centerZ-(wGapHalf+wSideD/2)); scene.add(trimWNear);
  const trimWFar = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,wSideD), trimMat);
  trimWFar.position.set(cx-ROOM6_W/2,0.08,centerZ+(wGapHalf+wSideD/2)); scene.add(trimWFar);

  // dim, unsteady oil-lamp glow is the only light source in the shrine
  const glow = new THREE.PointLight(0xff9a3d, 0.55, 5, 2.4);
  glow.position.set(cx, 1.2, ROOM6_NORTH_Z+0.9);
  scene.add(glow);
  room6Light = glow;

  // cobwebs tucked in the back corners, consistent with the rest of the haveli
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.0, [cx-ROOM6_W/2+0.05, ROOM6_H-0.04, ROOM6_NORTH_Z+0.05], [0, Math.PI/4, 0], 7, 0.2);
  fan(0.9, [cx+ROOM6_W/2-0.05, ROOM6_H-0.04, ROOM6_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.25);

  // walkable zone, overlapping south into room 2 so the shared doorway
  // feels seamless in both directions
  obstacles.push({minX:cx-ROOM6_W/2, maxX:cx+ROOM6_W/2, minZ:ROOM6_NORTH_Z, maxZ:ROOM6_SOUTH_Z+1.0, isRoomBound:true});

  // doorway bridge -> room 7 (east wall gap only). room6's own zone and
  // room7's own zone both stop exactly at this shared wall with no
  // overlap, which (given PLAYER_R) leaves a dead strip neither zone
  // covers - the player is never "inside" anything right at the
  // threshold, so tryMove() silently refuses to move them through. This
  // narrow bridge, restricted to the gap's width and overlapping 1m into
  // each room, closes that gap - same technique as room9's bridge into
  // room10.
  obstacles.push({minX:cx+ROOM6_W/2-1.0, maxX:cx+ROOM6_W/2+1.0, minZ:centerZ-eGapHalf, maxZ:centerZ+eGapHalf, isRoomBound:true});

  // doorway bridge -> room 8 (west wall gap only), same reasoning
  obstacles.push({minX:cx-ROOM6_W/2-1.0, maxX:cx-ROOM6_W/2+1.0, minZ:centerZ-wGapHalf, maxZ:centerZ+wGapHalf, isRoomBound:true});
}

/* ---------------- room 6 shrine props (removed) ----------------
   All furniture (altar platform, brass idol, garlands, oil lamps,
   and offering mat) has been stripped out. buildRoom6Furniture()
   is kept as a no-op below so any existing call to it from
   engine.js/main.js does not break. */
function buildRoom6Furniture(){
  // intentionally empty - room 6 is now bare
}
