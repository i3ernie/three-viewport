/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')(); // Load all gulp plugins
                                              // automatically and attach
                                              // them to the `plugins` object
const _ = require('lodash');
const fs = require('fs');
const rollup  = require('rollup');
const resolve =require('rollup-plugin-node-resolve');



const buble = require('rollup-plugin-buble');

const path = require('path');

var pkg = require('./package.json');
var dirs = pkg.directories;
//var requireconfig = require("./config.json");

const rollupBuild = function ( inputOptions, outputOptions, done ) {
    // create a bundle
    rollup.rollup(inputOptions).then( function( bundle ){

        console.log( bundle.watchFiles ); // an array of file names this bundle depends on

        // generate code
        bundle.generate( outputOptions ).then( function( output ){

            // or write the bundle to disk
            bundle.write(outputOptions).then(function(){
                done();
            });
        });

    });
};

const replace = function( obj ){
    
    return { 
        name : "replace",
        generateBundle : function( code, code2 ){ 
            for ( key in obj ){
                for ( file in code2 ) {
                    let str = code2[file].code;
                    code2[file].code = str.replace(new RegExp(key, "g"), obj[key] );
                }
            }
        }
    };
};

gulp.task('default', ( done ) => {
    build_viewport( ()=>{
        build_domeventsES(()=>{
            done();
        });
    });
});


gulp.task('init', ( done ) => {
    
    var fnc = function( src, dest, req, name, mod )
    {
        var end = '';
        
        fs.readFile( './node_modules/'+src, 'utf8', ( err, content ) => {
            if ( err ) { console.log( err ); return; }
            if ( typeof mod === "string" ) { end = "\n return " + mod + ';';  }
            var ret = ( typeof req === "string" )? 'define('+req+', function('+name+'){\n' + content + end + "\n});" : content;
            fs.writeFile(dest, ret, 'utf8', ( err ) => {
                if ( err ) { console.log( "ERROR: ", err ); }
            });
        });
    };
    
    var modules = require("./modules.json");
    
    _.each(modules, ( el ) =>{ 
        fnc(el.src, el.dest, el.req , el.name, el.mod);
    });    
    done();
    
});

gulp.task("build", ( done ) => {
    "use strict";
    build_viewport( ()=>{
        build_domeventsES(()=>{
            done();
        });
    });
    
});

gulp.task("buildAMD", ( done )=>{
    build_viewport( done );
});

const build_viewport = function( done ){
   
    rollup.rollup({
        input : 'src/Viewport.js',
        external: ['../node_modules/three/build/three.module.js',  '../node_modules/three/examples/jsm/controls/OrbitControls.js'],
        
        plugins:[

            resolve(),
            
            buble({
				transforms: {
					arrow: false,
					classes: true
				}
			})
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/viewport.amd.js',


            plugins:[
                replace({
                    "../node_modules/three/build/three.module" : "three",
                    "../node_modules/three/examples/jsm/controls/OrbitControls" : "OrbitControls"
                })
            ],
            
            format: 'amd',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
};

gulp.task("buildES", ( done ) => {
    build_viewportES( done );
});

const build_viewportES = function( done ){
   
    rollup.rollup({
        input : 'src/Viewport.js',
        external: ['../node_modules/three/build/three.module.js', '../node_modules/three/examples/jsm/controls/OrbitControls.js'],
        
        plugins:[
            
            resolve(),
            
            buble({
				transforms: {
					arrow: false,
					classes: true
				}
            })
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/viewport.es.js',
            plugins:[
                replace({
                    "../node_modules/three/" : "../../three/"
                })
            ],
            
            format: 'es',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
};




