/* ============================================================
   HAVELI OF SHADOWS — ROOM 13 (west wing)
   Opens off room 11's WEST wall via corridor13, an extremely
   short 0.25-metre stone connector — mirrors corridor12/room12
   on the opposite side of room 11. Requires engine.js and
   room11.js to be loaded first, AND requires room11.js to already
   cut a doorway gap into room 11's west wall — without that this
   room is unreachable.
============================================================ */

/* ---- shared sizing for this wing, all derived off room11's own
   existing constants so it lines up regardless of room11's real
   numbers ---- */
const GATE13_GAPHALF = 0.9; // half-width of room11's west doorway
const CORR13_LEN = 0.25; // the requested 0.25m corridor
const CORR13_W = GATE13_GAPHALF * 2;
const CORR13_H = 2.3;
const CORR13_EAST_X = -ROOM11_W / 2; // starts at room11's west wall
const CORR13_WEST_X = CORR13_EAST_X - CORR13_LEN;

const ROOM13_W = 5.0, ROOM13_D = 5.6, ROOM13_H = 3.05;
const ROOM13_EAST_X = CORR13_WEST_X; // room13's east wall (doorway) x
const ROOM13_WEST_X = ROOM13_EAST_X - ROOM13_W;
const ROOM13_CENTER_Z = (ROOM11_SOUTH_Z + ROOM11_NORTH_Z) / 2; // flush with room11's own z-center

let room13Light, corridor13Light;

function buildCorridor13(){
  const centerX = (CORR13_WEST_X + CORR13_EAST_X) / 2;
  const cz = ROOM13_CENTER_Z;
  const wTex = wallTexture(); wTex.repeat.set(0.5, 1.3);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR13_LEN, CORR13_W), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR13_LEN, CORR13_W), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, CORR13_H, cz);
  scene.add(ceil);

  // short north/south flanking walls - these run ALONG the corridor's
  // own length (X), sitting at fixed Z on the north/south sides, so
  // they need NO y-rotation (their local width already lies on world
  // X). Their normals face into the corridor: north flank faces +Z
  // (default), south flank faces -Z (rotated 180°).
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR13_LEN, CORR13_H), wallMat);
  northWall.position.set(centerX, CORR13_H/2, cz - CORR13_W/2);
  scene.add(northWall);

  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR13_LEN, CORR13_H), wallMat.clone());
  southWall.position.set(centerX, CORR13_H/2, cz + CORR13_W/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  [cz - CORR13_W/2, cz + CORR13_W/2].forEach(z => {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(CORR13_LEN, 0.15, 0.1), trimMat);
    trim.position.set(centerX, 0.08, z);
    scene.add(trim);
  });

  const lantern = new THREE.PointLight(0xff9d4a, 0.45, 3.6, 2.6);
  lantern.position.set(centerX, CORR13_H - 0.2, cz);
  scene.add(lantern);
  corridor13Light = lantern;

  const strand = new THREE.Mesh(new THREE.PlaneGeometry(CORR13_W*0.85, 0.4),
    new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
  strand.position.set(centerX, CORR13_H - 0.45, cz);
  strand.rotation.y = Math.PI/2;
  scene.add(strand);

  // walkable zone bridging room11's west doorway and room13's east doorway
  obstacles.push({minX:CORR13_WEST_X-1.0, maxX:CORR13_EAST_X+1.0, minZ:cz-CORR13_W/2, maxZ:cz+CORR13_W/2, isRoomBound:true});
}

function buildRoom13(){
  const cz = ROOM13_CENTER_Z;
  const centerX = (ROOM13_WEST_X + ROOM13_EAST_X) / 2;
  const wTex = wallTexture(); wTex.repeat.set(3.2, 1.5);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  // floor/ceiling: X-extent and Z-extent both use ROOM13_W, since
  // that's the same constant that defines the room's real east/west
  // wall positions (ROOM13_EAST_X/WEST_X) AND the room's real
  // north/south wall spacing below - keeps every wall's corner
  // meeting cleanly instead of overshooting or falling short.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM13_W, ROOM13_W), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM13_W, ROOM13_W), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, ROOM13_H, cz);
  scene.add(ceil);

  // west wall - solid dead end for now
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM13_W, ROOM13_H), wallMat.clone());
  westWall.position.set(ROOM13_WEST_X, ROOM13_H/2, cz);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // north wall - solid. Runs along X at fixed Z, so it needs NO
  // y-rotation (its local width already lies on world X). Default
  // normal (+Z) already faces into the room from the north side.
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM13_W, ROOM13_H), wallMat.clone());
  northWall.position.set(centerX, ROOM13_H/2, cz - ROOM13_W/2);
  scene.add(northWall);

  // south wall - solid. Also runs along X at fixed Z, so its local
  // width also lies on world X, but it needs a 180° flip so its
  // normal (-Z) faces back into the room from the south side.
  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM13_W, ROOM13_H), wallMat.clone());
  southWall.position.set(centerX, ROOM13_H/2, cz + ROOM13_W/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // east wall - carries the doorway gap back through corridor13 to room11
  const gapHalf = GATE13_GAPHALF;
  const sideD = (ROOM13_W/2) - gapHalf;
  const eastTex = wallTexture(); eastTex.repeat.set(1.6,1.5);
  const eastMat = new THREE.MeshStandardMaterial({map:eastTex, roughness:0.95});

  const topPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM13_H), eastMat);
  topPanel.position.set(ROOM13_EAST_X, ROOM13_H/2, cz - (gapHalf + sideD/2));
  topPanel.rotation.y = -Math.PI/2;
  scene.add(topPanel);

  const botPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM13_H), eastMat.clone());
  botPanel.position.set(ROOM13_EAST_X, ROOM13_H/2, cz + (gapHalf + sideD/2));
  botPanel.rotation.y = -Math.PI/2;
  scene.add(botPanel);

  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM13_H-DOOR_H), eastMat.clone());
  lintel.position.set(ROOM13_EAST_X, DOOR_H+(ROOM13_H-DOOR_H)/2, cz);
  lintel.rotation.y = -Math.PI/2;
  scene.add(lintel);

  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.16, DOOR_H+0.1, 0.24);
  const ft1 = new THREE.Mesh(frameSide, frameMat); ft1.position.set(ROOM13_EAST_X, DOOR_H/2+0.05, cz-gapHalf-0.1);
  const ft2 = new THREE.Mesh(frameSide, frameMat); ft2.position.set(ROOM13_EAST_X, DOOR_H/2+0.05, cz+gapHalf+0.1);
  const ftt = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, gapHalf*2+0.32), frameMat); ftt.position.set(ROOM13_EAST_X, DOOR_H+0.1, cz);
  scene.add(ft1, ft2, ftt);

  // baseboard trim
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM13_W,0.15,0.1), trimMat);
  trimN.position.set(centerX,0.08,cz-ROOM13_W/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM13_W,0.15,0.1), trimMat);
  trimS.position.set(centerX,0.08,cz+ROOM13_W/2); scene.add(trimS);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM13_W), trimMat);
  trimW.position.set(ROOM13_WEST_X,0.08,cz); scene.add(trimW);
  const trimET = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,sideD), trimMat);
  trimET.position.set(ROOM13_EAST_X,0.08,cz-(gapHalf+sideD/2)); scene.add(trimET);
  const trimEB = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,sideD), trimMat);
  trimEB.position.set(ROOM13_EAST_X,0.08,cz+(gapHalf+sideD/2)); scene.add(trimEB);

  // a single weak lantern
  const lamp = new THREE.PointLight(0xff9748, 0.6, 5.5, 2.3);
  lamp.position.set(centerX, ROOM13_H-0.3, cz);
  scene.add(lamp);
  room13Light = lamp;

  // cobwebs in the far (west) corners
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.0, [ROOM13_WEST_X+0.05, ROOM13_H-0.04, cz-ROOM13_W/2+0.05], [0, Math.PI/4, 0], 7, 0.25);
  fan(0.95, [ROOM13_WEST_X+0.05, ROOM13_H-0.04, cz+ROOM13_W/2-0.05], [0, -Math.PI/4+Math.PI/2, 0], 7, 0.3);

  // walkable zone - tight to room13's own real walls; doorway crossing back
  // into corridor13 (east) is handled by corridor13's own bridge zone
  obstacles.push({minX:ROOM13_WEST_X, maxX:ROOM13_EAST_X, minZ:cz-ROOM13_W/2, maxZ:cz+ROOM13_W/2, isRoomBound:true});
}
