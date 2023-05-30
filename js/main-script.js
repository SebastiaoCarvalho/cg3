//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;
var materials;

var globalClock, deltaTime;

var skydome;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    const backgroundColor = new THREE.Color("rgb(200, 255, 255)");

    scene = new THREE.Scene();
    scene.background = backgroundColor;

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(){
    const aspect = window.innerWidth / window.innerHeight;
    const left = -140;
    const right = 140;
    const top = 75;
    const down = -75;
    const fov = 70;
    const near = 1;
    const far = 1000;
    const distance = 40;
    const isometricDistance = 50;
    tempCamera = new THREE.OrthographicCamera(
        -isometricDistance * aspect,
        isometricDistance * aspect,
        isometricDistance,
        -isometricDistance,
        near,
        far
    );
    tempCamera.position.set(isometricDistance, isometricDistance, isometricDistance);
    tempCamera.lookAt(scene.position);
    mainCamera = tempCamera;
    /* cameras.push(tempCamera); */
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createSkydome() {
    "use strict";
    skydome = new THREE.Object3D();
    skydome.position.set(0, 0, 0);
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    skydome.add(mesh);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, mainCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    globalClock = new THREE.Clock(true);
    deltaTime = globalClock.getDelta();

    const map = new THREE.TextureLoader().load('pene.png');

    const groundMat = new THREE.MeshStandardMaterial({
        color : 0x000000,
        wireframe : true,
        displacementMap : map,
        displacementScale : 50,
    });

    const groundGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = - Math.PI / 2;
    scene.add(ground);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    deltaTime = globalClock.getDelta();

    update();
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}