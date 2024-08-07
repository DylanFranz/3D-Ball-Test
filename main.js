import * as THREE from 'three';
import "./style.css";
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Scene
const scene = new THREE.Scene();

const loader = new GLTFLoader();

loader.load( './earth.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//Sphere
const geometry = new THREE.SphereGeometry(1.00, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Light
const light = new THREE.PointLight(0xffffff, 100, 100)
light.position.set(0, 10, 10)
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.setPixelRatio(2)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = true
controls.autoRotate = true

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  console.log(window.innerWidth)
  console.log(window.innerHeight)
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //Update Camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic voodo shit
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

//Mouse Color
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))
window.addEventListener('mousemove', (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150
    ]
    //animation
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, newColor)
  }
})