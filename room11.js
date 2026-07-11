/* ============================================================
   HAVELI OF SHADOWS — ROOM 11 (a small ritual chamber) + corridor11,
   the extremely short 0.25-metre stone connector linking it to room
   10's north wall. Requires engine.js and room10.js to be loaded
   first (room10.js already cuts the doorway gap into its own north
   wall; this file builds the short connector itself and room 11 on
   the other end, including room 11's own south doorway that mirrors
   it).
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
  // room 11: a small ritual chamber, reached only via corridor11 off
  // room 10's north wall. East, west, and north walls are solid dead
  // ends for now - the south wall carries the doorway back through
  // corridor11 to room 10.
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

  // north wall - solid, dead end for now (future rooms could open off
  // here later, the same way room9/room10 grew deeper into the haveli)
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM11_W, ROOM11_H), wallMat.clone());
  northWall.position.set(cx, ROOM11_H/2, ROOM11_NORTH_Z);
  scene.add(northWall);

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
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM11_W,0.15,0.1), trimMat);
  trimN.position.set(cx,0.08,ROOM11_NORTH_Z); scene.add(trimN);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM11_D), trimMat);
  trimE.position.set(cx+ROOM11_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM11_D), trimMat);
  trimW.position.set(cx-ROOM11_W/2,0.08,centerZ); scene.add(trimW);

  // a small cluster of guttering diya-style lights over the altar,
  // deeper and stranger-feeling than room10's single lantern
  const lamp = new THREE.PointLight(0xff9748, 0.6, 5.5, 2.3);
  lamp.position.set(cx, 1.5, ROOM11_NORTH_Z+0.9);
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
  // the solid north/east/west wall panels actually block movement. The
  // doorway crossing back into corridor11 is handled by corridor11's
  // own bridge zone, so no separate bridge is needed here.
  obstacles.push({minX:cx-ROOM11_W/2, maxX:cx+ROOM11_W/2, minZ:ROOM11_NORTH_Z, maxZ:ROOM11_SOUTH_Z, isRoomBound:true});
}

/* ---------------- room 11 furniture ---------------- */

function buildRoom11Furniture(){
  const cx = 0;

  // --- a low stone altar against the north wall, holding a cracked
  // idol and a scatter of unlit diyas - the room's centrepiece ---
  const stoneMat = new THREE.MeshStandardMaterial({color:0x2c261e, roughness:0.92});
  const altarBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 0.6), stoneMat);
  altarBase.position.set(cx, 0.275, ROOM11_NORTH_Z+0.5);
  altarBase.castShadow = true; altarBase.receiveShadow = true;
  scene.add(altarBase);

  const altarTop = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.06, 0.68), stoneMat);
  altarTop.position.set(cx, 0.58, ROOM11_NORTH_Z+0.5);
  scene.add(altarTop);

  // cracked idol, roughly humanoid, weathered dark stone
  const idolMat = new THREE.MeshStandardMaterial({color:0x1f1a14, roughness:0.85});
  const idolGroup = new THREE.Group();
  const idolBody = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 8), idolMat);
  idolBody.position.y = 0.21;
  idolGroup.add(idolBody);
  const idolHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), idolMat);
  idolHead.position.y = 0.46;
  idolGroup.add(idolHead);
  idolGroup.position.set(cx, 0.61, ROOM11_NORTH_Z+0.42);
  idolGroup.rotation.z = 0.06; // slightly toppled, unsettling rather than tidy
  scene.add(idolGroup);

  // scattered unlit diya lamps along the altar top
  const diyaMat = new THREE.MeshStandardMaterial({color:0x4a3a1c, roughness:0.7});
  const diyaPositions = [[-0.55,0.03],[-0.3,-0.08],[0.4,0.05],[0.6,-0.1]];
  diyaPositions.forEach(([dx,dz])=>{
    const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.04,0.03,10), diyaMat);
    diya.position.set(cx+dx, 0.62, ROOM11_NORTH_Z+0.5+dz);
    scene.add(diya);
  });

  obstacles.push(boxFor(new THREE.Vector3(cx,0,ROOM11_NORTH_Z+0.5), 0.85, 0.4, 0.1));

  // --- faded rangoli-style ash markings swept across the floor in
  // front of the altar, long since disturbed ---
  const ashMat = new THREE.MeshStandardMaterial({map:shrineClothTexture(), roughness:0.95, transparent:true, opacity:0.5});
  const ashMark = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), ashMat);
  ashMark.rotation.x = -Math.PI/2;
  ashMark.position.set(cx, 0.007, ROOM11_NORTH_Z+1.5);
  scene.add(ashMark);

  // --- a toppled brass bell near the east wall, silent and dust-caked ---
  const bellMat = new THREE.MeshStandardMaterial({color:0x5a4a26, roughness:0.55, metalness:0.6});
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.13,0.16,10), bellMat);
  bell.position.set(cx+ROOM11_W/2-0.6, 0.08, ROOM11_SOUTH_Z-1.1);
  bell.rotation.z = Math.PI/2.2;
  scene.add(bell);

  // --- cobweb strand low across the doorway threshold, torn where the
  // player would brush through it ---
  const strand = new THREE.Mesh(new THREE.PlaneGeometry(GATE11_GAPHALF*1.6, 0.5),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(cx, DOOR_H-0.6, ROOM11_SOUTH_Z-0.06);
  scene.add(strand);
}
