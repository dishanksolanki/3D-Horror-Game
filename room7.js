/* ============================================================
HAVELI OF SHADOWS — ROOM 7 (ordinary bedroom, east of room 6)

Opens directly off room 6's east wall - no corridor. The
doorway sits in the wall room 6 itself builds (room6.js must
be updated to cut a gap in its east wall - see the room6.js
patch notes). This file only adds the other three walls,
floor, ceiling, and simple furniture.

Requires engine.js and the updated room6.js to be loaded first.
Add GATE7_GAPHALF, ROOM7_W, ROOM7_D, ROOM7_H, ROOM7_WEST_X,
ROOM7_EAST_X, ROOM7_CENTER_Z to your constants file (see notes).
============================================================ */

let room7Light;

function buildRoom7(){
  const cz = ROOM7_CENTER_Z;
  const westX = ROOM7_WEST_X; // shared doorway wall, built by room6.js
  const eastX = ROOM7_EAST_X;

  const wTex = wallTexture(); wTex.repeat.set(2.4, 1.4);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02, side:THREE.DoubleSide});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM7_W, ROOM7_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(westX + ROOM7_W/2, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM7_W, ROOM7_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(westX + ROOM7_W/2, ROOM7_H, cz);
  scene.add(ceil);

  // north wall - solid
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM7_W, ROOM7_H), wallMat.clone());
  northWall.position.set(westX + ROOM7_W/2, ROOM7_H/2, cz - ROOM7_D/2);
  scene.add(northWall);

  // south wall - solid
  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM7_W, ROOM7_H), wallMat.clone());
  southWall.position.set(westX + ROOM7_W/2, ROOM7_H/2, cz + ROOM7_D/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // east wall - solid, dead end
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM7_D, ROOM7_H), wallMat.clone());
  eastWall.position.set(eastX, ROOM7_H/2, cz);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // note: the west wall (the doorway back into room 6) is built once, by
  // buildRoom6() in room6.js, so it isn't duplicated here.

  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM7_W,0.15,0.1), trimMat);
  trimN.position.set(westX + ROOM7_W/2, 0.08, cz - ROOM7_D/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM7_W,0.15,0.1), trimMat);
  trimS.position.set(westX + ROOM7_W/2, 0.08, cz + ROOM7_D/2); scene.add(trimS);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM7_D), trimMat);
  trimE.position.set(eastX, 0.08, cz); scene.add(trimE);

  // plain hanging bulb, slightly dimmer than room 1's
  const bulbMat = new THREE.MeshStandardMaterial({color:0x2a2015, emissive:0xffcc88, emissiveIntensity:0.5});
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8), bulbMat);
  bulb.position.set(westX + ROOM7_W/2, ROOM7_H - 0.35, cz);
  scene.add(bulb);

  const glow = new THREE.PointLight(0xffce8a, 0.6, 6, 2.2);
  glow.position.set(westX + ROOM7_W/2, ROOM7_H - 0.4, cz);
  scene.add(glow);
  room7Light = glow;

  // cobwebs in the far corners, consistent with the rest of the haveli
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(0.8, [eastX-0.05, ROOM7_H-0.04, cz-ROOM7_D/2+0.05], [0, -Math.PI/4, 0], 6, 0.2);
  fan(0.7, [eastX-0.05, ROOM7_H-0.04, cz+ROOM7_D/2-0.05], [0, Math.PI/4+Math.PI/2, 0], 6, 0.25);

  // walkable zone, overlapping west into room 6 so the shared doorway
  // feels seamless in both directions
  obstacles.push({minX:westX, maxX:eastX, minZ:cz-ROOM7_D/2, maxZ:cz+ROOM7_D/2, isRoomBound:true});
}

/* ---------------- room 7 furniture ---------------- */

function buildRoom7Furniture(){
  const cz = ROOM7_CENTER_Z;
  const westX = ROOM7_WEST_X;
  const eastX = ROOM7_EAST_X;
  const frameMat = new THREE.MeshStandardMaterial({map:woodTexture('#3b2413','#160e08'), roughness:0.85});

  // --- simple bed against the east wall ---
  const bedX = eastX - 0.9, bedZ = cz - 0.3;
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.35, 1.0), frameMat);
  bedFrame.position.set(bedX, 0.18, bedZ);
  bedFrame.castShadow = true; bedFrame.receiveShadow = true;
  scene.add(bedFrame);
  obstacles.push(boxFor(new THREE.Vector3(bedX,0,bedZ), 0.85, 0.5, 0.05));

  const mattressMat = new THREE.MeshStandardMaterial({color:0x8a7a5c, roughness:0.9});
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.14, 0.88), mattressMat);
  mattress.position.set(bedX, 0.42, bedZ);
  scene.add(mattress);

  const pillowMat = new THREE.MeshStandardMaterial({color:0xc9bfa0, roughness:0.95});
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.3), pillowMat);
  pillow.position.set(bedX-0.55, 0.53, bedZ);
  scene.add(pillow);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 1.0), frameMat);
  headboard.position.set(eastX-0.05, 0.35, bedZ);
  scene.add(headboard);

  // --- small nightstand beside the bed ---
  const standX = eastX - 0.9, standZ = cz + 0.6;
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), frameMat);
  stand.position.set(standX, 0.25, standZ);
  stand.castShadow = true;
  scene.add(stand);
  obstacles.push(boxFor(new THREE.Vector3(standX,0,standZ), 0.24, 0.24, 0.04));

  // --- a plain wooden chair near the north wall ---
  const chairX = westX + 0.5, chairZ = cz - ROOM7_D/2 + 0.5;
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), frameMat);
  seat.position.set(chairX, 0.42, chairZ);
  scene.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.05), frameMat);
  back.position.set(chairX, 0.68, chairZ-0.18);
  scene.add(back);
  obstacles.push(boxFor(new THREE.Vector3(chairX,0,chairZ), 0.22, 0.22, 0.03));
}
