import * as THREE from "three";
import WoodBox from "./WoodBox.js";
import Viewport from "viewport";


    const VP = new Viewport({
        $vp             : document.getElementById("viewport"),
        antialias       : "default", //none, default, fxaa, smaa
        renderer        : "standard", //"deferred", "standard"
        postprocessing  : false,
        shadowMap       : true,
        clearColor      : 'lightgrey',
        alpha           : true,
        opacity         : 0.5,
        camFov          : 45,
        cameraPosition     : [0,200,400]
    }).init().start();


    let mesh = new WoodBox();
    VP.scene.add( mesh );
