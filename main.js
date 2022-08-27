import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import * as dat from 'dat.gui' //dat.gui for gui controls
// import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({alpha: true})
// const gui = new dat.GUI()
// const world = {
//   plane: {
//     width: 400,
//     height: 400,
//     widthSegments: 50,
//     heightSegments: 50
//   }
// }

// gui.add(world.plane, 'width', 1, 50).
//   onChange(generatePlane)
// gui.add(world.plane, 'height', 1, 50).
//   onChange(generatePlane)
// gui.add(world.plane, 'widthSegments', 1, 50).
//   onChange(generatePlane)
// gui.add(world.plane, 'heightSegments', 1, 50).
//   onChange(generatePlane)

function generatePlane(){
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry
  ( world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments)

  change()

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0, 0.19, 0.4)
}


planeMesh.geometry.setAttribute('color',
  new THREE.BufferAttribute(new Float32Array(colors), 3))
}

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(19, 19, 17, 17)
const planeMaterial = new THREE.MeshPhongMaterial
({color: 0xF6FF33,
   side: THREE.DoubleSide,
   flatShading: THREE.FlatShading,
   vertexColors: true
  })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const randomValues = []
function change(){
const vertices = planeMesh.geometry.attributes.position.array
for(let i = 0; i < vertices.length; i++){

  if (i % 3 === 0) {
  const x = vertices[i]
  const y = vertices[i + 1]
  const z = vertices[i + 2]

  vertices[i] += (Math.random() - 0.5)
  vertices[i + 1] += (Math.random() - 0.5)
  vertices[i + 2] += Math.random()
  }

  randomValues.push(Math.random() * Math.PI * 2)
}
}

planeMesh.geometry.attributes.position.randomValues = randomValues
planeMesh.geometry.attributes.position.original = planeMesh.geometry.attributes.position.array

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
  colors.push(0.64, 0.55, 0.20)
}


planeMesh.geometry.setAttribute('color',
  new THREE.BufferAttribute(new Float32Array(colors), 3))

change()

planeMesh.rotation.x = -10
planeMesh.rotation.y = -9
camera.position.set(0, 0, 3)

const mouse = {
  x: undefined,
  y: undefined
}

//frame
let fps = 0
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // planeMesh.rotation.x += 0.01
  // planeMesh.rotation.y += 0.01
  raycaster.setFromCamera(mouse, camera)
  fps += 0.01
  const {array, original, randomValues} = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3){
    //x coor
    array[i] = original[i] + Math.cos(fps + randomValues[i]) * 0.0005

    //y coor
    array[i + 1] = original[i + 1] + Math.sin(fps + randomValues[i]) * 0.0005
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersectObj = raycaster.intersectObject(planeMesh)
  if(intersectObj.length > 0){
    const {color} = intersectObj[0].object.geometry.attributes

    color.needsUpdate = true

    const initialColor = {
      r: 0.64,
      g: 0.55,
      b: 0.20
    }

    const newColor = {
      r: 0.7,
      g: 0.70,
      b: 0.1
    }

    gsap.to(newColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersectObj[0].face.a, newColor.r)
        color.setY(intersectObj[0].face.a, newColor.g)
        color.setZ(intersectObj[0].face.a, newColor.b)

        color.setX(intersectObj[0].face.b, newColor.r)
        color.setY(intersectObj[0].face.b, newColor.g)
        color.setZ(intersectObj[0].face.b, newColor.b)

        color.setX(intersectObj[0].face.c, newColor.r)
        color.setY(intersectObj[0].face.c, newColor.g)
        color.setZ(intersectObj[0].face.c, newColor.b)
      }
    })
  }
}

animate()

addEventListener('mousemove', event => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})