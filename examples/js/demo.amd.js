require.config({
    paths : {
        "three" : "../../node_modules/three/build/three",
        "Viewport" : "../../dist/viewport.amd",
        "OrbitControls" : "./OrbitControls"
    }
});


require(["three" ,"WoodBox.amd", "Viewport"], function( THREE,  WoodBox, ViewportPack) {

        const VP = new ViewportPack.Viewport().init().start();

        VP.camera.position.z = 400;

        VP.scene.add( new WoodBox() );
});