import {TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from "../node_modules/three/build/three.module.js";

var texture = new TextureLoader().load( 'textures/crate.gif' );

const WoodBox = function( geo, mat ){
    geo = geo || new BoxBufferGeometry( 200, 200, 200 );
    mat = mat || new MeshBasicMaterial( { map: texture } );

    Mesh.call( this, geo,mat );
};

WoodBox.prototype = Object.assign( Object.create( Mesh.prototype ), {
    constructor : WoodBox
});

export default  WoodBox;