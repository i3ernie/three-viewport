# three-viewport
simple viewport with camera and scene and render-loop for three.js

# usage
## ES6

```javascript


import * as THREE from 'three.module.js';
import Viewport from 'viewport.es.js'

let VP = new Viewport();

VP.init().start();


//add new scene element
VP.scene.add( new THREE.Mesh( new THREE.BoxGeometry(10,10,10) ) );

//animation with loop
VP.loop.add( function(){
  box.position.x = box.position.x + .1
});

```

### Examples

- Basic [example/basic.html](https://i3ernie.github.io/three-viewport/examples/demo.es.html). 
