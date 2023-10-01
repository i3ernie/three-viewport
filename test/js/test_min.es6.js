import WoodBox from "./WoodBox.js";
import Viewport from "viewport";

    const VP = new Viewport().init().start();

    VP.camera.position.z = 400;

    VP.scene.add( new WoodBox() );
