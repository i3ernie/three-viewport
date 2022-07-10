import {TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from "../node_modules/three/build/three.module.js";

var texture = new TextureLoader().load( 'textures/crate.gif' );

class WoodBox extends Mesh {
    constructor ( geo, mat ) {
        geo = geo || new BoxBufferGeometry( 200, 200, 200 );
        mat = mat || new MeshBasicMaterial( { map: texture } );

        super( geo,mat );
    }
};

export default  WoodBox;