import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HumanAvatar, loadHumanPackage, createHumanEditor } from 'humanforge/human';

const ASSET_ROOT = 'https://cdn.jsdelivr.net/gh/abdulrehman043/humanforge@2226df1f50a04c5a8e1c02ea33780d28337dfbb1/assets/human';
const $ = (id) => document.getElementById(id);
const stage = $('stage');
const loading = $('loading');
const loadingText = $('loadingText');
const renderStatus = $('renderStatus');

let avatar = null;
let packageData = null;
let editorModel = null;
let currentConfig = null;
let shots = 0;
let busy = false;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.setSize(stage.clientWidth || 800, stage.clientHeight || 600);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#211b24');
const camera = new THREE.PerspectiveCamera(29, Math.max(1, stage.clientWidth) / Math.max(1, stage.clientHeight), 0.05, 80);
camera.position.set(2.25, 1.48, 3.05);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.91, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 1.65;
controls.maxDistance = 5.2;
controls.minPolarAngle = 0.18;
controls.maxPolarAngle = Math.PI * 0.49;

const hemi = new THREE.HemisphereLight(0xffeee3, 0x352b39, 1.75);
scene.add(hemi);
const keyLight = new THREE.DirectionalLight(0xffe4d2, 3.1);
keyLight.position.set(-2.8, 4.8, 3.2);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 14;
keyLight.shadow.camera.left = -2.5;
keyLight.shadow.camera.right = 2.5;
keyLight.shadow.camera.top = 3;
keyLight.shadow.camera.bottom = -2;
keyLight.shadow.bias = -0.00012;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffc6d3, 1.25);
fillLight.position.set(3.2, 2.7, 2.6);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xb5c8ff, 2.25);
rimLight.position.set(0.4, 3.5, -3.5);
scene.add(rimLight);
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(3.7, 96),
  new THREE.MeshStandardMaterial({ color: 0x403542, roughness: 0.92, metalness: 0.02 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.012;
floor.receiveShadow = true;
scene.add(floor);

let environmentTarget = null;
try {
  const pmrem = new THREE.PMREMGenerator(renderer);
  environmentTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = environmentTarget.texture;
  pmrem.dispose();
} catch (error) {
  console.warn('Studio environment unavailable; using direct lighting.', error);
}

const DEFAULT_CONFIG = {
  gender: 0,
  age: (30 - 18) / 72,
  muscle: 0.36,
  weight: 0.52,
  height: 0.50,
  proportions: 0.50,
  cupSize: 0.48,
  firmness: 0.56,
  african: 0,
  asian: 0,
  caucasian: 1,
  detail: {},
  skin: 'young_caucasian_female',
  skinTint: '#ffffff',
  eyes: 'brownlight',
  eyebrows: 'eyebrow002',
  eyebrowColor: '#38251c',
  eyelashes: 'eyelashes02',
  hair: 'ponytail01',
  hairColor: '#38251c',
  clothes: ['female_sportsuit01', 'shoes02']
};

const PRESETS = {
  reference: {
    hair: 'ponytail01', hairColor: '#38251c',
    clothes: ['female_sportsuit01', 'shoes02'],
    weight: 0.52, height: 0.50, muscle: 0.36, age: (30 - 18) / 72
  },
  sport: {
    hair: 'ponytail01', hairColor: '#211b22',
    clothes: ['female_sportsuit01', 'shoes03'],
    weight: 0.48, height: 0.53, muscle: 0.48, age: (27 - 18) / 72
  },
  casual: {
    hair: 'long01', hairColor: '#6b4428',
    clothes: ['female_casualsuit02', 'shoes02'],
    weight: 0.54, height: 0.49, muscle: 0.32, age: (29 - 18) / 72
  },
  elegant: {
    hair: 'rehmanpolanski_hair_bun_brown', hairColor: '#3b261c',
    clothes: ['female_elegantsuit01', 'shoes04'],
    weight: 0.50, height: 0.51, muscle: 0.34, age: (32 - 18) / 72
  }
};

function setLoading(message, visible = true) {
  loadingText.textContent = message;
  loading.classList.toggle('hidden', !visible);
}

function mergeConfig(base, patch) {
  return { ...base, ...patch, detail: { ...(base.detail || {}), ...(patch.detail || {}) } };
}

async function applyConfig(patch, statusText = 'ОБНОВЛЕНИЕ МОДЕЛИ') {
  if (!avatar || busy) return;
  busy = true;
  renderStatus.textContent = statusText;
  try {
    currentConfig = mergeConfig(currentConfig, patch);
    await avatar.setConfig(patch);
    updateControlsFromConfig();
    renderStatus.textContent = 'МОДЕЛЬ ГОТОВА';
  } catch (error) {
    console.error('Avatar update failed:', error);
    renderStatus.textContent = 'ОШИБКА ОБНОВЛЕНИЯ';
  } finally {
    busy = false;
  }
}

function updateControlsFromConfig() {
  if (!currentConfig) return;
  $('age').value = Math.round(18 + currentConfig.age * 72);
  $('ageOut').value = $('age').value;
  $('build').value = Math.round(currentConfig.weight * 100);
  $('buildOut').value = $('build').value;
  $('height').value = Math.round(currentConfig.height * 100);
  $('heightOut').value = $('height').value;
  $('muscle').value = Math.round(currentConfig.muscle * 100);
  $('muscleOut').value = $('muscle').value;
  $('hairStyle').value = currentConfig.hair || 'ponytail01';
  $('eyes').value = currentConfig.eyes || 'brownlight';
  const outfit = currentConfig.clothes.find((id) => id.startsWith('female_')) || 'female_sportsuit01';
  $('outfit').value = outfit;
  const shoe = currentConfig.clothes.find((id) => id.startsWith('shoes')) || 'shoes02';
  $('shoes').value = shoe;
  document.querySelectorAll('#skinSwatches button').forEach((b) => b.classList.toggle('selected', b.dataset.skin === currentConfig.skin));
  document.querySelectorAll('#hairSwatches button').forEach((b) => b.classList.toggle('selected', b.dataset.color.toLowerCase() === (currentConfig.hairColor || '').toLowerCase()));
}

function syncBodyControls() {
  return {
    age: (+$('age').value - 18) / 72,
    weight: +$('build').value / 100,
    height: +$('height').value / 100,
    muscle: +$('muscle').value / 100
  };
}

function initControls() {
  for (const [id, out] of [['age','ageOut'], ['build','buildOut'], ['height','heightOut'], ['muscle','muscleOut'], ['light','lightOut']]) {
    $(id).addEventListener('input', () => { $(out).value = $(id).value; });
  }
  for (const id of ['age', 'build', 'height', 'muscle']) {
    $(id).addEventListener('change', () => applyConfig(syncBodyControls()));
  }
  $('hairStyle').addEventListener('change', (e) => applyConfig({ hair: e.target.value }));
  $('eyes').addEventListener('change', (e) => applyConfig({ eyes: e.target.value }));
  $('outfit').addEventListener('change', (e) => applyConfig({ clothes: [e.target.value, $('shoes').value] }));
  $('shoes').addEventListener('change', (e) => applyConfig({ clothes: [$('outfit').value, e.target.value] }));
  $('skinSwatches').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('#skinSwatches button').forEach((x) => x.classList.remove('selected'));
    b.classList.add('selected');
    applyConfig({ skin: b.dataset.skin });
  }));
  $('hairSwatches').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('#hairSwatches button').forEach((x) => x.classList.remove('selected'));
    b.classList.add('selected');
    applyConfig({ hairColor: b.dataset.color });
  }));
  $('preset').addEventListener('change', async (e) => {
    const preset = PRESETS[e.target.value] || PRESETS.reference;
    await applyConfig(preset, 'ЗАГРУЗКА ОБРАЗА');
  });
  $('light').addEventListener('input', (e) => {
    const value = +e.target.value / 75;
    keyLight.intensity = 3.1 * value;
    fillLight.intensity = 1.25 * value;
    rimLight.intensity = 2.25 * value;
  });
  $('background').addEventListener('change', (e) => {
    const settings = {
      studio: ['#211b24', 0x403542],
      warm: ['#30201f', 0x4b3730],
      night: ['#111927', 0x283343],
      neutral: ['#27292a', 0x3b3d3d]
    };
    const [color, floorColor] = settings[e.target.value] || settings.studio;
    scene.background = new THREE.Color(color);
    floor.material.color.setHex(floorColor);
    $('viewport').style.background = 'radial-gradient(ellipse at 50% 36%, ' + color + ' 0%, #17131c 100%)';
  });
  $('quality').addEventListener('change', async (e) => {
    if (!avatar) return;
    avatar.textureSize = e.target.value;
    setLoading('Перезагружаем текстуры выбранного качества…');
    try {
      await avatar.reloadTextures();
      setLoading('', false);
      renderStatus.textContent = 'ТЕКСТУРЫ ОБНОВЛЕНЫ';
    } catch (error) {
      console.error(error);
      setLoading('Не удалось сменить качество текстур.', false);
    }
  });
  $('randomBtn').addEventListener('click', async () => {
    if (!editorModel || !avatar || busy) return;
    const config = editorModel.randomize();
    $('preset').value = 'reference';
    await applyConfig(config, 'СОЗДАНИЕ НОВОГО ОБРАЗА');
  });
  $('resetBtn').addEventListener('click', async () => {
    $('preset').value = 'reference';
    await applyConfig(DEFAULT_CONFIG, 'ВОЗВРАТ К ИСХОДНОМУ ОБРАЗУ');
  });
  $('resetView').addEventListener('click', resetCamera);
  $('fullscreen').addEventListener('click', () => {
    const element = $('viewport');
    if (!document.fullscreenElement && element.requestFullscreen) element.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  });
  $('captureBtn').addEventListener('click', captureSnapshot);
  $('saveBtn').addEventListener('click', captureSnapshot);
}

function resetCamera() {
  camera.position.set(2.25, 1.48, 3.05);
  controls.target.set(0, 0.91, 0);
  controls.update();
}

function captureSnapshot() {
  if (!avatar) return;
  renderer.render(scene, camera);
  const data = renderer.domElement.toDataURL('image/png');
  shots += 1;
  const gallery = $('galleryGrid');
  gallery.querySelector('.empty-gallery')?.remove();
  const wrap = document.createElement('div');
  wrap.className = 'thumb';
  const img = document.createElement('img');
  img.src = data;
  img.alt = 'Снимок персонажа ' + shots;
  const label = document.createElement('span');
  label.textContent = 'Снимок ' + shots;
  wrap.append(img, label);
  gallery.prepend(wrap);
  $('galleryCount').textContent = shots + (shots === 1 ? ' изображение' : ' изображений');
  const link = document.createElement('a');
  link.href = data;
  link.download = 'character-studio-' + shots + '.png';
  link.click();
}

function resize() {
  const width = stage.clientWidth, height = stage.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

async function start() {
  try {
    setLoading('Скачиваем базовую сетку, скелет и карты кожи…');
    renderStatus.textContent = 'ЗАГРУЗКА МОДЕЛИ';
    packageData = await loadHumanPackage(ASSET_ROOT);
    editorModel = createHumanEditor(packageData, { gender: 'female', detailRange: 0.65 });
    avatar = new HumanAvatar(packageData);
    avatar.textureSize = '2k';
    avatar.anisotropy = 4;
    avatar.normalMaps = true;
    avatar.group.position.y = 0;
    scene.add(avatar.group);
    setLoading('Накладываем кожу, глаза, волосы и одежду…');
    currentConfig = { ...DEFAULT_CONFIG, detail: {} };
    await avatar.setConfig(currentConfig);
    avatar.group.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material && !Array.isArray(object.material)) {
          object.material.shadowSide = THREE.FrontSide;
          if (object.material.roughness !== undefined && object.name !== 'body') {
            object.material.roughness = Math.max(0.42, object.material.roughness);
          }
        }
      }
    });
    updateControlsFromConfig();
    controls.target.set(0, 0.91, 0);
    controls.update();
    setLoading('', false);
    renderStatus.textContent = 'МОДЕЛЬ ГОТОВА · PBR';
  } catch (error) {
    console.error('Could not load HumanForge model:', error);
    setLoading('Не удалось загрузить модель. Проверь интернет и повторно открой приложение.');
    loadingText.textContent = error && error.message ? error.message : 'Ошибка загрузки 3D-ресурсов';
    renderStatus.textContent = 'ОШИБКА ЗАГРУЗКИ';
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
new ResizeObserver(resize).observe(stage);
window.addEventListener('orientationchange', () => setTimeout(resize, 180));
window.addEventListener('resize', resize);
initControls();
animate();
start();
