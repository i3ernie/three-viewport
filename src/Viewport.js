/**
 * Created by bernie on 27.10.15.
 */

/**
 * 
 * @param {type} _
 * @param {type} Backbone
 * @param {type} CMD
 * @param {type} Loop
 * @param {type} PointerRay
 * @param {type} Domevents
 * @param {type} model
 * @returns {ViewportL#8.Viewport}
 */

import { WebGLRenderer, Color, Scene, PerspectiveCamera, Clock, EventDispatcher } from "../node_modules/three/build/three.module.js";
import PointerRay from "./PointerRay.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import RenderingLoop from "./loops/RenderingLoop.js";


    const defaults = {
        $vp             : window.document.getElementsByTagName("body")[0],
        antialias       : "default", //none, default, fxaa, smaa
        renderer        : "standard", //"deferred", "standard"
        postprocessing  : false,
        shadowMap       : true,
        clearColor      : 'lightgrey',
        alpha           : true,
        opacity         : 0.5,
        camFov          : 45
    };
    
    const initRenderer = function(){ 
        
        let antialias = (this.options.antialias === "default")? true : false;

        this.renderer	= new WebGLRenderer({
            alpha : true,
            antialias	: antialias
        });    

        this.renderer.setSize( this.options.$vp.clientWidth, this.options.$vp.clientHeight );
        this.renderer.shadowMap.enabled = this.options.shadowMap;
        this.renderer.shadowMapSoft = true;
        this.renderer.setClearColor( new Color( this.options.clearColor ), this.options.opacity );
        
        return this;
    };


    const initScene = function(){
        this.scene = this.options.scene || new Scene();
        return this;
    };
    
    const initCamera = function(){
        this.camera = this.options.camera || new PerspectiveCamera(this.options.camFov, this.options.$vp.clientWidth / this.options.$vp.clientHeight, 1, 20000);
        return this;
    };

    const initControl = function(){
        this.control = this.options.control || new OrbitControls( this.camera, this.renderer.domElement );
        return this;
    };

    const initLoop = function( ){
        let scope = this;
        this.loop  = new RenderingLoop();
        
        this.loop.add( function()
        {
            scope.renderer.render( scope.scene, scope.camera );
        } );    
        
        return this;
    };

    const initDomElement = function(){
        let VP = this;
        let $vp = this.options.$vp;
       
        if ( this.options.$vp === window || this.options.$vp[0] === window ) { 
            window.document.body.appendChild( this.renderer.domElement );
        }
        else { 
            this.options.$vp.appendChild( this.renderer.domElement );
        }

        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize() {

            VP.camera.aspect = $vp.clientWidth / $vp.clientHeight;
            VP.camera.updateProjectionMatrix();
        
            VP.renderer.setSize( $vp.clientWidth, $vp.clientHeight );
        }

        return this;
    };

    /**
     * 
     * @param {type} obj
     * @returns {ViewportL#14.Viewport}
     */
    const Viewport = function( obj )
    {        
        this.options = Object.assign({}, defaults, obj );
        
        //this.model = new Model();
        this.clock = new Clock();
    };

    Object.assign( Viewport.prototype, EventDispatcher.prototype, {
    
        init : function() {

            initRenderer.call( this ).dispatchEvent({ type:"rendererInitalized" });

            initScene.call( this ).dispatchEvent({ type:"sceneInitalized" });

            initCamera.call( this );
            this.scene.add( this.camera );
            this.dispatchEvent({ type:"cameraInitalized" });

            initDomElement.call( this ).dispatchEvent({ type:"domeElementInitalized" });

            //render loop
            initLoop.call( this ).dispatchEvent({ type:"loopInitalized" });

            //camera control
            initControl.call( this ).dispatchEvent({ type:"controlInitalized" });

            //loop
            this.scene.addEventListener( 'update', this.onUpdateScene.bind(this) );

            
            this.raycaster = new PointerRay( this );

            this.dispatchEvent( {type: "initalized" });
            
            return this;
        },
    
        start : function(){
            //this.DomEvents.addEventListener( this.scene, "click", this.onClick );
            this.clock.getDelta();
            this.loop.start();

            this.dispatchEvent({ type:"started" });
            
            return this;
        },
        
        stop : function(){
            //this.DomEvents.removeEventListener( this.scene, "click", this.onClick );
            this.loop.stop();
            
            this.dispatchEvent({ type:"stopped" });
            
            return this;
        },

        onUpdateScene : function( ev ){
        },
        onClick : function( ev ){
        }
    });
 
    Viewport.prototype.disableControl = function() {
        this.control.enabled = false;
    };
    Viewport.prototype.enableControl = function() {
        this.control.enabled = true;
    };
    

export default Viewport;
export {Viewport, RenderingLoop,OrbitControls };
