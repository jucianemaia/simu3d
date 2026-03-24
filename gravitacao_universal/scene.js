const gridHelper = new THREE.GridHelper(200, 200, 0x334155, 0x1e293b);
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

const geometryBody1 = new THREE.SphereGeometry(0.38, 32, 32);
const materialBody1 = new THREE.MeshStandardMaterial({
    color: 0xffcc33,
    emissive: 0xffaa00,
    emissiveIntensity: 1.2,
    roughness: 0.4,
    metalness: 0.0
});

const geometryBody2 = new THREE.SphereGeometry(0.15, 25, 12);
const materialBody2 = new THREE.MeshStandardMaterial({
    color: 0x87cefa,
    roughness: 0.5,
    metalness: 0.1
});

const geometryBody3 = new THREE.SphereGeometry(0.15, 25, 12);
const materialBody3 = new THREE.MeshBasicMaterial({
    color: 0xFFE4E1,
    wireframe: true,
});

const body1 = new THREE.Mesh(geometryBody1, materialBody1);
scene.add(body1);
body1.position.x = 0;
body1.position.y = 0;
body1.position.z = 0;

const body2 = new THREE.Mesh(geometryBody2, materialBody2);
scene.add(body2);
body2.position.x = 1.496;  //cada px equivale a 1x10^11
body2.position.y = 1.496;  //cada px equivale a 1x10^11
body2.position.z = 0;

const body3 = new THREE.Mesh(geometryBody2, materialBody2);
scene.add(body3);
body3.position.x = -1.496;  //cada px equivale a 1x10^11
body3.position.y = -1.496;  //cada px equivale a 1x10^11
body3.position.z = 0;

const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc66,
    transparent: true,
    opacity: 0.18
});

const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(sunGlow);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starsVertices = [];

for (let i = 0; i < 10000; i++) {
    starsVertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
}

starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


let pointsTrajetorias1 = [];
let pointsTrajetorias2 = [];


const fator = 50e9;


function pausar(){
    pausou = !pausou;

    if (pausou) {
        console.log("Pausado");
    } else {
        console.log("Executando");
    }
}

renderer.setAnimationLoop(() => {
    console: 'loop';

    //if(pausou)
        //parametros()

    if (!pausou)
        gravitacaoUniversal()

    body1.position.x = x1/fator;
    body1.position.y = y1/fator;
    body1.position.z = z1/fator;
    body2.position.x = x2/fator;
    body2.position.y = y2/fator;
    body2.position.z = z2/fator;
    body3.position.x = x3/fator;
    body3.position.y = y3/fator;
    body3.position.z = z3/fator;
    
    // ----------- trajetória body1 ---------------
    pointsTrajetorias1.push( new THREE.Vector3( x2/fator, y2/fator, z2/fator ) );
    const geometryLinha1 = new THREE.BufferGeometry().setFromPoints( pointsTrajetorias1);
    const materialLinha1 = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    const line1 = new THREE.Line( geometryLinha1, materialLinha1 );
    scene.add( line1 )
    // ---------------------------------------------
    
    // ----------- trajetória body2 ---------------
    pointsTrajetorias2.push( new THREE.Vector3( x3/fator, y3/fator, z3/fator ) );
    const geometryLinha2 = new THREE.BufferGeometry().setFromPoints( pointsTrajetorias2 );
    const materialLinha2 = new THREE.LineBasicMaterial({
        color: 0x4de3db
    });
    const line2 = new THREE.Line( geometryLinha2, materialLinha2 );
    scene.add( line2 )
    // ---------------------------------------------

    renderer.render(scene, camera);
    controls.update();
    sunGlow.position.copy(body1.position)
});

let isDragging = false;

const sceneContainer = document.getElementById("scene");


// ----------- pausar e reiniciar a cena com o mouse ---------------
sceneContainer.addEventListener("mousedown", () => {
    isDragging = false;
});

sceneContainer.addEventListener("mousemove", () => {
    isDragging = true;
});

sceneContainer.addEventListener("mouseup", () => {
    if (!isDragging) {
        pausar();
    }
});

sceneContainer.addEventListener("dblclick", () => {
    reset();
});

