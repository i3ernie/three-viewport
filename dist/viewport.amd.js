define(['exports', 'three', 'OrbitControls'], function (exports, three_module_js, OrbitControls_js) { 'use strict';

    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */
        
        var raycaster = new three_module_js.Raycaster();
        var mouseCoords = new three_module_js.Vector2();
        
        var PointerRay = function( VP ){
            
            this.getRay = function( event ){
                 mouseCoords.set(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1
                );
                raycaster.setFromCamera( mouseCoords, VP.camera );
                return raycaster.ray;
            };
            
           
        };

    //////////////////////////////////////////////////////////////////////////////////
    //		Loop                            				//
    //////////////////////////////////////////////////////////////////////////////////

        var Loop = function(){
            this._fcts = [];
        };

        /**
         * 
         * @param {function} fct
         * @returns {function}
         */
        Loop.prototype.add	= function( fct ){
            this._fcts.push( fct );
            return fct;
        };

        /**
         * 
         * @param {function} fct
         * @returns {undefined}
         */
        Loop.prototype.remove = function( fct ){
            var index	= this._fcts.indexOf( fct );
            if( index === -1 )	{ return; }
            this._fcts.splice( index,1 );
        };

        /**
         * 
         * @param {type} delta
         * @returns {undefined}
         */
        Loop.prototype.update = function( delta, now ){
            this._fcts.forEach( function( fct ){
                fct( delta, now );
            });
        };

    //////////////////////////////////////////////////////////////////////////////////
    //		THREEx.RenderingLoop						//
    //////////////////////////////////////////////////////////////////////////////////
    var RenderingLoop = function()
    {
        Loop.call( this );

        this.maxDelta	= 0.2;
        var requestId	= null;
        var lastTimeMsec= null;
    	
        var onRequestAnimationFrame = function( nowMsec ){
    		// keep looping
    		requestId	= requestAnimationFrame( onRequestAnimationFrame );

    		// measure time - never notify more than this.maxDelta
    		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
    		var deltaMsec	= Math.min(this.maxDelta*1000, nowMsec - lastTimeMsec);
    		lastTimeMsec	= nowMsec;
    		// call each update function
    		this.update( deltaMsec/1000, nowMsec/1000 );
        }.bind(this);


        //////////////////////////////////////////////////////////////////////////////////
        //		start/stop/isRunning functions					//
        //////////////////////////////////////////////////////////////////////////////////
        
        /**
         * 
         * @returns {undefined}
         */
        this.start = function(){
            console.assert(this.isRunning() === false);
            requestId	= requestAnimationFrame(onRequestAnimationFrame);
        };
        
        /**
         * 
         * @returns {Boolean}
         */
        this.isRunning = function(){
                return requestId ? true : false;
        };
        
        /**
         * 
         * @returns {undefined}
         */
        this.stop = function(){
                if( requestId === null )	{ return; }
                cancelAnimationFrame( requestId );
                requestId	= null;
        };
    };

    RenderingLoop.prototype = Object.assign( Object.create( Loop.prototype ), {
        constructor : RenderingLoop
    });

    /**
     * Created by bernie on 27.10.15.
     */


        var defaults = {
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
        
        var initRenderer = function(){ 
            
            var antialias = (this.options.antialias === "default")? true : false;

            this.renderer	= new three_module_js.WebGLRenderer({
                alpha : true,
                antialias	: antialias
            });    

            this.renderer.setSize( this.options.$vp.clientWidth, this.options.$vp.clientHeight );
            this.renderer.shadowMap.enabled = this.options.shadowMap;
            this.renderer.shadowMapSoft = true;
            this.renderer.setClearColor( new three_module_js.Color( this.options.clearColor ), this.options.opacity );
            
            return this;
        };


        var initScene = function(){
            this.scene = this.options.scene || new three_module_js.Scene();
            return this;
        };
        
        var initCamera = function(){
            this.camera = this.options.camera || new three_module_js.PerspectiveCamera(this.options.camFov, this.options.$vp.clientWidth / this.options.$vp.clientHeight, 1, 20000);
            return this;
        };

        var initControl = function(){
            this.control = this.options.control || new OrbitControls_js.OrbitControls( this.camera, this.renderer.domElement );
            return this;
        };

        var initLoop = function( ){
            var scope = this;
            this.loop  = new RenderingLoop();
            
            this.loop.add( function()
            {
                scope.renderer.render( scope.scene, scope.camera );
            } );    
            
            return this;
        };

        var initDomElement = function(){
            var VP = this;
            var $vp = this.options.$vp;
           
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
        var Viewport = /*@__PURE__*/(function (EventDispatcher) {
        function Viewport ( obj ) {       
                
                EventDispatcher.call(this);
                
                this.options = Object.assign({}, defaults, obj );
                
                //this.model = new Model();
                this.clock = new three_module_js.Clock();
            }

        if ( EventDispatcher ) Viewport.__proto__ = EventDispatcher;
        Viewport.prototype = Object.create( EventDispatcher && EventDispatcher.prototype );
        Viewport.prototype.constructor = Viewport;

            Viewport.prototype.init = function init () {

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
            };
        
            Viewport.prototype.start = function start ( opts ) {
                //this.DomEvents.addEventListener( this.scene, "click", this.onClick );
                this.clock.getDelta();
                this.loop.start();

                this.dispatchEvent({ type:"started" });
                
                return this;
            };
            
            Viewport.prototype.stop = function stop ( opts ) {
                //this.DomEvents.removeEventListener( this.scene, "click", this.onClick );
                this.loop.stop();
                
                this.dispatchEvent({ type:"stopped" });
                
                return this;
            };

            Viewport.prototype.onUpdateScene = function onUpdateScene ( ev ) {
            };
            Viewport.prototype.onClick = function onClick ( ev ) {
            };

            Viewport.prototype.disableControl = function disableControl () {
                this.control.enabled = false;
            };
            Viewport.prototype.enableControl = function enableControl () {
                this.control.enabled = true;
            };

        return Viewport;
    }(three_module_js.EventDispatcher)); 
        Viewport.make = function( opts ){
            var VP = new Viewport( opts );
            VP.init();
            VP.start();
            return VP;
        };

    Object.defineProperty(exports, 'OrbitControls', {
        enumerable: true,
        get: function () {
            return OrbitControls_js.OrbitControls;
        }
    });
    exports.RenderingLoop = RenderingLoop;
    exports.Viewport = Viewport;
    exports['default'] = Viewport;

    Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=viewport.amd.js.map
