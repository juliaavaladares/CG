import * as THREE from  '../../build/three.module.js';
import Stats from       '../../build/jsm/libs/stats.module.js';
import {GUI} from       '../../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        createGroundPlane,
        onWindowResize, 
        initDefaultLighting,
        lightFollowingCamera,
        initCamera} from "../../libs/util/util.js";

var stats = new Stats();
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

var speed = 0.5;
var nextX = 0;
var nextY = 0;
var moveSphere = false;

var plane = createGroundPlane(25, 25, 40, 40);
scene.add(plane);

var sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);

sphere.translateZ(0.0).translateZ(0.0).translateZ(1.0);

var circleGeometry = new THREE.CircleGeometry( 0.8, 32);
var circleMaterial = new THREE.MeshBasicMaterial( { color: 0x958085 } );
var circle = new THREE.Mesh( circleGeometry, circleMaterial );
scene.add( circle );
circle.translateZ(0.001);

// Main camera
var camera = initCamera(new THREE.Vector3(30, 30, 10)); // Init camera in this position
camera.up.set(0, 0, 1);
camera.lookAt(0.0, 0.0, 0.0);

var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


buildInterface();
render();

function moveSphereToPosition()
{
  if(moveSphere)
  {
    sphere.lookAt(new THREE.Vector3(nextX, nextY, 1));
        
    if(Math.abs(sphere.position.x - nextX )> speed)
    {
      sphere.translateZ(speed);
    } else{
      moveSphere = false;
    }
  }
}

function buildInterface()
{
  var controls = new function ()
  {
    this.onMoveSphere = function(){
      moveSphere = !moveSphere;
    };
    this.speed = 0.05;
    this.nextX = 0.0;
    this.nextY = 0.0;

    this.changeSpeed = function(){
      speed = this.speed;
    };

    this.changeX = function(){
      nextX = this.nextX;
      circle.position.x = nextX;
    };

    this.changeY = function(){
      nextY = this.nextY;
      circle.position.y = nextY;
    };

    this.reset = function(){
      
      circle.position.set(0,0,0.001);
      sphere.position.set(0,0,1.0);
      controls.nextX = 0;
      controls.nextY = 0;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onMoveSphere',true).name("Move Sphere");
  gui.add(controls, 'speed', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
  gui.add(controls, 'nextX', -12.5,12.5)
    .onChange(function(e) { controls.changeX() })
    .name("Change X Position");
  gui.add(controls, 'nextY', -12.5,12.5)
    .onChange(function(e) { controls.changeY() })
    .name("Change Y Position");
  gui.add(controls, 'reset')
    .onChange(function(e) { controls.reset() })
    .name("Reset");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  moveSphereToPosition();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render);

  renderer.render(scene, camera) // Render scene
}