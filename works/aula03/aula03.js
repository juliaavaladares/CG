import * as THREE from  '../../build/three.module.js';
import {TrackballControls} from '../../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        onWindowResize, 
        degreesToRadians} from "../../libs/util/util.js";



var scene = new THREE.Scene();    // Create main scene
scene.background = new THREE.Color('rgb(20,20,20)');
var renderer = initRenderer();    // View function in util/utils

showInformation();

var axesHelper = new THREE.AxesHelper( 120 );
scene.add( axesHelper );

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0.2);
  camera.position.set(200,200,-500)
  camera.up.set( 0,1, 0, );

var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var firstPlane = createPlane('rgb(153,51,153)', [100, 250,100,100], [0.0, 75.0, 0.0])
scene.add(firstPlane);

var secondPlane = createPlane('rgb(255,0,0)', [100, 100,100,100], [0.0, 50.0, 200.0])
scene.add(secondPlane);

var thirdPlane = createPlane('rgb(0,0,255)', [250, 100,100,100], [-75.0, 50.0, 50.0])
scene.add(thirdPlane);

var fourthPlane = createPlane('rgb(0,255,0)', [250, 100,100,100], [-75.0, 50.0, -50.0])
scene.add(fourthPlane);

var fifthPlane = createPlane('rgb(255,255,255)', [100, 250,100,100], [0.0, 75.0, -100.0])
scene.add(fifthPlane);

//-------------------------------------------------------------------------------
// Setting virtual camera
//-------------------------------------------------------------------------------
var lookAtVec = new THREE.Vector3( 0.0, 0.0, 0.0 );
var upVec = new THREE.Vector3( 0.0, 1.0, 0.0 );
var vcWidth = 400; // virtual camera width
var vcHeidth = 300; // virtual camera height
var virtualCamera = new THREE.PerspectiveCamera(45, vcWidth/vcHeidth, 1.0, 20.0);
  virtualCamera.lookAt(lookAtVec);
  virtualCamera.position.set(3.7, 2.2, 1.0);
  virtualCamera.up = upVec;

// Create helper for the virtual camera
const cameraHelper = new THREE.CameraHelper(virtualCamera);
scene.add(cameraHelper);


updateCamera();
render();

function updateCamera(){
  //-- Update virtual camera position --
  virtualCamera.lookAt(lookAtVec);        // Update camera position
  virtualCamera.updateProjectionMatrix(); // Necessary when updating FOV angle         
  cameraHelper.update();    

}

function createPlane(colorPlane, planeGeometry, translate)
{
  let [width, height, widthSegments, heightSegments] = planeGeometry;
  const geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments);

  let [x, y, z] = translate 
  geometry.translate(x, y, z);

  geometry.rotateX(1.5708); 

  const material = new THREE.MeshBasicMaterial( {color: colorPlane,  wireframe:true});
  const plane = new THREE.Mesh( geometry, material);
  
  return plane;
}

function keyboardUpdate() 
{
  keyboard.update();

  var angle = degreesToRadians(0.5);
  var rotAxis1 = new THREE.Vector3(1,0,0); // Set X axis
  var rotAxis2 = new THREE.Vector3(0,1,0); // Set Y axis
  var rotAxis3 = new THREE.Vector3(0,0,1); // Set Z axis

  
  if ( keyboard.pressed("space")) virtualCamera.translateZ(-0.5);  
  if ( keyboard.pressed("down")) virtualCamera.rotateOnAxis(rotAxis1, angle);
  if ( keyboard.pressed("up")) virtualCamera.rotateOnAxis(rotAxis1, -angle);
  if ( keyboard.pressed("left")) virtualCamera.rotateOnAxis(rotAxis2, angle);
  if ( keyboard.pressed("right")) virtualCamera.rotateOnAxis(rotAxis2,-angle);
  if ( keyboard.pressed(",")) virtualCamera.rotateOnAxis(rotAxis3, angle);
  if ( keyboard.pressed(".")) virtualCamera.rotateOnAxis(rotAxis3, -angle);

}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
  controls.add("Commands:");
  controls.addParagraph();
  controls.add("←  → : Y rotation");
  controls.add("↓  ↑ : X rotation");
  controls.add("<  > : Z rotation");
  controls.add("space : Z translation");
  controls.show();
}

function controlledRender()
{
  var width = window.innerWidth;
  var height = window.innerHeight; 

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport    
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearColor("rgb(100, 70, 170)");    
  renderer.clear();   // Clean the window
  renderer.render(scene, virtualCamera);   
}

function render()
{
  trackballControls.update()
  controlledRender();
  keyboardUpdate();
  requestAnimationFrame(render);
}