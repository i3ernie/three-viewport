# three-viewport
[![DeepScan grade](https://deepscan.io/api/teams/22235/projects/25585/branches/802652/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=22235&pid=25585&bid=802652)

#### one line viewport for three.js
make a simple and fast viewport with camera and scene and render-loop for the three.js 3D library

[Examples](https://i3ernie.github.io/three-viewport/examples/) &mdash;

# usage
## ES6

```javascript
import * as THREE from 'three.module.js';
import Viewport from 'viewport.es.js'

let VP = new Viewport();

VP.init();
VP.start();

let box =  new THREE.Mesh( new THREE.BoxGeometry(10,10,10) );

//add new scene element
VP.scene.add( box );

//animation with loop
VP.loop.add( function(){
  box.position.x = box.position.x + .1
});
```
