import { Tree } from "./tree.js";
import { FlyingSportsCar } from "./car.js";
import { Waterfall } from './waterfall.js';
import {Boat} from './boat.js';
import {BoatLifter} from './boat.js';

import {SimpleHouse, Statue, TicketBooth} from './structures.js';

import * as T from "../libs/CS559-Three/build/three.module.js";
import { Person } from "./person.js";
import { Rock } from "./rock.js";
import { ButterflyObject, Fish } from "./animals.js";
import { Giraffe } from "./animals.js";
import { Pool } from "./pool.js";



export function main(world) {
    //world.add(new Tree({x: -18, z: -5, stump_length: 5}));
    let tree = new Tree({x: -18, z: -5, stump_length: 5})
    tree.highlighted = true;
    world.add(tree);
    world.add(new Tree({x: -16, z: -8}));
    world.add(new Tree({x: -14, z: -9, stump_length: 3.5, top: true}));
    world.add(new Tree({x: -18, z: -8, stump_length: 3.5, sf: 1.2}));
    world.add(new Tree({x: -17, z: -9, top:true, stump_length: 9, sf: .8, y: -1}));
    world.add(new Tree({x: -13, z: -8, stump_length: 9, sf: 1.3, y: .5}));
    world.add(new Tree({x: -13, z: -11, top:true, stump_length: 7, sf: 1, y: -1}));
    world.add(new Tree({x: -19, z: -4, stump_length: 4, sf: .7, y: -1}));
    world.add(new Tree({x: -19, z: -2, top:true, stump_length: 7, sf: 1, y: -1}));

    world.add(new Tree({x: 18, z: -5, stump_length: 5}));
    world.add(new Tree({x: 16, z: -8}));
    world.add(new Tree({x: 14, z: -9, stump_length: 3.5, top: true}));
    world.add(new Tree({x: 18, z: -8, stump_length: 3.5, sf: 1.2}));
    world.add(new Tree({x: 17, z: -9, top:true, stump_length: 9, sf: .8, y: -1}));
    world.add(new Tree({x: 13, z: -8, stump_length: 9, sf: 1.3, y: .5}));
    world.add(new Tree({x: 13, z: -11, top:true, stump_length: 7, sf: 1, y: -1}));
    world.add(new Tree({x: 19, z: -4, stump_length: 4, sf: .7, y: -1}));
    world.add(new Tree({x: 19, z: -2, top:true, stump_length: 7, sf: 1, y: -1}));

    world.add(new Tree({x: 8, z: -15, stump_length: 5}));
    world.add(new Tree({x: 6, z: -18}));
    world.add(new Tree({x: 4, z: -19, stump_length: 3.5, top: true}));
    world.add(new Tree({x: 8, z: -18, stump_length: 3.5, sf: 1.2}));
    world.add(new Tree({x: 7, z: -19, top:true, stump_length: 9, sf: .8, y: -1}));
    world.add(new Tree({x: 3, z: -18, stump_length: 9, sf: 1.3, y: .5}));
    world.add(new Tree({x: 3, z: -20, top:true, stump_length: 7, sf: 1, y: -1}));
    world.add(new Tree({x: 9, z: -14, stump_length: 4, sf: .7, y: -1}));
    world.add(new Tree({x: 9, z: -12, top:true, stump_length: 7, sf: 1, y: -1}));

    world.add(new Tree({x: -4, z: 0, stump_length: 5}));
    world.add(new Tree({x: -2, z: -3}));
    world.add(new Tree({x: -0, z: -4, stump_length: 3.5, top: true}));
    world.add(new Tree({x: -4, z: -3, stump_length: 3.5, sf: 1.2}));
    world.add(new Tree({x: -3, z: -4, top:true, stump_length: 9, sf: .8, y: -1}));
    world.add(new Tree({x: 1, z: -3, stump_length: 9, sf: 1.3, y: .5}));
    world.add(new Tree({x: 1, z: -5, top:true, stump_length: 7, sf: 1, y: -1}));
    world.add(new Tree({x: -5, z: 1, stump_length: 4, sf: .7, y: -1}));
    world.add(new Tree({x: -5, z: 3, top:true, stump_length: 7, sf: 1, y: -1}));

    // bushes

    world.add(new Tree({x: -4, z: 5, y: -3, bush: true}));
    world.add(new Tree({x: -2, z: 2, y: -3, bush: true}));
    world.add(new Tree({x: -0, z: 1, y: -3, top: true, bush: true}));
    world.add(new Tree({x: -4, z: 2,y: -3, sf: 1.2, bush: true}));
    world.add(new Tree({x: -3, z: 1, top:true, y: -3, sf: .8, bush: true}));
    world.add(new Tree({x: 3, z: 2, y: -3, sf: 1.3, bush: true}));
    world.add(new Tree({x: 1, z: 0, top:true, y: -3, sf: 1, bush: true}));
    world.add(new Tree({x: -5, z: 6, y: -3, sf: .7, bush: true}));
    world.add(new Tree({x: 0, z: 8, top:true, y: -3, sf: 1, bush: true}));

    world.add(new Tree({x: -14, z: 10, y: -3, bush: true}));
    world.add(new Tree({x: -12, z: 12, y: -3, bush: true}));
    world.add(new Tree({x: -10, z: 13, y: -3, top: true, bush: true}));
    world.add(new Tree({x: -14, z: 12,y: -3, sf: 1.2, bush: true}));
    world.add(new Tree({x: -13, z: 15, top:true, y: -3, sf: .8, bush: true}));
    world.add(new Tree({x: -7, z: 16, y: -3, sf: 1.3, bush: true}));
    world.add(new Tree({x: -9, z: 10, top:true, y: -3, sf: 1, bush: true}));
    world.add(new Tree({x: -15, z: 16, y: -3, sf: .7, bush: true}));
    world.add(new Tree({x: -10, z: 18, top:true, y: -3, sf: 1, bush: true}));

    world.add(new Rock({x: -7, z: -6}))
    world.add(new Rock({x: -6, z: -5}))
    world.add(new Rock({x: -6, z: -4}))
    world.add(new Rock({x: -5.5, z: -3}))
    world.add(new Rock({x: -5.5, z: -2}))
    world.add(new Rock({x: -5.5, z: -1}))
    world.add(new Rock({x: -5.5, z: 0}))
    world.add(new Rock({x: -6, z: 1}))
    world.add(new Rock({x: -6.5, z: 2}))
    world.add(new Rock({x: -7, z: 3}))
    world.add(new Rock({x: -7.5, z: 4}))
    world.add(new Rock({x: -7.5, z: 5}))
    world.add(new Rock({x: -7.5, z: 6}))
    world.add(new Rock({x: -8.5, z: 7}))
    world.add(new Rock({x: -9.5, z: 8}))
    world.add(new Rock({x: -10.5, z: 8.25}))
    world.add(new Rock({x: -11.5, z: 8}))

    world.add(new Rock({x: -7, z: -4}))
    world.add(new Rock({x: -6, z: -3}))
    world.add(new Rock({x: -6, z: -2}))
    world.add(new Rock({x: -5.5, z: -1}))
    world.add(new Rock({x: -5.5, z: 0}))
    world.add(new Rock({x: -5.5, z: 1}))
    world.add(new Rock({x: -5.5, z: 2}))
    world.add(new Rock({x: -6, z: 3}))
    world.add(new Rock({x: -6.5, z: 4}))
    world.add(new Rock({x: -7, z: 5}))
    world.add(new Rock({x: -7.5, z: 6}))

    world.add(new Rock({x: -7, z: -3}))
    world.add(new Rock({x: -6, z: -2}))
    world.add(new Rock({x: -6, z: -1}))
    world.add(new Rock({x: -5.5, z: 0}))
    world.add(new Rock({x: -5.5, z: 1}))
    world.add(new Rock({x: -5.5, z: 2}))




    world.add(new Waterfall({x: -5, z: -10}));
    world.add(new Pool({x: 15, z:-16, y: -.49, sz: .5}));

    let boat = new Boat({x: -6, z: -9, rot: Math.PI / 4});
    boat.highlighted = true;
    world.add(boat);
    world.add(new TicketBooth({x: -18, z:10}));

    
    world.add(new Person({x: -8, z: 0, right:true, go: true}));    
    world.add(new Person({x: -10, z: 2, go: true}));

    world.add(new Person({x: -10, z: 3}));
    world.add(new Person({x: -11, z: 1}));

    world.add(new Person({x: -16, z: 3}));
    world.add(new Person({x: -15, z: 1}));

    let butterfly = new ButterflyObject({x: 1, y: 1, z: -10, rotX: -Math.PI / 5, rotZ: -Math.PI / 2});
    butterfly.highlighted = true;
    world.add(butterfly);
   // console.log(new ButterflyObject({x: 1, y: 1, z: -10, rotX: -Math.PI / 5, rotZ: -Math.PI / 2}))

    world.add(new ButterflyObject({x: -.5, y: 3, z: -13, rotX: Math.PI / 10, rotZ: -Math.PI / 2}));
    world.add(new ButterflyObject({x: -.3, y: 5, z: -11, rotX: Math.PI / 3, rotZ: -Math.PI / 2}));
    world.add(new ButterflyObject({x: -.65, y: 7, z: -12, rotX: -Math.PI / 2, rotZ: -Math.PI / 2}));

    world.add(new ButterflyObject({x: -.7, y: 9, z: -10, rotX: -Math.PI / 5, rotZ: -Math.PI / 2}));
    world.add(new ButterflyObject({x: -1.3, y: 10, z: -13, rotX: Math.PI / 10, rotZ: -Math.PI / 2}));
    world.add(new ButterflyObject({x: -1.3, y: 12, z: -11, rotX: Math.PI / 3, rotZ: -Math.PI / 2}));
    world.add(new ButterflyObject({x: -1.8, y: 14, z: -12, rotX: -Math.PI / 2, rotZ: -Math.PI / 2}));
    //console.log(ButterflyObject);

    world.add(new Giraffe({x: 14, z: -3, rotY: Math.PI / 2}))

    world.add(new Giraffe({x: -18, z: -12, rotY: -Math.PI / 8}));
    world.add(new Giraffe({x: 8, z: -9, sf: .8}));
    let gir = new Giraffe({x: -18, z: -12, rotY: -Math.PI / 8});
    gir.highlighted = true;
    world.add(gir);
    world.add(new Giraffe({x: -1, z: 0, sf: .5, rotY: Math.PI, neck_move: true}));
    world.add(new Giraffe({x: -10, z: 10, sf: .5, rotY: Math.PI, head_down: true}));
    world.add(new Giraffe({x: -13, z: 14, sf: 1, rotY: -Math.PI / 4, head_down: true}));




    let fish = new Fish({x: -15, z: -2, sf: .4})
    fish.highlighted = true;
    world.add(fish);


    world.add(new Fish({x: 15, z: -13, sf: .5}));
    world.add(new Fish({x: 13, z: -15, sf: .5}));
    world.add(new Fish({x: 19, z: -16, sf: .5}));
    world.add(new Fish({x: 11, z: -17, sf: .5}));

    // shallow water fish
    world.add(new Fish({x: -12, z: -1, sf: .4}));
    world.add(new Fish({x: -15, z: -0, sf: .4}));
    world.add(new Fish({x: -8, z: 1, sf: .4}));
    world.add(new Fish({x: -10, z: -4, sf: .5}));
    world.add(new Fish({x: -12, z: -4, sf: .5}));
    world.add(new Fish({x: -15, z: -3, sf: .5}));
    world.add(new Fish({x: -10, z: -4, sf: .5}));


    let numhouses = 15
    for (let i = 0; i < numhouses; i++) {

        let house = new SimpleHouse({
          //  rotY: (2 * i * Math.PI) / numhouses,
            rotY: 2 * i * Math.PI / numhouses,
            x: 10,
            z: 10
        }); 
        house.translateX(8);
        world.add(house);
        if (i == 0) {
            house.highlighted = true;
        }
      }
    world.add(new FlyingSportsCar({x: -4}))

      world.add(new Statue({world: world, radius: 2, x: 10, z: 10}))


   /* let skybox = new T.CubeTextureLoader()
        .setPath('./images/')
        .load( [
	"blue.png", "blue.png",
	"blue.png", "blue.png",
	"blue.png", "blue.png"
    ] );*/

    let skybox = new T.CubeTextureLoader()
        .setPath('./images/')
        .load( [
	"cloud.png", "cloud.png",
	"cloud.png", "cloud.png",
	"cloud.png", "cloud.png"
    ] );

    world.scene.background = skybox;

    
}