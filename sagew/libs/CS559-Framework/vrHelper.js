import { XRControllerModelFactory } from '../CS559-Three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '../CS559-Three/examples/jsm/webxr/VRButton.js';
import * as T from "../CS559-Three/build/three.module.js";
import { Group } from "../CS559-Three/build/three.module.js";

export class VrHelper {
    constructor(options) {

        this.renderer = options.renderer;
        this.scene = options.scene;
        this.camera = options.camera;
        this.speed = options.flightSpeed;

        this.clock = new T.Clock();
        this.isFlying = false;
        this.vrFlightVec = new T.Vector3(0, 0, 0)

        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer))

        // create and add right controller to the screen
        this.controller1 = this.renderer.xr.getControllerGrip(0);
        const controllerModelFactory = new XRControllerModelFactory();
        const model1 = controllerModelFactory.createControllerModel(this.controller1);
        this.controller1.add(model1);
        this.scene.add(this.controller1); 

        this.cameraGroup = new Group()
        this.cameraGroup.add(this.camera)
        this.scene.add(this.cameraGroup)

        this.controller1.addEventListener('squeezestart', () => {
            // fly in the direction the camera is facing
            let dir = this.renderer.xr.getCamera(this.camera).getWorldDirection(new T.Vector3(0,0,0))
            // let dir = this.controller1.getWorldDirection(new T.Vector3(0, 0, 0))
            console.log(dir.x + ' ' + dir.y + ' ' + dir.z)
            this.vrFlightVec = dir.normalize()
            this.isFlying = true;
        })     

        this.controller1.addEventListener('squeezeend', () => {
            this.vrFlightVec = new T.Vector3(0, 0, 0)
            this.isFlying = false;
        }) 
    }    

    update() {
        let delta = this.clock.getDelta();
        if (this.isFlying) {
            this.cameraGroup.position.addScaledVector(this.vrFlightVec, this.speed * delta)
        }
    }
}