import * as THREE from "../node_modules/three/build/three.module.js";
import WoodBox from "./WoodBox.js";
import Viewport from "../src/Viewport.js";


    let VP = new Viewport();

    VP.init();
    VP.start();

   // VP.DomEvents = new Domevents( VP.camera, VP.renderer.domElement );

    VP.camera.position.z = 400;

    let mesh = new WoodBox();
    VP.scene.add( mesh );
