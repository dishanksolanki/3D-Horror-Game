/* ============================================================
   HAVELI OF SHADOWS — WASHROOM 1
   A small washroom opening directly off Room 2's west wall.
   Requires engine.js and room2.js to be loaded first.
   ============================================================ */

function bathroomTileTexture(){
  // old, grimy ceramic tiles - a grid of once-white squares gone yellow and
  // cracked, dark grout lines, mildew blotches creeping up from the grout,
  // and a few tiles chipped away to show the dark backing beneath
  const S = 512;
  const c = makeCanvas(S,S), ctx = c.getContext('2d');
  ctx.fillStyle = '#1c1a16'; ctx.fillRect(0,0,S,S); // grout base
  const cols = 8, rows = 8, tw = S/cols, th = S/rows, grout = 3;
  for(let r=0;r<rows;r++){
    for(let col=0;col<cols;col++){
      const x = col*tw, y = r*th;
      const missing = Math.random() < 0.045;
      if(missing){
        // chipped-away tile, dark backing showing through
        ctx.fillStyle = `rgba(${18+Math.random()*10},${14+Math.random()*8},${10+Math.random()*6},1)`;
        ctx.fillRect(x+grout, y+grout, tw-grout*2, th-grout*2);
        continue;
      }
      const shade = 180+Math.random()*40;
      const yellow = Math.random()*22;
      ctx.fillStyle = `rgb(${shade-yellow*0.2},${shade-yellow*0.5},${shade-yellow*0.9})`;
      ctx.fillRect(x+grout, y+grout, tw-grout*2, th-grout*2);
      // faint hairline crack on some tiles
      if(Math.random()<0.2){
        ctx.strokeStyle='rgba(40,35,30,0.5)'; ctx.lineWidth=0.8;
        ctx.beginPath();
        let px=x+grout+Math.random()*(tw-grout*2), py=y+grout;
        ctx.moveTo(px,py);
        const segs=2+Math.floor(Math.random()*3);
        for(let s=0;s<segs;s++){ px+=(Math.random()-0.5)*14; py+=th/segs; ctx.lineTo(px,py); }
        ctx.stroke();
      }
    }
  }
  // mildew/damp blotches, worse toward the bottom of the texture (floor-level grime)
  for(let i=0;i<26;i++){
    const x=Math.random()*S, y=S*0.5+Math.random()*S*0.5, r=8+Math.random()*30;
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba(35,45,25,0.4)');
    g.addColorStop(0.6,'rgba(20,30,15,0.22)');
    g.addColorStop(1,'rgba(20,30,15,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  // fine grime speckle over everything
  for(let i=0;i<2500;i++){
    ctx.fillStyle = `rgba(15,15,12,${Math.random()*0.1})`;
    ctx.fillRect(Math.random()*S, Math.random()*S, 1,1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAniso;
  return tex;
}


function buildRoom4(){
  // the smallest room in the haveli so far - a cramped, low-ceilinged old
  // washroom entered directly through a gap in room 2's own west wall. No
  // corridor; you just step through. Three of its four walls are solid
  // dead-ends, same "close it off for now" pattern used for room 3.
  const cz = ROOM4_CENTER_Z;
  const centerX = (ROOM4_WEST_X + ROOM4_EAST_X)/2;

  const wTex = bathroomTileTexture(); wTex.wrapS = wTex.wrapT = THREE.RepeatWrapping; wTex.repeat.set(2, 1.1);
  const wallMat = new THREE.MeshStandardMaterial({map:wTex, roughness:0.9, metalness:0.02});
  const fTex = bathroomTileTexture(); fTex.wrapS = fTex.wrapT = THREE.RepeatWrapping; fTex.repeat.set(2.4, 2.4);
  const floorMat = new THREE.MeshStandardMaterial({map:fTex, roughness:0.75, metalness:0.03});
  const ceilMat = new THREE.MeshStandardMaterial({map:ceilingTexture(), roughness:1});

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM4_D, ROOM4_W), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(centerX, 0, cz);
  floor.receiveShadow = true;
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM4_D, ROOM4_W), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(centerX, ROOM4_H, cz);
  scene.add(ceil);

  // west (far) wall - solid dead-end, the washroom's back wall
  const westFarWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM4_W, ROOM4_H), wallMat);
  westFarWall.position.set(ROOM4_WEST_X, ROOM4_H/2, cz);
  westFarWall.rotation.y = Math.PI/2;
  scene.add(westFarWall);

  // north and south walls, solid - this nook is a dead end off room 2
  const northWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM4_D, ROOM4_H), wallMat.clone());
  northWall.position.set(centerX, ROOM4_H/2, cz-ROOM4_W/2);
  scene.add(northWall);

  const southWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM4_D, ROOM4_H), wallMat.clone());
  southWall.position.set(centerX, ROOM4_H/2, cz+ROOM4_W/2);
  southWall.rotation.y = Math.PI;
  scene.add(southWall);

  // east wall carries the doorway gap back into room 2 - narrower and
  // lower than the other doorways, to sell the cramped scale
  const gapHalf = GATE4_GAPHALF;
  const sideD = (ROOM4_W/2) - gapHalf;
  const eastTex = bathroomTileTexture(); eastTex.wrapS = eastTex.wrapT = THREE.RepeatWrapping; eastTex.repeat.set(1,1.1);
  const eastMat = new THREE.MeshStandardMaterial({map:eastTex, roughness:0.9});

  const nearPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM4_H), eastMat);
  nearPanel.position.set(ROOM4_EAST_X, ROOM4_H/2, cz-(gapHalf+sideD/2));
  nearPanel.rotation.y = -Math.PI/2;
  scene.add(nearPanel);

  const farPanel = new THREE.Mesh(new THREE.PlaneGeometry(sideD, ROOM4_H), eastMat.clone());
  farPanel.position.set(ROOM4_EAST_X, ROOM4_H/2, cz+(gapHalf+sideD/2));
  farPanel.rotation.y = -Math.PI/2;
  scene.add(farPanel);

  const doorH4 = DOOR_H*0.85;
  const lintel = new THREE.Mesh(new THREE.PlaneGeometry(gapHalf*2+0.3, ROOM4_H-doorH4), eastMat.clone());
  lintel.position.set(ROOM4_EAST_X, doorH4+(ROOM4_H-doorH4)/2, cz);
  lintel.rotation.y = -Math.PI/2;
  scene.add(lintel);

  // small carved door frame, same family as the rest of the haveli
  const frameMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const frameSide = new THREE.BoxGeometry(0.24, doorH4+0.1, 0.16);
  const fn = new THREE.Mesh(frameSide, frameMat); fn.position.set(ROOM4_EAST_X, doorH4/2+0.05, cz-gapHalf-0.08);
  const fs = new THREE.Mesh(frameSide, frameMat); fs.position.set(ROOM4_EAST_X, doorH4/2+0.05, cz+gapHalf+0.08);
  const ft = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.16,gapHalf*2+0.32), frameMat); ft.position.set(ROOM4_EAST_X,doorH4+0.08,cz);
  scene.add(fn,fs,ft);

  // baseboard trim on the three solid walls
  const trimMat = new THREE.MeshStandardMaterial({color:0x120c08, roughness:1});
  const trimW = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,ROOM4_W), trimMat);
  trimW.position.set(ROOM4_WEST_X,0.08,cz); scene.add(trimW);
  const trimN = new THREE.Mesh(new THREE.BoxGeometry(ROOM4_D,0.15,0.1), trimMat);
  trimN.position.set(centerX,0.08,cz-ROOM4_W/2); scene.add(trimN);
  const trimS = new THREE.Mesh(new THREE.BoxGeometry(ROOM4_D,0.15,0.1), trimMat);
  trimS.position.set(centerX,0.08,cz+ROOM4_W/2); scene.add(trimS);

  // --- floor drain set into the tile, just south of the toilet ---
  const drainMat = new THREE.MeshBasicMaterial({color:0x0a0a08});
  const drain = new THREE.Mesh(new THREE.CircleGeometry(0.09,16), drainMat);
  drain.rotation.x = -Math.PI/2;
  drain.position.set(ROOM4_WEST_X+0.75, 0.006, cz+0.55);
  scene.add(drain);
  const drainRing = new THREE.Mesh(new THREE.RingGeometry(0.09,0.1,16),
    new THREE.MeshStandardMaterial({color:0x3a3a34, metalness:0.6, roughness:0.5}));
  drainRing.rotation.x = -Math.PI/2;
  drainRing.position.set(ROOM4_WEST_X+0.75, 0.007, cz+0.55);
  scene.add(drainRing);

  // --- an old Indian-style squat toilet pan set into a low ceramic platform,
  // against the back wall ---
  const ceramicMat = new THREE.MeshStandardMaterial({color:0xd8d4c8, roughness:0.5, metalness:0.05});
  const stainMat = new THREE.MeshStandardMaterial({color:0x8f8a6f, roughness:0.6, metalness:0.03});
  const platform = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.12,0.62), ceramicMat);
  platform.position.set(ROOM4_WEST_X+0.55, 0.06, cz+0.4);
  scene.add(platform);
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.13,0.08,16), stainMat);
  pan.position.set(ROOM4_WEST_X+0.55, 0.14, cz+0.4);
  scene.add(pan);
  // foot ridges either side of the pan
  [-0.2,0.2].forEach(dz=>{
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.03,0.12), ceramicMat);
    ridge.position.set(ROOM4_WEST_X+0.55, 0.13, cz+0.4+dz);
    scene.add(ridge);
  });
  obstacles.push({minX:platform.position.x-0.4, maxX:platform.position.x+0.4, minZ:cz+0.4-0.36, maxZ:cz+0.4+0.36});

  // --- a rusty wall tap with a short pipe, above a dark damp stain running
  // down the tile - the water's long since stopped working ---
  const rustTex = rustyMetalTexture();
  const metalMat = new THREE.MeshStandardMaterial({map:rustTex, metalness:0.6, roughness:0.6});
  const stainStreak = new THREE.Mesh(new THREE.PlaneGeometry(0.3,1.1),
    new THREE.MeshBasicMaterial({color:0x1a2015, transparent:true, opacity:0.55, depthWrite:false}));
  stainStreak.position.set(ROOM4_WEST_X+0.02, 1.3, cz-0.7);
  stainStreak.rotation.y = Math.PI/2;
  scene.add(stainStreak);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.5,8), metalMat);
  pipe.rotation.z = Math.PI/2;
  pipe.position.set(ROOM4_WEST_X+0.15, 1.75, cz-0.7);
  scene.add(pipe);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.14,8), metalMat);
  tap.rotation.x = Math.PI/2.6;
  tap.position.set(ROOM4_WEST_X+0.36, 1.7, cz-0.7);
  scene.add(tap);

  // --- a dented bucket and mug tucked in the corner, the room's only other
  // furnishing ---
  const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.13,0.26,14), metalMat);
  bucket.position.set(ROOM4_EAST_X-0.45, 0.13, cz-0.95);
  scene.add(bucket);
  const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15,0.008,6,12,Math.PI),
    new THREE.MeshStandardMaterial({color:0x2a2a26, metalness:0.7, roughness:0.5}));
  bucketHandle.position.set(ROOM4_EAST_X-0.45, 0.28, cz-0.95);
  bucketHandle.rotation.x = Math.PI/2;
  scene.add(bucketHandle);
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.045,0.06,10), metalMat.clone());
  mug.position.set(ROOM4_EAST_X-0.6, 0.03, cz-0.75);
  scene.add(mug);
  obstacles.push({minX:ROOM4_EAST_X-0.62, maxX:ROOM4_EAST_X-0.28, minZ:cz-1.12, maxZ:cz-0.6});

  // --- a small cracked mirror over a narrow ledge, by the door ---
  const ledgeMat = new THREE.MeshStandardMaterial({color:0x2a1a0e, roughness:0.85});
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.04,0.14), ledgeMat);
  ledge.position.set(ROOM4_EAST_X-0.35, 1.05, cz+1.05);
  scene.add(ledge);
  const mirrorMat = new THREE.MeshStandardMaterial({map:tarnishedMirrorTexture(), roughness:0.4, metalness:0.3});
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(0.32,0.4), mirrorMat);
  mirror.position.set(ROOM4_EAST_X-0.02, 1.4, cz+1.05);
  mirror.rotation.y = -Math.PI/2;
  scene.add(mirror);

  // --- a dark, dried handprint smeared low on the tile beside the toilet -
  // the one horror flourish this small room keeps ---
  const hpMat = new THREE.MeshBasicMaterial({map:bloodHandprintTexture('dried'), transparent:true, depthWrite:false});
  const hp = new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.4), hpMat);
  hp.position.set(ROOM4_WEST_X+0.251, 0.55, cz+0.85);
  hp.rotation.y = Math.PI/2;
  scene.add(hp);

  // a single bare, sickly bulb instead of a warm one - this room reads
  // colder and more clinical than the rest of the haveli
  const flame = new THREE.PointLight(0xc9d9c0, 0.55, 3.2, 2.4);
  flame.position.set(centerX, ROOM4_H-0.2, cz);
  scene.add(flame);
  room4Light = flame;

  // heavy cobwebs choking the low corners - this nook hasn't been opened
  // in a long time
  const fanMat = (density,torn)=> new THREE.MeshBasicMaterial({map:cobwebTextureVariant(density,torn), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const fan = (size,pos,rot,density,torn)=>{
    const web = new THREE.Mesh(new THREE.PlaneGeometry(size,size), fanMat(density,torn));
    web.position.set(...pos); web.rotation.set(...rot);
    scene.add(web);
  };
  fan(0.9, [ROOM4_WEST_X+0.04, ROOM4_H-0.03, cz-ROOM4_W/2+0.04], [0, Math.PI/4, 0], 8, 0.1);
  fan(0.85, [ROOM4_WEST_X+0.04, ROOM4_H-0.03, cz+ROOM4_W/2-0.04], [0, -Math.PI/4, 0], 7, 0.15);

  // extended 1.0m past the shared wall into room 2 - the movement code
  // shrinks each zone inward by the player's radius before testing "inside",
  // so without this overlap the doorway itself becomes a dead strip neither
  // zone covers (same reason every corridor zone elsewhere overlaps too)
  obstacles.push({minX:ROOM4_WEST_X, maxX:ROOM4_EAST_X+1.0, minZ:cz-ROOM4_W/2, maxZ:cz+ROOM4_W/2, isRoomBound:true});
}
