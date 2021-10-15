import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";


export class Pool extends GrObject {
    constructor(params = {}) {



        let waterGroup = new T.Group();

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
                speed: {value: 22},
                frequency: {value: 22},
                highlightIntensity: {value: 2},
                highlightColor: {value: new T.Vector3(.6156, .5529, .9607)},
                lowerBound: {value: 20},
                wavetexture: {value: image}
              },
        });


        let pool_group = new T.Group();
        let pool1_geo = new T.CylinderGeometry(6, 6, 1, 20);
        let pool1 = new T.Mesh(pool1_geo, shaderMat);

        let pool2_geo = new T.CylinderGeometry(4, 4, 1, 20);
        let pool2 = new T.Mesh(pool2_geo, shaderMat);
        pool2.translateZ(5);
        pool_group.add(pool1, pool2);
        pool_group.scale.set(params.sx || 1, params.sy || 1, params.sz || 1);
        waterGroup.add(pool_group);

        super("Pool", waterGroup);
        this.pool = waterGroup;
        this.pool.position.set(params.x || 0, params.y || 0, params.z || 0);
        this.shader = shaderMat;
        //this.pool.scale.set(params.sx || 1, params.sy || 1, params.sz || 1);
    } stepWorld(delta, timeOfDay) {
        this.shader.time += delta * .01;
    }
}