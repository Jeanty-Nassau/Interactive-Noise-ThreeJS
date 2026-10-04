import './style.css'
import * as THREE from 'three'
import SimplexNoise from 'simplex-noise'

const canvas = document.querySelector('canvas.webgl')
const container = document.querySelector('#canvasContainer')
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scene = new THREE.Scene()
const simplex = new SimplexNoise()

const geometry = new THREE.PlaneBufferGeometry(22, 14, 128, 84)
const material = new THREE.MeshLambertMaterial({
  color: 0xb9c7ff,
  side: THREE.DoubleSide,
  wireframe: false,
})

const plane = new THREE.Mesh(geometry, material)
plane.rotation.x = -Math.PI / 2.25
plane.position.set(1.8, -2.2, -1.5)
scene.add(plane)

const lights = [
  new THREE.PointLight(0x1847ff, 2.5, 45),
  new THREE.PointLight(0xff991c, 2.1, 45),
  new THREE.PointLight(0x91a7ff, 1.8, 40),
]

lights[0].position.set(7, 2, 7)
lights[1].position.set(-7, 0, 5)
lights[2].position.set(0, 5, -6)
lights.forEach((light) => scene.add(light))

scene.add(new THREE.AmbientLight(0x27325f, 0.7))

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80)
camera.position.set(0, 1.4, 9.5)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.setClearColor(0x05070b, 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const pointer = { x: 0, y: 0 }
let amplitude = 1.0

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1
}, { passive: true })

window.addEventListener('wheel', (event) => {
  amplitude = THREE.MathUtils.clamp(amplitude - event.deltaY * 0.0008, 0.45, 1.7)
}, { passive: true })

document.querySelector('[data-reset-view]')?.addEventListener('click', () => {
  amplitude = 1
  pointer.x = 0
  pointer.y = 0
})

function resize() {
  const width = Math.max(container.clientWidth, 1)
  const height = Math.max(container.clientHeight, 1)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', resize)
resize()

const clock = new THREE.Clock()

function tick() {
  const elapsed = clock.getElapsedTime()
  const positions = plane.geometry.attributes.position.array
  const time = prefersReducedMotion ? 0.65 : elapsed * 0.22

  for (let index = 0; index < positions.length; index += 3) {
    positions[index + 2] =
      simplex.noise4D(
        positions[index] / 2.8,
        positions[index + 1] / 2.8,
        time,
        1
      ) * amplitude
  }

  plane.geometry.attributes.position.needsUpdate = true
  plane.rotation.z += ((pointer.x * 0.08) - plane.rotation.z) * 0.035
  plane.position.y += ((-2.2 - pointer.y * 0.5) - plane.position.y) * 0.035

  const orbit = elapsed * 0.25
  lights[0].position.x = Math.sin(orbit) * 7
  lights[0].position.z = Math.cos(orbit) * 7
  lights[1].position.x = Math.cos(orbit * 1.15) * 7
  lights[1].position.z = Math.sin(orbit * 1.15) * 6

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()
