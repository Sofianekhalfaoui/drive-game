import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loader = new GLTFLoader();
let car, road, speed = 0, accelerate = false, brake = false, steering = 0;
let followCamOffset = new THREE.Vector3(0, 5, -10);
let useInteriorCam = false;

loader.load('car_for_games_unity.glb', gltf => {
    car = gltf.scene;
    car.scale.set(1, 1, 1);
    scene.add(car);
    camera.position.set(0, 5, -10);
}, undefined, console.error);

loader.load('american_road.glb', gltf => {
    road = gltf.scene;
    scene.add(road);
}, undefined, console.error);

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

document.getElementById('accelerate').addEventListener('touchstart', () => accelerate = true);
document.getElementById('accelerate').addEventListener('touchend', () => accelerate = false);
document.getElementById('brake').addEventListener('touchstart', () => brake = true);
document.getElementById('brake').addEventListener('touchend', () => brake = false);
document.getElementById('cameraBtn').addEventListener('click', () => useInteriorCam = !useInteriorCam);

function animate() {
    requestAnimationFrame(animate);
    if (car) {
        if (accelerate) speed += 0.05;
        if (brake) speed -= 0.1;
        speed = Math.max(0, Math.min(speed, 5));
        car.translateZ(speed * 0.1);

        document.getElementById("speedometer").textContent = "Speed: " + Math.round(speed * 20) + " km/h";

        // الكاميرا
        if (!useInteriorCam) {
            let camPos = car.position.clone().add(followCamOffset);
            camera.position.lerp(camPos, 0.05);
            camera.lookAt(car.position);
        } else {
            camera.position.copy(car.position).add(new THREE.Vector3(0, 1.5, 0));
            camera.rotation.copy(car.rotation);
        }
    }
    renderer.render(scene, camera);
}
animate();
