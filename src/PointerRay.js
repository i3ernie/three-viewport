/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { Raycaster, Vector2 } from "three";
    
const raycaster = new Raycaster();
const mouseCoords = new Vector2();
    
    class PointerRay {

        constructor ( VP ) {
            
            this.getRay = function( event ) {

                mouseCoords.set(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1
                );

                raycaster.setFromCamera( mouseCoords, VP.camera );

                return raycaster.ray;
            };
        
        }
    }
    
export default PointerRay;