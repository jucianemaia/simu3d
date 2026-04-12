const visualConfig = {
    fatorEscala: 50e9,
    grid: {
        size: 200,
        divisions: 200,
        color1: 0x334155,
        color2: 0x1e293b
    },
    corpo1: {
        raio: 0.38,
        color: 0xffcc33,
        emissive: 0xffaa00
    },
    corpo2: {
        raio: 0.15,
        color: 0x87cefa
    },
    corpo3: {
        raio: 0.15,
        color: 0xFFE4E1
    },
    glow: {
        raio: 0.5,
        color: 0xffcc66,
        opacity: 0.18
    }
};

const fator = visualConfig.fatorEscala;

const gridHelper = new THREE.GridHelper(
    visualConfig.grid.size,
    visualConfig.grid.divisions,
    visualConfig.grid.color1,
    visualConfig.grid.color2
);
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

const geometryBody1 = new THREE.SphereGeometry(
    visualConfig.corpo1.raio, 32, 32
);
const materialBody1 = new THREE.MeshStandardMaterial({
    color: 0xffcc33,
    emissive: 0xffaa00,
    emissiveIntensity: 1.2,
    roughness: 0.4,
    metalness: 0.0
});

const geometryBody2 = new THREE.SphereGeometry(0.15, 25, 12);
const materialBody2 = new THREE.MeshStandardMaterial({
    color: 0xFFE4E1,
    roughness: 0.6,
    metalness: 0.0
});

const geometryBody3 = new THREE.SphereGeometry(0.15, 25, 12);
const materialBody3 = new THREE.MeshStandardMaterial({
    color: 0x87cefa,
    roughness: 0.5,
    metalness: 0.1
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

const body3 = new THREE.Mesh(geometryBody3, materialBody3);
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


const maxPoints = 20000;

// ---------- trilha corpo 1 ----------
let trailIndex1 = 0;
let positions1 = new Float32Array(maxPoints * 3);

const geometryTrail1 = new THREE.BufferGeometry();
geometryTrail1.setAttribute(
    'position',
    new THREE.BufferAttribute(positions1, 3)
);
geometryTrail1.setDrawRange(0, 0);

const materialTrail1 = new THREE.LineBasicMaterial({
    color: 0xffcc66
});

const trail1 = new THREE.Line(geometryTrail1, materialTrail1);
scene.add(trail1);

// ---------- trilha corpo 2 ----------
let trailIndex2 = 0;
let positions2 = new Float32Array(maxPoints * 3);

const geometryTrail2 = new THREE.BufferGeometry();
geometryTrail2.setAttribute(
    'position',
    new THREE.BufferAttribute(positions2, 3)
);
geometryTrail2.setDrawRange(0, 0);

const materialTrail2 = new THREE.LineBasicMaterial({
    color: 0xffffff
});

const trail2 = new THREE.Line(geometryTrail2, materialTrail2);
scene.add(trail2);

// ---------- trilha corpo 3 ----------
let trailIndex3 = 0;
let positions3 = new Float32Array(maxPoints * 3);

const geometryTrail3 = new THREE.BufferGeometry();
geometryTrail3.setAttribute(
    'position',
    new THREE.BufferAttribute(positions3, 3)
);
geometryTrail3.setDrawRange(0, 0);

const materialTrail3 = new THREE.LineBasicMaterial({
    color: 0x4de3db
});

const trail3 = new THREE.Line(geometryTrail3, materialTrail3);
scene.add(trail3);

// controla a frequência de gravação dos pontos
let frameCount = 0;
const trailStep = 3;



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
    
    // ----------- trajetória ---------------
    frameCount++;

    if (frameCount % trailStep === 0) {
        if (trailIndex1 < maxPoints) {
            positions1[trailIndex1 * 3] = x1 / fator;
            positions1[trailIndex1 * 3 + 1] = y1 / fator;
            positions1[trailIndex1 * 3 + 2] = z1 / fator;

            trailIndex1++;
            geometryTrail1.setDrawRange(0, trailIndex1);
            geometryTrail1.attributes.position.needsUpdate = true;
        }

        if (trailIndex2 < maxPoints) {
            positions2[trailIndex2 * 3] = x2 / fator;
            positions2[trailIndex2 * 3 + 1] = y2 / fator;
            positions2[trailIndex2 * 3 + 2] = z2 / fator;

            trailIndex2++;
            geometryTrail2.setDrawRange(0, trailIndex2);
            geometryTrail2.attributes.position.needsUpdate = true;
        }

        if (trailIndex3 < maxPoints) {
            positions3[trailIndex3 * 3] = x3 / fator;
            positions3[trailIndex3 * 3 + 1] = y3 / fator;
            positions3[trailIndex3 * 3 + 2] = z3 / fator;

            trailIndex3++;
            geometryTrail3.setDrawRange(0, trailIndex3);
            geometryTrail3.attributes.position.needsUpdate = true;
        }
    }
    // ---------------------------------------------

    renderer.render(scene, camera);
    controls.update();
    sunGlow.position.copy(body1.position)

    body1.visible = m1 !== 0;
    body2.visible = m2 !== 0;
    body3.visible = m3 !== 0;

    trail1.visible = m2 !== 0;
    trail2.visible = m3 !== 0;
});

let isDragging = false;

const sceneContainer = document.getElementById("scene");


// ----------- botoes ---------------
document.getElementById("start").addEventListener("click", () => {
    pausar();
});

document.getElementById("reset").addEventListener("click", () => {
    reset();
});

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

function limparTrilhas() {
    trailIndex1 = 0;
    trailIndex2 = 0;
    trailIndex3 = 0;
    frameCount = 0;

    positions1.fill(0);
    positions2.fill(0);
    positions3.fill(0);

    geometryTrail1.setDrawRange(0, 0);
    geometryTrail2.setDrawRange(0, 0);
    geometryTrail3.setDrawRange(0, 0);

    geometryTrail1.attributes.position.needsUpdate = true;
    geometryTrail2.attributes.position.needsUpdate = true;
    geometryTrail3.attributes.position.needsUpdate = true;
}

body1.visible = m1 !== 0;
body2.visible = m2 !== 0;
body3.visible = m3 !== 0;

trail1.visible = m1 !== 0;
trail2.visible = m2 !== 0;
trail3.visible = m3 !== 0;