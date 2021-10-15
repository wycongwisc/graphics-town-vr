/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Simple Circular Track - and an object that goes around on it
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";
import { GrCube } from "../libs/CS559-Framework/SimpleObjects.js";

/**
 * A Less Simple Object to go around the track
 */
export class ButterflyObject extends Loaders.FbxGrObject {
  constructor(params = {}) {
    super({
      fbx: "./fbx files/butterfly.fbx",
      norm: 2.0,
      name: "Butterfly",
      mtl: {
          color: 'red'
      }
    });
   // this.setPos(0, 10, 0);
   this.objects[0].position.set(params.x || 0, params.y || 0, params.z || 0);

    this.objects[0].rotation.set(params.rotX || 0, params.rotY || 0, params.rotZ || 0);
  //  this.objects
    
    
   // Create a material
  }
  stepWorld(delta, timeOfDay) {
  }
}
