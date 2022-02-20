import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import SimplexNoise from 'simplex-noise';

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


const simplex = new SimplexNoise();
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(sizes.width, sizes.height, sizes.width/2, sizes.height/2);

// Materials

const material = new THREE.MeshLambertMaterial({
    color: 'gray',
    side: THREE.DoubleSide
})

// Mesh
const plane = new THREE.Mesh(geometry,material);
const xyCoef = 30;
const zCoef = 8;
scene.add(plane)
plane.rotation.x = -Math.PI / 2 - 0.2;
plane.position.y = -25;


gui.add(plane.rotation,'x').min(0).max(600);
gui.add(plane.rotation,'y').min(0).max(600);
gui.add(plane.rotation,'z').min(0).max(600);
gui.add(plane.scale,('x')).min(0).max(5);
gui.add(plane.scale,('y')).min(0).max(5);
gui.add(plane.scale,('z')).min(0).max(5);

// Lights

const pointLight1 = new THREE.PointLight(0x34A6E0, 1.5, 1000)
pointLight1.position.x = sizes.width/4 * 0.05
pointLight1.position.y = 0
pointLight1.position.z = 30
scene.add(pointLight1)

const light2 = new THREE.PointLight(0xE03F4D, 1.5, 1000);
light2.position.set(sizes.width/4 * -0.15, 0, -20);
scene.add(light2);


const light3 = new THREE.PointLight(0x29E0BB, 1.5, 1000);
light3.position.set(sizes.width/4 * 0.15, 0, -20);
scene.add(light3);

const light4 = new THREE.PointLight(0xE08512, 1.5, 1000);
light4.position.set(sizes.width/4 * -0.05, 0, 30);
scene.add(light4);


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth *.7;
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 75
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
  
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    let gArray = plane.geometry.attributes.position.array;
    const time = elapsedTime * 0.2;
    for (let i = 0; i < gArray.length; i += 3) {
      gArray[i + 2] = simplex.noise4D(gArray[i] / xyCoef, gArray[i + 1] / xyCoef, time, 1) * zCoef;
    }
    plane.geometry.attributes.position.needsUpdate = true;
    // Update Orbital Controls
    // controls.update()

    const d = 50;
    pointLight1.position.x = Math.sin(time * 0.1) * d;
    pointLight1.position.z = Math.cos(time * 0.2) * d;
    light2.position.x = Math.cos(time * 0.3) * d;
    light2.position.z = Math.sin(time * 0.4) * d;
    light3.position.x = Math.sin(time * 0.5) * d;
    light3.position.z = Math.sin(time * 0.6) * d;
    light4.position.x = Math.sin(time * 0.7) * d;
    light4.position.z = Math.cos(time * 0.8) * d;




    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()