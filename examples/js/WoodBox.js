import {TextureLoader, BoxGeometry, MeshBasicMaterial, Mesh} from "three";

var texture = new TextureLoader().load( 'textures/crate.gif' );

class WoodBox extends Mesh {

    constructor ( geo, mat ) {
        geo = geo || new BoxGeometry( 200, 200, 200 );
        mat = mat || new MeshBasicMaterial( { map: texture } );

        super( geo, mat );
    }
};

export default  WoodBox;