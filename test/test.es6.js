import * as THREE from "three";
import WoodBox from "./WoodBox.js";
import Viewport from "../src/Viewport.js";


    let el = document.getElementById("viewport");
    let VP = new Viewport();

    VP.init().start();


    VP.camera.position.z = 400;

    let mesh = new WoodBox();
    VP.scene.add( mesh );
