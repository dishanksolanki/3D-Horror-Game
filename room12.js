/* ============================================================
   HAVELI OF SHADOWS — ROOM 12 (the loop-closing chamber) +
   corridor12a (a bent, two-leg passage: room10's east wall -> east,
   then north, into room12's east wall) + corridor12b (a short
   straight continuation north from room11's gate threshold, into
   room12's south wall). Together these give the player two ways
   into room 12 - one from room 10, one from room 11 - closing the
   haveli's first proper loop. Requires engine.js, room10.js, and
   room11.js to be loaded first (room10.js already cuts room12a's
   doorway gap into its own east wall, and room11.js already cuts
   corridor12b's doorway through what used to be its threshold's
   dead-end far wall).
   ============================================================ */

function buildCorridor12a(){
  const wTex = wallTexture(); wTex.repeat.set(1.2, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});

  const half = CORR12A_W/2;

  /* ---- leg 1: straight east out of room10's east wall, stopping
     just short of the bend (the bend square itself belongs to leg 2
     below, so the two pieces don't overlap) ---- */
  const len1 = (CORR12A_CORNER_X - half) - CORR12A_WEST_X;
  const cx1 = CORR12A_WEST_X + len1/2;

  const floor1 = new THREE.Mesh(new THREE.PlaneGeometry(len1, CORR12A_W), floorMat);
  floor1.rotation.x = -Math.PI/2;
  floor1.position.set(cx1, 0, CORR12A_EW_Z);
  floor1.receiveShadow = true;
  scene.add(floor1);

  const ceil1 = new THREE.Mesh(new THREE.PlaneGeometry(len1, CORR12A_W), ceilMat);
  ceil1.rotation.x = Math.PI/2;
  ceil1.position.set(cx1, CORR12A_H, CORR12A_EW_Z);
  scene.add(ceil1);

  // north-side wall (faces south/interior, default normal) - full run
  const n1 = new THREE.Mesh(new THREE.PlaneGeometry(len1, CORR12A_H), wallMat);
  n1.position.set(cx1, CORR12A_H/2, CORR12A_EW_Z-half);
  scene.add(n1);

  // south-side wall (faces north/interior, flipped normal) - full run
  const s1 = new THREE.Mesh(new THREE.PlaneGeometry(len1, CORR12A_H), wallMat.clone());
  s1.position.set(cx1, CORR12A_H/2, CORR12A_EW_Z+half);
  s1.rotation.y = Math.PI;
  scene.add(s1);

  const trimN1 = new THREE.Mesh(new THREE.BoxGeometry(len1,0.15,0.1), trimMat);
  trimN1.position.set(cx1,0.08,CORR12A_EW_Z-half); scene.add(trimN1);
  const trimS1 = new THREE.Mesh(new THREE.BoxGeometry(len1,0.15,0.1), trimMat);
  trimS1.position.set(cx1,0.08,CORR12A_EW_Z+half); scene.add(trimS1);

  const lanternA = new THREE.PointLight(0xd89a52, 0.42, 4.0, 2.6);
  lanternA.position.set(cx1, CORR12A_H-0.25, CORR12A_EW_Z);
  scene.add(lanternA);
  corridor12aLight = lanternA;

  /* ---- leg 2: the bend square plus the run north into room12's
     east wall. Its west wall is only solid where leg1 does NOT sit
     alongside it (i.e. north of the bend square), leaving the bend
     itself open so the two legs connect. ---- */
  const len2 = (CORR12A_EW_Z+half) - CORR12A_NS_NORTH_Z;
  const cz2 = CORR12A_NS_NORTH_Z + len2/2;

  const floor2 = new THREE.Mesh(new THREE.PlaneGeometry(CORR12A_W, len2), floorMat.clone());
  floor2.rotation.x = -Math.PI/2;
  floor2.position.set(CORR12A_NS_X, 0, cz2);
  floor2.receiveShadow = true;
  scene.add(floor2);

  const ceil2 = new THREE.Mesh(new THREE.PlaneGeometry(CORR12A_W, len2), ceilMat.clone());
  ceil2.rotation.x = Math.PI/2;
  ceil2.position.set(CORR12A_NS_X, CORR12A_H, cz2);
  scene.add(ceil2);

  // east-side wall (faces west/interior, flipped normal) - full run,
  // nothing connects on this side so it stays solid throughout
  const e2 = new THREE.Mesh(new THREE.PlaneGeometry(len2, CORR12A_H), wallMat.clone());
  e2.position.set(CORR12A_NS_X+half, CORR12A_H/2, cz2);
  e2.rotation.y = -Math.PI/2;
  scene.add(e2);

  // west-side wall - solid only north of the bend square, leaving the
  // bend itself (where leg1 joins) open
  const westLen = (CORR12A_EW_Z-half) - CORR12A_NS_NORTH_Z;
  const westCz = CORR12A_NS_NORTH_Z + westLen/2;
  const w2 = new THREE.Mesh(new THREE.PlaneGeometry(westLen, CORR12A_H), wallMat.clone());
  w2.position.set(CORR12A_NS_X-half, CORR12A_H/2, westCz);
  w2.rotation.y = Math.PI/2;
  scene.add(w2);

  const trimE2 = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,len2), trimMat);
  trimE2.position.set(CORR12A_NS_X+half,0.08,cz2); scene.add(trimE2);
  const trimW2 = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,westLen), trimMat);
  trimW2.position.set(CORR12A_NS_X-half,0.08,westCz); scene.add(trimW2);

  // a cobweb strand slung across the bend itself, since nothing ever
  // brushes past it out here
  const bendWeb = new THREE.Mesh(new THREE.PlaneGeometry(CORR12A_W*0.85, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  bendWeb.position.set(CORR12A_NS_X, CORR12A_H-0.4, CORR12A_EW_Z);
  bendWeb.rotation.y = Math.PI/2;
  scene.add(bendWeb);

  // walkable zones for both legs, overlapping generously at the bend
  // and into room10/room12 at the far ends so movement stays seamless
  obstacles.push({minX:CORR12A_WEST_X-1.0, maxX:CORR12A_CORNER_X+half, minZ:CORR12A_EW_Z-half, maxZ:CORR12A_EW_Z+half, isRoomBound:true});
  obstacles.push({minX:CORR12A_NS_X-half, maxX:CORR12A_NS_X+half, minZ:CORR12A_NS_NORTH_Z-1.0, maxZ:CORR12A_EW_Z+half, isRoomBound:true});
}

function buildCorridor12b(){
  // a short, straight continuation north from room11's own gate
  // threshold - the "future room 12" connector that threshold was
  // always built for. Same shape as corridor11: floor/ceiling/side
  // walls, its own lantern, and a bridging walkable zone.
  const centerZ = (CORR12B_SOUTH_Z + CORR12B_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(0.9, 1.4);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.96, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR12B_W, CORR12B_LEN), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR12B_W, CORR12B_LEN), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(0, CORR12B_H, centerZ);
  scene.add(ceil);

  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR12B_LEN, CORR12B_H), wallMat);
  westWall.position.set(-CORR12B_W/2, CORR12B_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR12B_LEN, CORR12B_H), wallMat.clone());
  eastWall.position.set(CORR12B_W/2, CORR12B_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [-CORR12B_W/2, CORR12B_W/2].forEach(x=>{
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,CORR12B_LEN), trimMat);
    trim.position.set(x,0.08,centerZ);
    scene.add(trim);
  });

  const lantern = new THREE.PointLight(0x6a8ab0, 0.4, 3.8, 2.6);
  lantern.position.set(0, CORR12B_H-0.25, centerZ);
  scene.add(lantern);
  corridor12bLight = lantern;

  const strand = new THREE.Mesh(new THREE.PlaneGeometry(CORR12B_W*0.85, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(0, CORR12B_H-0.45, centerZ);
  scene.add(strand);

  obstacles.push({minX:-CORR12B_W/2, maxX:CORR12B_W/2, minZ:CORR12B_NORTH_Z-1.0, maxZ:CORR12B_SOUTH_Z+1.0, isRoomBound:true});
}

function buildRoom12(){
  // room 12: reached both from room 10 (via corridor12a's bend) and
  // from room 11 (via its gate + corridor12b) - the haveli's first
  // proper loop. North and west walls are solid dead ends for now.
  const centerZ = ROOM12_CENTER_Z;
  const wTex = wallTexture(); wTex.repeat.set(4.0, 1.6);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_W, ROOM12_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(ROOM12_CENTER_X, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_W, ROOM12_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(ROOM12_CENTER_X, ROOM12_H, centerZ);
  scene.add(ceil);

  // north wall - solid, dead end for now
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_W, ROOM12_H), wallMat.clone());
  northWall.position.set(ROOM12_CENTER_X, ROOM12_H/2, ROOM12_NORTH_Z);
  scene.add(northWall);

  // west wall - solid, dead end for now
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_D, ROOM12_H), wallMat.clone());
  westWall.position.set(ROOM12_WEST_X, ROOM12_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // east wall with a doorway gap (GATE12A_GAPHALF) centered on the
  // room, leading back down corridor12a's second leg to room 10
  const eGapHalf = GATE12A_GAPHALF;
  const eSideD = (ROOM12_D/2) - eGapHalf;
  const eTex = wallTexture(); eTex.repeat.set(1.5,1.6);
  const eMat = new THREE.MeshStandardMaterial({map:eTex, roughness:0.95, metalness:0.02});

  const eNearPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM12_H), eMat);
  eNearPanel.position.set(ROOM12_EAST_X, ROOM12_H/2, centerZ-(eGapHalf+eSideD/2));
  eNearPanel.rotation.y = -Math.PI/2;
  scene.add(eNearPanel);

  const eFarPanel = new THREE.Mesh(new THREE.PlaneGeometry(eSideD, ROOM12_H), eMat.clone());
  eFarPanel.position.set(ROOM12_EAST_X, ROOM12_H/2, centerZ+(eGapHalf+eSideD/2));
  eFarPanel.rotation.y = -Math.PI/2;
  scene.add(eFarPanel);

  const eLintel = new THREE.Mesh(new THREE.PlaneGeometry(eGapHalf*2+0.4, ROOM12_H-DOOR_H), eMat.clone());
  eLintel.position.set(ROOM12_EAST_X, DOOR_H+(ROOM12_H-DOOR_H)/2, centerZ);
  eLintel.rotation.y = -Math.PI/2;
  scene.add(eLintel);

  const eFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const eFrameSide = new THREE.BoxGeometry(0.16, DOOR_H+0.1, 0.24);
  const efn = new THREE.Mesh(eFrameSide, eFrameMat); efn.position.set(ROOM12_EAST_X, DOOR_H/2+0.05, centerZ-eGapHalf-0.1);
  const eff = new THREE.Mesh(eFrameSide, eFrameMat); eff.position.set(ROOM12_EAST_X, DOOR_H/2+0.05, centerZ+eGapHalf+0.1);
  scene.add(efn,eff);

  // south wall with a doorway gap (GATE12B_GAPHALF), positioned NOT at
  // the room's own centerline but at x=0 - exactly matching corridor12b
  // and room11's own gate below, which sit on room11's central axis
  const sGapHalf = GATE12B_GAPHALF;
  const sLeftW = (0-sGapHalf) - ROOM12_WEST_X;   // room's own west edge to the left side of the gap
  const sRightW = ROOM12_EAST_X - (0+sGapHalf);  // right side of the gap to the room's own east edge
  const sTex = wallTexture(); sTex.repeat.set(1.6,1.6);
  const sMat = new THREE.MeshStandardMaterial({map:sTex, roughness:0.95});

  const sLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sLeftW, ROOM12_H), sMat);
  sLeftPanel.position.set(ROOM12_WEST_X+sLeftW/2, ROOM12_H/2, ROOM12_SOUTH_Z);
  sLeftPanel.rotation.y = Math.PI;
  scene.add(sLeftPanel);

  const sRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sRightW, ROOM12_H), sMat.clone());
  sRightPanel.position.set(ROOM12_EAST_X-sRightW/2, ROOM12_H/2, ROOM12_SOUTH_Z);
  sRightPanel.rotation.y = Math.PI;
  scene.add(sRightPanel);

  const sLintel = new THREE.Mesh(new THREE.PlaneGeometry(sGapHalf*2+0.4, ROOM12_H-DOOR_H), sMat.clone());
  sLintel.position.set(0, DOOR_H+(ROOM12_H-DOOR_H)/2, ROOM12_SOUTH_Z);
  sLintel.rotation.y = Math.PI;
  scene.add(sLintel);

  const sFrameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const sFrameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const sfl = new THREE.Mesh(sFrameSide, sFrameMat); sfl.position.set(0-sGapHalf-0.1, DOOR_H/2+0.05, ROOM12_SOUTH_Z);
  const sfr = new THREE.Mesh(sFrameSide, sFrameMat); sfr.position.set(0+sGapHalf+0.1, DOOR_H/2+0.05, ROOM12_SOUTH_Z);
  scene.add(sfl,sfr);

  // baseboard trim - split around both doorway gaps, unbroken along
  // the two solid walls
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimEN = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimEN.position.set(ROOM12_EAST_X,0.08,centerZ-(eGapHalf+eSideD/2)); scene.add(trimEN);
  const trimES = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,eSideD), trimMat);
  trimES.position.set(ROOM12_EAST_X,0.08,centerZ+(eGapHalf+eSideD/2)); scene.add(trimES);
  const trimSL = new THREE.Mesh(new THREE.BoxGeometry(sLeftW,0.15,0.1), trimMat);
  trimSL.position.set(ROOM12_WEST_X+sLeftW/2,0.08,ROOM12_SOUTH_Z); scene.add(trimSL);
  const trimSR = new THREE.Mesh(new THREE.BoxGeometry(sRightW,0.15,0.1), trimMat);
  trimSR.position.set(ROOM12_EAST_X-sRightW/2,0.08,ROOM12_SOUTH_Z); scene.add(trimSR);
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM12_W,0.15,0.1), trimMat);
  trimN.position.set(ROOM12_CENTER_X,0.08,ROOM12_NORTH_Z); scene.add(trimN);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM12_D), trimMat);
  trimW.position.set(ROOM12_WEST_X,0.08,centerZ); scene.add(trimW);

  // a single weak lantern, centered
  const lamp = new THREE.PointLight(0xd9a25a, 0.65, 6, 2.2);
  lamp.position.set(ROOM12_CENTER_X, ROOM12_H-0.3, centerZ);
  scene.add(lamp);
  room12Light = lamp;

  // cobwebs tucked into the far (north) corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.1, [ROOM12_WEST_X+0.05, ROOM12_H-0.04, ROOM12_NORTH_Z+0.05], [0, Math.PI/4, 0], 8, 0.2);
  fan(1.0, [ROOM12_EAST_X-0.05, ROOM12_H-0.04, ROOM12_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.25);

  // walkable zone - tight to room12's own real walls, so the solid
  // north/west panels actually block movement. Both doorway crossings
  // are handled by corridor12a's and corridor12b's own bridge zones.
  obstacles.push({minX:ROOM12_WEST_X, maxX:ROOM12_EAST_X, minZ:ROOM12_NORTH_Z, maxZ:ROOM12_SOUTH_Z, isRoomBound:true});
}
