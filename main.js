import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Sphere
const moonTexture = new THREE.TextureLoader().load("./assets/bg2.jpg");

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
  // map: moonTexture
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
light.intensity = 1.5;

// const ambientLight = new THREE.AmbientLight(0xffffff);, ambientLight
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 15;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".can");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.enablePan = false;
// control.enableZoom = false
control.autoRotate = true;
control.autoRotateSpeed = 1;

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

window.addEventListener("resize", () => {
  // Update size
  (sizes.height = window.innerHeight), (sizes.width = window.innerWidth);

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateWorldMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  control.update();
  mesh.rotation.x += 0.2;
  light.rotation.y += 0.2;
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// TimeLine
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    // Set colors
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// Avatar
const deeTexture = new THREE.TextureLoader().load("./assets/me.jpg");

const deeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: deeTexture })
);

deeMesh.position.z = -5;
deeMesh.position.x = -10;

scene.add(deeMesh);

function moveCamera() {
  // const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  dee.rotation.y += 0.01;
  dee.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();
