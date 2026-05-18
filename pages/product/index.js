
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { RequestDetailComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

class ServiceModelViewer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    // Маппинг услуг → модели
    static MODEL_PATHS = {
        "Доставка расходников": "models/delivery-box.glb",
        "Ремонт оборудования": "models/tool-kit.glb",
        "Установка кассы": "models/cash-register.glb",
        "default": "models/service-default.glb"
    };

    init(serviceName) {
        // Сцена
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe6ebf5);

        // Камера
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

        // Управление
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 1, 0);

        // Свет
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(3, 5, 3);
        this.scene.add(light);

        // Загрузка модели (колбэк-стиль, как в app.js)
        this.loadModel(serviceName);

        // Анимация
        this.animate();

        // Resize
        window.addEventListener('resize', () => this.onResize());
    }

    loadModel(serviceName) {
        const path = ServiceModelViewer.MODEL_PATHS[serviceName]
                  || ServiceModelViewer.MODEL_PATHS.default;

        const loader = new GLTFLoader();

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                this.fitModelToView(model);
                this.scene.add(model);
                console.log('✅ Модель загружена:', path);
            },
            undefined,
            (error) => {
                console.warn('⚠️ Ошибка загрузки модели:', path, error);
                this.showFallback();
            }
        );
    }

    fitModelToView(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -box.min.y;

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            model.scale.multiplyScalar(2.5 / maxDim);
        }
    }

    showFallback() {
        // Простая заглушка
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x005bff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.75;
        this.scene.add(cube);
    }

    onResize() {
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

    // Управление камерой
    setView(direction) {
        if (!this.camera || !this.controls) return;
        const dist = this.camera.position.distanceTo(this.controls.target);
        const h = 2;

        switch(direction) {
            case 'front': this.camera.position.set(0, h, dist); break;
            case 'back':  this.camera.position.set(0, h, -dist); break;
            case 'left':  this.camera.position.set(-dist, h, 0); break;
            case 'right': this.camera.position.set(dist, h, 0); break;
        }
        this.controls.target.set(0, 1, 0);
        this.controls.update();
    }

    zoomIn()  { this.camera.position.z -= 0.5; this.controls.update(); }
    zoomOut() { this.camera.position.z += 0.5; this.controls.update(); }

    dispose() {
        window.removeEventListener('resize', () => this.onResize());
        this.renderer?.dispose();
    }
}

export class RequestPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.modelViewer = null;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div id="product-page" class="container mt-4">
                <div class="mb-3" id="back-button-container"></div>
                <div id="product-content"></div>

                <!-- 🔹 Блок 3D-модели -->
                <div class="mt-4 p-3 bg-white rounded shadow-sm">
                    <h5 class="mb-3">🔧 3D-визуализация услуги</h5>
                    <canvas id="service-model-canvas"
                            style="width:100%; height:400px; background:#e6ebf5; border-radius:8px;">
                    </canvas>
                    <div class="mt-2 d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-primary" id="zoom-in">+</button>
                        <button class="btn btn-sm btn-outline-primary" id="zoom-out">−</button>
                        <button class="btn btn-sm btn-outline-secondary" id="view-front">Спереди</button>
                        <button class="btn btn-sm btn-outline-secondary" id="view-back">Сзади</button>
                    </div>
                    <div class="text-center text-muted small mt-1">
                        💡 Вращайте модель мышью
                    </div>
                </div>
            </div>
        `;
    }

    getData() {
        const requests = [
            {
                id: 1,
                src: "https://placehold.co/300x200?text=Доставка",
                client: "Кофейня «Уголок»",
                service: "Доставка расходников",
                manager: "Смирнова О.А.",
                executor: "Петров И.В.",
                courier: "Кузнецов С.С.",
                status: "Новая",
                desc: "Привезти молоко, сиропы и стаканы до 12:00.",
                account_number: "ACC-2024-001"
            },
            {
                id: 2,
                src: "https://placehold.co/300x200?text=Ремонт",
                client: "Салон «Локон»",
                service: "Ремонт оборудования",
                manager: "Иванова М.П.",
                executor: "Сидоров А.А.",
                courier: "—",
                status: "В работе",
                desc: "Диагностика и ремонт оборудования.",
                account_number: "ACC-2024-002"
            },
            {
                id: 3,
                src: "https://placehold.co/300x200?text=Установка",
                client: "Магазин «Цветы»",
                service: "Установка кассы",
                manager: "Козлова Е.В.",
                executor: "Морозов Д.К.",
                courier: "Лебедев П.Р.",
                status: "Завершена",
                desc: "Подключение онлайн-кассы.",
                account_number: "ACC-2024-003"
            }
        ];
        return requests.find(r => r.id == this.id);
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    setupControls() {
        document.getElementById('zoom-in')?.addEventListener('click', () =>
            this.modelViewer?.zoomIn());
        document.getElementById('zoom-out')?.addEventListener('click', () =>
            this.modelViewer?.zoomOut());
        document.getElementById('view-front')?.addEventListener('click', () =>
            this.modelViewer?.setView('front'));
        document.getElementById('view-back')?.addEventListener('click', () =>
            this.modelViewer?.setView('back'));
    }

    // 🔹 Render в стиле вашего шаблона (без async/await)
    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        // Кнопка "Назад"
        const backButton = new BackButtonComponent(
            document.getElementById('back-button-container')
        );
        backButton.render(this.clickBack.bind(this));

        // Данные заявки
        const data = this.getData();
        if (!data) {
            document.getElementById('product-content').innerHTML =
                '<div class="alert alert-warning">Заявка не найдена</div>';
            return;
        }

        // Детали заявки
        const detail = new RequestDetailComponent(
            document.getElementById('product-content')
        );
        detail.render(data);

        // 🔹 Инициализация 3D (синхронный вызов, загрузка внутри — через колбэки)
        const canvas = document.getElementById('service-model-canvas');
        if (canvas && data?.service) {
            this.modelViewer = new ServiceModelViewer(canvas);
            this.modelViewer.init(data.service); // Без await, как в app.js
            this.setupControls();
            console.log('3D-модель инициализирована для:', data.service);
        }
    }

    destroy() {
        this.modelViewer?.dispose();
    }
}
