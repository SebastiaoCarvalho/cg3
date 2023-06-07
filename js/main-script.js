//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

/* Camera */
var mainCamera, stereoCamera;

/* Renderers */
var renderer, rendererSecondary; 

/* Scene */
var scene, sceneSecondary;

/* Clock */
var globalClock, deltaTime;

/* Skydome */
var skydome;

/* Tree */
var tree;

/* Tree meshes */
var branchMesh = [], topMesh = [];

/* Tree materials */
const branchTreeMaterial = new THREE.MeshBasicMaterial({ color: 0x884802 });
const branchTreeMaterialLambert = new THREE.MeshLambertMaterial({ color: 0x884802 });
const branchTreeMaterialPhong = new THREE.MeshPhongMaterial({ color: 0x884802 });
const branchTreeMaterialToon = new THREE.MeshToonMaterial({ color: 0x884802 });

const topTreeMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
const topTreeMaterialLambert = new THREE.MeshLambertMaterial({ color: 0x006400 });
const topTreeMaterialPhong = new THREE.MeshPhongMaterial({ color: 0x006400 });
const topTreeMaterialToon = new THREE.MeshToonMaterial({ color: 0x006400 });

/* Texture flags */
var changeToBasic = false, changeToLambert = false, changeToPhong = false, changeToToon = false;

/* Colors for the textures */
var colorCodes;

/* Load heightmap */
const map = new THREE.TextureLoader().load('pene.png');

/* Ground material */
var groundMaterial = new THREE.MeshPhongMaterial({
    color : 0xffffff,
    displacementMap : map,
    displacementScale : 50,
}); 

/* Skydome material */
var skydomeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
});

/* Arrow buttons */
var leftArrowPressed = false, upArrowPressed = false, rightArrowPressed = false, downArrowPressed = false;

/* Lights */
var directionalLight, spotLight, pointLights = [];

/* Lights Switch */
var directionalLightSwitch = false, alreadySwitchDirectionalLight = false;
var pointLightSwitch = false, alreadySwitchPointLight = false;
var spotlightSwitch = false, alreadySwitchSpotlight = false;

/* Lights intensity */
const directionalLightIntensity = 0.3;
const spotLightIntensity = 5;
const pointLightIntensity = 0.3;

/* Ovni */
var ovni;

/* Ovni meshes */
var bodyMesh, cockpitMesh, bottomMesh;

/* Ovni materials */
const ovniMaterial = new THREE.MeshStandardMaterial({ color: 0xffd45f });
const ovniMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xffd45f });
const ovniMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xffd45f });
const ovniMaterialToon = new THREE.MeshToonMaterial({ color: 0xffd45f });

/* Ovni spheres */
var spheres = []

/* Ovni dimensions */
const rBody = 2;
const r2Body = 7;

const rCockpit = 3;

const hCyl = 1;

const rSphere = 0.5;
const xSphere = 5;
const ySphere = - 2;

/* House */
const houseL = 20, houseD = 10, houseH = 15;
const roofH = 5;
const doorL = 2, doorH = 4;
const windowL = 2, windowH = 2; 

/* House meshes */
var houseMesh, doorAndWindowMesh, roofMesh;

/* House materials */
var houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff});
var houseMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xffffff});
var houseMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xffffff});
var houseMaterialToon = new THREE.MeshToonMaterial({ color: 0xffffff});

var roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff8000});
var roofMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xff8000});
var roofMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xff8000});
var roofMaterialToon = new THREE.MeshToonMaterial({ color: 0xff8000});

var doorAndWindowMaterial = new THREE.MeshBasicMaterial({ color: 0x000091});
var doorAndWindowMaterialLambert = new THREE.MeshLambertMaterial({ color: 0x000091});
var doorAndWindowMaterialPhong = new THREE.MeshPhongMaterial({ color: 0x000091});
var doorAndWindowMaterialToon = new THREE.MeshToonMaterial({ color: 0x000091});

/* Moon */
var moonMesh;

/* Moon materials */
var moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});
var moonMaterialLambert = new THREE.MeshLambertMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});
var moonMaterialPhong = new THREE.MeshPhongMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});
var moonMaterialToon = new THREE.MeshToonMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});

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
    const fov = 90;
    const near = 1;
    const far = 1000;

    stereoCamera = new THREE.StereoCamera();
    stereoCamera.eyesep = 0.1;
    stereoCamera.aspect = 2;

    tempCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    tempCamera.position.set(-35, 36, 0);
    tempCamera.lookAt(0,20,0);

    mainCamera = tempCamera;
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
    directionalLight.position.set(moonMesh.position.x, moonMesh.position.y - 10, moonMesh.position.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight.target);
    directionalLight.target.position.set(1, 20, 2);
    scene.add(directionalLight);
    // Spotlight
    spotLight = new THREE.SpotLight(0xd4d400, spotLightIntensity, 0, Math.PI / 6, 0);
    spotLight.position.set(0, ovni.position.y - hCyl - rBody, 0);
    spotLight.castShadow = true;
    scene.add(spotLight.target);
    scene.add(spotLight);
    // Point light
    for (var sphere of spheres) {
        const pointLight = new THREE.PointLight(0xff645f, pointLightIntensity, 100);
        pointLight.position.set(ovni.position.x + sphere.position.x, ovni.position.y + sphere.position.y, ovni.position.z + sphere.position.z);
        scene.add(pointLight);
        pointLights.push(pointLight);
    }
 
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function changeOvniMaterial(material) {
    bodyMesh.material = material;
    cockpitMesh.material = material;
    bottomMesh.material = material;
    for (var sphere of spheres) {
        sphere.material = material;
    }
}

function chnageTreesMaterial(topMaterial, branchMaterial) {
    for (var top of topMesh) {
        top.material = topMaterial;
    }
    for (var branch of branchMesh) {
        branch.material = branchMaterial;
    }
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createTrees(numberOfTrees) {
    var posVectors = [];
    while (numberOfTrees > 0) {
        const dimension = new THREE.Vector3(1, 1, getRandomNumber(7,12));
        const v = new THREE.Vector3(getRandomNumber(-40,20), 20, getRandomNumber(-40,40));
        if (posVectors.includes(v)) 
            continue;
        if ((-5-houseL <= v.x  && v.x <= -5+houseL) && (-20-houseD <= v.z && v.z <= -20+houseD)) {
            continue;
        }
        posVectors.push(v);
        createTree(v, dimension);
        numberOfTrees -= 1;
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

    branchMesh.push(mesh);

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
    ellipsoidGeometry.scale(dimensionVector.x*3.5, dimensionVector.y*2, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);

    topMesh.push(ellipsoidMesh);

    ellipsoidMesh.position.set(posVector.x, posVector.y, posVector.z);
    obj.add(ellipsoidMesh);
}

function addTopOnTree(obj, posVector, dimensionVector) {
    const ellipsoidGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0x006400,
    });
    ellipsoidGeometry.scale(dimensionVector.x*1.75, dimensionVector.y*2, dimensionVector.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
    
    topMesh.push(ellipsoidMesh);

    ellipsoidMesh.position.set(posVector.x, posVector.y, posVector.z-5);
    obj.add(ellipsoidMesh);
}

function createSkydome() {
    "use strict";
    skydome = new THREE.Object3D();
    skydome.position.set(0, 10, 0);
    const geometry = new THREE.SphereGeometry(60, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
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
    sceneSecondary = new THREE.Scene();
    var geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x90ee90,
    });

    var mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);
    fillSceneGround(object);
    sceneSecondary.add(object);
    
    rendererSecondary.clear();
    rendererSecondary.render(sceneSecondary, cameraGround);

    var texture = new THREE.CanvasTexture(rendererSecondary.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);

    groundMaterial = new THREE.MeshPhongMaterial({
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
    sceneSecondary = new THREE.Scene();
    var geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    
    let a = { r: 0.051, g: 0.051, b: 0.255 }
    let b = { r: 0.255, g: 0.102, b: 0.255 } 
    
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
    sceneSecondary.add(object);
    
    rendererSecondary.clear();
    rendererSecondary.render(sceneSecondary, cameraSky);

    var texture = new THREE.CanvasTexture(rendererSky.domElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
    skydomeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.BackSide,
    });    
    createSkydome();
}
    
function fillSceneSky(object) {
    "use strict";
    colorCodes = []
    colorCodes.push(0xffffff);
    for (let i = 0; i < 500; i++) {
        addCircle(getRandomNumber(-2,2), getRandomNumber(-2,2), 0, object);
    }
}

function fillSceneGround(object) {
    "use strict";
    colorCodes = [];
    colorCodes.push(0xffffff);
    colorCodes.push(0x00d2ff);
    colorCodes.push(0xb19cd9);
    colorCodes.push(0xffff00);
    for (let i = 0; i < 500; i++) {
        addCircle(getRandomNumber(-2,2), getRandomNumber(-2,2), i, object);
    }
}

function addCircle(x, y, i, object) {
    "use strict";
    var i = Math.floor(i/125);
    var geometry = new THREE.CircleGeometry(0.01, 32); 
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
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    moonMesh = new THREE.Mesh(geometry, moonMaterial);
    moonMesh.position.set(0, 50, 0);
    scene.add(moonMesh);
}

function createOvni() {
    "use strict";
    ovni = new THREE.Object3D();
    createOvniBody(ovni);
    createOvniCockpit(ovni);
    createOvniBottom(ovni);
    createOvniSpheres(ovni);
    ovni.position.set(0, 40, 0)
    scene.add(ovni);
}


function createOvniBody(obj) {
    "use strict";
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    geometry.scale(r2Body, rBody, r2Body);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd45f,
    });
    bodyMesh = new THREE.Mesh(geometry, material);
    bodyMesh.position.set(0, 0, 0);
    obj.add(bodyMesh);
}

function createOvniCockpit(obj) {
    "use strict";
    const geometry = new THREE.SphereGeometry(rCockpit, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
        color : 0xffd45f,
    });
    cockpitMesh = new THREE.Mesh(geometry, material);
    cockpitMesh.position.set(0, rCockpit-1.2, 0);
    obj.add(cockpitMesh);
}

function createOvniBottom(obj) {
    "use strict";
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const material = new THREE.MeshBasicMaterial({
        color : 0xffd45f,
    });
    bottomMesh = new THREE.Mesh(geometry, material);
    bottomMesh.position.set(0, -rCockpit - hCyl/2 + 1, 0);
    obj.add(bottomMesh);
}

function createOvniSpheres(obj) {
    createSphere(obj, xSphere, ySphere+0.2, 0);
    createSphere(obj, - xSphere, ySphere+0.2, 0);
    createSphere(obj, 0, ySphere+0.2, xSphere);
    createSphere(obj, 0, ySphere+0.2, - xSphere);
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

        //roof points
        -houseL/2, houseH/2 + roofH, 0,  // Vertex 20
        houseL/2, houseH/2 + roofH, 0,   // Vertex 21

        //east wall - auxiliary vertices
        houseL/2, houseH/2 - 3 - doorH/2, houseD/2,                                                                 // Vertex 22
        houseL/2 - spaceBetween - doorL/2, houseH/2, houseD/2,                                                      // Vertex 23
        houseL/2 - spaceBetween - doorL - spaceBetween/2, houseH/2, houseD/2,                                       // Vertex 24
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL/2, houseH/2, houseD/2,                             // Vertex 25
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween/2, houseH/2, houseD/2,              // Vertex 26
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween - windowL/2, houseH/2, houseD/2,    // Vertex 27
        -houseL/2, houseH/2 - 3 - windowH/2, houseD/2,                                                              // Vertex 28
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween - windowL/2, -houseH/2, houseD/2,   // Vertex 29
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL - spaceBetween/2, -houseH/2, houseD/2,             // Vertex 30
        houseL/2 - spaceBetween - doorL - spaceBetween - windowL/2, -houseH/2, houseD/2,                            // Vertex 31
        houseL/2 - spaceBetween - doorL - spaceBetween/2, -houseH/2, houseD/2,                                      // Vertex 32
        houseL/2 - spaceBetween - doorL/2, -houseH/2, houseD/2,                                                     // Vertex 33
    ];

    // Define faces of north wall
    const northWallIndices = [
        2, 0, 1,
        3, 2, 1,
    ];

    // Define faces of south wall
    const southWallIndices = [
        18, 16, 17,
        17, 19, 18,
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
        19,23,4,
        23, 6, 4,
        23, 24, 6,
        24, 8, 6,
        24, 25, 8,
        25, 10, 8,
        25, 26, 10,
        26, 12, 10,
        26, 27, 12,
        27, 14, 12,
        27, 3, 14,
        14, 3, 28,
        14, 28, 15,
        15, 28, 1,
        15, 1, 29,
        13, 15, 29,
        13, 29, 30,
        11, 13, 30,
        11, 12, 13,
        11, 10, 12,
        11, 30, 31,
        9, 11, 31,
        9, 31, 32,
        7, 9, 32,
        7, 32, 33,
        6, 9, 7,
        6, 8, 9,
        5, 7, 33,
        17, 5, 33,
        22, 5, 17,
        22, 4, 5,
        22, 19, 4, 
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
        20, 2, 18,
        18, 21, 20,
        3, 19, 21,
        21, 20, 3,
    ];

    const roofSide1Indices = [
        2, 3, 20,
    ];

    const roofSide2Indices = [
        18, 19, 21,
    ];

    // House Mesh
    const houseGeometry = new THREE.BufferGeometry();
    houseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    houseGeometry.setIndex(northWallIndices.concat(
        southWallIndices,
        coverIndices,
        floorIndices,
        westWallIndices,
        eastWallIndices,
    ));
    houseGeometry.computeVertexNormals();

    houseMesh = new THREE.Mesh(houseGeometry, houseMaterial);
    houseMesh.position.set(x, y, z);
    scene.add(houseMesh);

    // Door and Window Mesh
    const doorAndWindowGeometry = new THREE.BufferGeometry();
    doorAndWindowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    doorAndWindowGeometry.setIndex(doorIndices.concat(
        window1Indices,
        window2Indices,
    ));
    doorAndWindowGeometry.computeVertexNormals();

    doorAndWindowMesh = new THREE.Mesh(doorAndWindowGeometry, doorAndWindowMaterial);
    doorAndWindowMesh.position.set(x, y, z);
    scene.add(doorAndWindowMesh);

    // Roof Mesh
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(houseVertices, 3));
    roofGeometry.setIndex(roofIndices.concat(
        roofSide1Indices,
        roofSide2Indices,
    ));
    roofGeometry.computeVertexNormals();

    roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.set(x, y, z);
    scene.add(roofMesh);
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
        moveX(ovni, velocityValue, deltaTime);
        moveX(spotLight, velocityValue, deltaTime);
    }
    if (leftArrowPressed) {
        moveZ(ovni, -velocityValue, deltaTime);
        moveZ(spotLight, -velocityValue, deltaTime);
    }
    if (rightArrowPressed) {
        moveZ(ovni, velocityValue, deltaTime);
        moveZ(spotLight, velocityValue, deltaTime);
    }
    if (downArrowPressed) {
        moveX(ovni, -velocityValue, deltaTime);
        moveX(spotLight, -velocityValue, deltaTime);
    }

    ovni.rotation.y += 0.01;

    if(changeToBasic){
        houseMesh.material = houseMaterial;
        doorAndWindowMesh.material = doorAndWindowMaterial;
        roofMesh.material = roofMaterial;
        changeOvniMaterial(ovniMaterial);
        chnageTreesMaterial(topTreeMaterial, branchTreeMaterial);
        moonMesh.material = moonMaterial;
    }
    else if(changeToLambert){
        houseMesh.material = houseMaterialLambert;
        doorAndWindowMesh.material = doorAndWindowMaterialLambert;
        roofMesh.material = roofMaterialLambert;
        changeOvniMaterial(ovniMaterialLambert);
        chnageTreesMaterial(topTreeMaterialLambert, branchTreeMaterialLambert);
        moonMesh.material = moonMaterialLambert;
    }
    else if(changeToPhong){
        houseMesh.material = houseMaterialPhong;
        doorAndWindowMesh.material = doorAndWindowMaterialPhong;
        roofMesh.material = roofMaterialPhong;
        changeOvniMaterial(ovniMaterialPhong);
        chnageTreesMaterial(topTreeMaterialPhong, branchTreeMaterialPhong);
        moonMesh.material = moonMaterialPhong;
    }
    else if(changeToToon){
        houseMesh.material = houseMaterialToon;
        doorAndWindowMesh.material = doorAndWindowMaterialToon;
        roofMesh.material = roofMaterialToon;
        changeOvniMaterial(ovniMaterialToon);
        chnageTreesMaterial(topTreeMaterialToon, branchTreeMaterialToon);
        moonMesh.material = moonMaterialToon;
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

    rendererSecondary = new THREE.WebGLRenderer({
        antialias: true,
    });
    rendererSecondary.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererSecondary.domElement);

    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    createScene();
    createCamera();

    createTrees(7);
    createGround();
    createSkydome();
    createMoon();
    createOvni();
    createLights();
    createHouse(-5, 20, -20);

    globalClock = new THREE.Clock(true);
    deltaTime = globalClock.getDelta();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    renderer.xr.addEventListener('sessionstart', onVRSessionStart);
}

function onVRSessionStart() {
    scene.position.set(20, -25, -10);    
    renderer.setAnimationLoop( function () {
        renderer.render( scene, mainCamera );
    } );
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
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        mainCamera.aspect = window.innerWidth / window.innerHeight;
        mainCamera.updateProjectionMatrix();
    }
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
        case 81: // letter Q/q
            changeToLambert = true;
            break;
        case 87: // letter W/w
            changeToPhong = true;
            break;
        case 69: // letter E/e
            changeToToon = true;
            break;
        case 82: // letter R/r
            changeToBasic = true;
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
        case 81: // letter Q/q
            changeToLambert = false;
            break;
        case 87: // letter W/w
            changeToPhong = false;
            break;
        case 69: // letter E/e
            changeToToon = false;
            break;
        case 82: // letter R/r
            changeToBasic = false;
            break;
    }
}