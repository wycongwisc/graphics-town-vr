/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

let mydiv = document.getElementById("div1");

let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });

const loader = new T.CubeTextureLoader();
const textureCube = loader.load([
    "./images/posx.jpg", 
    "./images/negx.jpg", 
    "./images/posy.jpg", 
    "./images/negy.jpg", 
    "./images/posz.jpg", 
    "./images/negz.jpg", 
]);
world.scene.background = textureCube;


const bumpMap = new T.TextureLoader().load("./images/bumpmap.jpg")


let map = new T.MeshStandardMaterial({bumpMap: bumpMap, envMap: textureCube, metalness: 1.0, roughness: 0})


let sphere = new SimpleObjects.GrSphere({ x: -2, y: 1, material: map, widthSegments: 100, heightSegments: 100})
world.add(sphere)

world.go();
