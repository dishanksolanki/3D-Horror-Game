/* ============================================================
   HAVELI OF SHADOWS — ROOM 6 (the ancestor's shrine)
   Opens directly off room 2's north wall - no corridor, the
   doorway sits right in the wall the shrine shares with room 2.
   Requires engine.js and room2.js to be loaded first (room2.js
   builds the shared doorway wall; this file only needs to add
   the other three walls, floor, ceiling, and furniture).
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

  // east wall - solid, deliberately no further doorway (dead end)
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM6_D, ROOM6_H), wallMat.clone());
  eastWall.position.set(cx+ROOM6_W/2, ROOM6_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // west wall - solid
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM6_D, ROOM6_H), wallMat.clone());
  westWall.position.set(cx-ROOM6_W/2, ROOM6_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // note: the south wall (the doorway back into room 2) is built once, by
  // buildRoom2() in room2.js, so it isn't duplicated here.

  // baseboard trim along the three solid walls - the south threshold trim
  // is already laid down by room 2's own doorway construction
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM6_W,0.15,0.1), trimMat);
  trimN.position.set(cx,0.08,ROOM6_NORTH_Z); scene.add(trimN);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM6_D), trimMat);
  trimE.position.set(cx+ROOM6_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM6_D), trimMat);
  trimW.position.set(cx-ROOM6_W/2,0.08,centerZ); scene.add(trimW);

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
}

/* ---------------- room 6 shrine props (removed) ----------------
   All furniture (altar platform, brass idol, garlands, oil lamps,
   and offering mat) has been stripped out. buildRoom6Furniture()
   is kept as a no-op below so any existing call to it from
   engine.js/main.js does not break. */
function buildRoom6Furniture(){
  // intentionally empty - room 6 is now bare
}
