/*
 * Graphics Town Example Objects
 *
 * Simple Circular Track - and an object that goes around on it
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";

/**
 * 
 */
export class Tree extends GrObject {
    constructor(params = {}) {
        let tree = new T.Group();
        let stump_length = params.stump_length || 3;
        let stumpGeo = new T.CylinderGeometry(.3, .3, stump_length, 20);
        let stumpMat = new T.MeshStandardMaterial({map: new T.TextureLoader().load('./images/bark.jpeg')});
        let stump = new T.Mesh(stumpGeo, stumpMat);
    
        tree.add(stump);


        let numleaves = 4;
        let leafgeo = new T.SphereGeometry();
        let leafmat;
        if (params.bush) {
          leafmat = new T.MeshStandardMaterial({map: new T.TextureLoader().load('./images/bush.jpg')});
        } else
          leafmat = new T.MeshStandardMaterial({map: new T.TextureLoader().load('./images/leaves.jpeg')});
        let leaves = [];
        let leaf3;
        let leaf2;
        for (let i = 0; i < numleaves; i++) {
          let leaf = new T.Mesh(leafgeo, leafmat); 
          leaf2 = leaf.clone();
          leaf3 = leaf.clone();


          leaf.rotateY((2 * i * Math.PI) / numleaves);
          leaf2.rotateY((1.5 * i * Math.PI) / numleaves);

    
          leaf.translateX(0.8);
          leaf2.translateX(.4);
          leaf.translateY(stump_length - (stump_length * (2/3)));

          leaf2.translateY(leaf.position.y + 1);

    
          leaves.push(leaf, leaf2);
          tree.add(leaf, leaf2);
        }
        leaf3.translateY(leaf2.position.y + 1);
        leaf3.scale.set(.8, .8, .8);
        if (params.top) {
          tree.add(leaf3);
        }

       // tree.add(leaves);
     //   tree.translateY((stump_length / 2) + (params.y || 0));
        let sf = params.sf || 1;

        tree.scale.set(sf, sf, sf);

        //tree.position
       //let pos = 
        super("tree", tree);
       // this.scale.set(sf, sf, sf);
       this.setPos(params.x || 0, stump_length / 2 + (params.y || 0), params.z || 0);
    }
}