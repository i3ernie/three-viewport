/**
 * Created by bernie on 27.10.15.
 */

/**
 * 
 * @param {type} Loop
 * @param {type} PointerRay
 * @returns {Viewport}
 */

import { WebGLRenderer, Color, Scene, PerspectiveCamera, Clock, EventDispatcher } from "three";
import PointerRay from "./PointerRay.js";
import {OrbitControls} from "OrbitControls";
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

        enableControl : true,

        camFov          : 45,
        cameraPosition     : [0, 0, 400]
    };
    
    const initRenderer = function(){ 

        this.renderer	= new WebGLRenderer({
            alpha : this.options.alpha,
            antialias	: (this.options.antialias === "default")? true : false
        });    

        this.renderer.setSize( this.options.$vp.clientWidth, this.options.$vp.clientHeight );
        this.renderer.shadowMap.enabled = this.options.shadowMap;
        this.renderer.shadowMapSoft = true;
        this.renderer.setClearColor( new Color( this.options.clearColor ), this.options.opacity );
        
        return this;
    };


    const initScene = function() {

        this.scene = this.options.scene || new Scene();
        return this;
    
    };
    
    const initCamera = function() {
        
        const o = this.options;

        this.camera = o.camera || new PerspectiveCamera(
            o.camFov, o.$vp.clientWidth / o.$vp.clientHeight, 
            1, 20000
        );

        this.camera.position.set( o.cameraPosition[0], o.cameraPosition[1], o.cameraPosition[2] );
        this.scene.add( this.camera );

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
    class Viewport extends EventDispatcher { 

        constructor ( obj ) {       
            
            super();
            
            this.options = Object.assign({}, defaults, obj );
            
            this.clock = new Clock();
        }

        init ( opts ) {

            Object.assign(this.options, opts); 

            initRenderer.call( this ).dispatchEvent({ type:"rendererInitalized" });

            initScene.call( this ).dispatchEvent({ type:"sceneInitalized" });

            initCamera.call( this ).dispatchEvent({ type:"cameraInitalized" });

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
        }
    
        start ( opts ) {

            this.clock.getDelta();
            this.loop.start();

            this.dispatchEvent({ type:"started" });
            
            return this;
        
        }
        
        stop ( opts ) {

            this.loop.stop();
            
            this.dispatchEvent({ type:"stopped" });
            
            return this;
        }

        onUpdateScene ( ev ) {
        }

        disableControl () {
            this.control.enabled = false;
        }

        enableControl () {
            this.control.enabled = true;
        }
    };
 
    Viewport.make = function( opts ) {

        return new Viewport( opts ).init().start();
    
    };
    

export default Viewport;
export {Viewport, RenderingLoop,OrbitControls };
