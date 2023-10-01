import * as THREE from "three";
import WoodBox from "./WoodBox.js";
import Viewport from "viewport";

    const VP = Viewport.make();

    VP.camera.position.z = 400;

    VP.scene.add( new WoodBox() );
