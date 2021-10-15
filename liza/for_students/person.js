import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { MeshStandardMaterial } from "../libs/CS559-Three/build/three.module.js";

export class Person extends GrObject {
    constructor(params = {}) {
     //   let sf = params.sf || 1;
      //  let sf = Math.random() * .5 + .7;

        let person = new T.Group();
        let head_geo = new T.SphereGeometry(.4);
        let head_mat = new T.MeshStandardMaterial({color: 'black'});
        let head = new T.Mesh(head_geo, head_mat);
        head.translateY(1);

        let body_geo = new T.ConeGeometry(.5, 2);
        let body_col = '#' + Math.floor(Math.random()*16777215).toString(16);

        let body_mat = new T.MeshStandardMaterial({color: body_col});
        let body = new T.Mesh(body_geo, body_mat);
       // body.translateY(1);

        person.add(head, body);
        person.position.set(params.x || 0, Math.random() - 1, params.z || 0);
        super('person', person);
        this.person = person;
        this.time = 0;
     //   0, -.8,11
        this.dx = (-4 - person.position.x) / 46.50000000000039;
        this.dz = (11 - person.position.z)/ 46.50000000000039;
        this.go = params.go;
        this.part = 1;
        //this.boat = boat;
        this.going_up = false;
        this.orig_x = params.x || 0;
        this.orig_z = params.z || 0;
        this.orig_rot = params.rot || 0;
        this.in_mtn = false;
        this.right = params.right;
        this.first = true;
        this.up = .001;
    //  this.num_grps =
    }
    stepWorld(delta, timeOfDay) {
        /*
        if (this.go) {
            this.first = false;
            if (this.part == 1) {
                this.dx = (-4 - this.orig_x) / 46.50000000000039;
                this.dz = (11 - this.orig_z)/ 46.50000000000039;
                //console.log(this.person.position);
                this.time += .1;
                if ((this.person.position.x > -4 || this.person.position.z < 11) && !this.in_mtn ) {
                    //this.person.position.y += .01;

                    this.person.position.x += this.dx * .1;
                    this.person.position.z += this.dz * .1;
                } else if (this.time < 102.79999999999843) {
                  //  this.part_two = true;
                    this.in_mtn = true;
                    this.person.position.set(-6, 5, -9);
                } else {
                    this.part = 2;
                    this.in_mtn = false;
                    this.time = 0;
                    if (this.right)
                         this.person.position.set(-6.5, 17, -9);
                    else {
                        this.person.position.set(-5.5, 17, -9);
                    }
                }
            }
            else if (this.part == 2) { // part two
                this.time += .1;
                if (this.time < 7) {
                    this.person.position.y -= .1;
                } else if (this.time > 70 && this.person.position.y < 17) {
                    this.person.position.y += .05;
                } else if (this.time > 102.79999999999843) {
                    this.person.position.set(-6, 5, -9);
                } else {
                    this.part = 3;
                    this.time = 0;
                }
            } else if (this.part == 3) {
                this.time += .1;
                if (this.time < 46.50000000000039) {
                    this.person.position.set(-5.75, 5, -9);
                } else if (this.time < 46.51) {
                    this.person.position.set(-4, 1, 11);
                    if (this.right) {
                        this.person.position.set(-4.25, 1, 11);
                    } else {
                        this.person.position.set(-3.74, 1, 11);
                    }
                    this.dx = (this.orig_x - this.person.position.x) / 46.50000000000039 * .1;
                    this.dz = (this.orig_z - this.person.position.z)/ 46.50000000000039 * .1;
                } else if (this.person.position.x < this.orig_x || this.person.position.z > this.orig_z){
                    this.person.position.x += this.dx;
                    this.person.position.z += this.dz;
                } else {
                    this.part = 1;
                    this.time = 0;
                    this.go = false;
                }
            }
        } else {
            this.time += .1;
            let offset = 102.79999999999843;
            if (!this.first) {
                offset = 0;
            }
            if (this.time > offset) {
                console.log('reset')
                this.go = true;
                this.time = 0;
                this.part = 1;
            }
        }*/
      
        if (this.first) {
            this.person.position.y += delta * this.up;
        } else {
            this.person.position.y -= delta * this.up;
        } if (this.person.position.y > 1) {
            this.first = false;
        } if (this.person.position.y < 0) {
            this.first = true;
        }


    }
}