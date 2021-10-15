
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";


import * as Loaders from "../libs/CS559-Framework/loaders.js";

/**
 * A Less Simple Object to go around the track
 */
export class ButterflyObject extends Loaders.FbxGrObject {
  constructor(params = {}) {
    super({
      fbx: "./fbx files/butterfly.fbx",
      mtl: "./fbx files/butterfly.mtl",
      norm: 2.0,
      name: "Butterfly",
    });
   // this.setPos(0, 10, 0);
   this.objects[0].position.set(params.x || 0, params.y || 0, params.z || 0);

    this.objects[0].rotation.set(params.rotX || 0, params.rotY || 0, params.rotZ || 0);
  //  this.objects

  }
  stepWorld(delta, timeOfDay) {

  }
}

export class Giraffe extends GrObject {
    constructor(params = {}) {
        let giraffe = new T.Group();

        let mat = shaderMaterial("./shaders/giraffe.vs", "./shaders/giraffe.fs", {
            side: T.DoubleSide,
            uniforms: {
              radius: { value: 0.4 },
              dots: { value: 7.0 },
              light: { value: new T.Vector3(245/255, 213/255, 125/255) },
              dark: { value: new T.Vector3(179/255, 107/255, 0/255) },
            },
          });

        let hair_mat = new T.MeshStandardMaterial({color: '#b36b00'})

       // let mat = new T.MeshStandardMaterial();
        let body_geo = new T.SphereGeometry(1.25);
        let leg_geo = new T.CylinderGeometry(.3, .15, 5);
        let tail_geo = new T.CylinderGeometry(.2, .1, 2);
        let neck_geo = new T.CylinderGeometry(.3, .5, 5);
        let head_geo = new T.SphereGeometry(.38);
        let mane_geo = new T.BoxGeometry(.3, 5, .2);
        let tail_hair_geo = new T.SphereGeometry(.25);
        
        let body = new T.Mesh(body_geo, mat);
        body.scale.set(1.5, 1, 1);
        body.translateY(5);

        let legs = new T.Group();
        let leg = new T.Mesh(leg_geo, mat);
       // leg.translateY(1.5);
        let leg2 = leg.clone();
        let leg3 = leg.clone();
        let leg4 = leg.clone();
        leg.position.set(.75, 2.5, .5);
        leg2.position.set(.75, 2.5, -.5);
        leg3.position.set(-.75, 2.5, -.5)
        leg4.position.set(-.75, 2.5, .5)
        legs.add(leg, leg2, leg3, leg4);

        let tail_grp = new T.Group();
        let tail = new T.Mesh(tail_geo, mat);
        tail_grp.position.set(-1.9, 4.9, 0);
        tail_grp.rotateZ( - Math.PI / 5);
        tail_grp.add(tail);

        let tail_hair = new T.Mesh(tail_hair_geo, hair_mat);
        tail_hair.position.set(0, -1, 0);
        tail_grp.add(tail_hair);

        let upper = new T.Group();
        let neck = new T.Mesh(neck_geo, mat);
       // neck.position.set(2, 7.5, 0);
        neck.position.set(1, 2.5, 0);

        neck.rotateZ(-Math.PI / 10);
       // let neck_piv = new T.SphereGeometry(.2);
        let neck_pivot = new T.Object3D();
        neck_pivot.position.set(1.2, 5.3, 0);
        //upper.add(neck_pivot);

        let head = new T.Mesh(head_geo, mat);
        head.scale.set(2, 1, 1);
        //head.position.set(2.2, 5, 0);
        head.position.set(.7, 0, 0)


      //  let head_piv = new T.SphereGeometry(.2);
        let head_pivot = new T.Object3D();
        head_pivot.position.set(1.5, 5, 0);
        head_pivot.add(head);

        let mane = new T.Mesh(mane_geo, hair_mat);
        mane.position.set(.7, 3, 0);
        mane.rotateZ(-Math.PI / 9);

        neck_pivot.add(neck, mane, head_pivot);

       // upper.add(neck_pivot, head, mane);
        upper.add(neck_pivot);



        giraffe.add(body, legs, tail_grp, upper);

        super("Giraffe", giraffe);
        this.giraffe = giraffe;
        this.upper = upper;
        this.neck_piv = neck_pivot;
        this.head = head;
        this.head_piv = head_pivot;
        this.neck_rot = .0005;
        this.head_rot = .001;
        if (params.head_down) {
          this.head_down = true;
          this.neck_piv.rotateZ(-3 * Math.PI / 5);
        }
        this.giraffe.position.set(params.x || 0, params.y || 0, params.z || 0);
        this.giraffe.scale.set(params.sf || 1, params.sf || 1, params.sf || 1);
        this.giraffe.rotateY(params.rotY || 0);
        
    } stepWorld(delta, timeOfDay) {
       // this.neck_piv.rotation.y += delta * .001;
       // this.head_piv.rotation.y += delta * .001;


        this.neck_piv.rotation.y += delta * this.neck_rot;
        if (this.neck_piv.rotation.y > Math.PI / 4 || this.neck_piv.rotation.y < -Math.PI / 4) {
            this.neck_rot = -this.neck_rot;
            if (this.neck_piv.rotation.y > Math.PI / 4) {
                this.neck_piv.rotation.y = Math.PI / 4 - .01;
            } else if (this.neck_piv.rotation.y < -Math.PI / 4) {
                this.neck_piv.rotation.y  = - Math.PI / 4;
            }
        }



        this.head_piv.rotation.z += delta * this.head_rot;
        if (this.head_piv.rotation.z > Math.PI / 4 || this.head_piv.rotation.z < -Math.PI / 4) {
            this.head_rot = -this.head_rot;
            if (this.head_piv.rotation.z > Math.PI / 4) {
                this.head_piv.rotation.z = Math.PI / 4 - .01;
            } else if (this.head_piv.rotation.z < -Math.PI / 4) {
                this.head_piv.rotation.z  = - Math.PI / 4;
            }
        }
    }
}

export class Fish extends GrObject {
  constructor(params = {}) {
    const finEx = {
            
      steps: 2,
      depth: .05,
      bevelEnabled: true,
      bevelThickness: .1,
      bevelSize: .1,
      bevelOffset: 0,
      bevelSegments: 5

  };

    let fish_grp = new T.Group();
    let fish = new T.Group();
    let body_geo = new T.SphereGeometry(.5);

    let body_col = '#' + Math.floor(Math.random()*16777215).toString(16);

    let mat = new T.MeshStandardMaterial({color: body_col});
    let body = new T.Mesh(body_geo, mat);
    body.scale.set(2, 1, 1);
    
    let tail_shape = new T.Shape();
    tail_shape.moveTo(0, 0);
    tail_shape.lineTo(.75, .75);
    tail_shape.lineTo(.5, 0);
    tail_shape.lineTo(.75, -.75);

    let tail_geo = new T.ExtrudeGeometry(tail_shape, finEx);
    let tail = new T.Mesh(tail_geo, mat);
    let fins = tail.clone();
    fins.rotateX(Math.PI / 2);
    fins.translateX(-.5);
    tail.translateX(.5);

    let fish_piv = new T.Object3D();

    fish.translateY(1);
    fish.add(body, tail, fins);

    fish.scale.set(params.sf || .75, params.sf || .75, params.sf || .75)
    fish_piv.position.set(params.x || 0, params.y ||0, params.z || 0);
    fish_piv.add(fish);
    fish.translateX(1);
    fish.translateY(-.5);
    fish.rotateZ(-Math.PI / 2)
    fish_grp.add(fish_piv);

    super("Fish", fish_grp);
    this.fish = fish;
    this.pivot = fish_piv;
    this.pause = 0;
    this.pivot.rotation.z = 3 * Math.PI / 2;
    this.pause_orig = Math.random() * 50 + 25;
  } stepWorld(delta, timeOfDay) {
      if (this.pause > this.pause_orig) {
          this.pivot.rotation.z += delta * .01;

        if (this.pivot.rotation.z > (3 * Math.PI / 2) + (2 * Math.PI)) {
          this.pivot.rotation.z = 3 * Math.PI / 2;
          this.pause = 0;
        }
      } else {
        this.pause += delta * .05;
      }
  
  }
}