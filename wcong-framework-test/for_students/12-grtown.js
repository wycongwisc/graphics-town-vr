/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { GrHeliScene, GrIslandCube, GrHousesCube, GrDumpTruck, GrConstructionCube, GrFan, GrClaw, GrBox, GrForklift, GrFactoryCube } from "./objects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

import {main} from "../examples/main.js";

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 1, // make the ground plane big enough for a world of stuff
});

world.camera.position.set(-80, 15, 80);

world.scene.background = new T.Color(0xF5F5DC);

let offsetY = -10

let factoryCube = new GrFactoryCube({y: 10 + offsetY});
let constructionCube = new GrConstructionCube({y: 10 + offsetY });
let forklift = new GrForklift({y: 10 + offsetY, x: -11, z: .3});
let dumptruck = new GrDumpTruck({x: -26, y: offsetY, z: -1, size: .7});
let box = new GrBox({y: 10.9 + offsetY, x: 9.7, z: .3});
let claw = new GrClaw({y: 12 + offsetY, x: -4.2, z: 5})
let fan = new GrFan({x: 1.4, y: 16.1 + offsetY, z: 7.15})
let housesCube = new GrHousesCube({x: -0.5, y: -24 + offsetY, z: 23.6})
let islandCube = new GrIslandCube({x: -25.3, y: -36 + offsetY, z: 22.9});
let heliScene = new GrHeliScene({x: -23, y: -13 + offsetY, z: 22})

// let smoke = new GrSmoke();

function createParticleSystem() {
    let particleCount = 100
    let particles = new T.Geometry()
    let pMaterial = new T.PointsMaterial({
        color: 0x3b3b38,
        size: 1.5,
    });

    for (let p = 0; p < particleCount; p++) {
        let pX = Math.random() * 1 - .5
        let pY = Math.random() * 40 - 2
        let pZ = Math.random() * 1 - .5
        let particle = new T.Vector3(pX, pY, pZ)
        particles.vertices.push(particle);
    }
    let particleSystem = new T.Points(particles, pMaterial);
    return particleSystem
}

let smoke1 = createParticleSystem();
smoke1.position.set(-6.5, 26.5 + offsetY, -6.5)
world.scene.add(smoke1)

let smoke2 = createParticleSystem();
smoke2.position.set(-6.5, 26.5 + offsetY, -9.5)
world.scene.add(smoke2)

let smoke3 = createParticleSystem();
smoke3.position.set(9, 21 + offsetY, 6.3)
world.scene.add(smoke3)

let smokeList = [smoke1, smoke2, smoke3]

let clock = new T.Clock();

let shaderMat = shaderMaterial("./shaders/water.vs", "./shaders/water.fs", {
    side: T.DoubleSide,
    uniforms: {
      iTime: { value: clock.getDelta() }
    },
  });
let waterCube = new SimpleObjects.GrCube({ x: -25, y: -23.6 + offsetY, z: 23, size: 25.5, material: shaderMat })

function render() {
    smokeList.forEach((smoke) => {
        let pCount = 100;
        while (pCount--) {
        // get the particle
            let particle = smoke.geometry.vertices[pCount];
            if (particle.y > 40) {
                particle.y = 0;
            }
            particle.setY(particle.y + .05)
            particle.setX(particle.x + Math.random() * .02 - .01)
            particle.setZ(particle.z + Math.random() * .02 - .01)
        }
        smoke.geometry.verticesNeedUpdate = true;
    })
    shaderMat.uniforms.iTime.value = clock.getElapsedTime();
    window.requestAnimationFrame(render);
}
render();

let image = new T.TextureLoader().load("./images/bump.jpg");

let mat = shaderMaterial("./11-09-03.vs", "./11-09-03.fs", {
    side: T.DoubleSide,
    uniforms: {
      radius: { value: 0.3 },
      dots: { value: 10.0 },
      blur: { value: 0.0 },
      dark: { value: new T.Vector3(1, 1, 0) },
      light: { value: new T.Vector3(1, .5, 0.) },
      amplitude: { value: 3 },
      colormap: { value: image },
    },
  });

let grow = true;
let rgrow = true;
let obj = new SimpleObjects.GrSphere({ size: 36, x: -4, y: -23 + offsetY, z: 4, widthSegments: 100,
    heightSegments: 100, material: mat });

    obj.stepWorld = function (delta, timeOfDay) {
        obj.objects.forEach((obj) => obj.rotateY(((.5 * delta) / 1000) * Math.PI));
    
        if (grow) {
            mat.uniforms.amplitude.value += delta / 10000;
        } else {
            mat.uniforms.amplitude.value -= delta / 10000;
        }
    
        if (rgrow) {
            mat.uniforms.radius.value += delta / 3000;
        } else {
            mat.uniforms.radius.value -= delta / 3000;
        }
        if (mat.uniforms.radius.value < .1) {
          rgrow = true;
        } 
        if (mat.uniforms.radius.value > .5) {
          rgrow = false;
        } 
    
    
        if (mat.uniforms.amplitude.value < .8) {
          grow = true;
        } 
        if (mat.uniforms.amplitude.value > 1) {
          grow = false;
        } 

      };

world.add(obj)
world.add(waterCube)
// world.add(smoke)
world.add(heliScene)
world.add(islandCube);
world.add(housesCube);
world.add(dumptruck);
world.add(constructionCube);
world.add(fan);
world.add(claw);
world.add(box);
world.add(forklift);
world.add(factoryCube);
world.viewStats();
world.enableVR();

highlight("Factory Cube")
highlight("Island Cube")
highlight("Houses Cube")
highlight("Sphere-1")
highlight("Fan")
highlight("Dump Truck")
highlight("Heli Scene")
highlight("Forklift")
// main(world);

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
// highlight("SimpleHouse-5");
// highlight("Helicopter-0");
// highlight("Track Car");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
