/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { ShaderMaterial } from "../libs/CS559-Three/build/three.module.js";

let bump = new T.TextureLoader().load("./images/bump.jpg");
// let env = new T.CubeTextureLoader().load("./images/cube.jpg");

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name,ext="png", swapBottomFront=true) {
    return new T.CubeTextureLoader().load([
        name + "Right."  +ext,
        name + "Left."   +ext,
        name + "Top."    +ext,
        name + (swapBottomFront ? "Front."  : "Bottom.") +ext,
        name + "Back."   +ext,
        name + (swapBottomFront ? "Bottom." : "Front.")  +ext
    ]);
}

let mydiv = document.getElementById("div1");

let world = new GrWorld(
    {
        width: mydiv ? 600 : 800,
        where: mydiv,
        groundplane: null
    }
);

let ct = cubeTextureHelp("./images/env/");
world.scene.background = ct;

let objs = [];

let mat = new T.MeshStandardMaterial(
    {
        color: "white",
        bumpMap: bump,
        side: T.DoubleSide,
        envMap: ct,
        metalness: 1.0,
        roughness: 0.1
    }
);

let sphere = new SimpleObjects.GrSphere(
    {
        x: -10, 
        y: 1,
        material: mat 
    }
);

let cube = new SimpleObjects.GrCube(
    {
        x: 10,
        y: 1,
        material: mat
    }
);

sphere.setScale(6);
cube.setScale(8);

objs.push(sphere);
world.add(sphere);

objs.push(cube);
world.add(cube);

world.stepWorld = function(delta) {
    let d = delta / 1000;
    sphere.mesh.rotateY(1.0 * d);
    cube.objects[0].rotateY(-0.5 * d);
};

world.go();
