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

var groundMaterial, rendererGround, rendererSky, colorCodes;

var skydomeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
});

const map = new THREE.TextureLoader().load('pene.png');

var groundMaterial = new THREE.MeshStandardMaterial({
    color : 0xffffff,
    displacementMap : map,
    displacementScale : 50,
}); 

/* Ovni dimensions */
rBody = 2;
r2Body = 7;

var ovni, moon;
var spheres = [];

var directionalLight, spotLight, pointLights = [];

var leftArrowPressed = false, upArrowPressed = false, rightArrowPressed = false, downArrowPressed = false;

var directionalLightSwitch = false, alreadySwitchDirectionalLight = false;
var pointLightSwitch = false, alreadySwitchPointLight = false;
var spotlightSwitch = false, alreadySwitchSpotlight = false;

const directionalLightIntensity = 0.3;
const spotLightIntensity = 5;
const pointLightIntensity = 0.5;

/* Ovni dimensions */
rBody = 2;
r2Body = 7;

rCockpit = 3;

hCyl = 1;

rSphere = 0.5;
xSphere = 5;
ySphere = - 2;
/* House */
var houseL = 20, houseD = 10, houseH = 15;
var roofH = 5;
var doorL = 2, doorH = 4;
var windowL = 2, windowH = 2; 

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
    const fov = 90;
    const near = 1;
    const far = 1000;
    tempCamera = new THREE.OrthographicCamera(
        left,
        right,
        top,
        down,
        near,
        far
    );
    tempCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    tempCamera.position.set(-35, 30, 0);
    tempCamera.lookAt(0,20,0);


    mainCamera = tempCamera;
    /* cameras.push(tempCamera); */
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    "use strict";
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    // Directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
    directionalLight.position.set(moon.position.x, moon.position.y - 10, moon.position.z);
    console.log(directionalLight.position);
    console.log(moon.position);
    scene.add(directionalLight.target);
    directionalLight.target.position.set(1, 20, 2);
    scene.add(directionalLight);
    // Spotlight
    spotLight = new THREE.SpotLight(0xffffff, spotLightIntensity, 0, Math.PI / 6, 0);
    spotLight.position.set(0, ovni.position.y - hCyl - rBody, 0);
    scene.add(spotLight.target);
    scene.add(spotLight);
    // Point light
    for (var sphere of spheres) {
        const pointLight = new THREE.PointLight(0xffffff, pointLightIntensity, 100);
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
    var posVectors = [];
    for (let i = 0; i < numberOfTrees; i++) {
        const dimension = new THREE.Vector3(1, 1, getRandomNumber(7,12));
        const v = new THREE.Vector3(getRandomNumber(-40,20), 20, getRandomNumber(-40,40));
        if (posVectors.includes(v)) continue;
        posVectors.push(v);
        createTree(v, dimension);
    }
}

function createTree(posVector, dimensionVector) {
    tree = new THREE.Object3D();

    const i = getRandomNumber(Math.PI/20, Math.PI/16);
    addBranch(tree, posVector, dimensionVector, new THREE.Vector3(i,0,0));

    const branchPos = new THREE.Vector3(posVector.x+1,posVector.y+2,posVector.z-1); 
    const branchDim = new THREE.Vector3(dimensionVector.x/3, dimensionVector.y/3, dimensionVector.z/2);
    addBranch(tree, branchPos, branchDim, new THREE.Vector3(0, 0, -i*2)); 
    
    const bbox = new THREE.Box3().setFromObject(tree);
    const topPos = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)
    addTopOnTree(tree, topPos, dimensionVector);

    scene.add(tree);   
}

function addBranch(obj, posVector, dimensionVector, rotationVector) {
    const geometry = new THREE.CylinderGeometry(dimensionVector.x,dimensionVector.y,dimensionVector.z,32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x884802,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = rotationVector.x;
    mesh.rotation.y = rotationVector.y;
    mesh.rotation.z = rotationVector.z;
    mesh.position.set(posVector.x,posVector.y,posVector.z);

    var bbox = new THREE.Box3().setFromObject(mesh);
    let maxPos = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z);

    addTopPartOnBranch(obj, maxPos, dimensionVector, rotationVector);
    obj.add(mesh);
}

function addTopPartOnBranch(obj, posVector, dimensionVector) {
    const ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x006400,
    });
    ellipsoidGeometry.scale(dimensionVector.x*3.5, dimensionVector.y*1.25, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);

    ellipsoidMesh.position.set(posVector.x, posVector.y, posVector.z);
    obj.add(ellipsoidMesh);
}

function addTopOnTree(obj, posVector, dimensionVector) {
    const ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x006400,
    });
    ellipsoidGeometry.scale(dimensionVector.x*1.75, dimensionVector.y*1.5, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
    
    ellipsoidMesh.position.set(posVector.x, posVector.y, posVector.z-5);
    obj.add(ellipsoidMesh);
}

function createSkydome() {
    "use strict";
    skydome = new THREE.Object3D();
    skydome.position.set(0, 0, 0);
    const geometry = new THREE.SphereGeometry(50, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, skydomeMaterial);
    mesh.position.set(0, 0, 0);
    skydome.add(mesh);
    scene.add(skydome);
}

function createGroundTexture() {
    "use strict";
    const cameraGround = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 100);
    cameraGround.position.set(0, 0, 10);
    cameraGround.lookAt(new THREE.Vector3(0, 0, 0));
    
    var object = new THREE.Object3D();
    var sceneGround = new THREE.Scene();
    var geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x90ee90,
    });

    var mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);
    fillSceneGround(object);
    sceneGround.add(object);
    
    rendererGround.render(sceneGround, cameraGround);

    var texture = new THREE.CanvasTexture(rendererGround.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);

    groundMaterial = new THREE.MeshStandardMaterial({
        map : texture,
        displacementMap : map,
        displacementScale : 50,
    }); 
    createGround();
}

function createSkyTexture() {
    "use strict";
    const cameraSky = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 100);
    cameraSky.position.set(0, 0, 10);
    cameraSky.lookAt(new THREE.Vector3(0, 0, 0));

    var object = new THREE.Object3D();
    var sceneSky = new THREE.Scene();
    var geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    
    let a = { r: 0.00, g: 0.0467, b: 0.280 } // Dark blue
    let b = { r: 0.224, g: 0.00, b: 0.280 }  // Dark purple

    var colors = new Float32Array([
        a.r, a.g, a.b,      // top left
        a.r, a.g, a.b,      // top right
        b.r, b.g, b.b,      // bottom left
        b.r, b.g, b.b ]);   // bottom right
        
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    var material = new THREE.MeshBasicMaterial({ vertexColors: true });
    
    var mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);
    fillSceneSky(object);
    sceneSky.add(object);
    
    rendererSky.render(sceneSky, cameraSky);

    var texture = new THREE.CanvasTexture(rendererSky.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
    skydomeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.BackSide,
    });    
    createSkydome();
}
    
function fillSceneSky(object) {
    "use strict";

    colorCodes = []
    colorCodes.push(0xffffff);
    for (let i = 0; i < 200; i++) {
        addCircle(getRandomNumber(-2,2), getRandomNumber(-2,2), 0, object);
    }
}

function fillSceneGround(object) {
    "use strict";
    colorCodes = [];
    colorCodes.push(0xffffff);
    colorCodes.push(0xadd8e6);
    colorCodes.push(0xb19cd9);
    colorCodes.push(0xffff00);
    for (let i = 0; i < 200; i++) {
        addCircle(getRandomNumber(-2,2), getRandomNumber(-2,2), i, object);
    }
}

function addCircle(x, y, i, object) {
    "use strict";
    var i = Math.floor(i/50);
    var geometry = new THREE.CircleGeometry(0.015, 32); 
    var material = new THREE.MeshBasicMaterial( { color: colorCodes[i] } ); 
    const circle = new THREE.Mesh(geometry, material); 
    circle.position.set(x,y,0);
    object.add(circle);
}

function createGround() {
    "use strict";
    const groundGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = - Math.PI / 2;
    scene.add(ground);
}

function createMoon() {
    "use strict";
    moon = new THREE.Object3D();
    
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd45f,
        emissive: 0xffd45f,
        emissiveIntensity: 1.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    moon.add(mesh);
    moon.position.set(0, 50, 0);
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
    });
    const cockpit = new THREE.Mesh(geometry, material);
    cockpit.position.set(0, rCockpit-1.2, 0);
    obj.add(cockpit);
}

function createOvniBottom(obj) {
    "use strict";
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({
        color : 0xffd45f,
    });
    const bottom = new THREE.Mesh(geometry, material);
    bottom.position.set(0, -rCockpit - hCyl/2 + 1, 0);
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

var houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
var roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff8000, side: THREE.DoubleSide });
var doorAndWindowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

function createHouse(x, y, z) {
    "use strict";

    //Define vertices for the house walls
    const spaceBetween = (houseL - doorL - 2*windowL)/4;
    const houseVertices = [
        //north wall
        -houseL/2, -houseH/2, -houseD/2, // Vertex 0
        -houseL/2, -houseH/2, houseD/2,  // Vertex 1
        -houseL/2, houseH/2, -houseD/2,  // Vertex 2
        -houseL/2, houseH/2, houseD/2,   // Vertex 3
        //east wall - door
        houseL/2 - spaceBetween, houseH/2 - 3, houseD/2,                    // Vertex 4
        houseL/2 - spaceBetween, houseH/2 - 3 - doorH, houseD/2,            // Vertex 5
        houseL/2 - spaceBetween - doorL, houseH/2 - 3, houseD/2,            // Vertex 6
        houseL/2 - spaceBetween - doorL, houseH/2 - 3 - doorH, houseD/2,    // Vertex 7
        //east wall - window1
        houseL/2 - spaceBetween - doorL - spaceBetween, houseH/2 - 3, houseD/2,                         // Vertex 8
        houseL/2 - spaceBetween - doorL - spaceBetween, houseH/2 - 3 - windowH, houseD/2,               // Vertex 9
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL, houseH/2 - 3, houseD/2,               // Vertex 10
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL, houseH/2 - 3 - windowH, houseD/2,     // Vertex 11
        //east wall - window2
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween, houseH/2 - 3, houseD/2,                         // Vertex 12
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween, houseH/2 - 3 - windowH, houseD/2,               // Vertex 13
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween - windowL, houseH/2 - 3, houseD/2,               // Vertex 14
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween - windowL, houseH/2 - 3 - windowH, houseD/2,     // Vertex 15
        //south wall
        houseL/2, -houseH/2, -houseD/2, // Vertex 16
        houseL/2, -houseH/2, houseD/2,  // Vertex 17
        houseL/2, houseH/2, -houseD/2,  // Vertex 18
        houseL/2, houseH/2, houseD/2,   // Vertex 19

        //east wall - auxiliary vertices
        houseL/2 - spaceBetween, -houseH/2, houseD/2,                       // Vertex 20
        houseL/2 - spaceBetween - doorL, -houseH/2, houseD/2,               // Vertex 21
        -houseL/2, houseH/2 - 3 - windowH, houseD/2,                        // Vertex 22
        -houseL/2, houseH/2 - 3, houseD/2,                                  // Vertex 23
        houseL/2 - spaceBetween, houseH/2, houseD/2,                        // Vertex 24
        houseL/2 - spaceBetween - doorL, houseH/2 - 3 - windowH, houseD/2, // Vertex 25

        //roof points
        -houseL/2, houseH/2 + roofH, 0,  // Vertex 26
        houseL/2, houseH/2 + roofH, 0,   // Vertex 27

    ];

    // Define faces of north wall
    const northWallIndices = [
        1, 0, 2,
        1, 2, 3,
    ];

    // Define faces of south wall
    const southWallIndices = [
        17, 16, 18,
        18, 19, 17,
    ];

    // Define faces of cover
    const coverIndices = [
        19, 18, 2,
        2, 3, 19,
    ];

    // Define faces of floor
    const floorIndices = [
        17, 16, 0,
        0, 1, 17,
    ];

    // Define faces of west wall
    const westWallIndices = [
        0, 16, 18,
        18, 2, 0,
    ];

    // Define faces of east wall
    const eastWallIndices = [
        17, 19, 24,
        24, 20, 17,
        20, 5, 7,
        7, 21, 20,
        21, 25, 22,
        22, 1, 21,
        25, 6, 8,
        8, 9, 25,
        11, 10, 12,
        12, 13, 11,
        15, 14, 23,
        23, 22, 15,
        4, 24, 3,
        3, 23, 4,
    ];

    // Define faces of door
    const doorIndices = [
        7, 5, 4,
        4, 6, 7,
    ];

    // Define faces of window1
    const window1Indices = [
        11, 9, 8,
        8, 10, 11,
    ];

    // Define faces of window2
    const window2Indices = [
        15, 13, 12,
        12, 14, 15,
    ];

    // Define faces of roof
    const roofIndices = [
        26, 2, 18,
        18, 27, 26,
        3, 19, 27,
        27, 26, 3,
    ];

    const roofSide1Indices = [
        26, 3, 2,
    ];

    const roofSide2Indices = [
        27, 19, 18,
    ];

    // Create geometry for the north wall
    const northWallGeometry = new THREE.BufferGeometry();
    northWallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    northWallGeometry.setIndex(northWallIndices);

    // Create mesh for the north wall
    const northWallMesh = new THREE.Mesh(northWallGeometry, houseMaterial);

    // Create geometry for the south wall
    const southWallGeometry = new THREE.BufferGeometry();
    southWallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    southWallGeometry.setIndex(southWallIndices);

    // Create mesh for the south wall
    const southWallMesh = new THREE.Mesh(southWallGeometry, houseMaterial);

    // Create geometry for the cover
    const coverGeometry = new THREE.BufferGeometry();
    coverGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    coverGeometry.setIndex(coverIndices);

    // Create mesh for the cover
    const coverMesh = new THREE.Mesh(coverGeometry, houseMaterial);

    // Create geometry for the floor
    const floorGeometry = new THREE.BufferGeometry();
    floorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    floorGeometry.setIndex(floorIndices);

    // Create mesh for the floor
    const floorMesh = new THREE.Mesh(floorGeometry, houseMaterial);

    // Create geometry for the west wall
    const westWallGeometry = new THREE.BufferGeometry();
    westWallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    westWallGeometry.setIndex(westWallIndices);

    // Create mesh for the west wall
    const westWallMesh = new THREE.Mesh(westWallGeometry, houseMaterial);

    // Create geometry for the east wall
    const eastWallGeometry = new THREE.BufferGeometry();
    eastWallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    eastWallGeometry.setIndex(eastWallIndices);

    // Create mesh for the east wall
    const eastWallMesh = new THREE.Mesh(eastWallGeometry, houseMaterial);

    // Create geometry for the door
    const doorGeometry = new THREE.BufferGeometry();
    doorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    doorGeometry.setIndex(doorIndices);

    // Create mesh for the door
    const doorMesh = new THREE.Mesh(doorGeometry, doorAndWindowMaterial);

    // Create geometry for the window1
    const window1Geometry = new THREE.BufferGeometry();
    window1Geometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    window1Geometry.setIndex(window1Indices);

    // Create mesh for the window1
    const window1Mesh = new THREE.Mesh(window1Geometry, doorAndWindowMaterial);

    // Create geometry for the window2
    const window2Geometry = new THREE.BufferGeometry();
    window2Geometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    window2Geometry.setIndex(window2Indices);

    // Create mesh for the window2
    const window2Mesh = new THREE.Mesh(window2Geometry, doorAndWindowMaterial);

    // Create geometry for the roof
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    roofGeometry.setIndex(roofIndices);

    // Create mesh for the roof
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);

    // Create geometry for the roof side 1
    const roofSide1Geometry = new THREE.BufferGeometry();
    roofSide1Geometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    roofSide1Geometry.setIndex(roofSide1Indices);

    // Create mesh for the roof side 1
    const roofSide1Mesh = new THREE.Mesh(roofSide1Geometry, roofMaterial);

    // Create geometry for the roof side 2
    const roofSide2Geometry = new THREE.BufferGeometry();
    roofSide2Geometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    roofSide2Geometry.setIndex(roofSide2Indices);

    // Create mesh for the roof side 2
    const roofSide2Mesh = new THREE.Mesh(roofSide2Geometry, roofMaterial);

    // Position and add meshes to the scene
    northWallMesh.position.set(x, y, z);
    scene.add(northWallMesh);
    southWallMesh.position.set(x, y, z);
    scene.add(southWallMesh);
    coverMesh.position.set(x, y, z);
    scene.add(coverMesh);
    floorMesh.position.set(x, y, z);
    scene.add(floorMesh);
    westWallMesh.position.set(x, y, z);
    scene.add(westWallMesh);
    eastWallMesh.position.set(x, y, z);
    scene.add(eastWallMesh);
    doorMesh.position.set(x, y, z);
    scene.add(doorMesh);
    window1Mesh.position.set(x, y, z);
    scene.add(window1Mesh);
    window2Mesh.position.set(x, y, z);
    scene.add(window2Mesh);
    roofMesh.position.set(x, y, z);
    scene.add(roofMesh);
    roofSide1Mesh.position.set(x, y, z);
    scene.add(roofSide1Mesh);
    roofSide2Mesh.position.set(x, y, z);
    scene.add(roofSide2Mesh);
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
    if (pointLightSwitch && ! alreadySwitchPointLight) {
        for (var pointLight of pointLights) {
            pointLight.intensity = pointLightIntensity - pointLight.intensity;
        }
        alreadySwitchPointLight = true;
    }   
    
    if (upArrowPressed) {
        moveZ(ovni, -velocityValue, deltaTime);
        moveZ(spotLight, -velocityValue, deltaTime);
    }
    if (leftArrowPressed) {
        moveX(ovni, -velocityValue, deltaTime);
        moveX(spotLight, -velocityValue, deltaTime);
    }
    if (rightArrowPressed) {
        moveX(ovni, velocityValue, deltaTime);
        moveX(spotLight, velocityValue, deltaTime);
    }
    if (downArrowPressed) {
        moveZ(ovni, velocityValue, deltaTime);
        moveZ(spotLight, velocityValue, deltaTime);
    }

    ovni.rotation.y += 0.01;
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

    rendererGround = new THREE.WebGLRenderer({
        antialias: true,
    });
    rendererGround.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererGround.domElement);

    rendererSky = new THREE.WebGLRenderer({
        antialias: true,
    });
    rendererSky.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererSky.domElement);


    createScene();
    createCamera();

    createTrees(7);
    createGround();
    createSkydome();
    createMoon();
    createOvni();
    createLights();
    createHouse(-5, 18, -20);

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
        case 49:
            createGroundTexture();
            break;
        case 50: 
            createSkyTexture();
            break;
        case 68: // letter D/d
            directionalLightSwitch = true;
            break;
        case 83: // letter S/s
            spotlightSwitch = true;
            break;
        case 80: // letter P/p
            pointLightSwitch = true;
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
        case 80: // letter P/p
            pointLightSwitch = false;
            alreadySwitchPointLight = false;
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