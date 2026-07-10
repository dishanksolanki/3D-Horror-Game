/* ============================================================
   HAVELI OF SHADOWS — ROOM 5
   Opens DIRECTLY off Room 3's east wall (no corridor in between).
   The doorway itself lives in room3.js's east wall — this file just
   builds the room shell on the other side of that opening.
   Requires engine.js and room3.js to be loaded first.
   ============================================================ */

function buildRoom5(){
  const cz = ROOM5_CENTER_Z;
  const centerX = (ROOM5_WEST_X + ROOM5_EAST_X)/2;
  const wTex = wallTexture(); wTex.repeat.set(4, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM5_D, ROOM5_W), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM5_D, ROOM5_W), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, ROOM5_H, cz);
  scene.add(ceil);

  // east (far) wall - solid dead-end, ready to extend the haveli later
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM5_W, ROOM5_H), wallMat);
  eastWall.position.set(ROOM5_EAST_X, ROOM5_H/2, cz);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // north and south walls, solid for now
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM5_D, ROOM5_H), wallMat.clone());
  northWall.position.set(centerX, ROOM5_H/2, cz-ROOM5_W/2);
  scene.add(northWall);

  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM5_D, ROOM5_H), wallMat.clone());
  southWall.position.set(centerX, ROOM5_H/2, cz+ROOM5_W/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // NOTE: no west wall here on purpose — room3.js cuts the doorway into
  // its own east wall at ROOM3_EAST_X === ROOM5_WEST_X, so the two rooms
  // open straight into each other.

  // baseboard trim
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM5_W), trimMat);
  trimE.position.set(ROOM5_EAST_X,0.08,cz); scene.add(trimE);
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM5_D,0.15,0.1), trimMat);
  trimN.position.set(centerX,0.08,cz-ROOM5_W/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM5_D,0.15,0.1), trimMat);
  trimS.position.set(centerX,0.08,cz+ROOM5_W/2); scene.add(trimS);

  // a single weak bulb, a touch warmer/dimmer than room 3's — this room
  // feels older and more forgotten
  const bulb = new THREE.PointLight(0xff9f5a, 0.85, 6, 2.2);
  bulb.position.set(centerX, ROOM5_H-0.25, cz);
  scene.add(bulb);
  room5Light = bulb;

  // cobwebs in the corners, slightly denser/more torn than room 3's
  const fanMat = (density,torn)=> new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size), fanMat(density,torn));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.3, [ROOM5_EAST_X-0.05, ROOM5_H-0.04, cz-ROOM5_W/2+0.05], [0, Math.PI/4, 0], 8, 0.25);
  fan(1.2, [ROOM5_EAST_X-0.03, ROOM5_H-0.04, cz+ROOM5_W/2-0.05], [0, -Math.PI/4, 0], 7, 0.25);

  // a dried blood pool on the floor - the first real hint that something
  // happened deeper in the haveli
  const poolMat = new THREE.MeshBasicMaterial({map:bloodPoolTexture('dried'), transparent:true, depthWrite:false});
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(1.4,1.4), poolMat);
  pool.rotation.x = -Math.PI/2;
  pool.position.set(centerX+0.6, 0.01, cz+0.4);
  scene.add(pool);

  // walkable zone — extended back past the west opening so it overlaps
  // room3's zone at the doorway (room3's zone was extended the same way),
  // which is what makes crossing between the two rooms seamless
  obstacles.push({minX:ROOM5_WEST_X-1.0, maxX:ROOM5_EAST_X, minZ:cz-ROOM5_W/2, maxZ:cz+ROOM5_W/2, isRoomBound:true});
}
