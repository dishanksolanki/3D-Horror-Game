/* ============================================================
HAVELI OF SHADOWS — ROOM 9 (the great hall)
Opens directly off room 6's north wall - no corridor, the
doorway sits in the wall room 6 itself builds (room6.js has
been updated to cut a gap in its north wall for this).
This file only adds the other three walls, floor, ceiling,
structural pillars, and wall-mounted lighting. NO FURNITURE.

Requires engine.js and the updated room6.js to be loaded first.
============================================================ */

let room9Light;
let room9SconceLights = [];

function buildRoom9(){
  const cx = 0;
  const centerZ = (ROOM9_SOUTH_Z + ROOM9_NORTH_Z)/2;

  const wTex = wallTexture(); wTex.repeat.set(3.4, 1.7);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.95, metalness:0.02, side:THREE.DoubleSide});
  const floorMat = new THREE.MeshStandardMaterial({map:floorTexture(), roughness:0.9});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_W, ROOM9_D), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(cx, 0, centerZ);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_W, ROOM9_D), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(cx, ROOM9_H, centerZ);
  scene.add(ceil);

  // north wall - solid dead end, with a small barred slit window set
  // high up, letting a thin shaft of moonlight into the hall
  const winGapHalf = 0.55;
  const winSideW = (ROOM9_W/2) - winGapHalf;
  const nLeftPanel = new THREE.Mesh(new THREE.PlaneGeometry(winSideW, ROOM9_H), wallMat.clone());
  nLeftPanel.position.set(cx-(winGapHalf+winSideW/2), ROOM9_H/2, ROOM9_NORTH_Z);
  scene.add(nLeftPanel);
  const nRightPanel = new THREE.Mesh(new THREE.PlaneGeometry(winSideW, ROOM9_H), wallMat.clone());
  nRightPanel.position.set(cx+(winGapHalf+winSideW/2), ROOM9_H/2, ROOM9_NORTH_Z);
  scene.add(nRightPanel);
  // solid strip below the window slit
  const winSillY = ROOM9_H*0.55, winTopY = ROOM9_H*0.85;
  const belowWin = new THREE.Mesh(new THREE.PlaneGeometry(winGapHalf*2, winSillY), wallMat.clone());
  belowWin.position.set(cx, winSillY/2, ROOM9_NORTH_Z);
  scene.add(belowWin);
  const aboveWin = new THREE.Mesh(new THREE.PlaneGeometry(winGapHalf*2, ROOM9_H-winTopY), wallMat.clone());
  aboveWin.position.set(cx, winTopY+(ROOM9_H-winTopY)/2, ROOM9_NORTH_Z);
  scene.add(aboveWin);
  // iron bars across the slit, purely decorative/structural, not furniture
  const barMat = new THREE.MeshStandardMaterial({map:rustyMetalTexture(), metalness:0.7, roughness:0.5});
  for(let i=-1;i<=1;i++){
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,winTopY-winSillY,6), barMat);
    bar.rotation.x = Math.PI/2;
    bar.position.set(cx+i*(winGapHalf*0.6), (winSillY+winTopY)/2, ROOM9_NORTH_Z+0.02);
    scene.add(bar);
  }
  // faint pale light glowing through the slit
  const winGlow = new THREE.PointLight(0x9fb0c9, 0.35, 4, 2.2);
  winGlow.position.set(cx, (winSillY+winTopY)/2, ROOM9_NORTH_Z+0.6);
  scene.add(winGlow);

  // east wall - solid
  const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_D, ROOM9_H), wallMat.clone());
  eastWall.position.set(cx+ROOM9_W/2, ROOM9_H/2, centerZ);
  eastWall.rotation.y = -Math.PI/2;
  scene.add(eastWall);

  // west wall - solid
  const westWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM9_D, ROOM9_H), wallMat.clone());
  westWall.position.set(cx-ROOM9_W/2, ROOM9_H/2, centerZ);
  westWall.rotation.y = Math.PI/2;
  scene.add(westWall);

  // note: the south wall (the doorway back into room 6) is built once, by
  // buildRoom6() in room6.js, so it isn't duplicated here.

  // baseboard trim along the solid walls
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM9_W,0.15,0.1), trimMat);
  trimN.position.set(cx,0.08,ROOM9_NORTH_Z); scene.add(trimN);
  const trimE = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM9_D), trimMat);
  trimE.position.set(cx+ROOM9_W/2,0.08,centerZ); scene.add(trimE);
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM9_D), trimMat);
  trimW.position.set(cx-ROOM9_W/2,0.08,centerZ); scene.add(trimW);

  /* ---------------- structural stone pillars (not furniture) ---------------- */
  const pillarMat = new THREE.MeshStandardMaterial({color:0x3a3228, roughness:0.9});
  const pillarXOff = ROOM9_W/2 - 0.7;
  const pillarZs = [
    ROOM9_SOUTH_Z - 2.0,
    ROOM9_SOUTH_Z - (ROOM9_D/2),
    ROOM9_SOUTH_Z - (ROOM9_D - 2.0)
  ];
  const makePillar = (px,pz)=>{
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.32,0.18,12), pillarMat);
    base.position.y = 0.09;
    group.add(base);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.22,ROOM9_H-0.5,12), pillarMat);
    shaft.position.y = 0.18 + (ROOM9_H-0.5)/2;
    shaft.castShadow = true;
    group.add(shaft);
    const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.22,0.22,12), pillarMat);
    capital.position.y = ROOM9_H - 0.21;
    group.add(capital);
    group.position.set(px,0,pz);
    scene.add(group);
    obstacles.push(boxFor(new THREE.Vector3(px,0,pz), 0.24, 0.24, 0.05));
  };
  pillarZs.forEach(pz=>{
    makePillar(cx-pillarXOff, pz);
    makePillar(cx+pillarXOff, pz);
  });

  /* ---------------- wall-mounted torch sconces (lighting, not furniture) ---------------- */
  const makeSconce = (px,pz,rotY)=>{
    const group = new THREE.Group();
    const bracketMat = new THREE.MeshStandardMaterial({map:rustyMetalTexture(), metalness:0.6, roughness:0.5});
    const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.03,0.22,8), bracketMat);
    bracket.rotation.z = Math.PI/2.4;
    bracket.position.set(0, 1.85, 0.1);
    group.add(bracket);
    const flameMat = new THREE.MeshStandardMaterial({color:0xffaa33, emissive:0xff7a1a, emissiveIntensity:1.3});
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05,0.16,8), flameMat);
    flame.position.set(0, 2.0, 0.2);
    group.add(flame);
    const light = new THREE.PointLight(0xff8a3d, 0.6, 5, 2.3);
    light.position.set(0, 2.0, 0.2);
    group.add(light);
    room9SconceLights.push(light);
    group.position.set(px,0,pz);
    group.rotation.y = rotY;
    scene.add(group);
  };
  makeSconce(cx-ROOM9_W/2+0.02, ROOM9_SOUTH_Z-2.2, Math.PI/2);
  makeSconce(cx+ROOM9_W/2-0.02, ROOM9_SOUTH_Z-2.2, -Math.PI/2);
  makeSconce(cx-ROOM9_W/2+0.02, ROOM9_NORTH_Z+2.2, Math.PI/2);
  makeSconce(cx+ROOM9_W/2-0.02, ROOM9_NORTH_Z+2.2, -Math.PI/2);

  // a dim, general hall glow so the space doesn't read as pitch black
  // between the sconces
  const glow = new THREE.PointLight(0xd9b98a, 0.3, 9, 2.0);
  glow.position.set(cx, ROOM9_H-0.3, centerZ);
  scene.add(glow);
  room9Light = glow;

  /* ---------------- cobwebs, consistent with the rest of the haveli ---------------- */
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size),
      new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false}));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(1.1, [cx-ROOM9_W/2+0.05, ROOM9_H-0.04, ROOM9_NORTH_Z+0.05], [0, Math.PI/4, 0], 8, 0.15);
  fan(1.0, [cx+ROOM9_W/2-0.05, ROOM9_H-0.04, ROOM9_NORTH_Z+0.05], [0, -Math.PI/4, 0], 8, 0.2);
  fan(0.8, [cx-ROOM9_W/2+0.05, ROOM9_H-0.04, ROOM9_SOUTH_Z-0.05], [0, Math.PI/4+Math.PI/2, 0], 6, 0.25);
  fan(0.8, [cx+ROOM9_W/2-0.05, ROOM9_H-0.04, ROOM9_SOUTH_Z-0.05], [0, -Math.PI/4-Math.PI/2, 0], 6, 0.2);

  /* ---------------- walkable zone - tight fit against the hall's own
     walls, no padding. Crossing into room 6 is handled entirely by the
     doorway bridge zone pushed in room6.js, so there's no gap here for
     the player to slip through solid wall. ---------------- */
  obstacles.push({minX:cx-ROOM9_W/2, maxX:cx+ROOM9_W/2, minZ:ROOM9_NORTH_Z, maxZ:ROOM9_SOUTH_Z, isRoomBound:true});
}
