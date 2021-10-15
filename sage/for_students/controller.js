import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrthographicCamera } from "../libs/CS559-Three/build/three.module.js";
import { Boat, WaterBox, SandBox, GridObject, RollOverBox, DoorBox, WindowBox, ArchBox, PointedRoofBox, randomFloat, Bird } from "./gridObjects.js";

export class Controller {
    constructor(world) {
        this.world = world;
        this.grid = {};

        // Hovering/pointer
        this.controlsEnabled = false;
        this.pointer = new T.Vector2(0, 0);
        this.pointerGridPos = new T.Vector3(0, 0, 0);
        this.raycaster = new T.Raycaster();

        this.hoveredObject = null; // What is hovered
        this.hoveredTarget = null; // What block is hovered in the normal direction

        this.highlightBox = new RollOverBox();
        this.hoverObjects = [];
        this.roofList = [];

        this.worldLimit = 10;
        // ----
    }

    initialize() {
        this.addGridObject(this.highlightBox);
        this.highlightBox.hideMesh();

        this.world.scene.background = new T.Color(230/255, 255/255, 255/255);

        let pointerBound = this.onPointerMove.bind(this);
        window.addEventListener('pointermove', pointerBound);
        let mouseDownBind = this.onMouseDown.bind(this);
        window.addEventListener('pointerdown', mouseDownBind);
    }
    
    stepWorld(delta) {


        if (this.controlsEnabled) {
            if (this.world.active_camera instanceof OrthographicCamera)
                this.raycastMouse();
            else
                this.disableControls();
        }
        else {
            if (this.world.active_camera instanceof OrthographicCamera)
                this.enableControls();
        }
    }

    enableControls() {
        this.highlightBox.showMesh();
        this.controlsEnabled = true;
    }

    disableControls() {
        this.highlightBox.hideMesh();
        this.controlsEnabled = false;
    }

    // EVENT HANDLERS
    onPointerMove(event) {
        if (this.controlsEnabled) {
            let bbox = this.world.renderer.domElement.getBoundingClientRect();
            let mouseX = event.clientX - bbox.left;
            let mouseY = event.clientY - bbox.top;
            this.pointer.set(
                (mouseX / this.world.width) * 2 - 1,
                (-mouseY / this.world.height) * 2 + 1,
            );
        }
    }

    onMouseDown(event) {
        if (this.controlsEnabled && this.hoveredObject) {
            let clicked = this.at(this.hoveredObject.position.x, this.hoveredObject.position.y , this.hoveredObject.position.z);

            if (event.button === 0) { // Left Mouse Button 
                this.clickObject(clicked, this.hoveredTarget);
            }
            else if (event.button === 2) { // Right Mouse Button
                this.rightClickObject(clicked);
            }
        }
    }

    // Do a raycast check from the camera through mouse position, update tags
    raycastMouse() {
        this.raycaster.setFromCamera(this.pointer, this.world.active_camera);

        const intersects = this.raycaster.intersectObjects(this.hoverObjects);

        if (intersects.length) { // Hit Something
            const intersect = intersects[0];

            this.hoveredObject = intersect.object;
            this.pointerGridPos.copy(intersect.object.position);
            this.hoveredTarget = intersect.object.position.clone().add(intersect.face.normal).round();
            this.highlightBox.showMesh();
        }
        else {
            this.pointerGridPos.set(0, 0, 0);
            this.hoveredObject = null;
            this.hoveredTarget = null;
            this.highlightBox.hideMesh();
        }

        this.highlightBox.setPos(this.pointerGridPos.x, this.pointerGridPos.y, this.pointerGridPos.z);
    }

    at(x, y, z) {
        return this.grid[`${x},${y},${z}`] ?? null;
    }

    getObjectToken(object) {
        let pos = object.objects[0].position;
        return `${pos.x},${pos.y},${pos.z}`;
    }

    /* -----------------------
       World Object Functions
       ----------------------- */

    clickObject(object, target) {
        // ----------------------------------
        //     OBJECT PLACEMENT LOGIC
        // ----------------------------------
        if (object instanceof WaterBox) {
            this.addGridObject(new SandBox(this.hoveredObject.position.x, this.hoveredObject.position.z),
                                true);
            this.checkForBoats(this.hoveredObject.position);
        }
        else if (object instanceof GridObject) {
            this.addGridObject(new DoorBox(this.hoveredTarget.x, this.hoveredTarget.y, this.hoveredTarget.z));
        }
    }

    rightClickObject(object) {
        let pos = object.getPos();
        if (object instanceof SandBox) {
            this.replaceGridObject(object, new WaterBox(pos.x, pos.z));
            return;
        }
        else if (object instanceof DoorBox || object instanceof WindowBox)
        {
            if (object.above()
                && (object.above() instanceof DoorBox || object.above() instanceof WindowBox)) {
                if (object.left() && object.right()) {
                    this.replaceGridObject(object, new ArchBox(pos.x, pos.y, pos.z));
                    return;
                }
                if (object.front() && object.back()) {
                    this.replaceGridObject(object, new ArchBox(pos.x, pos.y, pos.z, true));
                    return;
                }
            }
        }

        if (!(object instanceof WaterBox)) {
            this.removeGridObject(object, true);
        }
    }

    addGridObject(object, force=false) {
        object.setController(this);

        if (object.aligned) {
            let token = this.getObjectToken(object);
            if (this.grid[token] && this.grid[token] != null) {
                if (force || !this.grid[token].hoverable)
                    this.removeGridObject(this.grid[token], false);
                else
                    return; // !! Already an object here, can't place
            }
            this.grid[this.getObjectToken(object)] = object;
        }

        this.world.add(object);

        if (object.hoverable)
            this.hoverObjects.push(object.objects[0]);

        if (object instanceof PointedRoofBox)
            this.roofList.push(object);

        object.update(true);
    }

    removeGridObject(object, updateGeom=true) {
        let token = this.getObjectToken(object);

        this.world.remove(object);

        this.grid[token] = null;
        for(let i = 0; i < this.hoverObjects.length; ++i) {
            if (this.hoverObjects[i].id == object.objects[0].id) {
                this.hoverObjects.splice(i, 1);
                break;  // No way for more than 1.. right?
            }
        }

        // Remove from rooflist
        if (object instanceof PointedRoofBox) {
            for(let i = 0; i < this.roofList.length; ++i) {
                if (this.roofList[i].id == object.id) {
                    if (this.roofList[i].bird)
                        this.roofList[i].bird.takeoff();
                    this.roofList.splice(i, 1);
                    break;  // No way for more than 1.. right?
                }
            }
        }
        
        if (updateGeom)
            object.update(true);
    }

    replaceGridObject(object, newObject, force=false) {
        this.removeGridObject(object, false); // Don't update geom yet!
        this.addGridObject(newObject, force);
    }

    buildPlane(length, width, gridObjectClass, force=false) {
        if (!(gridObjectClass.prototype instanceof(GridObject)))
            return;

        // Make odd
        length += !(length%2);
        width += !(width%2);

        for (let i = length; i > 0; --i) {
            for (let j = width; j > 0; --j) {
                let tmp = new gridObjectClass(
                    i - Math.ceil(length/2),  // Build around center of world
                    j - Math.ceil(width/2)
                );

                this.addGridObject(tmp, force);
            }
        }

        let dist = Math.sqrt(length*length + width*width) * 1.2;
        if (this.worldLimit < dist){
            this.worldLimit = dist;
        }
    }

    scatterBirds(length, width, number, height=4) {
        for (let i = 0; i < number; i++) {
            let x = randomFloat(-length/2, length/2);
            let y = randomFloat(-width/2, width/2);
            this.addGridObject(
                new Bird(x, height, y)
            );
        }
    }

    scatterBoats(length, width, number, height=0) {
        for (let i = 0; i < number; i++) {
            let x = Math.floor(randomFloat(-length/2, length/2));
            let y = Math.floor(randomFloat(-width/2, width/2));
            let tile = this.at(x, 0, y);
            if (!tile || !tile.solid) {
                this.addGridObject(
                    new Boat(x, height, y)
                );
            }
        }
    }

    checkForBoats(position) {
        this.world.objects.forEach(obj => {
            if (obj instanceof Boat) {
                let dist = position.distanceTo(obj.getPos());
                if (dist < 1) {
                    this.removeGridObject(obj);
                }
            }
        });
    }
}