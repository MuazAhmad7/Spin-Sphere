import * as THREE from 'three';
import './index.css'
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//scene
const scene = new THREE.Scene();

//create sphere

//( 1, 1, 1 ) ok so first 1 is radius, Second and Third 1s are segments.
const geometry = new THREE.SphereGeometry( 3, 64, 64 ); 
const material = new THREE.MeshStandardMaterial(
   {
    color: "#FFC300",
    roughness: 0.7,
   } ); //material is how it looks like, geometry is just the shape but material is apparence
const sphere = new THREE.Mesh( geometry, material ); //combination of geometry and meterial
sphere.castShadow = true; // Enable the sphere to cast shadows
sphere.receiveShadow = true; // Enable the sphere to receive shadows
scene.add( sphere )

//sizes
const sizes = 
{
  width: window.innerWidth,
  height: window.innerHeight,
}
//lights/lighting
const light = new THREE.PointLight(0xffffff, 100, 100) // (color, light intensity, distance, decay)
light.position.set(0,10,10)
light.castShadow = true;

scene.add(light)

//Camera

const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height); //(field of view, aspect ratio)
camera.position.z = 10 //position camera back 20 units back (the measurment could be anything u desire)
scene.add(camera)


//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(3);    //makes it smoother
renderer.shadowMap.enabled = true;
renderer.render(scene, camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5
//Resize

window.addEventListener('resize', () => 
{
  //update sizes
  sizes.width = window.innerWidth;    //update as in lets say i drag the window to make it bigger, it needs to update
  sizes.height = window.innerHeight; 
  //update camera
  camera.updateProjectionMatrix()
  camera.aspect = sizes.width / sizes.height
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => // this loop basicalyy just keeps updating everything to make sure everythings is in sync
{
  controls.update()
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic???
const t1 = gsap.timeline({defaults: {duration: 1}})
t1.fromTo(sphere.scale, {x:0, y:0, z:0}, {x:1, y:1, z:1}) //i named my sphere, sphere and not mesh so when vid says mesh. put sphere
t1.fromTo('nav', { y:'-100%' }, { y: '0%' }) //this brings the navigator tabs at the top from nothing into the screen
t1.fromTo('.title', {opacity: 0}, {opacity: 1})

//Mouse Animation Colorsssssss
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true)) //when mouse is clicked mouseDown turns true
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => 
{
  if(mouseDown)
  {
   let rgb = 
    [
      Math.round(e.pageX / sizes.width * 255),
      Math.round(e.pageY / sizes.height * 255),
      150,
    ] //e.pageX/Y is where the mouse is on the page, return value from where the mouse is on the screen

    //lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`) //make sure you put ` and not '
    gsap.to(sphere.material.color, 
    {
      r: newColor.r, 
      g: newColor.g, 
      b: newColor.b,
    })

  }
}
);
