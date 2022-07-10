import * as THREE from "three";
import Viewport from "Viewport";

    const texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    const VP = new Viewport().init().start();

    VP.camera.position.z = 400;

    VP.scene.add ( 
        new THREE.Mesh ( 
            new THREE.BoxBufferGeometry( 200, 200, 200 ), 
            new THREE.MeshBasicMaterial({ map: texture }) 
        ) 
    );