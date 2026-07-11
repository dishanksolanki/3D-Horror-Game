/* ============================================================
HAVELI OF SHADOWS — ROOM 12 (east wing)

Opens off room 11's EAST wall via corridor12, an extremely
short 0.25-metre stone connector — same tight-threshold style
as corridor11 (room11.js). Requires engine.js and room11.js to
be loaded first, AND requires the room11.js patch (see
room11_patch.js) that cuts a doorway gap into room 11's east
wall — without that patch this room is unreachable.
============================================================ */

/* ---- shared sizing for this wing, all derived off room11's own
existing constants so it lines up regardless of room11's real
numbers ---- */
const GATE12_GAPHALF = 0.9; // half-width of room11's east doorway
const CORR12_LEN = 0.25; // the requested 0.25m corridor
const CORR12_W = GATE12_GAPHALF * 2;
const CORR12_H = 2.3;
const CORR12_WEST_X = ROOM11_W / 2; // starts at room11's east wall
const CORR12_EAST_X = CORR12_WEST_X + CORR12_LEN;

const ROOM12_W = 5.0, ROOM12_D = 5.6, ROOM12_H = 3.05;
const ROOM12_WEST_X = CORR12_EAST_X; // room12's west wall (doorway) x
const ROOM12_EAST_X = ROOM12_WEST_X + ROOM12_W;
const ROOM12_CENTER_Z = (ROOM11_SOUTH_Z + ROOM11_NORTH_Z) / 2; // flush with room11's own z-center

/* FIX: room12Light and corridor12Light were being re-declared here with
`let`, but engine.js already declares them as globals near its top
(`let corridor11Light, room11Light, corridor12Light, room12Light, ...`).
Since none of these files are ES modules, every <script> tag shares one
global scope, so this second `let` collided with engine.js's and threw
"Identifier 'room12Light' has already been declared". Just assign the
already-declared globals below instead of re-declaring them. */

function buildCorridor12(){
const centerX = (CORR12_WEST_X + CORR12_EAST_X) / 2;
const cz = ROOM12_CENTER_Z;
const wTex = wallTexture(); wTex.repeat.set(0.5, 1.3);
const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(CORR12_LEN, CORR12_W), floorMat);
floor.rotation.x = -Math.PI/2;
floor.position.set(centerX, 0, cz);
floor.receiveShadow = true;
scene.add(floor);

const ceil = new THREE.Mesh(new THREE.PlaneGeometry(CORR12_LEN, CORR12_W), ceilMat);
ceil.rotation.x = Math.PI/2;
ceil.position.set(centerX, CORR12_H, cz);
scene.add(ceil);

// short north/south stub walls, same "tight connector" logic as corridor11
const northWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR12_LEN, CORR12_H), wallMat);
northWall.position.set(centerX, CORR12_H/2, cz - CORR12_W/2);
northWall.rotation.y = Math.PI/2;
scene.add(northWall);

const southWall = new THREE.Mesh(new THREE.PlaneGeometry(CORR12_LEN, CORR12_H), wallMat.clone());
southWall.position.set(centerX, CORR12_H/2, cz + CORR12_W/2);
southWall.rotation.y = -Math.PI/2;
scene.add(southWall);

const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
[cz - CORR12_W/2, cz + CORR12_W/2].forEach(z => {
const trim = new THREE.Mesh(new THREE.BoxGeometry(CORR12_LEN, 0.15, 0.1), trimMat);
trim.position.set(centerX, 0.08, z);
scene.add(trim);
});

const lantern = new THREE.PointLight(0xff9d4a, 0.45, 3.6, 2.6);
lantern.position.set(centerX, CORR12_H - 0.2, cz);
scene.add(lantern);
corridor12Light = lantern;

const strand = new THREE.Mesh(new THREE.PlaneGeometry(CORR12_W*0.85, 0.4),
new THREE.MeshBasicMaterial({map:strandWebTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
strand.position.set(centerX, CORR12_H - 0.45, cz);
strand.rotation.y = Math.PI/2;
scene.add(strand);

// walkable zone bridging room11's east doorway and room12's west doorway
obstacles.push({minX:CORR12_WEST_X-1.0, maxX:CORR12_EAST_X+1.0, minZ:cz-CORR12_W/2, maxZ:cz+CORR12_W/2, isRoomBound:true});
}

function buildRoom12(){
const cz = ROOM12_CENTER_Z;
const centerX = (ROOM12_WEST_X + ROOM12_EAST_X) / 2;
const wTex = wallTexture(); wTex.repeat.set(3.2, 1.5);
const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02});
const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_D, ROOM12_W), floorMat);
floor.rotation.x = -Math.PI/2;
floor.position.set(centerX, 0, cz);
floor.receiveShadow = true;
scene.add(floor);

const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_D, ROOM12_W), ceilMat);
ceil.rotation.x = Math.PI/2;
ceil.position.set(centerX, ROOM12_H, cz);
scene.add(ceil);

// east wall - solid dead end for now
const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_W, ROOM12_H), wallMat.clone());
eastWall.position.set(ROOM12_EAST_X, ROOM12_H/2, cz);
eastWall.rotation.y = -Math.PI/2;
scene.add(eastWall);

// north wall - solid
const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_D, ROOM12_H), wallMat.clone());
northWall.position.set(centerX, ROOM12_H/2, cz - ROOM12_W/2);
northWall.rotation.y = Math.PI/2;
scene.add(northWall);

// south wall - solid
const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM12_D, ROOM12_H), wallMat.clone());
southWall.position.set(centerX, ROOM12_H/2, cz + ROOM12_W/2);
southWall.rotation.y = -Math.PI/2;
scene.add(southWall);

// west wall - carries the doorway gap back through corridor12 to room11.
// Panels face back INTO room12 (rotation.y = -PI/2 side already handled by
// BoxGeometry orientation below via plane rotation)
const gapHalf = GATE12_GAPHALF;
const sideD = (ROOM12_W/2) - gapHalf;
const westTex = wallTexture(); westTex.repeat.set(1.6,1.5);
const westMat = new THREE.MeshStandardMaterial({map:westTex, roughness:0.95});

const topPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM12_H), westMat);
topPanel.position.set(ROOM12_WEST_X, ROOM12_H/2, cz - (gapHalf + sideD/2));
topPanel.rotation.y = Math.PI/2;
scene.add(topPanel);

const botPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM12_H), westMat.clone());
botPanel.position.set(ROOM12_WEST_X, ROOM12_H/2, cz + (gapHalf + sideD/2));
botPanel.rotation.y = Math.PI/2;
scene.add(botPanel);

const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.4, ROOM12_H-DOOR_H), westMat.clone());
lintel.position.set(ROOM12_WEST_X, DOOR_H+(ROOM12_H-DOOR_H)/2, cz);
lintel.rotation.y = Math.PI/2;
scene.add(lintel);

const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
const frameSide = new THREE.BoxGeometry(0.16, DOOR_H+0.1, 0.24);
const ft1 = new THREE.Mesh(frameSide, frameMat); ft1.position.set(ROOM12_WEST_X, DOOR_H/2+0.05, cz-gapHalf-0.1);
const ft2 = new THREE.Mesh(frameSide, frameMat); ft2.position.set(ROOM12_WEST_X, DOOR_H/2+0.05, cz+gapHalf+0.1);
const ftt = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, gapHalf*2+0.32), frameMat); ftt.position.set(ROOM12_WEST_X, DOOR_H+0.1, cz);
scene.add(ft1, ft2, ftt);

// baseboard trim
const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM12_D,0.15,0.1), trimMat);
trimN.position.set(centerX,0.08,cz-ROOM12_W/2); scene.add(trimN);
const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM12_D,0.15,0.1), trimMat);
trimS.position.set(centerX,0.08,cz+ROOM12_W/2); scene.add(trimS);
const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM12_W), trimMat);
trimE.position.set(ROOM12_EAST_X,0.08,cz); scene.add(trimE);
const trimWT = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,sideD), trimMat);
trimWT.position.set(ROOM12_WEST_X,0.08,cz-(gapHalf+sideD/2)); scene.add(trimWT);
const trimWB = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,sideD), trimMat);
trimWB.position.set(ROOM12_WEST_X,0.08,cz+(gapHalf+sideD/2)); scene.add(trimWB);

// a single weak lantern
const lamp = new THREE.PointLight(0xff9748, 0.6, 5.5, 2.3);
lamp.position.set(centerX, ROOM12_H-0.3, cz);
scene.add(lamp);
room12Light = lamp;

// cobwebs in the far (east) corners
const fan = (size,pos,rot,density,torn)=>{
const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
web.position.set(...pos); web.rotation.set(...rot);
scene.add(web);
};
fan(1.0, [ROOM12_EAST_X-0.05, ROOM12_H-0.04, cz-ROOM12_W/2+0.05], [0, -Math.PI/4, 0], 7, 0.25);
fan(0.95, [ROOM12_EAST_X-0.05, ROOM12_H-0.04, cz+ROOM12_W/2-0.05], [0, Math.PI/4+Math.PI/2, 0], 7, 0.3);

// walkable zone - tight to room12's own real walls; doorway crossing back
// into corridor12 (west) is handled by corridor12's own bridge zone
obstacles.push({minX:ROOM12_WEST_X, maxX:ROOM12_EAST_X, minZ:cz-ROOM12_W/2, maxZ:cz+ROOM12_W/2, isRoomBound:true});
}
