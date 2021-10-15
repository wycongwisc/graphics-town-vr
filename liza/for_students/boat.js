import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { MeshStandardMaterial } from "../libs/CS559-Three/build/three.module.js";

export class Boat extends GrObject {
    constructor(params = {}) {
        let tl = new T.TextureLoader();

        let boat = new T.Group();
        let base_geo = new T.SphereGeometry(1, 20, 100, 0, Math.PI * 2, Math.PI / 2, Math.PI); 
        let base_mat = new T.MeshStandardMaterial({color: '#b0b0b0', metalness: .7, roughness: .5});
        let base = new T.Mesh(base_geo, base_mat);
        base.scale.set(1.7, 1);
       // base.scale.set(.2, .2);
        boat.add(base);

        let top_geo = new T.CylinderGeometry(1, 1, .2, 20);
        let top_text = tl.load('./images/wood.jpeg');
        let top_mat = new T.MeshStandardMaterial({map: top_text, roughness: 1, metalness: 0});
        let top = new T.Mesh(top_geo, top_mat);
        top.scale.set(1.7, 1);
        boat.add(top);
        boat.position.set(params.x || 0, 16, params.z || 0);
        boat.rotation.y = params.rot || 0;

        let flag_grp = new T.Group();
        let pole_geo = new T.CylinderGeometry(.1, .1, 3, 20);

        let pole = new T.Mesh(pole_geo, base_mat);
        pole.translateY(.5);
        flag_grp.add(pole);

        let flag_text = tl.load('./images/Flag.jpg');
        let flag_geo = new T.BoxGeometry(1, .05, .7);
        let flag_mat = new T.MeshStandardMaterial({map: flag_text});
        let flag = new T.Mesh(flag_geo, flag_mat);
        flag.rotateX(Math.PI / 2);
        flag_grp.add(flag);
        flag.translateZ(-2);
        flag.translateX(.5);
        let flag_back = flag.clone();

        const wingEx = {
            
            steps: 2,
            depth: .05,
            bevelEnabled: true,
            bevelThickness: .1,
            bevelSize: .1,
            bevelOffset: 0,
            bevelSegments: 5

        };

        let wingShape = new T.Shape();
        wingShape.moveTo(0, .3);
        wingShape.lineTo(0, .5);
        wingShape.lineTo(.5, 1);
        wingShape.lineTo(1, 1.3);
        wingShape.lineTo(1.5, 1.2);
        wingShape.lineTo(1.5, 1.1);
        wingShape.lineTo(1.4, 1.1);
        wingShape.lineTo(1.45, .9);
        wingShape.lineTo(1.45, .8);
        wingShape.lineTo(1.35, .9);
        wingShape.lineTo(1.4, .6);
        wingShape.lineTo(1.35, .5);
        wingShape.lineTo(1.2, .7);
        wingShape.lineTo(1.2, .4);
        wingShape.lineTo(1.1, .4);
        wingShape.lineTo(1, .5);
        wingShape.lineTo(.5, .5);


        let wings = new T.Group();
        let wingGeo = new T.ExtrudeGeometry(wingShape, wingEx);
        let tl_w = new T.TextureLoader().load("./images/feather.jpeg");
        let wingMat = new T.MeshStandardMaterial({map: tl_w});
        let wing = new T.Mesh(wingGeo, wingMat);
        let wing2 = wing.clone();
        wing.position.set(0, -.2, .4);
        wing.rotateX(Math.PI / 6);
        wing.rotateZ(Math.PI / 4);

        wing2.position.set(0, -.2, -.4);
        wing2.rotateX(-Math.PI / 6);
        wing2.rotateZ(Math.PI / 4);

        wings.add(wing, wing2);
        wings.scale.set(1.5, 1.5, 1.5);

        boat.add(wings);

        boat.add(flag_grp);

        super('boat', boat);
        this.rideable = boat;
        this.time = 0;
        this.boat = boat;
        this.going_up = false;
        this.orig_x = params.x || 0;
        this.orig_z = params.z || 0;
        this.orig_rot = params.rot || 0;
        this.pause = 0;
        this.rot_wing = .2;
        this.wing1 = wing;
        this.wing2 = wing2;


        this.part = [1, 0, 0, 0, 0]
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta * .1;

        // part 0
        if ((this.boat.position.x > -3 || this.boat.position.z < -7) && this.part[0]) { // moving towards edge
  //  console.log(this.boat.position)
            if (this.boat.position.x > -3) {
                this.boat.position.x -= delta * .0006;
            } if (this.boat.position.z < -7) {
                this.boat.position.z += delta * .0012;
            }
            this.part[1] = 1;
           // console.log('part 1');
        
        // part 1
        } else if (this.boat.rotation.z < Math.PI / 2 && this.part[1]) { // rotating down
            this.part[0] = 0;
           // this.part[1] = 1;
            this.boat.rotation.z += delta * .001;
            this.boat.position.x -= delta * .001;
            this.boat.position.y -= delta * .001;
          //  console.log('part 2');

        // part 2
        } else if (this.boat.position.y > 1.25 && !this.going_up) { // going down
            this.part[1] = 0;
            this.part[3] = 1;
            this.boat.position.y -= delta *.015;
            this.boat.position.z += delta *.003;
            this.boat.position.x -= delta * .003;
          //  console.log('part 3');
        
        // part 3
        } else if (this.boat.rotation.z > 0 && this.part[3]) {
            this.boat.rotation.z -= delta * .001;
            this.boat.position.z += delta * .001;
        }  else if (this.pause < 50){
            this.pause ++;
        } else if (this.boat.position.y < 16) {
            // console.log(this.time);
             this.boat.position.y += delta *.01;
             this.boat.position.z -= delta *.0003;
             this.boat.position.x += delta *.0002;
             this.going_up = true;

             this.wing1.rotation.x += delta * .05 * this.rot_wing;
             this.wing2.rotation.x -= delta * .05 * this.rot_wing;
             if (this.wing1.rotation.x > Math.PI || this.wing1.rotation.x < Math.PI / 6) {
                 this.rot_wing = -this.rot_wing;
                 if (this.wing1.rotation.x > Math.PI) {
                     this.wing1.rotation.x = Math.PI - .01;
                     this.wing2.rotation.x = Math.PI - .01;
                 } else if (this.wing1.rotation.x < Math.PI / 6) {
                     this.wing1.rotation.x = Math.PI / 6;
                     this.wing2.rotation.x = -Math.PI / 6;
                 }
             }
           //  this.boat.rotation.y = this.orig_rot;
        } else if ((this.boat.position.x < this.orig_x) || 
            (this.boat.position.z > this.orig_z) || 
            (this.boat.rotation.z % 0.001 > .001) ||
            (this.wing1.rotation.x > Math.PI / 6)) {
            
            if (this.boat.position.x < this.orig_x)  {
                this.boat.position.x += delta * .01;
            } if (this.boat.position.z > this.orig_z) {
                this.boat.position.z -= delta *.01;
            } if (this.boat.rotation.z > 0) {
                this.boat.rotation.z -= delta *.001;
            } if (this.wing1.rotation.x > Math.PI / 6) {
                this.wing1.rotation.x += delta * .05 * this.rot_wing;
                this.wing2.rotation.x -= delta * .05 * this.rot_wing;

            }
          //  console.log('part 8');

        } else {
            this.time = 0;
            this.boat.rotation.y = this.orig_rot;
            this.going_up = false;
            this.pause = 0;
            this.part[0] = 1;
            this.wing1.rotation.x = Math.PI / 6;
            this.wing2.rotation.x = -Math.PI / 6;
        }
    }


}

export class BoatLifter extends GrObject {
    constructor(params = {}) {
        let tl = new T.TextureLoader();
      //  let lifter = new T.Group();
        let lifter_geo = new T.BoxGeometry(6, 1, 3);
        let lifter_text = tl.load('./images/wood.jpeg')
        let lifter_mat = new MeshStandardMaterial({map: lifter_text});
        let lifter = new T.Mesh(lifter_geo, lifter_mat);
       // lifter.translateZ(-5);
        lifter.rotateY(Math.PI / 4);
        lifter.position.set(params.x || 0, -.6, params.z || 0);
        super('lifter', lifter);
       // this.setPos(params.x || 0, -.6, params.z || 0);
        this.lifter = lifter;
        this.time = 0;
    } 
    stepWorld(delta, timeOfDay) {
      //  this.time += .01;
        this.time += .1;
        if (this.time > 48.00000000000041 && this.time < 62.80000000000062) {
            this.lifter.position.y += .1;
        } else if (this.lifter.position.y > -.6) {
            this.lifter.position.y -= .1;
        } else if (this.time > 102.79999999999843){
            this.time = 0;
        }

    }
}