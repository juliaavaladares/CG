import * as THREE from  '../../build/three.module.js';
import Stats from       '../../build/jsm/libs/stats.module.js';
import {GUI} from       '../../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        initDefaultLighting,
        onWindowResize, 
        degreesToRadians, 
        lightFollowingCamera} from "../../libs/util/util.js";

        
var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(7, 7, 7)); // Init camera in this position
var light  = initDefaultLighting(scene, new THREE.Vector3(7, 7, 7));
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Set angleZs of rotation
var angle = [-1.57,0, 0, 0];

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var firstSphere = createSphere();
scene.add(firstSphere);

var firstCylinder = createCylinder();
firstSphere.add(firstCylinder);

var secondSphere = createSphere();
firstCylinder.add(secondSphere);

var seondCylinder = createCylinder();
secondSphere.add(seondCylinder);

var thirdSphere = createSphere();
seondCylinder.add(thirdSphere);

var thirdCylinder = createCylinder();
thirdSphere.add(thirdCylinder);


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();

function createSphere()
{
  var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  return sphere;
}

function createCylinder()
{
  var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
  var cylinderMaterial = new THREE.MeshPhongMaterial( {color:'rgb(100,255,100)'} );
  var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  return cylinder;
}

function rotateCylinder(eixo = false)
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  firstCylinder.matrixAutoUpdate = false;
  secondSphere.matrixAutoUpdate = false;
  seondCylinder.matrixAutoUpdate = false;
  thirdSphere.matrixAutoUpdate = false;
  thirdCylinder.matrixAutoUpdate = false;

  var mat4 = new THREE.Matrix4();

  // resetting matrices
  firstCylinder.matrix.identity();
  secondSphere.matrix.identity();
  seondCylinder.matrix.identity();
  thirdSphere.matrix.identity();
  thirdCylinder.matrix.identity();

  firstCylinder.matrix.multiply(mat4.makeRotationY(angle[1]));
  firstCylinder.matrix.multiply(mat4.makeRotationZ(angle[0]));// R1

  firstCylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
  
  // Just need to translate the sphere to the right positi

  // Will execute T2 and then R2
  seondCylinder.matrix.multiply(mat4.makeRotationZ(angle[2]));
  seondCylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T2
  
  secondSphere.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));


  thirdCylinder.matrix.multiply(mat4.makeRotationZ(angle[3])); // R3
  thirdCylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T3
  
  thirdSphere.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

}

function buildInterface()
{
  var controls = new function ()
  {
    this.joint1 = 270;
    this.joint2 = 0;
    this.joint3 = 0;
    this.joint4 = 0;

    this.rotate = function(){
      angle[0] = degreesToRadians(this.joint1);
      angle[1] = degreesToRadians(this.joint2);
      angle[2] = degreesToRadians(this.joint3);
      angle[3] = degreesToRadians(this.joint4);
      rotateCylinder();
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'joint1', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("First Joint");
  gui.add(controls, 'joint2', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Second Joint");
  gui.add(controls, 'joint3', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Third Joint");
  gui.add(controls, 'joint4', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Fourth Joint");
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  lightFollowingCamera(light, camera);
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
