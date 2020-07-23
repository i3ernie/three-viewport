import * as THREE from "../node_modules/three/build/three.module.js";
import WoodBox from "./WoodBox.js";
import Viewport from "../src/Viewport.js";

init();

function init(){

    let el = document.getElementById("viewport");
    let VP = new Viewport({$vp : el});

    VP.init();
    VP.start();


    VP.camera.position.z = 400;

    let mesh = new WoodBox();
    VP.scene.add( mesh );

}