/* ============================================================
HAVELI OF SHADOWS — ROOM 8 (ordinary storeroom, west of room 6)

Opens directly off room 6's west wall - no corridor. The
doorway sits in the wall room 6 itself builds (room6.js must
be updated to cut a gap in its west wall - see the room6.js
patch notes). This file only adds the other three walls,
floor, ceiling, and simple furniture.

Requires engine.js and the updated room6.js to be loaded first.
Add GATE8_GAPHALF, ROOM8_W, ROOM8_D, ROOM8_H, ROOM8_EAST_X,
ROOM8_WEST_X, ROOM8_CENTER_Z to your constants file (see notes).
============================================================ */

let room8Light;

function buildRoom8(){
  const cz = ROOM8_CENTER_Z;
  const eastX = ROOM8_EAST_X; // shared doorway wall, built by room6.js
  const westX = ROOM8_WEST_X;

  const wTex = wallTexture(); wTex.repeat.set(2.4, 1.4);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02, side:THREE.DoubleSide});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM8_W, ROOM8_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(eastX - ROOM8_W/2, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM8_W, ROOM8_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(eastX - ROOM8_W/2, ROOM8_H, cz);
  scene.add(ceil);

  // north wall - solid
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM8_W, ROOM8_H), wallMat.clone());
  northWall.position.set(eastX - ROOM8_W/2, ROOM8_H/2, cz - ROOM8_D/2);
  scene.add(northWall);

  // south wall - solid
  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM8_W, ROOM8_H), wallMat.clone());
  southWall.position.set(eastX - ROOM8_W/2, ROOM8_H/2, cz + ROOM8_D/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // west wall - solid, dead end
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM8_D, ROOM8_H), wallMat.clone());
  westWall.position.set(westX, ROOM8_H/2, cz);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // note: the east wall (the doorway back into room 6) is built once, by
  // buildRoom6() in room6.js, so it isn't duplicated here.

  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM8_W,0.15,0.1), trimMat);
  trimN.position.set(eastX - ROOM8_W/2, 0.08, cz - ROOM8_D/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM8_W,0.15,0.1), trimMat);
  trimS.position.set(eastX - ROOM8_W/2, 0.08, cz + ROOM8_D/2); scene.add(trimS);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM8_D), trimMat);
  trimW.position.set(westX, 0.08, cz); scene.add(trimW);

  // plain hanging bulb
  const bulbMat = new THREE.MeshStandardMaterial({color:0x2a2015, emissive:0xffcc88, emissiveIntensity:0.5});
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8), bulbMat);
  bulb.position.set(eastX - ROOM8_W/2, ROOM8_H - 0.35, cz);
  scene.add(bulb);

  const glow = new THREE.PointLight(0xffce8a, 0.55, 6, 2.2);
  glow.position.set(eastX - ROOM8_W/2, ROOM8_H - 0.4, cz);
  scene.add(glow);
  room8Light = glow;

  // cobwebs in the far corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(0.8, [westX+0.05, ROOM8_H-0.04, cz-ROOM8_D/2+0.05], [0, Math.PI/4, 0], 6, 0.2);
  fan(0.7, [westX+0.05, ROOM8_H-0.04, cz+ROOM8_D/2-0.05], [0, -Math.PI/4-Math.PI/2, 0], 6, 0.25);

  // walkable zone, overlapping east into room 6 so the shared doorway
  // feels seamless in both directions
  obstacles.push({minX:westX, maxX:eastX, minZ:cz-ROOM8_D/2, maxZ:cz+ROOM8_D/2, isRoomBound:true});
}

/* ---------------- room 8 furniture ---------------- */

function buildRoom8Furniture(){
  const cz = ROOM8_CENTER_Z;
  const eastX = ROOM8_EAST_X;
  const westX = ROOM8_WEST_X;
  const frameMat = new THREE.MeshStandardMaterial({map:woodTexture('#3b2413','#160e08'), roughness:0.85});

  // --- plain storage shelving against the west wall ---
  const shelfX = westX + 0.25, shelfZ = cz;
  const shelfUnit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.6, 1.4), frameMat);
  shelfUnit.position.set(shelfX, 0.8, shelfZ);
  shelfUnit.castShadow = true; shelfUnit.receiveShadow = true;
  scene.add(shelfUnit);
  obstacles.push(boxFor(new THREE.Vector3(shelfX,0,shelfZ), 0.24, 0.74, 0.05));

  // a couple of crates stacked nearby
  const crateMat = new THREE.MeshStandardMaterial({map:woodTexture('#4a3018','#20140a'), roughness:0.9});
  const crateX = westX + 0.9, crateZ = cz - 0.9;
  const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), crateMat);
  crate1.position.set(crateX, 0.25, crateZ);
  crate1.castShadow = true;
  scene.add(crate1);
  const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), crateMat);
  crate2.position.set(crateX+0.05, 0.7, crateZ+0.05);
  crate2.rotation.y = 0.3;
  scene.add(crate2);
  obstacles.push(boxFor(new THREE.Vector3(crateX,0,crateZ), 0.28, 0.28, 0.04));

  // --- a plain table near the east side ---
  const tableX = eastX - 0.9, tableZ = cz + 0.7;
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.6), frameMat);
  tableTop.position.set(tableX, 0.62, tableZ);
  scene.add(tableTop);
  const legGeo = new THREE.BoxGeometry(0.06, 0.6, 0.06);
  [[-0.4,-0.25],[0.4,-0.25],[-0.4,0.25],[0.4,0.25]].forEach(([dx,dz])=>{
    const leg = new THREE.Mesh(legGeo, frameMat);
    leg.position.set(tableX+dx, 0.3, tableZ+dz);
    scene.add(leg);
  });
  obstacles.push(boxFor(new THREE.Vector3(tableX,0,tableZ), 0.48, 0.33, 0.04));
}
