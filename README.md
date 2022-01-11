# Framework Updates

1. Add `vrHelper.js` to `/libs/CS559-Framework`
2. Add `stats.js` to `/js`
3. Make changes to `GrWorld`
   1. Import the following
        ```js
        import { VrHelper } from './vrHelper.js'
        import Stats from '../../js/stats.js'
        ```
   2. Add the following code to the end of the constructor
        ```js
        this.vrHelper = new VrHelper({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            flightSpeed: 10,
        })

        this.stats = Stats()
        this.stats.setMode(0);

        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0';
        this.stats.domElement.style.top = '0';
        document.body.appendChild( this.stats.domElement );
        ```
   2. Add the following code to `animate()`
        ```js
        this.vrHelper.update()
        this.stats.update()
        ```
    3. In `go()`, replace `window.requestAnimationFrame(loop);` with `self.renderer.setAnimationLoop(loop)`.
4. Create a folder named `webxr` at `/libs/CS559-Three/examples/jsm/` and add `VRButton.js` and `XRControllerModelFactory.js`
5. Replace `three.module.js` at `/libs/CS559/build/` with `three.module.js`.