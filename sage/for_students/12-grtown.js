import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { Controller } from "./controller.js";
import { ArchBox, Bird, Boat, DoorBox, SandBox, WaterBox, WaterPlane, WindmillBox } from "./gridObjects.js";
import * as C from "./controller.js";

// import {main} from "../examples/main.js";

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplane: null
});

// main(world);
// let waterTestPlane = new WaterBox(0, 0);
// world.add(waterTestPlane);

// let sand1 = new SandBox(0, 0);
// world.add(sand1);

let game = new Controller(world);

let waterplane = new WaterPlane(1000, 1000);
game.addGridObject(waterplane);

game.buildPlane(30, 30, WaterBox);
game.buildPlane(6, 8, SandBox, true);
game.scatterBirds(20, 20, 8);
game.scatterBoats(20, 20, 4);

function buildDemoScene() {
    // Make main building
    game.addGridObject(new DoorBox(0, 1, 0));
    game.addGridObject(new DoorBox(1, 1, 0));
    game.addGridObject(new DoorBox(0, 2, 0));
    game.addGridObject(new DoorBox(0, 3, 0));
    game.addGridObject(new DoorBox(0, 4, 0));
    // Side Part
    game.addGridObject(new DoorBox(0, 1, 2));
    game.addGridObject(new DoorBox(0, 2, 1));
    game.addGridObject(new DoorBox(0, 2, 2));
    game.addGridObject(new ArchBox(0, 1, 1, true));

    game.addGridObject(new DoorBox(2, 1, -4));
    game.addGridObject(new DoorBox(2, 2, -4));

    // Build out part of sandbar
    game.addGridObject(new SandBox(4, 0), true);
    game.addGridObject(new SandBox(4, 1), true);
    game.addGridObject(new SandBox(0, 5), true);
    game.addGridObject(new SandBox(-1, 5), true);
    game.addGridObject(new SandBox(1, 5), true);
    game.addGridObject(new SandBox(2, 5), true);
    game.addGridObject(new SandBox(3, -5), true);
    game.addGridObject(new SandBox(2, -5), true);
    game.addGridObject(new SandBox(1, -5), true);

    // Make a little island
    game.addGridObject(new SandBox(-6, 8), true);
    game.addGridObject(new SandBox(-7, 8), true);
    game.addGridObject(new SandBox(-6, 9), true);
    game.addGridObject(new SandBox(-5, 8), true);
    game.addGridObject(new SandBox(-6, 7), true);
    game.addGridObject(new SandBox(-5, 7), true);

    // Add windmill to island
    game.addGridObject(new DoorBox(-6, 1, 8));
    game.addGridObject(new DoorBox(-6, 2, 8));
    game.addGridObject(new DoorBox(-6, 3, 8));
    game.addGridObject(new DoorBox(-6, 4, 8));
}

// while making your objects, be sure to identify some of them as "highlighted"
///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
highlight("WaterBox <5, 5>");
highlight("Boat No. 0");
highlight("SandBox <-1, 0>");
highlight("TreeDecoration <3, 0.5, 3>");

game.initialize();

world.ui = new WorldUI(world);

buildDemoScene();

world.go(game);
