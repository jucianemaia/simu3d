const options = {
    targetSelector: '#scene',
    width: 850, height: 550,
    backgroundColor: 0x4169E1,
}

const renderer = new THREE.WebGL1Renderer();

document.querySelector(
    options.targetSelector
).appendChild(renderer.domElement);


/*-------- Cena Principal ---------*/
const scene = new THREE.Scene();
scene.backgroundColor = new THREE.Color(
    options.backgroundColor,
);

const loaderSolTerra = new THREE.TextureLoader();
loaderSolTerra.load("./images/universe-8k.jpg", function (texture) {
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    scene.background = texture;
});

/*-------- Camera Principal ---------*/
const camera = new THREE.PerspectiveCamera(
    50, options.width / options.height,
);

camera.position.set(0, -4, 6);
camera.lookAt(0, 0, 0);

resize();

/*-------- Coordenadas ---------*/
scene.add( new THREE.AxesHelper() );


/*------ Controls -------*/
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.panSpeed = 0.8;
controls.screenSpacePanning = true;
controls.autoRotate = false;
controls.minDistance = 2;
controls.maxDistance = 60;

/*-------- Resize ---------*/
function resize() {
    const container = document.querySelector('#scene');
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener('resize', resize)