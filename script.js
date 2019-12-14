import * as THREE from './vendor/three.js-master/build/three.module.js';
import Stats from './vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';  

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  console.log('Initialized app');

  let scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xfefefe )

  let renderer = new THREE.WebGLRenderer( { 
    canvas: document.querySelector("#tinyisland"),
    antialias: true 
  } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  var camera = new THREE.PerspectiveCamera( 47, window.innerWidth / window.innerHeight, 1, 10000 );

  var controls = new OrbitControls( camera, renderer.domElement );

  camera.position.set( 0, 20, 100 );
  controls.update();

  scene.fog = new THREE.Fog(0xe2e2e2, 40, 200)

  const radius = getRandomArbitrary(4, 8)*4;
  const segments = getRandomArbitrary(5, 14);
  
  let islandGeo = new THREE.CylinderGeometry( 
    radius, 
    getRandomArbitrary(0, 4)*4, 
    getRandomArbitrary(2, 8)*4, 
    segments
  );
  
  let material = new THREE.MeshPhongMaterial({color: 0xfafafa});
  material.flatShading = true
  let island = new THREE.Mesh( islandGeo, material );
  let groundGeo = new THREE.CircleGeometry( radius, segments, Math.PI/2 );
  let ground =  new THREE.Mesh(groundGeo);
  ground.material.color = new THREE.Color(0x0000aa)

  island.geometry.computeBoundingBox();
  let box = island.geometry.boundingBox.clone();
  ground.position.y = box.max.y + .1

  ground.rotation.x = Math.PI/2
  ground.material.side = THREE.BackSide

  let light = new THREE.AmbientLight(0xffffff, .4);
  scene.add(light)

  let directionalLight = new THREE.DirectionalLight(0xf2f2f2, .4)
  scene.add(directionalLight)

  let directionalLight2 = new THREE.DirectionalLight(0xf0f0f0, .3)
  scene.add(directionalLight2)

  directionalLight2.position.x = -15
  directionalLight2.position.y = -15
  directionalLight2.position.z = 5

  directionalLight.target = island

  let tinyisland = new THREE.Group()
  tinyisland.add(island);
  tinyisland.add(ground);

  tinyisland.position.y -= 7

  scene.add( tinyisland );

  loadFBX("./fbx/TreeBase.FBX", (object) => {
    object.traverse((node) => {
      if(node.isMesh){
        node.material.color = new THREE.Color(0xff0000);
        node.position.x = 0;
        node.position.y = 0;
        node.position.z = 0;
      }
    })
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;

    console.log("object ready !")
    scene.add(object);
    object.scale.x = object.scale.y = object.scale.z = .1;
    console.log(object)
  })

  animate();

  function animate() {
    requestAnimationFrame( animate );
    tinyisland.rotation.y += .001
    controls.update();
    renderer.render( scene, camera );
  }

  function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function loadFBX(file, callback) {
    let loader = new FBXLoader();
    loader.load(file, 
      (object) => {
        callback(object);
      },
      (xhr) => {

      },
      (event) =>{
        console.log("The file couldn't be loaded because :\n"+event);
      }
    );
 }
});
