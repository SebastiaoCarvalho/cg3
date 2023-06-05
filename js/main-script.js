//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;
var materials;

var globalClock, deltaTime;

var skydome;

var ovni;
var spheres = [];

var directionalLight, spotLight, pointLights = [];

var leftArrowPressed, upArrowPressed, rightArrowPressed, downArrowPressed;

var directionalLightSwitch = false, alreadySwitchDirectionalLight = false;
var spotlightSwitch = false, alreadySwitchSpotlight = false;

const directionalLightIntensity = 30;
const spotLightIntensity = 30;

/* Ovni dimensions */
rBody = 2;
r2Body = 7;

rCockpit = 3;

hCyl = 1;

rSphere = 0.5;
xSphere = 5;
ySphere = - 2;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    const backgroundColor = new THREE.Color("rgb(0, 0, 0)");

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
    const isometricDistance = 80;
    tempCamera = new THREE.OrthographicCamera(
        left,
        right,
        top,
        down,
        near,
        far
    );
    //tempCamera.position.set(distance, 0, 0);
    //tempCamera.position.set(0, 0, distance);
    tempCamera.lookAt(scene.position);

    
    tempCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    tempCamera.position.set(isometricDistance, 30, isometricDistance);
    tempCamera.lookAt(scene.position);

    mainCamera = tempCamera;
    /* cameras.push(tempCamera); */
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    "use strict";
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    // Directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
    /* directionalLight.target.position.set(0, 10, 0); */
    scene.add(directionalLight);
    // Spotlight
    spotLight = new THREE.SpotLight(0xffffff, spotLightIntensity, 0, Math.PI / 6, 0);
    spotLight.position.set(0, ovni.position.y - hCyl - rBody), 0;
    scene.add(spotLight.target);
    scene.add(spotLight);
    // Point light
    for (var sphere of spheres) {
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(ovni.position.x + sphere.position.x, ovni.position.y + sphere.position.y, ovni.position.z + sphere.position.z);
        scene.add(pointLight);
        pointLights.push(pointLight);
    }
 
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createTrees(numberOfTrees) {
    for (let i = 0; i < numberOfTrees; i++) {
        const dimension = new THREE.Vector3(3, 3, getRandomNumber(15,20));
        const v = new THREE.Vector3(0, 0, i*30);
        createTree(v, dimension);
    }
}

function createTree(posVector, dimensionVector) {
    tree = new THREE.Object3D();

    const i = getRandomNumber(Math.PI/30, Math.PI/16);
    addBranch(tree, posVector, dimensionVector, new THREE.Vector3(i,0,0));

    const branchPos = new THREE.Vector3(posVector.x+2,posVector.y+2,posVector.z-1); 
    const branchDim = new THREE.Vector3(dimensionVector.x/3, dimensionVector.y/3, dimensionVector.z/2);
    addBranch(tree, branchPos, branchDim, new THREE.Vector3(0, 0, -i*3)); 
    
    const bbox = new THREE.Box3().setFromObject(tree);
    const topPos = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)
    addTopOnTree(tree, topPos, dimensionVector);

    scene.add(tree);   
}

function addBranch(obj, posVector, dimensionVector, rotationVector) {
    const geometry = new THREE.CylinderGeometry(dimensionVector.x,dimensionVector.y,dimensionVector.z,32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x884802,
        //wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = rotationVector.x;
    mesh.rotation.y = rotationVector.y;
    mesh.rotation.z = rotationVector.z;
    mesh.position.set(posVector.x,posVector.y,posVector.z);

    var bbox = new THREE.Box3().setFromObject(mesh);
    let maxPos = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z-3);

    addTopPartOnBranch(obj, maxPos, dimensionVector, rotationVector);
    obj.add(mesh);
}

function addTopPartOnBranch(obj, posVector, dimensionVector) {
    const ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x006400,
        //wireframe: true,
    });
    ellipsoidGeometry.scale(dimensionVector.x*3.5, dimensionVector.y*1.25, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);

    ellipsoidMesh.position.set(posVector.x, posVector.y+1, posVector.z);
    obj.add(ellipsoidMesh);
}

function addTopOnTree(obj, posVector, dimensionVector) {
    const ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x006400,
        //wireframe: true,
    });
    ellipsoidGeometry.scale(dimensionVector.x*1.75, dimensionVector.y*1.5, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
    
    ellipsoidMesh.position.set(posVector.x+3, posVector.y+5, posVector.z-5);
    obj.add(ellipsoidMesh);
}

function createSkydome() {
    "use strict";
    skydome = new THREE.Object3D();
    skydome.position.set(0, 0, 0);
    const geometry = new THREE.SphereGeometry( 50, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    skydome.add(mesh);
    scene.add(skydome);
}

function createGround() {
    "use strict";
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

function createMoon() {
    "use strict";
    const moon = new THREE.Object3D();
    
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd45f,
        wireframe: true,
        emissive: 0xffd45f,
        emissiveIntensity: 1.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 50, 0);
    moon.add(mesh);
    scene.add(moon);
}

function createOvni() {
    "use strict";
    ovni = new THREE.Object3D();
    createOvniBody(ovni);
    createOvniCockpit(ovni);
    createOvniBottom(ovni);
    createOvniSpheres(ovni);
    ovni.position.set(0, 30, 0)
    scene.add(ovni);
}

function createOvniBody(obj) {
    "use strict";
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    geometry.scale(r2Body, rBody, r2Body);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd45f,
        wireframe: true,
    });
    const body = new THREE.Mesh(geometry, material);
    body.position.set(0, 0, 0);
    obj.add(body);
}

function createOvniCockpit(obj) {
    "use strict";
    const geometry = new THREE.SphereGeometry(rCockpit, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
        color : 0xffd45f,
        wireframe: true
    });
    const cockpit = new THREE.Mesh(geometry, material);
    cockpit.position.set(0, rCockpit, 0);
    obj.add(cockpit);
}

function createOvniBottom(obj) {
    "use strict";
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({
        color : 0xffd45f,
        wireframe: true
    });
    const bottom = new THREE.Mesh(geometry, material);
    bottom.position.set(0, -rCockpit - hCyl/2, 0);
    obj.add(bottom);
}

function createOvniSpheres(obj) {
    createSphere(obj, xSphere, ySphere, 0);
    createSphere(obj, - xSphere, ySphere, 0);
    createSphere(obj, 0, ySphere, xSphere);
    createSphere(obj, 0, ySphere, - xSphere);
}

function createSphere(obj, x, y , z) {
    const geometry = new THREE.SphereGeometry(rSphere, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color : 0xff645f,
        wireframe: false
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    spheres.push(sphere);
    obj.add(sphere);
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
    spotLight.target.position.set(ovni.position.x, 0, ovni.position.z);
    for (var i = 0; i < pointLights.length; i++) {
        pointLights[i].position.set(ovni.position.x + spheres[i].position.x, ovni.position.y + spheres[i].position.y, ovni.position.z + spheres[i].position.z);
        console.log(spheres[i].position);
    }
    var velocityValue = 10;
    if (directionalLightSwitch && ! alreadySwitchDirectionalLight) {
        directionalLight.intensity = directionalLightIntensity - directionalLight.intensity;
        alreadySwitchDirectionalLight = true;
    }
    if (spotlightSwitch && ! alreadySwitchSpotlight) {
        spotLight.intensity = spotLightIntensity - spotLight.intensity;
        alreadySwitchSpotlight = true;
        
    }
    if (leftArrowPressed) {
        moveX(ovni, -velocityValue, deltaTime);
        moveX(spotLight, -velocityValue, deltaTime);
    }
    if (rightArrowPressed) {
        moveX(ovni, velocityValue, deltaTime);
        moveX(spotLight, velocityValue, deltaTime);
    }
    if (upArrowPressed) {
        moveZ(ovni, -velocityValue, deltaTime);
        moveZ(spotLight, -velocityValue, deltaTime);
    }
    if (downArrowPressed) {
        moveZ(ovni, velocityValue, deltaTime);
        moveZ(spotLight, velocityValue, deltaTime);
    }
}

function moveX(object, value, deltaTime) {
    const vec = new THREE.Vector3(value*deltaTime, 0, 0);
    object.position.add(vec);
}

function moveZ(object, value, deltaTime) {
    const vec = new THREE.Vector3(0, 0, value*deltaTime);
    object.position.add(vec);
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
    //createGround();
    //createSkydome();

    createTrees(3);
    createGround();
    createSkydome();
    createMoon();
    createOvni();
    createLights();

    globalClock = new THREE.Clock(true);
    deltaTime = globalClock.getDelta();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
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
    switch (e.keyCode) {
        case 68: // letter D/d
            directionalLightSwitch = true;
            break;
        case 83: // letter S/s
            spotlightSwitch = true;
            break;
        case 37: // left arrow
            leftArrowPressed = true;
            break;
        case 38: // up arrow
            upArrowPressed = true;
            break;
        case 39: // right arrow
            rightArrowPressed = true;
            break;
        case 40: // down arrow
            downArrowPressed = true;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 68: // letter D/d
            directionalLightSwitch = false;
            alreadySwitchDirectionalLight = false;
            break;
        case 83: // letter S/s
            spotlightSwitch = false;
            alreadySwitchSpotlight = false;
            break;
        case 37: // left arrow 
            leftArrowPressed = false;
            break;
        case 38: // up arrow
            upArrowPressed = false;
            break;
        case 39: // right arrow
            rightArrowPressed = false;
            break;
        case 40: // down arrow
            downArrowPressed = false;
            break;
    }
}