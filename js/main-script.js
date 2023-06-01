//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var mainCamera, cameras;
var renderer, scene;
var material, mesh;
var globalClock, deltaTime,robot;
var strDownloadMime = "image/octet-stream";
var number1Pressed, number2Pressed, removePressed;
var colorCodes
var skydome;

var ovni;
var spheres = [];

var directionalLight, spotLight, pointLights = [];

var leftArrowPressed = false, upArrowPressed = false, rightArrowPressed = false, downArrowPressed = false;

var directionalLightSwitch = false, alreadySwitchDirectionalLight = false;
var pointLightSwitch = false, alreadySwitchPointLight = false;
var spotlightSwitch = false, alreadySwitchSpotlight = false;

const directionalLightIntensity = 30;
const spotLightIntensity = 30;
const pointLightIntensity = 1;

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

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createScene2() {
    var geometry = new THREE.BoxGeometry(280, 0, 150);
    geometry.computeBoundingBox();
    var material = new THREE.ShaderMaterial({
    uniforms: {
        color1: {
        value: new THREE.Color("red")
        },
        color2: {
        value: new THREE.Color("purple")
        },
        bboxMin: {
        value: geometry.boundingBox.min
        },
        bboxMax: {
        value: geometry.boundingBox.max
        }
    },
    vertexShader: `
        uniform vec3 bboxMin;
        uniform vec3 bboxMax;
    
        varying vec2 vUv;

        void main() {
        vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
    
        varying vec2 vUv;
        
        void main() {
        
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
    `,
    });
    /*
    var material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2() },
            colors: { 
                value: [new THREE.Color('#ff0000'), new THREE.Color('#0000ff')]
          }
        },
        vertexShader: `
                varying float h; 

                void main() {
                h = position.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
  fragmentShader: `
            uniform vec3 colors[2]; 

            varying float h;

            void main() {
            float f = (h + 100.) / 200.;  // linear interpolation
                                        // but you can also use 'smoothstep'
            f = clamp(f, 0., 1.);
            gl_FragColor = vec4(mix(colors[0], colors[1], f), 1.0);
            }`
    });*/
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    fillScene2();
}

function fillScene2() {
    colorCodes = []
    colorCodes.push(0xffffff);
    for (let i = 0; i < 800; i++) {
        addCircle(getRandomNumber(-140,140), getRandomNumber(-75,75), 0);
    }
}

function createScene1() {
    var material = new THREE.MeshBasicMaterial({
        color: 0x90ee90,
    });
    var geometry = new THREE.BoxGeometry(1920, 0, 936);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    fillScene1();
}

function fillScene1() {
    colorCodes = [];
    colorCodes.push(0xffffff);
    colorCodes.push(0xffff00);
    colorCodes.push(0xadd8e6);
    colorCodes.push(0xb19cd9);
    for (let i = 0; i < 800; i++) {
        addCircle(getRandomNumber(-140,140), getRandomNumber(-75,75), i);
    }
}

function addCircle(x, z, i) {
    var i = Math.floor(i/200);
    console.log(i);
    geometry = new THREE.CircleGeometry(0.25, 32); 
    material = new THREE.MeshBasicMaterial( { color: colorCodes[i] } ); 
    const circle = new THREE.Mesh( geometry, material ); 
    circle.position.set(x,0.01,z);
    circle.rotation.x = -Math.PI/2
    scene.add( circle );
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
async function update(){
    'use strict';

    spotLight.target.position.set(ovni.position.x, 0, ovni.position.z);
    for (var i = 0; i < pointLights.length; i++) {
        pointLights[i].position.set(ovni.position.x + spheres[i].position.x, ovni.position.y + spheres[i].position.y, ovni.position.z + spheres[i].position.z);
        /* console.log(spheres[i].position); */
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
    console.log(leftArrowPressed, upArrowPressed, rightArrowPressed, downArrowPressed);
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

    var saveLink = document.createElement('div');
    saveLink.style.position = 'absolute';
    saveLink.style.top = '10px';
    saveLink.style.width = '100%';
    saveLink.style.color = 'white !important';
    saveLink.style.textAlign = 'center';
    saveLink.innerHTML =
    '<a href="#" id="saveLink">Save Frame</a>';
    document.body.appendChild(saveLink);
    document.getElementById("saveLink").addEventListener('click', saveAsImage);
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true ,
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
async function animate() {
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



