import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { MeshStandardMaterial } from "../libs/CS559-Three/build/three.module.js";

export class Rock extends GrObject {
    constructor (params = {}) {
       // let rock = new T.Group();
        let rock_geo = new T.SphereGeometry();
        let tl = new T.TextureLoader();
        let text = tl.load('./images/rock.jpeg')
        let rock_mat = new T.MeshStandardMaterial({map: text});
        let rock = new T.Mesh(rock_geo, rock_mat);
        rock.scale.set(Math.random() * .5 + .5, Math.random() * .5 + .5, Math.random() * .5 + .5);
        rock.position.set(params.x || 0, 0, params.z || 0);
        super('rock', rock);
    }
}