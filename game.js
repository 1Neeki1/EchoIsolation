import * as THREE from "three";

const interactables = [];

function addInteractable(
    mesh,
    name,
    action
) {

    interactables.push({
        mesh,
        name,
        action
    });
}

function getClosestInteractable() {

    let closest = null;
    let closestDistance = 3;

    for (const obj of interactables) {

        const distance =
            camera.position.distanceTo(
                obj.mesh.position
            );

        if (
            distance <
            closestDistance
        ) {

            closest = obj;
            closestDistance =
            distance;
        }
    }

    return closest;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
scene.fog = new THREE.Fog(0x000000, 5, 50);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

const ambient = new THREE.AmbientLight(
    0xffffff,
    0.35
);

scene.add(ambient);

const flashlight = new THREE.SpotLight(
0xffffff,
100,
100,
Math.PI / 8,
0.4
);

scene.add(flashlight);
scene.add(flashlight.target);

const floor = new THREE.Mesh(
new THREE.PlaneGeometry(100, 100),
new THREE.MeshStandardMaterial({
color: 0x222222
})
);

floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ceiling = new THREE.Mesh(

    new THREE.PlaneGeometry(
        100,
        100
    ),

    new THREE.MeshStandardMaterial({
        color: 0x1a1a1a
    })
);

ceiling.rotation.x =
Math.PI / 2;

ceiling.position.y = 6;

scene.add(ceiling);

const colliders = [];
const batteries = [];

function createWall(x, y, z, w, h, d, color = 0x555555) {


const wall = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
        color
    })
);

wall.position.set(x, y, z);

scene.add(wall);

colliders.push(wall);

return wall;


}

createWall(-8, 3, -20, 14, 6, 1);
createWall(8, 3, -20, 14, 6, 1);

createWall(-15, 3, -5, 1, 6, 30);
createWall(15, 3, -5, 1, 6, 30);

function createCrate(x, z) {

    const crate =
    new THREE.Mesh(

        new THREE.BoxGeometry(
            1,
            1,
            1
        ),

        new THREE.MeshStandardMaterial({
            color: 0x6a4b2a
        })
    );

    crate.position.set(
        x,
        0.5,
        z
    );

    scene.add(crate);

    return crate;
}

createCrate(-6, -12);
createCrate(-4, -12);
createCrate(6, -6);

const diary = new THREE.Mesh(

    new THREE.BoxGeometry(
        0.6,
        0.3,
        0.4
    ),

    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

diary.position.set(
    0,
    0.3,
    -10
);

scene.add(diary);

const diaryLight =
new THREE.PointLight(
    0xff2200,
    15,
    8
);

diaryLight.position.set(
    0,
    2.5,
    -10
);

scene.add(diaryLight);

addInteractable(

    diary,

    "Прослушать запись",

    () => {

        diarySound();

        showMessage(
    "Запись воспроизводится...",
    3
);

setTimeout(() => {

    showMessage(
        "Здесь хранятся невышедшие демки killxve...",
        4
    );

}, 3000);

setTimeout(() => {

    if (
    currentObjective ===
    "Найти источник сигнала"
) {

    currentObjective =
    "Найти архив музыки killxve";
}

    showMessage(
        "Цель обновлена",
        3
    );

}, 7000);
    }
);

function createBattery(x, z) {


const battery = new THREE.Group();

const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.55, 16),
    new THREE.MeshStandardMaterial({
        color: 0xd6c13a,
        metalness: 0.3,
        roughness: 0.35
    })
);

const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.08, 16),
    new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        metalness: 0.7,
        roughness: 0.2
    })
);

body.rotation.z = Math.PI / 2;
cap.rotation.z = Math.PI / 2;
cap.position.x = 0.32;

battery.add(body);
battery.add(cap);
battery.position.set(x, 0.22, z);

scene.add(battery);
batteries.push(battery);

addInteractable(

    battery,

    "Подобрать батарею",

    () => {

        batteryCharge =
        Math.min(
            100,
            batteryCharge + 35
        );

        pickupSound();

        scene.remove(battery);

        const index =
        batteries.indexOf(battery);

        if (index !== -1) {

            batteries.splice(
                index,
                1
            );
        }

        const interactableIndex =
interactables.findIndex(
    obj => obj.mesh === battery
);

if (
    interactableIndex !== -1
) {

    interactables.splice(
        interactableIndex,
        1
    );
}

        message.innerHTML =
        "Батарея подобрана";
    }
);

return battery;

}

createBattery(-7, -11);
createBattery(7, -17);
createBattery(11, 2);

const monster = new THREE.Mesh(
new THREE.SphereGeometry(1.2, 16, 16),
new THREE.MeshStandardMaterial({
color: 0xaa0000
})
);

monster.position.set(0, 1, -40);
scene.add(monster);

camera.position.set(0, 1.7, 8);

const menu =
document.getElementById("menu");

const message =
document.getElementById("message");

const objective =
document.getElementById(
    "objective"
);

let currentObjective =
"Найти источник сигнала";

let notificationText = "";
let notificationTimer = 0;

let hasKeycard = false;

const keycard = new THREE.Mesh(

    new THREE.BoxGeometry(
        0.5,
        0.05,
        0.3
    ),

    new THREE.MeshStandardMaterial({
        color: 0x3366ff
    })
);

keycard.position.set(
    8,
    0.2,
    -12
);

scene.add(keycard);

addInteractable(

    keycard,

    "Подобрать карту доступа",

    () => {

        hasKeycard = true;

        keycardSound();

        scene.remove(keycard);

        const interactableIndex =
interactables.findIndex(
    obj => obj.mesh === keycard
);

if (
    interactableIndex !== -1
) {

    interactables.splice(
        interactableIndex,
        1
    );
}

        showMessage(
    "Карта доступа получена"
);
    }
);

const archiveDoor =
new THREE.Mesh(

    new THREE.BoxGeometry(
    4,
    3,
    0.5
    ),

    new THREE.MeshStandardMaterial({
        color: 0x444444
    })
);

archiveDoor.position.set(
    0,
    1.5,
    -20
);

scene.add(archiveDoor);

createWall(
    0,
    3,
    -35,
    20,
    6,
    1,
    0x333333
);

createWall(
    -10,
    3,
    -28,
    1,
    6,
    15,
    0x333333
);

createWall(
    10,
    3,
    -28,
    1,
    6,
    15,
    0x333333
);

addInteractable(

    archiveDoor,

    "Открыть архив",

    () => {

        if (!hasKeycard) {

            errorSound();

            showMessage(
    "Требуется карта доступа"
);

            return;
        }

        doorOpenSound();

        scene.remove(
            archiveDoor
        );

        const interactableIndex =
        interactables.findIndex(
        obj => obj.mesh === archiveDoor
        );

        if (
        interactableIndex !== -1
        ) {

        interactables.splice(
        interactableIndex,
        1
        );
        }

        currentObjective =
        "Исследовать архив";

        showMessage(
    "Архив открыт"
);

    }
);

const batteryFill =
document.getElementById("batteryFill");

let started = false;
let yaw = 0;
let pitch = 0;

let velocityY = 0;
let onGround = true;

const PLAYER_HEIGHT = 1.7;
const CROUCH_HEIGHT = 1.0;
const PLAYER_RADIUS = 0.75;
const GRAVITY = 20;
const JUMP_FORCE = 8;
const BATTERY_DRAIN_RATE = 4;
const BATTERY_PICKUP_CHARGE = 35;
const BATTERY_PICKUP_DISTANCE = 1.4;
const FLASHLIGHT_FULL_INTENSITY = 100;
const FLASHLIGHT_LOW_THRESHOLD = 20;

let audioCtx = null;
let humOsc = null;
let lastStep = 0;
let batteryCharge = 100;
let flashlightOn = true;

const keys = {};
const GAME_KEYS = new Set([
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Space",
    "ShiftLeft",
    "ShiftRight",
    "ControlLeft",
    "ControlRight",
    "KeyF",
    "KeyC"
]);

function isCrouching() {


return (
    keys["ControlLeft"] ||
    keys["ControlRight"] ||
    keys["KeyC"]
);


}

function showMessage(
    text,
    duration = 3
) {

    notificationText =
    text;

    notificationTimer =
    duration;
}

function lockPointer() {


if (
    document.pointerLockElement !== document.body &&
    document.body.requestPointerLock
) {

    document.body.requestPointerLock();
}


}

function shouldBlockGameShortcut(e) {


return (
    started &&
    (
        GAME_KEYS.has(e.code) ||
        e.metaKey
    )
);


}

function isCommandKey(e) {


return (
    e.code === "MetaLeft" ||
    e.code === "MetaRight" ||
    e.key === "Meta"
);


}

function blockCommandKey(e) {


if (
    !started ||
    !isCommandKey(e)
) {
    return;
}

e.preventDefault();
e.stopPropagation();
resetKeys();


}

function resetKeys() {


for (const code in keys) {
    keys[code] = false;
}


}

document
.getElementById("startBtn")
.addEventListener("click", () => {


menu.style.display = "none";

started = true;

try {

    audioCtx =
    new AudioContext();

    humOsc =
    audioCtx.createOscillator();

    const humGain =
    audioCtx.createGain();

    humOsc.connect(humGain);

    humGain.connect(
        audioCtx.destination
    );

    humOsc.frequency.value = 35;
    humGain.gain.value = 0.08;

    humOsc.start();

} catch (e) {

    console.log(e);
}

lockPointer();

message.innerHTML =
"Жилой сектор пуст...";


});

document.addEventListener(
"click",
() => {


    if (started) {
        lockPointer();
    }
}


);

document.addEventListener(
"pointerlockchange",
() => {


    if (!started) return;

    if (
        document.pointerLockElement === document.body
    ) {

        message.innerHTML =
        "Жилой сектор пуст...";

    } else {

        message.innerHTML =
        "Кликни по экрану, чтобы вернуться...";
    }
}


);

document.addEventListener(
"mousemove",
(e) => {


    if (
        document.pointerLockElement === document.body
    ) {

        yaw -=
        e.movementX * 0.0025;

        pitch -=
        e.movementY * 0.0025;

        pitch = Math.max(
            -1.2,
            Math.min(
                1.2,
                pitch
            )
        );
    }
}


);

window.addEventListener(
"keydown",
blockCommandKey,
true
);

window.addEventListener(
"keyup",
blockCommandKey,
true
);

window.addEventListener(
    "keydown",
    (e) => {

        if (shouldBlockGameShortcut(e)) {
            e.preventDefault();
        }

        if (
            !started ||
            isCommandKey(e)
        ) return;

        keys[e.code] = true;

        if (
            e.code === "KeyF" &&
            !e.repeat
        ) {

            toggleFlashlight();
        }

        if (
    e.code === "KeyE" &&
    !e.repeat
) {

    const interactable =
    getClosestInteractable();

    if (
        interactable
    ) {

        interactable.action();
    }
}

        if (
            e.code === "Space" &&
            onGround
        ) {

            jumpSound();

            velocityY =
            JUMP_FORCE;

            onGround = false;
        }
    }
);

window.addEventListener(
"keyup",
(e) => {


    if (shouldBlockGameShortcut(e)) {
        e.preventDefault();
    }

    if (isCommandKey(e)) return;

    keys[e.code] = false;
}


);

window.addEventListener(
"blur",
() => {


    resetKeys();
}


);

function keycardSound() {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );

    osc.type = "triangle";

    osc.frequency.setValueAtTime(
        500,
        audioCtx.currentTime
    );

    osc.frequency.linearRampToValueAtTime(
        900,
        audioCtx.currentTime + 0.12
    );

    gain.gain.value = 0.04;

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.15
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.15
    );
}

function diarySound() {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);
    gain.connect(
        audioCtx.destination
    );

    osc.frequency.value = 700;

    gain.gain.value = 0.03;

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.12
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.12
    );
}

function stepSound(type = "walk") {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );

    if (type === "run") {

        osc.frequency.value = 120;
        gain.gain.value = 0.10;

    } else if (
        type === "crouch"
    ) {

        osc.frequency.value = 45;
        gain.gain.value = 0.03;

    } else {

        osc.frequency.value = 80;
        gain.gain.value = 0.08;
    }

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.08
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.08
    );
}

function doorOpenSound() {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);
    gain.connect(
        audioCtx.destination
    );

    osc.frequency.setValueAtTime(
        300,
        audioCtx.currentTime
    );

    osc.frequency.linearRampToValueAtTime(
        120,
        audioCtx.currentTime + 0.25
    );

    gain.gain.value = 0.04;

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.25
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.25
    );
}

function jumpSound() {


if (!audioCtx) return;

const osc =
audioCtx.createOscillator();

const gain =
audioCtx.createGain();

osc.connect(gain);

gain.connect(
    audioCtx.destination
);

osc.frequency.setValueAtTime(
    180,
    audioCtx.currentTime
);

osc.frequency.exponentialRampToValueAtTime(
    420,
    audioCtx.currentTime + 0.12
);

gain.gain.value = 0.07;

gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.16
);

osc.start();

osc.stop(
    audioCtx.currentTime + 0.16
);


}

function landSound() {


if (!audioCtx) return;

const osc =
audioCtx.createOscillator();

const gain =
audioCtx.createGain();

osc.connect(gain);

gain.connect(
    audioCtx.destination
);

osc.frequency.setValueAtTime(
    95,
    audioCtx.currentTime
);

osc.frequency.exponentialRampToValueAtTime(
    45,
    audioCtx.currentTime + 0.14
);

gain.gain.value = 0.12;

gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.14
);

osc.start();

osc.stop(
    audioCtx.currentTime + 0.14
);


}

function errorSound() {

    if (!audioCtx) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);
    gain.connect(
        audioCtx.destination
    );

    osc.type = "square";

    osc.frequency.value = 180;

    gain.gain.value = 0.05;

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.2
    );

    osc.start();

    osc.stop(
        audioCtx.currentTime + 0.2
    );
}

function pickupSound() {


if (!audioCtx) return;

const osc =
audioCtx.createOscillator();

const gain =
audioCtx.createGain();

osc.connect(gain);

gain.connect(
    audioCtx.destination
);

osc.frequency.setValueAtTime(
    520,
    audioCtx.currentTime
);

osc.frequency.exponentialRampToValueAtTime(
    820,
    audioCtx.currentTime + 0.12
);

gain.gain.value = 0.06;

gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.12
);

osc.start();

osc.stop(
    audioCtx.currentTime + 0.12
);


}

function toggleFlashlight() {


if (batteryCharge <= 0) {

    flashlightOn = false;

    message.innerHTML =
    "Батарея разряжена...";

    return;
}

flashlightOn = !flashlightOn;

message.innerHTML =
flashlightOn ?
"Фонарик включен" :
"Фонарик выключен";


}

function updateBatteryHud() {


if (!batteryFill) return;

batteryFill.style.width =
`${batteryCharge}%`;

if (batteryCharge <= FLASHLIGHT_LOW_THRESHOLD) {

    batteryFill.style.background =
    "#ffcc33";

} else {

    batteryFill.style.background =
    "#33ff66";
}


}

function updateFlashlight(delta) {


if (
    flashlightOn &&
    batteryCharge > 0
) {

    batteryCharge = Math.max(
        0,
        batteryCharge -
        BATTERY_DRAIN_RATE *
        delta
    );

    if (batteryCharge <= 0) {
        flashlightOn = false;
    }
}

if (
    flashlightOn &&
    batteryCharge > 0
) {

    let intensity =
    FLASHLIGHT_FULL_INTENSITY;

    if (
        batteryCharge <
        FLASHLIGHT_LOW_THRESHOLD
    ) {

        const flicker =
        0.45 +
        Math.random() *
        0.55;

        intensity *= flicker;
    }

    flashlight.intensity =
    intensity;

} else {

    flashlight.intensity = 0;
}

updateBatteryHud();


}

function updateBatteryPickups() {


for (
    let i = batteries.length - 1;
    i >= 0;
    i--
) {

    const battery =
    batteries[i];

    const dx =
    camera.position.x -
    battery.position.x;

    const dz =
    camera.position.z -
    battery.position.z;

    const distance =
    Math.hypot(dx, dz);

    battery.rotation.y += 0.03;

    if (
    distance <
    BATTERY_PICKUP_DISTANCE
) {

}
}


}

function resolvePlayerCollisions() {


for (const wall of colliders) {

    const dx =
    camera.position.x -
    wall.position.x;

    const dz =
    camera.position.z -
    wall.position.z;

    const limitX =
    wall.geometry.parameters.width / 2 +
    PLAYER_RADIUS;

    const limitZ =
    wall.geometry.parameters.depth / 2 +
    PLAYER_RADIUS;

    if (
        Math.abs(dx) < limitX &&
        Math.abs(dz) < limitZ
    ) {

        const overlapX =
        limitX - Math.abs(dx);

        const overlapZ =
        limitZ - Math.abs(dz);

        if (
            overlapX <
            overlapZ
        ) {

            camera.position.x +=
            (dx >= 0 ? 1 : -1) *
            overlapX;

        } else {

            camera.position.z +=
            (dz >= 0 ? 1 : -1) *
            overlapZ;
        }
    }
}


}

function updatePlayer(delta) {


let speed = 4 * delta;
const crouching = isCrouching();
const playerHeight =
    crouching ? CROUCH_HEIGHT : PLAYER_HEIGHT;

if (
    keys["ShiftLeft"] &&
    !crouching
) {
    speed *= 2;
}

if (crouching) {
    speed *= 0.55;
}

const forward = new THREE.Vector3();
camera.getWorldDirection(forward);

forward.y = 0;
forward.normalize();

const right = new THREE.Vector3();
right.crossVectors(
    new THREE.Vector3(0, 1, 0),
    forward
).normalize();

if (
    keys["KeyW"] ||
    keys["ArrowUp"]
) {
    camera.position.addScaledVector(
        forward,
        speed
    );
}

if (
    keys["KeyS"] ||
    keys["ArrowDown"]
) {
    camera.position.addScaledVector(
        forward,
        -speed
    );
}

resolvePlayerCollisions();

if (
    keys["KeyA"] ||
    keys["ArrowLeft"]
) {
    camera.position.addScaledVector(
        right,
        speed
    );
}

if (
    keys["KeyD"] ||
    keys["ArrowRight"]
) {
    camera.position.addScaledVector(
        right,
        -speed
    );
}

resolvePlayerCollisions();

camera.rotation.order = "YXZ";

camera.rotation.set(
    pitch,
    yaw,
    0
);

const moving =
    keys["KeyW"] ||
    keys["KeyA"] ||
    keys["KeyS"] ||
    keys["KeyD"] ||
    keys["ArrowUp"] ||
    keys["ArrowLeft"] ||
    keys["ArrowDown"] ||
    keys["ArrowRight"];

if (
    moving &&
    onGround
) {

    const running =
    keys["ShiftLeft"];

    const crouching =
    keys["ControlLeft"] ||
    keys["ControlRight"] ||
    keys["KeyC"];

    const stepDelay =
    crouching
        ? 500
        : running
        ? 220
        : 350;

    if (
        performance.now() -
        lastStep >
        stepDelay
    ) {

        if (
            crouching
        ) {

            stepSound(
                "crouch"
            );

        } else if (
            running
        ) {

            stepSound(
                "run"
            );

        } else {

            stepSound(
                "walk"
            );
        }

        lastStep =
        performance.now();
    }
}

if (onGround) {

    camera.position.y +=
    (playerHeight - camera.position.y)
    * 8
    * delta;
}

velocityY -= GRAVITY * delta;

camera.position.y +=
    velocityY * delta;

if (
    camera.position.y <
    playerHeight
) {
    const wasFalling =
    !onGround &&
    velocityY < 0;

    camera.position.y =
    playerHeight;

    velocityY = 0;
    onGround = true;

    if (wasFalling) {
        landSound();
    }
}



}

const clock =
new THREE.Clock();

function animate() {


requestAnimationFrame(
    animate
);

const delta =
Math.min(
    clock.getDelta(),
    0.05
);

if (started) {

    objective.innerHTML =
currentObjective;

    document.getElementById(
    "objective"
).innerHTML =
currentObjective;

    updatePlayer(delta);
    updateBatteryPickups();
    updateFlashlight(delta);

    flashlight.position.copy(
        camera.position
    );

    const dir = new THREE.Vector3();
camera.getWorldDirection(dir);

flashlight.target.position.copy(
    camera.position.clone().add(dir)
);

    const distance =
    camera.position.distanceTo(
        monster.position
    );

    if (
        distance < 15
    ) {

        message.innerHTML =
        "Кажется, кто-то рядом...";
    }

    if (
        distance < 5
    ) {

        message.innerHTML =
        "СЛЕПЕЦ СМОТРИТ НА ТЕБЯ";
    }
    
    if (
    notificationTimer > 0
) {

    notificationTimer -= delta;

    message.innerHTML =
    notificationText;

} else {

    const interactable =
    getClosestInteractable();

    if (interactable) {

        message.innerHTML =
        "[E] " +
        interactable.name;

    } else {

        message.innerHTML = "";
    }
}

}

renderer.render(
    scene,
    camera
);


}

updateBatteryHud();

animate();

window.addEventListener(
"resize",
() => {


    camera.aspect =
    window.innerWidth /
    window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


);
