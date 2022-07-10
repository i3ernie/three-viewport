define(["three"], function( THREE ){
    var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    class WoodBox extends THREE.Mesh {
        constructor ( geo, mat ) {
            geo = geo || new THREE.BoxBufferGeometry( 200, 200, 200 );
            mat = mat || new THREE.MeshBasicMaterial( { map: texture } );
    
            super( geo,mat );
        }
    };

    return WoodBox;
}); 



