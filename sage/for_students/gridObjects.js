import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import { GLTFLoader } from "../libs/CS559-Three/examples/jsm/loaders/GLTFLoader.js";
import * as T from "../libs/CS559-Three/build/three.module.js";

const loader = new GLTFLoader();

function loadGLTF(src, doneCallback=null) {
    let objgroup = new T.Group();

    loader.load(
        src,
        function(gltf) {
            objgroup.add(gltf.scene);

            // Pull animations out
            if (gltf.animations) {
                objgroup.gltfAnims = gltf.animations;
            }

            if (doneCallback)
                doneCallback();
        }
    )

    return objgroup;
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export class GridObject extends GrObject
{
    constructor(name, obj) {
        super(name, obj);
        // OBJECT OPTIONS
        this.hoverable = true;
        this.aligned = true;
        this.affectTopBottom = true;
        this.solid = true;

        this.game = null;
    }

    setController(controller) {
        this.game = controller;
    }

    update(prop=false) {
        this.updateGeometry();

        if (prop)
            this.updateNeighbors(this.affectTopBottom);
    }

    updateGeometry() {
        // To be overridden in subclasses
    }

    getPos() {
        return this.objects[0].position;
    }

    showMesh() {
        this.objects[0].visible = true;
    }

    hideMesh() {
        this.objects[0].visible = false;
    }
    
    /*
     Helper functions to get neighbors
    */
    below() {
        let pos = this.getPos();
        return this.game.at(pos.x, pos.y-1, pos.z);
    }
    
    above() {
        let pos = this.getPos();
        return this.game.at(pos.x, pos.y+1, pos.z);
    }
    
    left() {
        let pos = this.getPos();
        return this.game.at(pos.x-1, pos.y, pos.z);
    }

    right() {
        let pos = this.getPos();
        return this.game.at(pos.x+1, pos.y, pos.z);
    }

    front() {
        let pos = this.getPos();
        return this.game.at(pos.x, pos.y, pos.z+1);
    }

    back() {
        let pos = this.getPos();
        return this.game.at(pos.x, pos.y, pos.z-1);
    }

    updateNeighbors(topBottom, diagonal=false) {
        // TODO: Diagonal (for sand, ...)
        this.left()     && this.left().updateGeometry(false);
        this.right()    && this.right().updateGeometry(false);
        this.front()    && this.front().updateGeometry(false);
        this.back()     && this.back().updateGeometry(false);

        if (topBottom) {
            this.below() && this.below().updateGeometry(false);
            this.above() && this.above().updateGeometry(false);
        }
    }
}

export class RollOverBox extends GridObject
{
    constructor()
    {
        // TODO: Make sure the box always appears on top of the highlighted objects
        const rollGeo = new T.BoxGeometry(1.01, 1.1, 1.01);
        let rollMaterial = new T.MeshBasicMaterial({color: 0xff0000, opacity: 0.6, transparent: true});
        let rollMesh = new T.Mesh(rollGeo, rollMaterial);
        rollMesh.visible = false;
        super("Rollover Geom", rollMesh);
        this.hoverable = false;
        this.aligned = false;
    }
}

const WATER_PLANE_SEGS = 1;
export class WaterPlane extends GridObject
{
    constructor(x, z) {
        const geom = new T.PlaneGeometry(x, z,
            WATER_PLANE_SEGS, WATER_PLANE_SEGS);
        
        const material = shaderMaterial("./shaders/watershader.vs",
                                              "./shaders/watershader.fs",
                                              {
                                                  uniforms: {
                                                      time: { value: 0 }
                                                  }
                                              });
        const mesh = new T.Mesh(geom, material);
        mesh.rotation.x = -Math.PI/2;

        super(`WaterPlane <${x}, ${z}>`, mesh);

        this.setPos(0, 0.48, 0);

        this.solid = false;
        this.hoverable = false;
        this.aligned = false;

        this.mat = material;
    }

    stepWorld(delta, worldTime) {
        this.mat.uniforms.time.value = worldTime / 1000;
    }
}

const WATER_SURFACE_SEGS = 10;
export class WaterBox extends GridObject
{
    constructor(x, z) {
        const geom = new T.BoxGeometry(1,1,1,
            WATER_SURFACE_SEGS,1,WATER_SURFACE_SEGS);
        
        const material = shaderMaterial("./shaders/watershader.vs",
                                              "./shaders/watershader.fs",
                                              {
                                                  uniforms: {
                                                      time: { value: 0 }
                                                  }
                                              });
        const mesh = new T.Mesh(geom, material);

        super(`WaterBox <${x}, ${z}>`, mesh);

        this.setPos(x, 0, z);

        this.solid = false;

        this.mat = material;
    }

    stepWorld(delta, worldTime) {
        this.mat.uniforms.time.value = worldTime / 1000;
    }
}

const SAND_SURFACE_SEGS = 10;
export class SandBox extends GridObject
{
    constructor(x, z) {
        const geom = new T.BoxGeometry(1,1,1,
            SAND_SURFACE_SEGS,1,SAND_SURFACE_SEGS);

        const material = shaderMaterial("./shaders/sandshader.vs",
                                        "./shaders/sandshader.fs",
                                        { // FIXME: USING 0 might be breaking this
                                            uniforms: {
                                                xPlusNeighbor: {value: 0},
                                                xMinusNeighbor: {value: 0},
                                                zPlusNeighbor: {value: 0},
                                                zMinusNeighbor: {value: 0},
                                            }
                                        }
        );
        const mesh = new T.Mesh(geom, material);

        const watergeom = new T.BoxGeometry(1,1,1,
            WATER_SURFACE_SEGS,1,WATER_SURFACE_SEGS);
        
        const watermaterial = shaderMaterial("./shaders/watershader.vs",
                                              "./shaders/watershader.fs",
                                              {
                                                  uniforms: {
                                                      time: { value: 0 }
                                                  }
                                              });
        const watermesh = new T.Mesh(watergeom, watermaterial);

        super(`SandBox <${x}, ${z}>`, [mesh, watermesh]);

        this.setPos(x, 0, z);

        this.solid = true;

        this.mat = material;
        this.watermat = watermaterial;
    }

    // Literally the worst noise function possible haha
    noise(x, z) {
        return 0.5*( Math.sin(1234.2351*x + 1001.0134*z))+0.5;
    }

    updateGeometry() {
        let pos = this.getPos();

        // Update shader uniforms about neighbors
        this.mat.uniforms.xPlusNeighbor.value = this.right() instanceof SandBox ? 1:0;
        this.mat.uniforms.xMinusNeighbor.value = this.left() instanceof SandBox ? 1:0;
        this.mat.uniforms.zPlusNeighbor.value = this.front() instanceof SandBox ? 1:0;
        this.mat.uniforms.zMinusNeighbor.value = this.back() instanceof SandBox ? 1:0;

        // Try to place a tree based on world noise
        if (this.noise(pos.x, pos.z) > 0.9) {
            this.game.addGridObject(new TreeDecoration(pos.x, pos.y+1, pos.z));
        }
    }

    stepWorld(delta, worldTime) {
        this.watermat.uniforms.time.value = worldTime / 1000;
    }
}

export class DoorBox extends GridObject
{
    constructor(x, y, z) {
        const mesh = loadGLTF("./objects/DoorBox.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`DoorBox <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.setPos(x, y, z);
        hitbox.translateY(0.5);

        this.mesh = mesh;
    }

    updateGeometry() {
        let pos = this.getPos();
        if (!(this.below() instanceof SandBox)) { // There must be sand below a door!
            this.game.replaceGridObject(this, new WindowBox(pos.x, pos.y, pos.z));
            return;
        }

        if (!(this.above())) {
            this.game.addGridObject(new LongRoofBox(pos.x, pos.y+1, pos.z, false));
        }
    }
}

export class WindowBox extends GridObject
{
    constructor(x, y, z) {
        const mesh = loadGLTF("./objects/WindowBox.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`WindowBox <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.setPos(x, y, z);
        hitbox.translateY(0.5);

        this.mesh = mesh;
    }

    updateGeometry() {
        let pos = this.getPos();

        if (!this.above()) { // We can put a roof on it
            if (!this.left() && !this.right() && !this.front() && !this.back()) {
                this.game.addGridObject(new PointedRoofBox(pos.x, pos.y+1, pos.z));
            }
            else {
                this.game.addGridObject(new LongRoofBox(pos.x, pos.y+1, pos.z));
            }
        }

        // Check to see if we should place a windmill
        if (this.below()
            && this.below().below()
            && this.below().below().below()
            && this.below().below().below() instanceof SandBox
            && !this.front()
            && !this.back()
            && !this.left()
            && !this.right()) {
            let underhang = this.game.at(pos.x+1, pos.y-1, pos.z);
            if (!this.right() && !underhang) {
                this.game.addGridObject(new WindmillBox(pos.x+1, pos.y, pos.z));
            }
        }
    }
}

export class WindmillBox extends GridObject
{
    constructor(x, y, z) {
        const mesh = loadGLTF("./objects/Windmill.glb");

        super(`WindmillBox <${x}, ${y}, ${z}>`, mesh);

        this.setPos(x, y, z);

        this.mesh = mesh;
        this.solid = false;
        this.hoverable = false;

        this.mesh.rotateY(Math.PI/2);
    }

    updateGeometry() {
        if (!this.left() || !(this.left() instanceof WindowBox)) {
            this.game.removeGridObject(this, false);
        }
    }

    stepWorld(delta) {
        this.mesh.rotateZ(1 * delta/1000);
    }
}

export class ArchBox extends GridObject
{
    constructor(x, y, z, rotate=false) {
        const mesh = loadGLTF("./objects/Arch.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`ArchBox <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.setPos(x, y, z);
        hitbox.translateY(0.5);
        if (rotate)
            mesh.rotateY(Math.PI/2);

        this.mesh = mesh;
    }

    updateGeometry() {
        if (!this.above()) { // There must be something above an arch!
            this.game.removeGridObject(this, false);
        }
    }
}

export class LongRoofBox extends GridObject
{
    constructor(x, y, z, rotate=false) {
        const mesh = loadGLTF("./objects/LongRoof.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`LongRoofBox <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.hoverable = false;

        this.setPos(x, y, z);
        hitbox.translateY(0.5);
        mesh.translateY(-1.0);
        if (rotate)
            mesh.rotation.y = Math.PI/2;
        
        this.solid = false;
        this.affectTopBottom = false;

        this.mesh = mesh;
    }

    updateGeometry() {
        if (!this.below() || !this.below().solid) // There must be something below it!
            this.game.removeGridObject(this, false);
        
        if ((this.front() instanceof LongRoofBox) || (this.back() instanceof LongRoofBox))
            this.mesh.rotation.y = Math.PI/2;
        else
            this.mesh.rotation.y = 0;
    }
}

export class PointedRoofBox extends GridObject
{
    constructor(x, y, z) {
        const mesh = loadGLTF("./objects/PointedRoof.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`PointedRoofBox <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.hoverable = false;

        this.setPos(x, y, z);
        hitbox.translateY(0.5);
        mesh.translateY(-1.0);

        this.solid = false;
        this.affectTopBottom = false;

        this.mesh = mesh;

        this.bird = null;
    }

    updateGeometry() {
        if (!this.below() || !this.below().solid) { // There must be something below it!
            this.game.removeGridObject(this, false);
        }

        if (this.left() || this.right() || this.front() || this.back()) {
            this.game.removeGridObject(this, false);
        }
    }
}

export class TreeDecoration extends GridObject
{
    constructor(x, y, z) {
        const mesh = loadGLTF("./objects/Tree.glb");

        let hitboxGeom = new T.BoxGeometry(1, 1, 1);
        let hitbox = new T.Mesh(hitboxGeom, new T.MeshStandardMaterial({visible: false}));

        y -= 0.5; // Center y

        super(`TreeDecoration <${x}, ${y}, ${z}>`, [hitbox, mesh]);

        this.hoverable = false;

        this.setPos(x, y, z);
        hitbox.translateY(0.5);

        this.solid = false;
        this.affectTopBottom = false;

        this.mesh = mesh;
    }

    updateGeometry() {
        if (!this.below() || !this.below().solid) { // There must be something below it!
            this.game.removeGridObject(this, false);
        }
    }
}

let birds = 0;
export class Bird extends GridObject
{
    constructor(x, y, z) {
        let tmp = new T.Group();

        super(`Bird No. ${birds++}`, tmp);

        this.mesh = loadGLTF("./objects/Bird.glb", this.initMesh.bind(this));
        this.addObject(this.mesh);

        this.mixer;

        this.hoverable = false;
        this.aligned = false;
        this.solid = false;

        this.setPos(x, y, z);

        this.velocity = new T.Vector3(1, 0, 0);
        this.speed = 1;
        this.turnspeed = 0.6;

        this.nextTurnTime = 0;
        this.turnDir = 1;

        this.lastLogTime = 0;

        this.state = "Wander";

        this.roof = null;
    }

    update() {}

    initMesh() {
        this.mixer = new T.AnimationMixer(this.mesh);
        this.clips = this.mesh.gltfAnims;

        this.clips.forEach(clip => {
            const action = this.mixer.clipAction(clip);
            action.play();
        });
    }

    stepWorld(delta, worldTime) {
        const worldlimit = this.game.worldLimit;
        let pos = this.getPos();
        let d = delta/1000;

        let diff;

        switch (this.state) {
            case "Wander":
                this.velocity.y = 0;
                this.speed = 1.2;
                diff = new T.Vector3().subVectors(pos, new T.Vector3(0,pos.y,0));
                if (diff.length() >= worldlimit) {
                    let newVel = new T.Vector3().lerpVectors(this.velocity, diff.negate(), 1);
                    this.velocity.copy(newVel).normalize();
                }
                else {
                    if (worldTime > this.nextTurnTime) {
                        this.nextTurnTime = worldTime + randomFloat(5000, 15000);
                        this.turnDir *= -1;
                        this.turnspeed = randomFloat(0.2, 0.7);
                    }

                    let turnAngle = this.turnspeed * this.turnDir * d;

                    let yX = new T.Vector3(0, 1, 0);
                    this.velocity.applyAxisAngle(yX, turnAngle);
                }

                // Look for roof to land on
                if (this.game.roofList.length) {
                   this.game.roofList.forEach(roof => {
                       if (roof.bird == null) {
                           roof.bird = this;
                           this.roof = roof;
                           this.state = "Landing";
                           return;
                       }
                   });
                }
                break;
            case "Landing":
                diff = new T.Vector3().subVectors(pos, this.roof.getPos());
                let newVel = new T.Vector3().lerpVectors(this.velocity, diff.negate(), 2*d);
                this.velocity.copy(newVel).normalize();

                if (diff.length() < 0.1)
                    this.state = "Landed";
                break;
            case "Landed":
                this.speed = 0;
                break;
            case "Takeoff":
                this.state = "Wander";
                break;
        }


        // Update Location based off velocity
        let dv = new T.Vector3().copy(this.velocity)
                                .multiplyScalar(d)
                                .multiplyScalar(this.speed)
                                .add(pos);
        this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z) - Math.PI / 2;
        this.setPos(dv.x, dv.y, dv.z);

        if (this.mixer)
            this.mixer.update(this.speed*delta/1000);
    }

    takeoff() {
        this.roof.bird = null;
        this.roof = null;
        this.state = "Takeoff";
    }
}

let boats = 0;
export class Boat extends GridObject
{
    constructor(x, y, z) {
        let mesh = loadGLTF("./objects/Boat.glb");

        super(`Boat No. ${boats++}`, mesh);

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;

        this.mesh = mesh;

        this.hoverable = false;
        this.aligned = false;
        this.solid = false;

        this.setPos(x, 0.55, z);

        this.velocity = new T.Vector3(1, 0, 0);
        this.speed = 0.4;
        this.turnspeed = 0.2;

        this.nextTurnTime = 0;
        this.turnDir = 1;
    }

    stepWorld(delta, worldTime) {
        const worldlimit = this.game.worldLimit;
        const SENSE_DISTANCE = 1;
        const yX = new T.Vector3(0, 1, 0);
        const EMERGENCY_SPEED = 0.05;
        const EMERGENCY_TURN_SPEED = 1;
        let pos = this.getPos();

        this.speed = 0.4;

        let d = delta/1000;
        let turnAngle;

        this.velocity.y = 0;
        let diff = new T.Vector3().subVectors(pos, new T.Vector3(0,pos.y,0));
        if (diff.length() >= worldlimit) {
            this.velocity.negate();
        }
        else {
            if (worldTime > this.nextTurnTime) {
                this.nextTurnTime = worldTime + randomFloat(9000, 25000);
                this.turnDir *= -1;
                this.turnspeed = randomFloat(0.1, 0.4);
            }

            turnAngle = this.turnspeed * this.turnDir * d;
        }

        // Test in 3 spots to see if we can make this move!
        let posFront = new T.Vector3().copy(this.velocity)
                                .multiplyScalar(SENSE_DISTANCE)
                                .add(pos)
                                .floor();
        let posLeft  = new T.Vector3().copy(this.velocity)
                                .multiplyScalar(SENSE_DISTANCE)
                                .applyAxisAngle(yX, Math.PI/8)
                                .add(pos)
                                .floor();
        let posRight = new T.Vector3().copy(this.velocity)
                                .multiplyScalar(SENSE_DISTANCE)
                                .applyAxisAngle(yX, -Math.PI/8)
                                .add(pos)
                                .floor();

        let front = this.game.at(posFront.x, posFront.y, posFront.z);
        let left = this.game.at(posLeft.x, posLeft.y, posLeft.z);
        let right = this.game.at(posRight.x, posRight.y, posRight.z);
        if (!front || !front.solid) {
            // Do nothing, we can move straight ahead
        }
        else if (!left || !left.solid) {
            // We can move to the left
            this.speed = EMERGENCY_SPEED; // Emergency Turn!
            turnAngle = Math.PI/2 * d * EMERGENCY_TURN_SPEED;
            this.nextTurnTime = worldTime; // Needs to pick a new direction
        }
        else if (!right || !right.solid) {
            // We can move to the right
            this.speed = EMERGENCY_SPEED; // Emergency Turn!
            turnAngle = -Math.PI/2 * d * EMERGENCY_TURN_SPEED;
            this.nextTurnTime = worldTime; // Needs to pick a new direction
        }
        else {
            // Super emergency turn!!!
            this.speed = 0;
            turnAngle = Math.PI/2 * d * EMERGENCY_TURN_SPEED;
            this.nextTurnTime = worldTime; // Needs to pick a new direction
        }

        this.velocity.applyAxisAngle(yX, turnAngle);

        // Update Location based off velocity
        let dv = new T.Vector3().copy(this.velocity)
                                .multiplyScalar(d)
                                .multiplyScalar(this.speed)
                                .add(pos);
        this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z) - Math.PI / 2;
        this.setPos(dv.x, dv.y, dv.z);
    }
}