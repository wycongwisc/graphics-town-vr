import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../libs/CS559-Three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from '../libs/CS559-Three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "../libs/CS559-Three/build/three.module.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";


const loader = new GLTFLoader();

let forkliftreset = false;
let arrived = false;
let retract = false;

export class GrFactoryCube extends GrObject {

  constructor(params = {}) {
    let factoryCube = new T.Group();

    loader.load("./objects/factorycube.glb", function(gltf) {
      factoryCube.add(gltf.scene)
    })

    super(`Factory Cube`, factoryCube, []);
    this.whole_ob = factoryCube;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    factoryCube.scale.set(scale, scale, scale);
  }
}

export class GrConstructionCube extends GrObject {

  constructor(params = {}) {
    let constructionCube = new T.Group();

    loader.load("./objects/constructioncube.glb", function(gltf) {
      constructionCube.add(gltf.scene)
    })

    super(`Construction Cube`, constructionCube, []);
    this.whole_ob = constructionCube;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    constructionCube.scale.set(scale, scale, scale);
  }
}

export class GrHousesCube extends GrObject {

  constructor(params = {}) {

    const objloader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    let housesCube = new T.Group();

      mtlLoader.load("./objects/housescube.mtl", function(materials) {
        materials.preload();
          
        objloader.setMaterials(materials);
        objloader.load("./objects/housescube.obj", function(obj) {
          let s = obj;
          s.scale.set(1.7, 1.7, 1.7);
          // s.position.set(-1.7, .5, 0)
          housesCube.add(s)
        });
      });

    super(`Houses Cube`, housesCube, []);
    this.whole_ob = housesCube;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    housesCube.scale.set(scale, scale, scale);
  }
}

export class GrIslandCube extends GrObject {

  constructor(params = {}) {
    const objloader = new OBJLoader();
const mtlLoader = new MTLLoader();
    let islandCube = new T.Group();

      mtlLoader.load("./objects/islandcube.mtl", function(materials) {
        materials.preload();
          
        objloader.setMaterials(materials);
        objloader.load("./objects/islandcube.obj", function(obj) {
          let s = obj;
          s.scale.set(1.75, 1.75, 1.75);
          // s.position.set(-1.7, .5, 0)
          islandCube.add(s)
        });
      });

    super(`Island Cube`, islandCube, []);
    this.whole_ob = islandCube;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    islandCube.scale.set(scale, scale, scale);
  }
}

export class GrBox extends GrObject {
  constructor(params = {}) {
    let box = new T.Group();
    loader.load("./objects/box.glb", function(gltf) {
      box.add(gltf.scene)
    })

    super(`Box`, box, []);
    this.whole_ob = box;

    // movement stages
    this.stage1 = true; // move straight with forklift
    this.stage2 = false; // lifted up
    this.stage3 = false; // pulled in
    this.stage4 = false; // do nothing

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    box.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    if (this.stage1) {
      forkliftreset = false;
      this.whole_ob.position.x -= delta/300;
      if (this.whole_ob.position.x <= -4.2 && this.whole_ob.position.x >= -4.4) {
        this.stage1 = false;
        this.stage2 = true;
      }
      return;
    }

    if (this.stage2) {
      this.whole_ob.position.y += delta/3000;
      if (this.whole_ob.position.y >= 11.9 -10) {
        this.stage2 = false;
        this.stage3 = true;
      }
      return;
    }

    if (this.stage3 && retract) {
      this.whole_ob.position.z += delta/500;
      if (this.whole_ob.position.z >= 4) {
        this.stage3 = false;
        this.stage4 = true;
      }
    }

    if (this.stage4) {
      //do nothing
      if (forkliftreset) {

        // must match initial parameters
        this.whole_ob.position.x = 9.3;
        this.whole_ob.position.y = 10.9-10 ;
        this.whole_ob.position.z = .3;
        this.stage4 = false;
        this.stage1 = true;
      }
    }


  }
}

export class GrForklift extends GrObject {

  constructor(params = {}) {

    let forkliftbody = new T.Group();
    let forkliftplate = new T.Group();
    let forklift = new T.Group();
    forklift.add(forkliftbody);
    forklift.add(forkliftplate);

    let objloader = new OBJLoader();
    let mtlLoader = new MTLLoader();

    mtlLoader.load("./objects/forkliftbody.mtl", function(materials) {
      materials.preload();
        
      objloader.setMaterials(materials);
      objloader.load("./objects/forkliftbody.obj", function(obj) {
        let s = obj;
        s.scale.set(.1, .1, .1);
        s.position.y = .3;
        forkliftbody.add(s)

        mtlLoader.load("./objects/forkliftplate.mtl", function(materials) {
          materials.preload();
            
          objloader.setMaterials(materials);
          objloader.load("./objects/forkliftplate.obj", function(obj) {
            let s = obj;
            s.scale.set(.1, .1, .1);
            s.position.set(-1.7, .5, 0)
            forkliftplate.add(s)
          });
        });
      });
    });

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Forklift`, forklift, []);
    this.whole_ob = forklift;
    this.forkliftplate = forkliftplate;

    // movement stages

    this.stage1 = true; // moving straight, before lift
    this.stage2 = false; // lift going up
    this.stage3 = false; // lift waiting

    this.stage3start = 0;
    this.stage4 = false; // lift going down
    this.stage5 = false; // moving straight, after lift


    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    forklift.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    if (this.stage1 || this.stage5) {
      this.whole_ob.position.x -= delta/300;
      if (this.whole_ob.position.x <= -10) {
        this.stage5 = false;
        this.stage1 = true;
        this.whole_ob.position.x = 11;
        forkliftreset = true;
      }
      if (this.whole_ob.position.x <= -2.5 && this.whole_ob.position.x >= -2.7) {
        this.stage1 = false;
        this.stage2 = true;
      }
      return;
    }

    if (this.stage2) {
      this.forkliftplate.position.y += delta/3000;
      if (this.forkliftplate.position.y >= 1) {
        this.stage2 = false;
        this.stage3 = true;
        this.stage3start = Date.now();
        arrived = true;
      }
      return;
    }

    if (this.stage3) {
      // nothign happens
      if (Date.now() - this.stage3start >= 3000) {
        this.stage3 = false;
        this.stage4 = true;
      }
      return;
    }

    if (this.stage4) {
      this.forkliftplate.position.y -= delta/3000;
      if (this.forkliftplate.position.y <= 0 && this.stage4) {
        this.stage4 = false;
        this.stage5 = true;
      }
      return;
    }
  }
}

export class GrClaw extends GrObject {
  constructor(params = {}) {
    let claw = new T.Group();
    loader.load("./objects/claw.glb", function(gltf) {
      claw.add(gltf.scene)
    })

    super(`Claw`, claw, []);
    this.whole_ob = claw;

    // movement stages
    this.stage1 = true; // do nothing
    this.stage2 = false; // extend
    this.stage3 = false; // retract
    this.stage4 = false; // do nothing

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    claw.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    if (this.stage1) {
      if (arrived) {
        this.stage1 = false;
        this.stage2 = true;
        arrived = false;
      }
      return;
    }

    if (this.stage2) {
      this.whole_ob.position.z -= delta/500;
      if (this.whole_ob.position.z <= 1) {
        this.stage2 = false;
        this.stage3 = true;
        retract = true;
      }
      return;
    }

    if (this.stage3) {
      this.whole_ob.position.z += delta/500;
      if (this.whole_ob.position.z >= 5) {
        this.stage3 = false;
        this.stage4 = true;
        retract = false;
      }
      return;
    }

    if (this.stage4) {
      if (forkliftreset) {
        this.stage4 = false;
        this.stage1 = true;
      }
      return;
    }


  }
}

export class GrFan extends GrObject {
  constructor(params = {}) {
    let fan = new T.Group();
    loader.load("./objects/fan.glb", function(gltf) {
      fan.add(gltf.scene)
    })

    super(`Fan`, fan, []);
    this.whole_ob = fan;
    this.raxis = new T.Vector3(1, 0, 0).normalize();

    this.ridePoint = new T.Object3D();
    this.ridePoint.translateY(0.5);
    this.objects[0].add(this.ridePoint);
    this.rideable = this.ridePoint;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    fan.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    this.whole_ob.rotateX(delta / 100)
  }
  
}

export class GrDumpTruck extends GrObject {

  constructor(params = {}) {

    let dumptruckbody = new T.Group();
    let dumptruckbin = new T.Group();
    let dumptruck = new T.Group();
    let rotationGroup = new T.Group();
    dumptruck.add(dumptruckbody);
    dumptruck.add(dumptruckbin);
    rotationGroup.add(dumptruck)

    let objloader = new OBJLoader();
    let mtlLoader = new MTLLoader();

    mtlLoader.load("./objects/dumptruckbody.mtl", function(materials) {
      materials.preload();
        
      objloader.setMaterials(materials);
      objloader.load("./objects/dumptruckbody.obj", function(obj) {
        let s = obj;
        s.scale.set(.1, .1, .1);
        s.position.y = .7;
        s.position.x = 13.5;
        dumptruckbody.add(s)

        mtlLoader.load("./objects/dumptruckbin.mtl", function(materials) {
          materials.preload();
            
          objloader.setMaterials(materials);
          objloader.load("./objects/dumptruckbin.obj", function(obj) {
            let s = obj;
            s.scale.set(.1, .1, .1);
            dumptruckbin.add(s);

          });
        });
      });
    });

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Dump Truck`, rotationGroup, []);
    this.whole_ob = rotationGroup;
    this.dumptruckbin = dumptruckbin;

    this.up = true;


    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    rotationGroup.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    this.whole_ob.rotateY(delta/1000)

    let rotate = delta/1000
    // this.dumptruckbin.rotateZ(delta/1000)

    this.dumptruckbin.position.set(13.5 + 3.5, 1.4, 0);

    if (this.up) {
      this.dumptruckbin.rotateZ(-rotate)
    } else {
      this.dumptruckbin.rotateZ(rotate)
    }

    if (this.dumptruckbin.rotation.z <= -1) {
      this.up = false;
    }
    if (this.dumptruckbin.rotation.z >= 0) {
      this.up = true;
    }

  }

}

export class GrHeliScene extends GrObject {

  constructor(params = {}) {

    let heliBody = new T.Group();
    let heliBlades = new T.Group();
    let heliBladesBack = new T.Group();
    let heliBody2 = new T.Group();
    let heliBlades2 = new T.Group();
    let heliBladesBack2 = new T.Group();
    let heli = new T.Group();
    let heli2 = new T.Group();
    let objloader = new OBJLoader();
    let mtlLoader = new MTLLoader();
    let radar = new T.Group();
    let radarBase = new T.Group();
    let heliScene = new T.Group();

    function loadRadar() {
      mtlLoader.load("./objects/radar-base.mtl", function(materials) {
        materials.preload();
        
        objloader.setMaterials(materials);
        objloader.load("./objects/radar-base.obj", function(obj) {
          radarBase.add(obj);
          radarBase.scale.set(0.05, 0.05, 0.05);
          radarBase.position.y = 6.5;
          radarBase.position.x = 0;
          radarBase.position.z = 1;
          radarBase.scale.set(.2, .2, .2);
          heliScene.add(radarBase);
    
          mtlLoader.load("./objects/radar.mtl", function(materials) {
            materials.preload();
            
            objloader.setMaterials(materials);
            objloader.load("./objects/radar.obj", function(obj) {
              radar.add(obj);
              radar.scale.set(0.3, 0.3, 0.3);
              radar.position.y = 7.5;
              radar.position.x = 0;
              radar.position.z = 1;
              heliScene.add(radar);
    
              loadHeli()
        
            });
          });
        });
      });
    }
    
    function loadHeli() {
      mtlLoader.load("./objects/helicenter.mtl", function(materials) {
        materials.preload();
        
        objloader.setMaterials(materials);
        objloader.load("./objects/helicenter.obj", function(obj) {
          heliBody.add(obj);
          // heliBody.translateOnAxis(1, 1, 1);
          mtlLoader.load("./objects/heliblades.mtl", function(materials) {
            materials.preload();
    
            objloader.setMaterials(materials);
            objloader.load("./objects/heliblades.obj", function(obj) {
              heliBlades.add(obj);
              mtlLoader.load("./objects/helibladesback.mtl", function(materials) {
                materials.preload();
                objloader.setMaterials(materials);
                objloader.load("./objects/helibladesback.obj", function(obj) {
                  heliBladesBack.add(obj);
    
                  heliBlades.position.set(0, 17, 5);
                  heliBladesBack.position.set(0, 14.5, -19.5);
    
                  heli.add(heliBody);
                  heli.add(heliBlades);
                  heli.add(heliBladesBack);
                  heli.scale.set(0.2, 0.2, 0.2)
                  heli.position.set(0, 48, 0)
                  heliScene.add(heli)
    
                  loadHeli2();
                });
              });
            });
          });
        });
      })
    }
    
    function loadHeli2() {
      mtlLoader.load("./objects/helicenter2.mtl", function(materials) {
        materials.preload();
        
        objloader.setMaterials(materials);
        objloader.load("./objects/helicenter2.obj", function(obj) {
          heliBody2.add(obj);
          // heliBody.translateOnAxis(1, 1, 1);
          mtlLoader.load("./objects/heliblades.mtl", function(materials) {
            materials.preload();
    
            objloader.setMaterials(materials);
            objloader.load("./objects/heliblades.obj", function(obj) {
              heliBlades2.add(obj);
              mtlLoader.load("./objects/helibladesback.mtl", function(materials) {
                materials.preload();
                objloader.setMaterials(materials);
                objloader.load("./objects/helibladesback.obj", function(obj) {
                  heliBladesBack2.add(obj);
    
                  heliBlades2.position.set(0, 17, 5);
                  heliBladesBack2.position.set(0, 14.5, -19.5);
    
                  heli2.add(heliBody2);
                  heli2.add(heliBlades2);
                  heli2.add(heliBladesBack2);
                  heli2.scale.set(0.2, 0.2, 0.2)
                  heli2.position.set(0, 36, 0)
                  heliScene.add(heli2);
                });
              });
            });
          });
        });
      })
    }

    loadRadar();

    super(`Heli Scene`, heliScene, []);
    this.whole_ob = heliScene;
    this.heli = heli;
    this.radar = radar;
    this.heli2 = heli2;
    this.heliBlades = heliBlades;
    this.heliBlades2 = heliBlades2;
    this.heliBladesBack = heliBladesBack;
    this.heliBladesBack2 = heliBladesBack2;
    this.timestamp = 0;

    this.ridePoint = new T.Object3D();
    this.ridePoint.translateY(3);
    this.heli.add(this.ridePoint);
    this.rideable = this.ridePoint;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    heliScene.scale.set(scale, scale, scale);
  }

  stepWorld(delta) {
    this.timestamp += delta
    let theta = this.timestamp / 1000;
    let x = 16 * Math.cos(theta);
    let z = 16 * Math.sin(theta);
    // tempMesh.position.x = x;
    // tempMesh.position.z = z;

    let x2 = 3 * (2 * Math.cos(-theta) + 5 * Math.cos((2/3) * -theta));
    let z2 = 3 * (2 * Math.sin(-theta) + 5 * Math.sin((2/3) * -theta));


    if (this.heli !== undefined && this.radar !== undefined) {
      this.heli.position.x = x;
      this.heli.position.z = z;
      this.heli.setRotationFromAxisAngle(new T.Vector3(0, 1, 0), -Math.atan2(z, x));

      let vector1 = new T.Vector3();
      let vector2 = new T.Vector3();
      this.heli.getWorldPosition(vector2);
      this.radar.getWorldPosition(vector1);
      vector1.multiply(new T.Vector3(-1, -1, -1));

      vector2.add(vector1);
      vector2.multiply(new T.Vector3(-1, 1, -1));
      this.radar.lookAt(vector2);

      this.heli2.position.x = x2;
      this.heli2.position.z = z2;
      this.heli2.setRotationFromAxisAngle(new T.Vector3(0, 1, 0), -Math.atan2(-z2, -x2));

  

      if (this.heliBlades !== undefined && this.heliBlades2 !== undefined) {
        this.heliBlades.rotation.y = (this.timestamp/60) % (2*Math.PI);
        this.heliBlades2.rotation.y = (this.timestamp/60) % (2*Math.PI);
      }
      if (this.heliBladesBack !== undefined && this.heliBladesBack2 !== undefined) {
        this.heliBladesBack.rotation.y = (this.timestamp/60) % (2*Math.PI);
        this.heliBladesBack2.rotation.y = (this.timestamp/60) % (2*Math.PI);
    }
  }

}
}

// export class GrSmoke extends GrObject {
//   constructor(params = {}) {
//     let particleCount = 200
//     let particles = new T.Geometry()
//     let pMaterial = new T.PointsMaterial({
//       color: 0x3b3b38,
//       size: 3,
//       // blending: T.AdditiveBlending,
//       // transparent: true
//     });

//     // now create the individual particles
//     for (let p = 0; p < particleCount; p++) {

//       // create a particle with random
//       // position values, -250 -> 250
//       let pX = Math.random() * 100 - 50
//       let pY = Math.random() * 100 - 50
//           pZ = Math.random() * 100 - 50
//           particle = new T.Vector3(pX, pY, pZ)
//           particle.velocity = new THREE.Vector3(
//             0,              // x
//             -Math.random(), // y: random vel
//             0);  

//       // add it to the geometry
//       particles.vertices.push(particle);
//     }

//     // create the particle system
//     let particleSystem = new T.Points(particles, pMaterial);
//     particleSystem.sortParticles = true;
//     super(`Smoke`, particleSystem, []);
//     this.whole_ob = particleSystem;
//     this.particles = particles;
//     this.particleCount = particleCount

//     this.whole_ob.position.x = params.x ? Number(params.x) : 0;
//     this.whole_ob.position.y = params.y ? Number(params.y) : 0;
//     this.whole_ob.position.z = params.z ? Number(params.z) : 0;
//     let scale = params.size ? Number(params.size) : 1;
//     particleSystem.scale.set(scale, scale, scale);
//   }

//   stepWorld(delta) {
//     let pCount = this.particleCount;
//     while (pCount--) {

//     // get the particle
//     let particle = this.particles.vertices[pCount];

//     // check if we need to reset
//     if (particle.y > 100) {
//       particle.setY(0);
//       particle.velocity.y = 0;
//     }

//     // update the velocity with
//     // a splat of randomniz
//     particle.velocity.y += Math.random() * .1;

//     // and the position
//     particle.position.addSelf(particle.velocity);
//   }


//   // flag to the particle system
//   // that we've changed its vertices.
//   this.whole_ob.geometry.__dirtyVertices = true;
//   }

// }