const options = {
    targetSelector: '#scene',
    width: 850, height: 550,
    backgroundColor: 0x4169E1,
}

const renderer = new THREE.WebGL1Renderer();

renderer.setSize(
    options.width, options.height
);

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

/*-------- Coordenadas ---------*/
scene.add( new THREE.AxesHelper() );


/* const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xe0e0e0 )
scene.fog = new THREE.Fog( 0xe0e0e0, 20, 20 ) */


/*------ Controls -------*/
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.1
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 40;

/*-------- Resize ---------*/
function resize()
{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
}

window.addEventListener('resize', resize)