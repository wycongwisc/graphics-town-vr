import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";


export class Waterfall extends GrObject {
    constructor(params = {}) {
        let waterfall = new T.Group();
        
        // mountain
        let mountainGroup = new T.Group();
        let mount_geo = new T.CylinderGeometry(4, 7, 15, 5);
        let mount_mat = new T.MeshStandardMaterial({color: '#63635e'});
        let mountain = new T.Mesh(mount_geo, mount_mat);
        mountainGroup.add(mountain);
        waterfall.add(mountainGroup);

        // water
        let waterGroup = new T.Group();
        let extrudeSettings = {
            //steps: 2,
            depth: 2,
            bevelEnabled: false,
        }
        let ws = new T.Shape();
        ws.moveTo(-.1, -.1);
        ws.lineTo(3, -15);
        ws.lineTo( 4, -15);
        ws.lineTo(1, 0);

        let wgeo = new T.BoxGeometry(2, 15, 1);
        //let wgeo = new T.ExtrudeGeometry(ws, extrudeSettings);
        let wmat = new T.MeshStandardMaterial();

        let tl = new T.TextureLoader();
        let image = tl.load('./images/water.jpeg');

        let time = 0;

        let shaderMat = shaderMaterial("./waterfall.vs", "./waterfall.fs", {
            side: T.DoubleSide,
            uniforms: {
                amplitude: {value: 0.09},
                time: {value: time},
                speed: {value: 10},
                frequency: {value: 22},
                highlightIntensity: {value: 2},
                highlightColor: {value: new T.Vector3(.6156, .5529, .9607)},
                lowerBound: {value: 20},
                wavetexture: {value: image}
              },
        });

        let w1 = new T.Mesh(wgeo, shaderMat);
        w1.position.set(-3, 0, 3);
        w1.rotation.set(-Math.PI / 7, -Math.PI / 2.5, -Math.PI / 9)
        waterGroup.add(w1);
        let pool_group = new T.Group();
        let pool1_geo = new T.CylinderGeometry(6, 6, 1, 20);
        let pool1_mat = new T.MeshStandardMaterial();
        let pool1 = new T.Mesh(pool1_geo, shaderMat);

        let pool2_geo = new T.CylinderGeometry(4, 4, 1, 20);
        let pool2_mat = new T.MeshStandardMaterial();
        let pool2 = new T.Mesh(pool2_geo, shaderMat);
        pool2.translateZ(5);
        pool_group.add(pool1, pool2);
        pool_group.position.set(-7, -7.9, 9);
        waterGroup.add(pool_group);
        waterfall.add(waterGroup);

        super('waterfall', waterfall);
        this.shader = shaderMat;

        this.setPos(params.x || 0, 7.5, params.z || 0);

    }
    stepWorld(delta, timeOfDay) {
       // this.time += 1;
   //     this.shader.uniforms.time.value += delta * .01;
    }
}