//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

/* Camera */
var mainCamera;

/* Camera used for textures */
const cameraTexture = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 100);
cameraTexture.position.set(0, 0, 10);
cameraTexture.lookAt(new THREE.Vector3(0, 0, 0));

/* Renderers */
var renderer, rendererSecondary; 

/* Scene */
var scene, sceneSecondary;

/* Clock */
var globalClock, deltaTime;

/* Skydome */
var skydome;

/* Skydome mesh */
var skydomeMesh;

/* Skydome radius */
const skydomeRadius = 60;

/* Tree */
var tree;

/* Number of trees */
const numberOfTrees = 7;

/* Tree top radius */
const treeTopRadius = 0.5;

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

/* Material flags */
var changeToBasic = false, changeToLambert = false, changeToPhong = false, changeToToon = false;

/* Load heightmap */
const map = new THREE.TextureLoader().load('pene.png');

/* Displacement scale */
const displacementScale = 50;

/* Ground mesh */
var groundMesh;

/* Ground material */
var groundMaterial = new THREE.MeshPhongMaterial({
    color : 0xffffff,
    displacementMap : map,
    displacementScale : displacementScale,
}); 

/* Skydome material */
var skydomeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
});

/* Texture flags */
var generatingGroundTexture = false, generatingSkyTexture = false;

/* Colors for the textures */
var colorCodes;

/* Position and number of circles on the textures */
const minXPos = -2, maxXPos = 2, minYPos = -2, maxYPos = 2;
const numberOfCircles = 500;

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

/* Ovni velocity */
const velocityValue = 10;

/* Ovni meshes */
var bodyMesh, cockpitMesh, bottomMesh;

/* Ovni materials */
const ovniMaterial = new THREE.MeshBasicMaterial({ color: 0xbbf3f9 });
const ovniMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xbbf3f9 });
const ovniMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xbbf3f9 });
const ovniMaterialToon = new THREE.MeshToonMaterial({ color: 0xbbf3f9 });
 
const ovniBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const ovniBodyMaterialLambert = new THREE.MeshLambertMaterial({ color: 0x808080 });
const ovniBodyMaterialPhong = new THREE.MeshPhongMaterial({ color: 0x808080 });
const ovniBodyMaterialToon = new THREE.MeshToonMaterial({ color: 0x808080 });

const ovniSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff645f });
const ovniSphereMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xff645f });
const ovniSphereMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xff645f });
const ovniSphereMaterialToon = new THREE.MeshToonMaterial({ color: 0xff645f });

/* Ovni spheres */
var spheres = []

/* Ovni dimensions */
const rBody = 2;
const r2Body = 7;

const rCockpit = 3;

const hCyl = 1;

const rSphere = 0.5;
const xSphere = 5;
const ySphere = -1.8;

/* Ovni bottom position */
const ovniBottom = -rCockpit - hCyl/2 + 1;

/* Ovni cockpit position */
const ovniCockpit = rCockpit-1.2;

/* Ovni rotation */
const rotationSpeed = 2;

/* Ovni height */
const hOvni = 40;

/* House */
const houseL = 20, houseD = 10, houseH = 15;
const roofH = 5;
const doorL = 2, doorH = 4;
const windowL = 2, windowH = 2; 

/* House position */
const housePos = new THREE.Vector3(-5, 20, -20);

/* House meshes */
var houseMesh, doorAndWindowMesh, roofMesh;

/* House materials */
const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff});
const houseMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xffffff});
const houseMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xffffff});
const houseMaterialToon = new THREE.MeshToonMaterial({ color: 0xffffff});

const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff8000});
const roofMaterialLambert = new THREE.MeshLambertMaterial({ color: 0xff8000});
const roofMaterialPhong = new THREE.MeshPhongMaterial({ color: 0xff8000});
const roofMaterialToon = new THREE.MeshToonMaterial({ color: 0xff8000});

const doorAndWindowMaterial = new THREE.MeshBasicMaterial({ color: 0x000091});
const doorAndWindowMaterialLambert = new THREE.MeshLambertMaterial({ color: 0x000091});
const doorAndWindowMaterialPhong = new THREE.MeshPhongMaterial({ color: 0x000091});
const doorAndWindowMaterialToon = new THREE.MeshToonMaterial({ color: 0x000091});

/* Moon */
var moonMesh;

/* Moon height */
const hMoon = 55;

/* Moon radius */
const moonRadius = 10;

/* Moon materials */
const moonMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd45f,
});
const moonMaterialLambert = new THREE.MeshLambertMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});
const moonMaterialPhong = new THREE.MeshPhongMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});
const moonMaterialToon = new THREE.MeshToonMaterial({
    color: 0xffd45f,
    emissive: 0xffd45f,
    emissiveIntensity: 1.5,
});

/* VR on */ 
var vrOn = false;

/* Radial segments for spheres and cylinders*/
const radialSegments = 32;

/* Height segments for spheres and cylinders*/
const heightSegments = 16;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(0, 0, 0)");
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(){
    'use strict';

    const aspect = window.innerWidth / window.innerHeight;
    const fov = 90;
    const near = 1;
    const far = 1000;
    const cameraPos = new THREE.Vector3(-35, 36, 0);
    const cameraLookAt = new THREE.Vector3(0, 20, 0);

    mainCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    mainCamera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    mainCamera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
    directionalLight.position.set(moonMesh.position.x, moonMesh.position.y - 10, moonMesh.position.z);
    directionalLight.castShadow = true;
    scene.add(directionalLight.target);
    directionalLight.target.position.set(1, 20, 2); // target different than the origin
    scene.add(directionalLight);

    // Spotlight
    spotLight = new THREE.SpotLight(0xd4d400, spotLightIntensity, 0, Math.PI / 6, 0);
    spotLight.castShadow = true;
    bottomMesh.add(spotLight);
    spotLight.target.position.set(0 , -hOvni + hCyl/2 + rBody/2, 0);
    bottomMesh.add(spotLight.target);

    // Point light
    for (var sphere of spheres) {
        const pointLight = new THREE.PointLight(0xff645f, pointLightIntensity, 100);
        sphere.add(pointLight);
        pointLights.push(pointLight);
    }
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function changeOvniMaterial(material, ovniBodyMaterial, ovniSphereMaterial) {
    'use strict';

    bodyMesh.material = ovniBodyMaterial;
    cockpitMesh.material = material;
    bottomMesh.material = material;
    for (var sphere of spheres) {
        sphere.material = ovniSphereMaterial;
    }
}

function chnageTreesMaterial(topMaterial, branchMaterial) {
    'use strict';

    for (var top of topMesh) {
        top.material = topMaterial;
    }
    for (var branch of branchMesh) {
        branch.material = branchMaterial;
    }
}

function getRandomNumber(min, max) {
    'use strict';

    return Math.random() * (max - min) + min;
}

function createTrees(numberOfTrees) {
    'use strict';

    var treesPos = [];
    const hTreeMin = 7, hTreeMax = 12;
    const rTree = 1;
    const treePosXMin = -40, treePosXMax = 20;
    const treePosY = 20;
    const treePosZMin = -40, treePosZMax = 40;
    const housePosXMin = -5-houseL, housePosXMax = -5+houseL;
    const housePosZMin = -20-houseD, housePosZMax = -20+houseD;

    while (numberOfTrees > 0) {
        const dimension = new THREE.Vector3(rTree, rTree, getRandomNumber(hTreeMin,hTreeMax));
        const v = new THREE.Vector3(getRandomNumber(treePosXMin,treePosXMax), treePosY, 
            getRandomNumber(treePosZMin,treePosZMax));
        if (treesPos.includes(v)) 
            continue;
        if ((housePosXMin <= v.x  && v.x <= housePosXMax) && (housePosZMin <= v.z && v.z <= housePosZMax)) {
            continue;
        }
        treesPos.push(v);
        createTree(v, dimension);
        numberOfTrees -= 1;
    }
}

function createTree(posVector, dimensionVector) {
    'use strict';

    const minBranchRotation = Math.PI/20, maxBranchRotation = Math.PI/16;
    const secondaryBranchPos = new THREE.Vector3(posVector.x+1,posVector.y+2,posVector.z-1);
    const secondaryBranchDim = new THREE.Vector3(dimensionVector.x/3, dimensionVector.y/3, dimensionVector.z/2);

    tree = new THREE.Object3D();

    const i = getRandomNumber(minBranchRotation, maxBranchRotation);
    
    addBranch(tree, posVector, dimensionVector, new THREE.Vector3(i,0,0));
    addBranch(tree, secondaryBranchPos, secondaryBranchDim, new THREE.Vector3(0, 0, -i*2)); 
    
    const bbox = new THREE.Box3().setFromObject(tree);
    const topPos = new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)
    addTopOnTree(tree, topPos, dimensionVector);

    scene.add(tree);   
}

function addBranch(obj, posVector, dimensionVector, rotationVector) {
    'use strict';

    const geometry = new THREE.CylinderGeometry(dimensionVector.x,dimensionVector.y,dimensionVector.z, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x884802 });
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
    'use strict';

    const treeTopDim = new THREE.Vector3(dimensionVector.x*3.5, dimensionVector.y*2, dimensionVector.z);
    const ellipsoidGeometry = new THREE.SphereGeometry(treeTopRadius, radialSegments, heightSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x006400 });

    ellipsoidGeometry.scale(treeTopDim.x, treeTopDim.y, treeTopDim.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
    topMesh.push(ellipsoidMesh);

    ellipsoidMesh.position.set(posVector.x, posVector.y, posVector.z);
    obj.add(ellipsoidMesh);
}

function addTopOnTree(obj, posVector, dimensionVector) {
    'use strict';

    const treeTopDim = new THREE.Vector3(dimensionVector.x*1.75, dimensionVector.y*2, dimensionVector.z);
    const treeTopPos = new THREE.Vector3(posVector.x, posVector.y, posVector.z-5);
    const ellipsoidGeometry = new THREE.SphereGeometry(treeTopRadius, radialSegments, heightSegments);
    const material = new THREE.MeshBasicMaterial({ color: 0x006400 });

    ellipsoidGeometry.scale(treeTopDim.x, treeTopDim.y, treeTopDim.z);
    const ellipsoidMesh = new THREE.Mesh(ellipsoidGeometry, material);
    topMesh.push(ellipsoidMesh);

    ellipsoidMesh.position.set(treeTopPos.x, treeTopPos.y, treeTopPos.z);
    obj.add(ellipsoidMesh);
}

function createSkydome() {
    'use strict';

    const skydomePosition = new THREE.Vector3(0, 10, 0);
    skydome = new THREE.Object3D();
    skydome.position.set(skydomePosition.x, skydomePosition.y, skydomePosition.z);

    const geometry = new THREE.SphereGeometry(skydomeRadius, radialSegments, 
            heightSegments, 0, Math.PI * 2, 0, Math.PI / 2);
    skydomeMesh = new THREE.Mesh(geometry, skydomeMaterial);
    skydomeMesh.position.set(0, 0, 0);

    skydome.add(skydomeMesh);
    scene.add(skydome);
}

function createGroundTexture() {
    'use strict';
    
    const object = new THREE.Object3D();
    sceneSecondary = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x90ee90 });
    const mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);

    fillSceneGround(object);
    sceneSecondary.add(object);
    
    rendererSecondary.clear();
    rendererSecondary.render(sceneSecondary, cameraTexture);

    const groundTexture = new THREE.CanvasTexture(rendererSecondary.domElement, THREE.UVMapping, 
                THREE.RepeatWrapping, THREE.RepeatWrapping);
    groundMesh.material = new THREE.MeshPhongMaterial({
        map : groundTexture,
        displacementMap : map,
        displacementScale : 50,
    }); 
}

function createSkyTexture() {
    'use strict';

    const object = new THREE.Object3D();
    sceneSecondary = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    
    let a = { r: 0.051, g: 0.051, b: 0.255 }    // dark blue color
    let b = { r: 0.255, g: 0.102, b: 0.255 }    // purple color
    
    var colors = new Float32Array([
        a.r, a.g, a.b,      // top left
        a.r, a.g, a.b,      // top right
        b.r, b.g, b.b,      // bottom left
        b.r, b.g, b.b ]);   // bottom right
        
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const mesh = new THREE.Mesh(geometry, material);
    object.add(mesh);

    fillSceneSky(object);
    sceneSecondary.add(object);
    
    rendererSecondary.clear();
    rendererSecondary.render(sceneSecondary, cameraTexture);

    var skyTexture = new THREE.CanvasTexture(rendererSecondary.domElement, THREE.UVMapping, 
                THREE.RepeatWrapping, THREE.RepeatWrapping);
    skydomeMesh.material = new THREE.MeshPhongMaterial({ 
        map: skyTexture,
        side: THREE.BackSide,
    });    
}
    
function fillSceneSky(object) {
    'use strict';

    colorCodes = []
    colorCodes.push(0xffffff);

    for (let i = 0; i < numberOfCircles; i++) {
        addCircle(getRandomNumber(minXPos, maxXPos), getRandomNumber(minYPos, maxYPos), 0, object);
    }
}

function fillSceneGround(object) {
    'use strict';

    colorCodes = [];
    colorCodes.push(0xffffff);
    colorCodes.push(0x00d2ff);
    colorCodes.push(0xb19cd9);
    colorCodes.push(0xffff00);

    for (let i = 0; i < numberOfCircles; i++) {
        addCircle(getRandomNumber(minXPos, maxXPos), getRandomNumber(minYPos, maxYPos), i, object);
    }
}

function addCircle(x, y, i, object) {
    'use strict';

    const circleRadius = 0.01;
    var i = Math.floor(i/125);
    const material = new THREE.MeshBasicMaterial({ color: colorCodes[i] }); 
    const geometry = new THREE.CircleGeometry(circleRadius, radialSegments); 
    
    const circle = new THREE.Mesh(geometry, material); 
    circle.position.set(x,y,0);
    object.add(circle);
}

function createGround() {
    'use strict';

    const groundGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
    groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
    groundMesh.rotation.x = - Math.PI / 2;
    scene.add(groundMesh);
}

function createMoon() {
    'use strict';
     
    const geometry = new THREE.SphereGeometry(moonRadius, radialSegments, heightSegments);

    moonMesh = new THREE.Mesh(geometry, moonMaterial);
    moonMesh.position.set(0, hMoon, 0);
    scene.add(moonMesh);
}

function createOvni() {
    'use strict';

    ovni = new THREE.Object3D();
    createOvniBody(ovni);
    createOvniCockpit(ovni);
    createOvniBottom(ovni);
    createOvniSpheres(ovni);
    ovni.position.set(0, hOvni, 0)
    scene.add(ovni);
}


function createOvniBody(obj) {
    'use strict';

    const geometry = new THREE.SphereGeometry(1, radialSegments, radialSegments);
    geometry.scale(r2Body, rBody, r2Body);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    bodyMesh = new THREE.Mesh(geometry, material);
    bodyMesh.position.set(0, 0, 0);
    obj.add(bodyMesh);
}

function createOvniCockpit(obj) {
    'use strict';

    const geometry = new THREE.SphereGeometry(rCockpit, radialSegments, radialSegments, 
                0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color : 0xbbf3f9 });
    cockpitMesh = new THREE.Mesh(geometry, material);
    cockpitMesh.position.set(0, ovniCockpit, 0);
    obj.add(cockpitMesh);
}

function createOvniBottom(obj) {
    'use strict';

    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color : 0xbbf3f9 });
    bottomMesh = new THREE.Mesh(geometry, material);
    bottomMesh.position.set(0, ovniBottom, 0);
    obj.add(bottomMesh);
}

function createOvniSpheres(obj) {
    'use strict';

    createSphere(obj, xSphere, ySphere, 0);
    createSphere(obj, - xSphere, ySphere, 0);
    createSphere(obj, 0, ySphere, xSphere);
    createSphere(obj, 0, ySphere, - xSphere);
}

function createSphere(obj, x, y , z) {
    'use strict';

    const geometry = new THREE.SphereGeometry(rSphere, radialSegments, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color : 0xff645f });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    spheres.push(sphere);
    obj.add(sphere);
}

function createHouse(x, y, z) {
    'use strict';

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
function moveX(object, value, deltaTime) {
    'use strict';

    const vec = new THREE.Vector3(value*deltaTime, 0, 0);
    object.position.add(vec);
}

function moveZ(object, value, deltaTime) {
    'use strict';

    const vec = new THREE.Vector3(0, 0, value*deltaTime);
    object.position.add(vec);
}

function update(){
    'use strict';

    if (generatingGroundTexture) {
        if (!generatingSkyTexture)
            createGroundTexture();
    }
    if (generatingSkyTexture) {
        if (!generatingGroundTexture)
            createSkyTexture();
    }
    if (directionalLightSwitch && ! alreadySwitchDirectionalLight) {
        directionalLight.visible = ! directionalLight.visible;
        alreadySwitchDirectionalLight = true;
    }
    if (spotlightSwitch && ! alreadySwitchSpotlight) {
        spotLight.visible = ! spotLight.visible;
        alreadySwitchSpotlight = true;
        
    }
    if (pointLightSwitch && ! alreadySwitchPointLight) {
        for (var pointLight of pointLights) {
            pointLight.visible = ! pointLight.visible;
        }
        alreadySwitchPointLight = true;
    }   
    if (upArrowPressed) {
        moveX(ovni, velocityValue, deltaTime);
    }
    if (leftArrowPressed) {
        moveZ(ovni, -velocityValue, deltaTime);
    }
    if (rightArrowPressed) {
        moveZ(ovni, velocityValue, deltaTime);
    }
    if (downArrowPressed) {
        moveX(ovni, -velocityValue, deltaTime);
    }

    ovni.rotation.y += rotationSpeed * deltaTime;

    if(changeToBasic){
        houseMesh.material = houseMaterial;
        doorAndWindowMesh.material = doorAndWindowMaterial;
        roofMesh.material = roofMaterial;
        changeOvniMaterial(ovniMaterial, ovniBodyMaterial, ovniSphereMaterial);
        chnageTreesMaterial(topTreeMaterial, branchTreeMaterial);
        moonMesh.material = moonMaterial;
    }
    else if(changeToLambert){
        houseMesh.material = houseMaterialLambert;
        doorAndWindowMesh.material = doorAndWindowMaterialLambert;
        roofMesh.material = roofMaterialLambert;
        changeOvniMaterial(ovniMaterialLambert, ovniBodyMaterialLambert, ovniSphereMaterialLambert);
        chnageTreesMaterial(topTreeMaterialLambert, branchTreeMaterialLambert);
        moonMesh.material = moonMaterialLambert;
    }
    else if(changeToPhong){
        houseMesh.material = houseMaterialPhong;
        doorAndWindowMesh.material = doorAndWindowMaterialPhong;
        roofMesh.material = roofMaterialPhong;
        changeOvniMaterial(ovniMaterialPhong, ovniBodyMaterialPhong, ovniSphereMaterialPhong);
        chnageTreesMaterial(topTreeMaterialPhong, branchTreeMaterialPhong);
        moonMesh.material = moonMaterialPhong;
    }
    else if(changeToToon){
        houseMesh.material = houseMaterialToon;
        doorAndWindowMesh.material = doorAndWindowMaterialToon;
        roofMesh.material = roofMaterialToon;
        changeOvniMaterial(ovniMaterialToon, ovniBodyMaterialToon, ovniSphereMaterialToon);
        chnageTreesMaterial(topTreeMaterialToon, branchTreeMaterialToon);
        moonMesh.material = moonMaterialToon;
    }
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

    document.body.appendChild(VRButton.createButton(renderer ));
    renderer.xr.enabled = true;

    createScene();
    createCamera();

    createTrees(numberOfTrees);
    createGround();
    createSkydome();
    createMoon();
    createOvni();
    createLights();
    createHouse(housePos.x, housePos.y, housePos.z);

    globalClock = new THREE.Clock(true);
    deltaTime = globalClock.getDelta();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    renderer.xr.addEventListener('sessionstart', onVRSessionStart);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    deltaTime = globalClock.getDelta();

    update();
    render();

    if (!vrOn) {
        requestAnimationFrame(animate);
    }
    else {
        renderer.setAnimationLoop( function () {
            renderer.render(scene, mainCamera);
        } );
    } 
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
        case 49: // number 1
            generatingGroundTexture = true
            break;
        case 50: // number 2
            generatingSkyTexture = true;
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
        case 49: // number 1
            generatingGroundTexture = false;
            break;
        case 50: // number 2
            generatingSkyTexture = false;
            break;
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

///////////////////////////
/* SESSION STARTCALLBACK */
///////////////////////////

function onVRSessionStart() {
    vrOn = true;
    scene.position.set(20, -25, -10);    
}
