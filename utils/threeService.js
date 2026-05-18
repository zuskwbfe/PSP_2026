// utils/threeService.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Маппинг услуг → 3D-моделей (по вашей теме!)
const SERVICE_MODEL_MAP = {
    "Доставка расходников": "models/delivery-box.glb",
    "Ремонт оборудования": "models/tool-kit.glb",
    "Установка кассы": "models/cash-register.glb",
    "default": "models/service-default.glb"
};

export class ServiceModelViewer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    init(serviceName) {
        // Настройка сцены
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe6ebf5);

        // Камера
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1, 1000
        );
        this.camera.position.set(0, 2, 5);

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Управление камерой
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 1, 0);

        // Свет
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(4, 10, 8);
        this.scene.add(dirLight);

        // Загрузка модели по названию услуги
        this.loadModelByService(serviceName);

        // Анимация
        this.animate();

        // Обработка ресайза
        window.addEventListener('resize', () => this.onResize());
    }

    loadModelByService(serviceName) {
        const modelPath = SERVICE_MODEL_MAP[serviceName] || SERVICE_MODEL_MAP.default;
        const loader = new GLTFLoader();

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                this.centerAndScaleModel(model);
                this.scene.add(model);
            },
            undefined,
            (error) => {
                console.warn(`⚠️ Не удалось загрузить модель ${modelPath}:`, error);
                this.showFallback();
            }
        );
    }

    centerAndScaleModel(model) {
        // Центрируем модель по основанию
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -box.min.y; // "Поставить на пол"

        // Масштабируем под сцену
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            const scale = 2.5 / maxDim;
            model.scale.multiplyScalar(scale);
        }
    }

    showFallback() {
        // Простая геометрия, если модель не загрузилась
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x005bff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.75;
        this.scene.add(cube);
    }

    onResize() {
        if (!this.canvas) return;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        window.removeEventListener('resize', () => this.onResize());
        this.renderer?.dispose();
    }
}
