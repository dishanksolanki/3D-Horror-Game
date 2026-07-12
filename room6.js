/* ============================================================
   HAVELI OF SHADOWS — ROOM 6 (the ancestor's shrine)
   Opens directly off room 2's north wall - no corridor, the
   doorway sits right in the wall the shrine shares with room 2.
   Requires engine.js and room2.js to be loaded first (room2.js
   builds the shared doorway wall; this file only needs to add
   the other three walls, floor, ceiling, and furniture).

   UPDATE: room6 is no longer a dead end on the east/west sides.
   room7.js opens off this room's east wall and room8.js opens
   off this room's west wall (see the notes in those files).

   UPDATE 2: the east/west openings used to be full-width doorway
   gaps (GATE7_GAPHALF / GATE8_GAPHALF), which meant you could
   see straight through from room 7 or room 8 into room 6 (and
   vice versa). Both walls are now built SOLID except for one
   narrow, doll-sized slit (DOLL_GAP_HALF) placed exactly where
   the doll prop stands. The doll is the only thing you can see
   or pass through - the rest of the wall blocks sightlines
   completely.

   To hook up your doll object:
   - East gap (room6 <-> room7) is centered at
       x = cx + ROOM6_W/2,  z = centerZ
   - West gap (room6 <-> room8) is centered at
       x = cx - ROOM6_W/2,  z = centerZ
   - Position the doll mesh at that exact (x, z), don't add its
     bounding box to `obstacles`, and (if you have any occlusion/
     raycast visibility check) exclude it from that check too -
     that's what lets it be seen/passed through while the solid
     parts of the wall block everything else.
   - If your doll model isn't ~0.8m wide, tune DOLL_GAP_HALF
     below so the slit matches its silhouette.
============================================================ */

// half-width of the narrow doll-shaped opening in room6's east/west
// walls - this replaces the old full-doorway GATE7_GAPHALF / GATE8_GAPHALF
// gaps for these two walls specifically. Shrink/grow to match your doll.
const DOLL_GAP_HALF = 0.4;

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

  // north wall - carries a doorway gap -> corridor9 -> room 9 (the hall).
  // Unchanged - still a normal full-width doorway.
  const nGapHalf = GATE9_GAPHALF;
  const nSideW = (ROOM6_W/2) - nGapHalf;
  const nTex = wallTexture(); nTex.repeat.set(3, 1.4);
  const nMat = new THREE.MeshStandardMaterial({map:nTex, roughness:0.95, metalness:0.02});

  const nLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM6_H), nMat);
  nLeftPanel.position.set(cx-(nGapHalf+nSideW/2), ROOM6_H/2, ROOM6_NORTH_Z);
  scene.add(nLeftPanel);

  const nRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(nSideW, ROOM6_H), nMat.clone());
  nRightPanel.position.set(cx+(nGapHalf+nSideW/2), ROOM6_H/2, ROOM6_NORTH_Z);
  scene.add(nRightPanel);

  const nLintel = new THREE.Mesh(new THREE.PlaneGeometry(nGapHalf*2+0.4, ROOM6_H-DOOR_H), nMat.clone());
  nLintel.position.set(cx, DOOR_H+(ROOM6_H-DOOR_H)/2, ROOM6_NORTH_Z);
  scene.add(nLintel);

  const nFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const nFrameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const nfl = new THREE.Mesh(nFrameSide, nFrameMat); nfl.position.set(cx-nGapHalf-0.1, DOOR_H/2+0.05, ROOM6_NORTH_Z);
  const nfr = new THREE.Mesh(nFrameSide, nFrameMat); nfr.position.set(cx+nGapHalf+0.1, DOOR_H/2+0.05, ROOM6_NORTH_Z);
  const nft = new THREE.Mesh(new THREE.BoxGeometry(nGapHalf*2+0.32, 0.18, 0.3), nFrameMat); nft.position.set(cx, DOOR_H+0.1, ROOM6_NORTH_Z);
  scene.add(nfl,nfr,nft);

  // east wall -> room 7. Was a full doorway gap (GATE7_GAPHALF); now a
  // narrow doll-sized slit (DOLL_GAP_HALF) so the wall reads as solid
  // and blocks the sightline into room 7, except for the doll's silhouette.
  const eGapHalf = DOLL_GAP_HALF;
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

  // west wall -> room 8. Same treatment: narrow doll-sized slit instead
  // of a full doorway gap.
  const wGapHalf = DOLL_GAP_HALF;
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

  // baseboard trim - all three built walls (north, east, west) carry
  // doorway gaps, so each trim run is split either side of its gap.
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimNL = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNL.position.set(cx-(nGapHalf+nSideW/2),0.08,ROOM6_NORTH_Z); scene.add(trimNL);
  const trimNR = new THREE.Mesh(new THREE.BoxGeometry(nSideW,0.15,0.1), trimMat);
  trimNR.position.set(cx+(nGapHalf+nSideW/2),0.08,ROOM6_NORTH_Z); scene.add(trimNR);

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

  // doorway bridge -> room 7 (east wall gap only). Narrowed to match the
  // doll-sized slit (eGapHalf), so the player can only physically pass
  // through the same narrow opening the doll occupies - not the full
  // former doorway width.
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
