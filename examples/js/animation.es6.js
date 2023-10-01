//import * as THREE from "three";
import WoodBox from "./WoodBox.js";
import Viewport from "viewport";

const VP = new Viewport().init().start();

VP.camera.position.z = 400;

const box = new WoodBox();
VP.scene.add( box );

//animation with loop
VP.loop.add( function() {
    box.position.x = box.position.x + .1
});
