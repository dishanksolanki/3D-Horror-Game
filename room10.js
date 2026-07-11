/* ============================================================
   HAVELI OF SHADOWS — ROOM 10 (a second hall)
   Opens DIRECTLY off room 9's north wall (no corridor in between).
   room9.js cuts the doorway gap into its own north wall and faces
   its panels INTO room 9; this file draws room 10's own south wall
   panels facing back INTO room 10, so the doorway looks correct
   and solid from both sides (planes only render from one face).
   Requires engine.js and room9.js to be loaded first.
   ============================================================ */

function buildRoom10(){
  const cx = 0;
  const centerZ = (ROOM10_SOUTH_Z + ROOM10_NORTH_Z)/2;
  const wTex = wallTexture(); wTex.repeat.set(4.4, 1.6);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM10_W, ROOM10_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM10_W, ROOM10_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM10_H, centerZ);
  scene.add(ceil);

  // north wall - solid, dead end for now
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM10_W, ROOM10_H), wallMat.clone());
  northWall.position.set(cx, ROOM10_H/2, ROOM10_NORTH_Z);
  scene.add(northWall);

  // east wall - solid
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM10_D, ROOM10_H), wallMat.clone());
  eastWall.position.set(cx+ROOM10_W/2, ROOM10_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // west wall - solid
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM10_D, ROOM10_H), wallMat.clone());
  westWall.position.set(cx-ROOM10_W/2, ROOM10_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // south wall with a doorway gap matching room 9's own gap (GATE10_GAPHALF)
  // exactly, so the two rooms' wall panels line up seamlessly. These panels
  // face back INTO room 10 (rotation.y = PI) - room9.js's own north-wall
  // panels handle the view from room 9's side of the same opening.
  const gapHalf = GATE10_GAPHALF;
  const sideW = (ROOM10_W/2) - gapHalf;
  const southTex = wallTexture(); southTex.repeat.set(1.6,1.6);
  const southMat = new THREE.MeshStandardMaterial({map:southTex, roughness:0.95});

  const leftPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM10_H), southMat);
  leftPanel.position.set(cx-(gapHalf+sideW/2), ROOM10_H/2, ROOM10_SOUTH_Z);
  leftPanel.rotation.y = Math.PI;
  scene.add(leftPanel);

  const rightPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideW, ROOM10_H), southMat.clone());
  rightPanel.position.set(cx+(gapHalf+sideW/2), ROOM10_H/2, ROOM10_SOUTH_Z);
  rightPanel.rotation.y = Math.PI;
  scene.add(rightPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM10_H-DOOR_H), southMat.clone());
  lintel.position.set(cx, DOOR_H+(ROOM10_H-DOOR_H)/2, ROOM10_SOUTH_Z);
  lintel.rotation.y = Math.PI;
  scene.add(lintel);

  // carved wooden door frame on room 10's side of the same opening
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.24, DOOR_H+0.1, 0.16);
  const fl = new THREE.Mesh(frameSide, frameMat); fl.position.set(cx-gapHalf-0.1, DOOR_H/2+0.05, ROOM10_SOUTH_Z);
  const fr = new THREE.Mesh(frameSide, frameMat); fr.position.set(cx+gapHalf+0.1, DOOR_H/2+0.05, ROOM10_SOUTH_Z);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(gapHalf*2+0.32, 0.18, 0.3), frameMat); ft.position.set(cx, DOOR_H+0.1, ROOM10_SOUTH_Z);
  scene.add(fl,fr,ft);

  // baseboard trim - south trim splits either side of the doorway, the
  // other three walls are solid so their trim runs unbroken
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimSL = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSL.position.set(cx-(gapHalf+sideW/2),0.08,ROOM10_SOUTH_Z); scene.add(trimSL);
  const trimSR = new THREE.Mesh(new THREE.BoxGeometry(sideW,0.15,0.1), trimMat);
  trimSR.position.set(cx+(gapHalf+sideW/2),0.08,ROOM10_SOUTH_Z); scene.add(trimSR);
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM10_W,0.15,0.1), trimMat);
  trimN.position.set(cx,0.08,ROOM10_NORTH_Z); scene.add(trimN);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM10_D), trimMat);
  trimE.position.set(cx+ROOM10_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM10_D), trimMat);
  trimW.position.set(cx-ROOM10_W/2,0.08,centerZ); scene.add(trimW);

  // a single weak, unsteady lantern - deeper into the haveli, dimmer and
  // colder than room 9's pair
  const lamp = new THREE.PointLight(0xdba25a, 0.65, 6, 2.2);
  lamp.position.set(cx, ROOM10_H-0.3, centerZ);
  scene.add(lamp);
  room10Light = lamp;

  // cobwebs tucked into the far (north) corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.2, [cx-ROOM10_W/2+0.05, ROOM10_H-0.04, ROOM10_NORTH_Z+0.05], [0, Math.PI/4, 0], 8, 0.2);
  fan(1.1, [cx+ROOM10_W/2-0.05, ROOM10_H-0.04, ROOM10_NORTH_Z+0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.25);

  // walkable zone - tight to room 10's own real walls (no padding), so
  // the solid north/east/west wall panels actually block movement. The
  // doorway crossing into room 9 is handled by the bridge zone room9.js
  // pushes across the shared gap, so no separate bridge is needed here.
  obstacles.push({minX:cx-ROOM10_W/2, maxX:cx+ROOM10_W/2, minZ:ROOM10_NORTH_Z, maxZ:ROOM10_SOUTH_Z, isRoomBound:true});
}

/* ---------------- room 10 furniture ---------------- */

function buildRoom10Furniture(){
  const cx = 0;

  // --- a heavy, dust-sheeted piece of furniture pushed against the
  // north wall, the room's one real feature so far ---
  const sheetMat = new THREE.MeshStandardMaterial({color:0x3a3428, roughness:0.95});
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.7), sheetMat);
  sheet.position.set(cx, 0.5, ROOM10_NORTH_Z+0.5);
  sheet.castShadow = true; sheet.receiveShadow = true;
  scene.add(sheet);
  obstacles.push(boxFor(new THREE.Vector3(cx,0,ROOM10_NORTH_Z+0.5), 0.85, 0.4, 0.08));

  // --- a broken chair on its side near the east wall ---
  const woodMat = new THREE.MeshStandardMaterial({color:0x2a1c10, roughness:0.85});
  const chairGroup = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.04,0.4), woodMat);
  seat.position.set(0,0.42,0);
  chairGroup.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.5,0.04), woodMat);
  back.position.set(0,0.65,-0.18);
  chairGroup.add(back);
  chairGroup.position.set(cx+ROOM10_W/2-0.7, 0, ROOM10_SOUTH_Z-1.4);
  chairGroup.rotation.z = Math.PI/2.4;
  scene.add(chairGroup);

  // --- cobweb strand low across the doorway threshold, torn where the
  // player would brush through it ---
  const strand = new THREE.Mesh(new THREE.PlaneGeometry(GATE10_GAPHALF*1.6, 0.5),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(cx, DOOR_H-0.6, ROOM10_SOUTH_Z+0.06);
  scene.add(strand);
}
