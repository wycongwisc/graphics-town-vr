/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class FlyingSportsCar extends GrObject {
    constructor(params = {}) {
        let whole = new T.Group();
        let car = new T.Group();
        const extrudeSettings = {
            steps: 2,
            depth: .5,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: .7,
            bevelOffset: 0,
            bevelSegments: 7
        };
        let baseShape = new T.Shape();
        baseShape.moveTo(-.3, 0);
        baseShape.lineTo(.5, .75);
        baseShape.lineTo(1.5, 1);
        baseShape.lineTo(3, 1.5);
        baseShape.lineTo(4, 1.5);
        baseShape.lineTo(5, 1);
        baseShape.lineTo(6.3, .7);
        baseShape.lineTo(6.7, 0);

        let baseGeo = new T.ExtrudeGeometry(baseShape, extrudeSettings);
        let baseMat = new T.MeshStandardMaterial({color: 'red', metalness: .7, roughness: .4});
        let base = new T.Mesh(baseGeo, baseMat);
        base.scale.set(.5, .5, .5);
        car.add(base);

       let wheelGeo = new T.CylinderGeometry(.35, .35, 1.5, 20);
        let wheelMat = new T.MeshStandardMaterial({color: 'gray'});
        let wheel = new T.Mesh(wheelGeo, wheelMat);
        wheel.position.set(.8, 0, .15);
        wheel.rotateZ(Math.PI / 2);
        wheel.rotateX(Math.PI / 2);
        let backwheel = wheel.clone();
        backwheel.translateZ(1.5);

        car.add(wheel, backwheel);
        whole.position.set(params.x || 0, .4, params.y || 0);
        car.position.set(-2, 15, -11);

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
        let tl = new T.TextureLoader().load("./images/feather.jpeg");
        let wingMat = new T.MeshStandardMaterial({map: tl});
        let wing = new T.Mesh(wingGeo, wingMat);
        let wing2 = wing.clone();
        wing.position.set(1.3, .2, .4);
        wing.rotateX(Math.PI / 6);
        wing.rotateZ(Math.PI / 4);

        wing2.position.set(1.3, .2, -.2);
        wing2.rotateX(-Math.PI / 6);
        wing2.rotateZ(Math.PI / 4);

        wings.add(wing, wing2);
        wings.scale.set(1.5, 1.5, 1.5);

        car.add(wings);

        let platform_geo = new T.CylinderGeometry(2, 2, 1, 20);
        let platform_mat = new T.MeshStandardMaterial({color: '#8f9c1e', metalness: 1, roughness: .5});
        let platform = new T.Mesh(platform_geo, platform_mat);
        platform.position.set(0, -.8,11)

        let pivot = new T.Group();
        pivot.add(car);
        whole.add(pivot, platform);
        let sf = params.sf || 1;

        car.rotateY(Math.PI / 8);
        car.scale.set(sf, sf, sf);

        super("Flying Sports Car", whole);

        this.rideable = car;
        this.car = car;
        this.highlighted = true;
        this.whole = whole;
        this.rotation_ctr = 0;
        this.pause_counter = 0;
        this.over_mtn = true;
       // pivot.rotation.y = Math.PI;
        this.pivot = pivot
        //this.pivot.rotation.y = 0;
        this.going_down = true;
        this.wing1 = wing;
        this.wing2 = wing2;
        this.wing_ctr = 10;
        this.rot_wing = .2;
        this.orig_pos = {
            x: -2,
            y: 15,
            z: -11
        }
    }
    stepWorld(delta, timeOfDay) {



        if (Math.abs(this.pivot.rotation.y - Math.PI) < 0.1) {
            if (this.car.position.y > 0.5 && this.going_down) {
                this.car.position.y -= delta * .01;
                this.going_down = true;
            } else if (this.car.position.y < 15) {
                this.car.position.y += delta * .01;
                this.going_down = false;
                if (this.car.position.y >= 15) {
                    this.pivot.rotation.y = Math.PI + .11;
                   // console.log('push')
                }
            } 
        } else if (Math.abs(this.pivot.rotation.y - (Math.PI * 2)) < 0.1) {
            this.pause_counter++;
            if (this.pause_counter > 100) {
                this.pause_counter = 0;
                this.pivot.rotation.y = 0;
                this.going_down = true;
            }
        } else {
            this.pivot.rotation.y += delta * Math.PI * 0.001;
        } if (this.pivot.rotation.y > Math.PI * 2) {
            this.pivot.rotation.y = 0;
        }

        
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
         
        

    }
}