/* ============================================================
PATCH FOR room6.js
Replace this block in buildRoom6():

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

WITH the block below. It cuts a doorway-sized gap (with a
lintel above door height) in both walls instead of building
them solid, so room 7 (east) and room 8 (west) connect through.
============================================================ */

// east wall - doorway through to room 7
const eastSpan = (ROOM6_D - GATE7_GAPHALF*2)/2;
const eastWallN = new THREE.Mesh(new THREE.PlaneGeometry(eastSpan, ROOM6_H), wallMat.clone());
eastWallN.position.set(cx+ROOM6_W/2, ROOM6_H/2, ROOM6_NORTH_Z + eastSpan/2);
eastWallN.rotation.y = -Math.PI/2;
scene.add(eastWallN);
const eastWallS = new THREE.Mesh(new THREE.PlaneGeometry(eastSpan, ROOM6_H), wallMat.clone());
eastWallS.position.set(cx+ROOM6_W/2, ROOM6_H/2, ROOM6_SOUTH_Z - eastSpan/2);
eastWallS.rotation.y = -Math.PI/2;
scene.add(eastWallS);
const eastLintel = new THREE.Mesh(new THREE.PlaneGeometry(GATE7_GAPHALF*2, ROOM6_H - DOOR_H), wallMat.clone());
eastLintel.position.set(cx+ROOM6_W/2, DOOR_H + (ROOM6_H-DOOR_H)/2, centerZ);
eastLintel.rotation.y = -Math.PI/2;
scene.add(eastLintel);

// west wall - doorway through to room 8
const westSpan = (ROOM6_D - GATE8_GAPHALF*2)/2;
const westWallN = new THREE.Mesh(new THREE.PlaneGeometry(westSpan, ROOM6_H), wallMat.clone());
westWallN.position.set(cx-ROOM6_W/2, ROOM6_H/2, ROOM6_NORTH_Z + westSpan/2);
westWallN.rotation.y = Math.PI/2;
scene.add(westWallN);
const westWallS = new THREE.Mesh(new THREE.PlaneGeometry(westSpan, ROOM6_H), wallMat.clone());
westWallS.position.set(cx-ROOM6_W/2, ROOM6_H/2, ROOM6_SOUTH_Z - westSpan/2);
westWallS.rotation.y = Math.PI/2;
scene.add(westWallS);
const westLintel = new THREE.Mesh(new THREE.PlaneGeometry(GATE8_GAPHALF*2, ROOM6_H - DOOR_H), wallMat.clone());
westLintel.position.set(cx-ROOM6_W/2, DOOR_H + (ROOM6_H-DOOR_H)/2, centerZ);
westLintel.rotation.y = Math.PI/2;
scene.add(westLintel);

/* ------------------------------------------------------------
Also extend room 6's own walkable zone so movement through both
new doorways is seamless (find this line near the end of
buildRoom6() and replace it):

    obstacles.push({minX:cx-ROOM6_W/2, maxX:cx+ROOM6_W/2, minZ:ROOM6_NORTH_Z, maxZ:ROOM6_SOUTH_Z+1.0, isRoomBound:true});

replace with:

    obstacles.push({minX:cx-ROOM6_W/2-1.0, maxX:cx+ROOM6_W/2+1.0, minZ:ROOM6_NORTH_Z, maxZ:ROOM6_SOUTH_Z+1.0, isRoomBound:true});
------------------------------------------------------------ */
