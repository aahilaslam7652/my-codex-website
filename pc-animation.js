const container = document.getElementById('canvas-container');
const width = container.clientWidth;
const height = container.clientHeight;

// 1. Initialize the 3D Engine
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 2. Set Up Clean Studio Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

let pcModel = null;
const partsArray = [];
const loader = new THREE.GLTFLoader();

// 3. Load Your Local 28MB PC Model
loader.load('pc-model.glb', (gltf) => {
    pcModel = gltf.scene;
    scene.add(pcModel);

    // Adjust position to center your specific gaming rig model
    pcModel.position.set(0, -0.5, 0); 
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0, 0);

    // Scan the model meshes and save their starting coordinates
    pcModel.traverse((child) => {
        if (child.isMesh) {
            child.userData.initialPosition = child.position.clone();
            partsArray.push(child);
        }
    });
}, undefined, (err) => console.error("Error loading model:", err));

// 4. Track Your Website's Scroll Depth
let scrollFactor = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    // The explosion finishes moving over the first 500px of scrolling down the page
    scrollFactor = Math.min(scrollTop / 500, 1); 
});

// 5. Active Animation Render Loop
function animate() {
    requestAnimationFrame(animate);

    if (pcModel) {
        // Slow horizontal rotational sweep to show off depth
        pcModel.rotation.y += 0.003; 

        // Scatter parts outward along their axes as the user scrolls
        partsArray.forEach((part, index) => {
            const initial = part.userData.initialPosition;
            const push = scrollFactor * 1.5; // Controls maximum explosion separation distance

            if (index % 3 === 0) part.position.x = initial.x + push;
            else if (index % 3 === 1) part.position.y = initial.y + push;
            else part.position.z = initial.z + push;
        });
    }
    renderer.render(scene, camera);
}
animate();

// Handle browser window resizing automatically
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});
