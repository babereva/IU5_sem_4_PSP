import { HeaderComponent } from "../../components/header/index.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class AnalyticsPage {
    constructor(parent, allProducts) {
        this.parent = parent;
        this.allProducts = allProducts;
    }

    // Задание 1.2 — подсчёт повторяющихся категорий
    countIdentic(arr) {
        const categoryCount = {};
        let index = 0;
        while (index < arr.length) {
            const category = arr[index].category;
            categoryCount[category] = (categoryCount[category] || 0) + 1;
            index++;
        }
        let duplicatesCount = 0;
        for (const category in categoryCount) {
            if (categoryCount[category] > 1) {
                duplicatesCount += categoryCount[category];
            }
        }
        return { duplicatesCount, categoryCount };
    }

    // Задание 1.8 — среднее арифметическое возраста
    calcAverageAge(products) {
        const ageNumbers = [];
        let index = 0;
        while (index < products.length) {
            const product = products[index];
            const ageNum = parseInt(product.age.replace('от ', ''));
            ageNumbers.push(ageNum);
            index++;
        }
        let sum = 0;
        for (const age of ageNumbers) {
            sum += age;
        }
        return (sum / ageNumbers.length).toFixed(1);
    }

    // Задание 2.3 — максимальная последовательность единиц (наличие на складе)
    maxStockSequence(stockSequence) {
        let maxLength = 0;
        let currentLength = 0;
        let index = 0;
        while (index < stockSequence.length) {
            if (stockSequence[index] === '1') {
                currentLength++;
                if (currentLength > maxLength) {
                    maxLength = currentLength;
                }
            } else {
                currentLength = 0;
            }
            index++;
        }
        return maxLength;
    }

    buildStockString() {
        return this.allProducts.map(p => p.inStock ? '1' : '0').join('');
    }

    getHTML() {
        const { duplicatesCount, categoryCount } = this.countIdentic(this.allProducts);
        const avgAge = this.calcAverageAge(this.allProducts);
        const stockString = this.buildStockString();
        const maxSeq = this.maxStockSequence(stockString);

        const categoryRows = Object.entries(categoryCount)
            .map(([cat, count]) => `
                <div class="analytics-row">
                    <span class="analytics-label">${cat}</span>
                    <span class="analytics-value">${count} шт.</span>
                </div>
            `).join('');

        const productRows = this.allProducts.map(p => `
            <span class="stock-badge ${p.inStock ? 'stock-yes' : 'stock-no'}"
                  title="${p.title}">
                ${p.inStock ? '1' : '0'}
            </span>
        `).join('');

        return `
            <div id="analytics-page">
                <section class="analytics-section">
                    <div class="container">
                        <h2 class="section-title">Аналитика продуктов</h2>

                        <!-- Задание 1.2 -->
                        <div class="analytics-card">
                            <div class="analytics-card-header">
                                <span class="analytics-badge">Задание 1.2</span>
                                <h3 class="analytics-card-title">Повторяющиеся категории</h3>
                            </div>
                            <p class="analytics-desc">
                                Подсчитываем сколько продуктов в каждой категории.
                                Продуктов с повторяющимися категориями: <strong>${duplicatesCount}</strong>
                            </p>
                            <div class="analytics-rows">
                                ${categoryRows}
                            </div>
                        </div>

                        <!-- Задание 1.8 -->
                        <div class="analytics-card">
                            <div class="analytics-card-header">
                                <span class="analytics-badge">Задание 1.8</span>
                                <h3 class="analytics-card-title">Средний рекомендуемый возраст</h3>
                            </div>
                            <p class="analytics-desc">
                                Считаем среднее арифметическое по возрасту (в месяцах) всех продуктов в каталоге.
                            </p>
                            <div class="analytics-result-big">
                                ${avgAge} <span class="analytics-unit">мес.</span>
                            </div>
                        </div>

                        <!-- Задание 2.3 -->
                        <div class="analytics-card">
                            <div class="analytics-card-header">
                                <span class="analytics-badge">Задание 2.3</span>
                                <h3 class="analytics-card-title">Наличие на складе</h3>
                            </div>
                            <p class="analytics-desc">
                                Каждый продукт — это 1 (есть на складе) или 0 (нет). Находим самую длинную непрерывную серию продуктов в наличии.
                            </p>
                            <div class="stock-sequence">
                                ${productRows}
                            </div>
                            <p class="analytics-sequence-str">Последовательность: <code>${stockString}</code></p>
                            <div class="analytics-result-big">
                                ${maxSeq} <span class="analytics-unit">подряд</span>
                            </div>
                        </div>

                        <!-- 3D Модель -->
                        <div class="analytics-card analytics-3d-card">
                            <div class="analytics-card-header">
                                <span class="analytics-badge">3D Модель</span>
                                <h3 class="analytics-card-title">Молочный персонаж</h3>
                            </div>
                            <p class="analytics-desc">
                                Интерактивная 3D-модель персонажа бренда. Вращайте мышью, масштабируйте колёсиком.
                            </p>
                            <div class="model-viewer-wrap">
                                <canvas id="analytics-3d-canvas"></canvas>
                            </div>
                        </div>

                    </div>
                </section>
                <footer class="footer">
                    <div class="container footer-inner">
                        <a href="#">
                            <img src="https://mir-tema.ru/header-logo.webp" alt="Тёма" class="footer-logo">
                        </a>
                        <p class="footer-copy">2026 Лабораторная работа. Молочная кухня.</p>
                    </div>
                </footer>
            </div>
        `;
    }

    init3DViewer() {
        const canvas = document.getElementById('analytics-3d-canvas');
        if (!canvas) return;

        const wrap = canvas.parentElement;
        const width = wrap.clientWidth || 600;
        const height = 420;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f4f8);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
        camera.position.set(0, 1.2, 3);

        const ambient = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 2);
        dir.position.set(3, 5, 3);
        scene.add(dir);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;
        controls.minDistance = 0.5;
        controls.maxDistance = 10;

        const loader = new GLTFLoader();
        loader.load(
            'models/milk-character.glb',
            (gltf) => {
                const model = gltf.scene;

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                model.scale.setScalar(scale);
                model.position.sub(center.multiplyScalar(scale));

                scene.add(model);

                // Подгоняем камеру: смотрим на верхнюю треть модели (торс персонажа)
                const targetY = size.y * scale * 0.15;
                controls.target.set(0, targetY, 0);
                camera.position.set(0, targetY, maxDim * scale * 2.0);
                controls.update();
            },
            undefined,
            (err) => console.error('Ошибка загрузки GLB:', err)
        );

        const onResize = () => {
            const w = wrap.clientWidth;
            renderer.setSize(w, height);
            camera.aspect = w / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        this._cleanup3D = () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        };
    }

    render(onHome, onAnalytics) {
        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent, {
            onHome,
            onAnalytics,
        });
        header.render();

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.init3DViewer();
    }
}
