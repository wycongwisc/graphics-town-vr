/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { MeshStandardMaterial, Scene, SphereGeometry } from "../libs/CS559-Three/build/three.module.js";

let mydiv = document.getElementById("div1");

let skybox = new T.CubeTextureLoader()
.setPath('./images/')
.load( [
	"blue.png", "blue.png",
	"blue.png", "blue.png",
	"blue.png", "blue.png"
] );

let bm = new T.TextureLoader().load('./images/bumpmap.jpg');
let sphGeo = new T.SphereGeometry(.5, 20, 20);
let sphMat = new T.MeshStandardMaterial({envMap: skybox, bumpMap: bm, metalness: 1, roughness: 0})
let sph = new T.Mesh(sphGeo, sphMat);
sph.translateY(1.5);

let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });

world.add(new GrObject("sphere", sph));

world.scene.background = skybox;
	


world.go();
