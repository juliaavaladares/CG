import * as THREE from  '../../build/three.module.js';
import Stats from       '../../build/jsm/libs/stats.module.js';
import {GUI} from       '../../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultLighting, 
        degreesToRadians, 
        lightFollowingCamera,
        onWindowResize} from "../../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(5, 5, 7)); // Init camera in this position
var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Set angles of rotation
var angle = [0,0,0,0];
var speed = 0.05;
var animationOn = true; // control if animation is on or of

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Base sphere
var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Set initial position of the sphere
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

// More information about cylinderGeometry here ---> https://threejs.org/docs/#api/en/geometries/CylinderGeometry
var greenCylinder = createCylinder([0.1, 0.1, 2.0, 25], 'rgb(100,255,100)');
sphere.add(greenCylinder);

var redCylinder = createCylinder([0.07, 0.07, 1.0, 25], 'rgb(255,100,100)');
greenCylinder.add(redCylinder);

var firstYellowCylinder = createCylinder([0.07, 0.07, 1.0, 25], 'rgb(255,255,0)');
redCylinder.add(firstYellowCylinder);

var secondYellowCylinder = createCylinder([0.07, 0.07, 1.0, 25], 'rgb(255,255,0)');
redCylinder.add(secondYellowCylinder);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function createCylinder(geometry, color) {
  let [radiusTop, radiusBottom, height, radialSegments] = geometry
  var cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  var cylinderMaterial = new THREE.MeshPhongMaterial( {color: color} );
  var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );

  return cylinder
}

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  greenCylinder.matrixAutoUpdate = false;
  redCylinder.matrixAutoUpdate = false;
  firstYellowCylinder.matrixAutoUpdate = false;
  secondYellowCylinder.matrixAutoUpdate = false;

  // Set angle's animation speed
  if(animationOn)
  {
    angle[0]+=speed;
    angle[1]+=speed*2;
    angle[2]+=speed*2;
    angle[3] = -angle[2];
    
    var mat4 = new THREE.Matrix4();
    greenCylinder.matrix.identity();  // reset matrix
    redCylinder.matrix.identity();  // reset
    firstYellowCylinder.matrix.identity();
    secondYellowCylinder.matrix.identity();

    // Will execute T1 and then R1
    greenCylinder.matrix.multiply(mat4.makeRotationZ(angle[0])); // R1
    greenCylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1

    // Will execute R2, T1 and R1 in this order
    redCylinder.matrix.multiply(mat4.makeRotationY(angle[1])); // R1
    redCylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
    redCylinder.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2

    firstYellowCylinder.matrix.multiply(mat4.makeRotationY(angle[2])); // R1
    firstYellowCylinder.matrix.multiply(mat4.makeTranslation(0.0, 0.5, 0.0)); // T1
    firstYellowCylinder.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2

    secondYellowCylinder.matrix.multiply(mat4.makeRotationY(angle[3])); // R1
    secondYellowCylinder.matrix.multiply(mat4.makeTranslation(0.0, -0.5, 0.0)); // T1
    secondYellowCylinder.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2



  }
}

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };
    this.speed = 0.05;

    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
