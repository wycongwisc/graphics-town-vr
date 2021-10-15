import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Group } from "../libs/CS559-Three/build/three.module.js";

export class TicketBooth extends GrObject {
    constructor(params = {}) {
        let booth = new T.Group();
        let base_geo = new T.BoxGeometry(2, 3, 2);
        let tl_base =   new T.TextureLoader().load('./images/Ticket Booth Front.jpg');

        let base_mat = new T.MeshStandardMaterial({map: tl_base})
        let base = new T.Mesh(base_geo, base_mat);

        let tl_top =   new T.TextureLoader().load('./images/tickets.jpg');

        let top_geo = new T.BoxGeometry(2.5, 1, 2.5);
        let top_mat = new T.MeshStandardMaterial({map: tl_top});
        let top = new T.Mesh(top_geo, top_mat);
        top.translateY(1.7);

        let roof_geo = new T.BoxGeometry(2.2, 1, 2.2);
        let roof_mat = new T.MeshStandardMaterial({color: 'white'});
        let roof = new T.Mesh(roof_geo, roof_mat);

        roof.position.y = 1.9;
        booth.add(base, top, roof);
        booth.position.set(params.x || 0, 3 / 2, params.z || 0);
        super('Ticket Booth', booth);
        this.highlighted = true;
    }
}

export class SimpleHouse extends GrObject {
    /**
     *
     * @param {Number} x
     * @param {Number} z
     */
    constructor(params = {}) {
      let housegrp = new T.Group();
      let geom = new T.BoxGeometry();
  
      let roofgeo = new T.Geometry();
      roofgeo.vertices.push(new T.Vector3(-.5, .5, -.5));
      roofgeo.vertices.push(new T.Vector3(.5, .5, -.5));
      roofgeo.vertices.push(new T.Vector3(.5, 1, 0));
  
      roofgeo.vertices.push(new T.Vector3(-.5, 1, 0));
  
      roofgeo.vertices.push(new T.Vector3(.5, .5, .5))
  
  
      let f1 = new T.Face3(2, 1, 0);
      roofgeo.faces.push(f1);
  
      let f2 = new T.Face3(3, 2, 0);
      roofgeo.faces.push(f2);
  
      let f3 = new T.Face3(4, 1, 2);
      roofgeo.faces.push(f3);
  
      roofgeo.computeFaceNormals();
  
      let roofmat = new T.MeshStandardMaterial({
          color: "white",
          roughness: 0.75
        });
        let roof = new T.Mesh(roofgeo, roofmat);
        let roof2 = roof.clone();
        roof2.rotation.y = Math.PI;
        housegrp.add(roof, roof2);
  
      let doorgeo = new T.Geometry();
      doorgeo.vertices.push(new T.Vector3(0, 0, 0))
      doorgeo.vertices.push(new T.Vector3(.5, 0, 0))
      doorgeo.vertices.push(new T.Vector3(0, 1.2, 0))
  
      doorgeo.vertices.push(new T.Vector3(.5, 1.2, 0));
  
      let f4 = new T.Face3(0, 1, 2);
      doorgeo.faces.push(f4);
      doorgeo.faceVertexUvs[0].push([
          new T.Vector2(.25, 0),
          new T.Vector2(.7, 0),
              new T.Vector2(.25, 1)
            ]);
  
            let f5 = new T.Face3(2, 1, 3);
            doorgeo.faces.push(f5);
            doorgeo.faceVertexUvs[0].push([
                new T.Vector2(.25, 1),
                new T.Vector2(.7, 0),
                    new T.Vector2(.7, 1)
                  ]);
      doorgeo.computeFaceNormals();
      doorgeo.uvsNeedUpdate = true;
      
  
      let windowgeo = new T.Geometry();
      windowgeo.vertices.push(new T.Vector3(0, 0, 0))
      windowgeo.vertices.push(new T.Vector3(.8, 0, 0))
      windowgeo.vertices.push(new T.Vector3(0, 1.2, 0))
  
      windowgeo.vertices.push(new T.Vector3(.8, 1.2, 0));
  
      let f6 = new T.Face3(0, 1, 2);
      windowgeo.faces.push(f6);
      windowgeo.faceVertexUvs[0].push([
          new T.Vector2(.15, .2),
          new T.Vector2(.8, .2),
              new T.Vector2(.25, .9)
            ]);
  
            let f7 = new T.Face3(2, 1, 3);
            windowgeo.faces.push(f7);
            windowgeo.faceVertexUvs[0].push([
                new T.Vector2(.15, .9),
                new T.Vector2(.8, .2),
                    new T.Vector2(.7, .9)
                  ]);
      windowgeo.computeFaceNormals();
      windowgeo.uvsNeedUpdate = true;
  
  
      let tl = new T.TextureLoader().load("./images/brick.jpeg");
  
      let material = new T.MeshStandardMaterial({ map: tl, roughness: 0.75 });
  
      let tl2 = new T.TextureLoader().load("./images/door.jpeg");
      let doormat = new T.MeshStandardMaterial({ map: tl2, roughness: 0.75 });
  
      let tl3 = new T.TextureLoader().load("./images/window.jpeg");
      let windowmat = new T.MeshStandardMaterial({ map: tl3, roughness: 0.75 });
  
      let mesh = new T.Mesh(geom, material);
  
      let door = new T.Mesh(doorgeo, doormat);
      door.scale.set(.75, .75, .75);
      //door.position.set(0, -.5, .51);
      door.position.set(-.51, -.5, -.25);
      door.rotateY(-Math.PI / 2);

      housegrp.add(door);
  
      let window = new T.Mesh(windowgeo, windowmat)
      window.position.set(.51, -.4, .4);
      window.rotation.y = (Math.PI / 2)
      window.scale.set(.6, .6, .6);
      housegrp.add(window);
  
      housegrp.position.x = params.x || 0;
      housegrp.position.z = params.z || 0;
      housegrp.position.y = 0.8;
      housegrp.add(mesh);

      housegrp.scale.set(2, 2, 2);
      //housegrp.rotateY(-Math.PI / 2)
      housegrp.rotateY(params.rotY + Math.PI / 2 || 0);
      
  
      super("box", housegrp);
      this.house = housegrp;
    } translateX(num) {
        this.house.translateX(num);
    }
  }

  export class Statue extends GrObject {
    constructor(params = {}) {


      let statue = new T.Group();

      super("Statue", statue);
  
      this.world = params.world;
      const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
      this.cubecam = new T.CubeCamera(params.radius*1.05, 1000, cubeRenderTarget);
      this.head_geo = new T.SphereBufferGeometry(params.radius, 20, 10);
      this.head_mat = new T.MeshStandardMaterial({
        color: "white",
        roughness: 0.1,
        metalness: .9,
        // @ts-ignore   // envMap has the wrong type
        envMap: this.cubecam.renderTarget.texture,
      });

      this.base_mat = new T.MeshStandardMaterial({color: '#b89c00', metalness: .7, roughness: .1})
      this.head = new T.Mesh(this.head_geo, this.head_mat);
      statue.add(this.cubecam);

      this.body_geo = new T.ConeBufferGeometry(1.9, 7.2, 20);
      this.body = new T.Mesh(this.body_geo, this.head_mat);
      this.body.translateY(4.5);
      this.head.translateY(9.3);

      this.base_geo = new T.CylinderBufferGeometry(3, 3, 2, 20);
      this.base = new T.Mesh(this.base_geo, this.base_mat);


      statue.add(this.head, this.body, this.base);
      this.highlighted = true;
      statue.position.set(params.x || 0, params.y || 1, params.z || 0);
    }
    stepWorld(delta, timeOfDay) {
      this.cubecam.update(this.world.renderer, this.world.scene);
    }
  }