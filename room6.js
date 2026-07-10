/* ============================================================
HAVELI OF SHADOWS — ROOM 6 (the ancestor's shrine)
Opens directly off room 2's north wall - no corridor, the
doorway sits right in the wall the shrine shares with room 2.
Also opens east into room 7 and west into room 8.
Requires engine.js and room2.js to be loaded first (room2.js
builds the shared doorway wall; this file only needs to add
the other three walls, floor, ceiling, and furniture).
============================================================ */

const GATE7_GAPHALF = 0.6;
const GATE8_GAPHALF = 0.6;

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

  // note: the south wall (the doorway back into room 2) is built once, by
  // buildRoom2() in room2.js, so it isn't duplicated here.

  // baseboard trim along the solid stretches of wall - the south threshold trim
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

  // walkable zone, overlapping south into room 2, east into room 7, and
  // west into room 8 so all three shared doorways feel seamless
  obstacles.push({minX:cx-ROOM6_W/2-1.0, maxX:cx+ROOM6_W/2+1.0, minZ:ROOM6_NORTH_Z, maxZ:ROOM6_SOUTH_Z+1.0, isRoomBound:true});
}

/* ---------------- room 6 shrine props ---------------- */

function shrineClothTexture(){
  // a worn, faded red altar cloth with a thin gold trim pattern woven
  // through it - not the crisp red of a fresh offering, but one that's
  // been sitting undisturbed for a long time
  const S = 128;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,S);
  g.addColorStop(0,'#7a1c1c'); g.addColorStop(1,'#4a1010');
  ctx.fillStyle = g; ctx.fillRect(0,0,S,S);
  for(let i=0;i<24;i++){
    ctx.strokeStyle = `rgba(200,160,80,${0.15+Math.random()*0.25})`;
    ctx.lineWidth = 1+Math.random();
    ctx.beginPath();
    ctx.moveTo(0, Math.random()*S);
    ctx.lineTo(S, Math.random()*S);
    ctx.stroke();
  }
  for(let i=0;i<900;i++){
    ctx.fillStyle = `rgba(20,4,4,${Math.random()*0.2})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1.2,1.2);
  }
  return new THREE.CanvasTexture(c);
}

function makeShrinePlatform(w,h,d,pos){
  const group = new THREE.Group();
  const stoneMat = new THREE.MeshStandardMaterial({color:0x2c2016, roughness:0.9});
  const base = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), stoneMat);
  base.position.y = h/2;
  base.castShadow = true; base.receiveShadow = true;
  group.add(base);
  const clothMat = new THREE.MeshStandardMaterial({map:shrineClothTexture(), roughness:0.85});
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(w+0.04,0.02,d+0.04), clothMat);
  cloth.position.y = h+0.01;
  group.add(cloth);
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeIdolFigure(scale, pos){
  // a simple carved brass figure - deliberately abstract rather than any
  // specific likeness, in keeping with the haveli's other props
  const group = new THREE.Group();
  const brassMat = new THREE.MeshStandardMaterial({color:0x8a6a2e, metalness:0.7, roughness:0.35});
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09*scale,0.11*scale,0.05*scale,10), brassMat);
  base.position.y = 0.025*scale;
  group.add(base);
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.08*scale,0.28*scale,10), brassMat);
  body.position.y = 0.05*scale + 0.14*scale;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.055*scale,10,8), brassMat);
  head.position.y = 0.05*scale + 0.28*scale + 0.045*scale;
  group.add(head);
  group.position.set(...pos);
  scene.add(group);
  return group;
}

function makeGarland(radius, pos, rotY){
  const mat = new THREE.MeshStandardMaterial({color:0xd88a2a, roughness:0.75});
  const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025, 8, 20), mat);
  torus.position.set(...pos);
  if(rotY !== undefined) torus.rotation.y = rotY; else torus.rotation.x = Math.PI/2;
  scene.add(torus);
  return torus;
}

function makeOilLamp(pos){
  const group = new THREE.Group();
  const dishMat = new THREE.MeshStandardMaterial({color:0x6a4a1a, metalness:0.6, roughness:0.4});
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.05,0.015,10), dishMat);
  group.add(dish);
  const flameMat = new THREE.MeshStandardMaterial({color:0xffaa33, emissive:0xff8822, emissiveIntensity:1.2});
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.012,0.035,6), flameMat);
  flame.position.y = 0.02;
  group.add(flame);
  const light = new THREE.PointLight(0xff9944, 0.4, 1.6, 2.6);
  light.position.y = 0.03;
  group.add(light);
  group.position.set(...pos);
  scene.add(group);
  return {group, light};
}

function buildRoom6Furniture(){
  const cx = 0;

  // --- raised stone altar against the north wall, draped in a faded cloth ---
  makeShrinePlatform(1.6, 0.5, 0.7, [cx, 0, ROOM6_NORTH_Z+0.55]);
  obstacles.push(boxFor(new THREE.Vector3(cx,0,ROOM6_NORTH_Z+0.55), 0.85, 0.4, 0.06));

  // --- a small brass idol at the centre of the altar, garlanded ---
  makeIdolFigure(1.0, [cx, 0.5, ROOM6_NORTH_Z+0.55]);
  makeGarland(0.13, [cx, 0.62, ROOM6_NORTH_Z+0.5], undefined);
  makeGarland(0.15, [cx, 0.56, ROOM6_NORTH_Z+0.48], undefined);

  // --- oil lamps flanking the idol, the only light sources in the room ---
  makeOilLamp([cx-0.55, 0.5, ROOM6_NORTH_Z+0.5]);
  makeOilLamp([cx+0.55, 0.5, ROOM6_NORTH_Z+0.5]);

  // --- a large marigold garland hanging from the ceiling above the altar ---
  makeGarland(0.5, [cx, ROOM6_H-0.2, ROOM6_NORTH_Z+0.6], Math.PI/2);

  // --- a straw mat before the altar where offerings would once have been laid ---
  const matMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1,0.7),
    new THREE.MeshStandardMaterial({map:shrineClothTexture(), transparent:true, roughness:0.9}));
  matMesh.rotation.x = -Math.PI/2;
  matMesh.position.set(cx, 0.006, ROOM6_NORTH_Z+1.3);
  scene.add(matMesh);
}
