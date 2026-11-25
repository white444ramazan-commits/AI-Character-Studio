const $ = (id) => document.getElementById(id);

const LABELS = {
  headWidth:'Ширина головы', headHeight:'Высота головы', headDepth:'Глубина головы', faceFat:'Полнота лица',
  headOval:'Овальная форма', headRound:'Круглая форма', headSquare:'Квадратная форма', headHeart:'Сердцевидная форма',
  foreheadHeight:'Высота лба', foreheadSlope:'Наклон лба', jaw:'Ширина челюсти', chinWidth:'Ширина подбородка',
  chinHeight:'Высота подбородка', chinProminence:'Выступ подбородка', chinCleft:'Ямочка на подбородке',
  cheekBones:'Выраженность скул', cheekVolume:'Объём щёк', eyeSize:'Размер глаз', eyeOpening:'Раскрытие глаз',
  eyeSpacing:'Расстояние между глазами', eyeHeight:'Положение глаз', eyeTilt:'Наклон глаз', eyeFold:'Складка века',
  eyeBags:'Область под глазами', browHeight:'Высота бровей', browAngle:'Наклон бровей', browDepth:'Глубина бровей',
  noseWidth:'Ширина носа', noseLength:'Длина носа', noseDepth:'Выступ носа', noseBridge:'Ширина переносицы',
  noseHump:'Горбинка носа', noseTip:'Положение кончика носа', noseTipWidth:'Ширина кончика носа',
  nostrils:'Ширина ноздрей', noseFlare:'Раскрытие ноздрей', mouthWidth:'Ширина рта', mouthHeight:'Положение рта',
  upperLip:'Объём верхней губы', lowerLip:'Объём нижней губы', cupidsBow:'Изгиб верхней губы',
  mouthCorners:'Уголки губ', mouthDepth:'Глубина рта', dimples:'Ямочки на щеках',
  earSize:'Размер ушей', earAngle:'Угол ушей', earLobe:'Мочки ушей', earPointed:'Заострённость ушей',
  neckWidth:'Ширина шеи', neckLength:'Длина шеи', shoulders:'Ширина плеч', chest:'Объём грудной клетки',
  waist:'Объём талии', hips:'Ширина бёдер', vShape:'V-образность торса', belly:'Объём живота',
  african:'Африканские черты', asian:'Азиатские черты', caucasian:'Европейские черты'
};

const SKIN_LABELS = { porcelain:'Фарфоровый', fair:'Светлый', light:'Светло-бежевый', beige:'Бежевый', warm:'Тёплый', olive:'Оливковый', tan:'Загорелый', caramel:'Карамельный', chestnut:'Каштановый', mocha:'Мокко', brown:'Коричневый', deep:'Тёмный', ebony:'Очень тёмный' };
const EYES = {
  brown:'Тёмно-карие', brownlight:'Карие', green:'Зелёные', blue:'Голубые',
  deepblue:'Тёмно-голубые', lightblue:'Светло-голубые', bluegreen:'Серо-зелёные', grey:'Серые', ice:'Ледяные'
};
const HAIR_NAMES = {
  long01:'Длинные прямые', ponytail01:'Высокий хвост', bob02:'Каре', bob01:'Уложенное каре',
  braid01:'Коса', afro01:'Афро', short01:'Короткие текстурные', short02:'Короткие взъерошенные',
  short03:'Короткая чёлка', short04:'Зачёс назад', toigo_blunt_bob:'Ровное каре',
  toigo_blunt_bob_with_bangs:'Каре с чёлкой', toigo_curled_under_bob:'Подкрученное каре',
  toigo_inverted_bob_with_bangs:'Обратное каре', cortu_straight_bangs:'Прямые с чёлкой',
  culturalibre_hair_01:'Длинные гладкие', sonntag78_junglebook_hair:'Слои до плеч',
  rehmanpolanski_hair_bun_brown:'Пучок', culturalibre_hair_02:'Короткий боковой пробор'
};
const OUTFIT_NAMES = {
  female_casualsuit01:'Футболка и брюки', female_casualsuit02:'Повседневные слои',
  female_elegantsuit01:'Элегантный комплект', female_sportsuit01:'Спортивный комплект',
  toigo_camisole_dress_with_full_skirt:'Платье на бретелях', toigo_halter_dress_knee_length:'Платье до колена',
  toigo_halter_dress_midi:'Платье миди', toigo_halter_dress_with_fluted_skirt:'Вечернее платье',
  toigo_shift_dress:'Платье прямого кроя', toigo_keyhole_neck_dress:'Платье с вырезом',
  toigo_dress_with_tiered_skirt:'Платье с ярусной юбкой', toigo_bodice_dress_with_lace_ruffle_skirt:'Платье с кружевом',
  toigo_strapless_ruffle_top_dress:'Платье без бретелей', toigo_cut_out_dress:'Платье с вырезами',
  toigo_female_suit:'Костюм с юбкой', toigo_female_suit_2:'Брючный костюм',
  'toigo_female_double-breasted_suit':'Двубортный костюм',
  abaya01:'Абая', jalabiya01:'Джалабия', dress_knee01:'Повседневное платье',
  dress_maxi01:'Длинное платье', gown01:'Вечернее платье'
};
const SHOE_NAMES = { shoes01:'Классические туфли', shoes02:'Повседневные', shoes03:'Спортивные', shoes04:'Ботинки', shoes05:'Обувь 5', shoes06:'Обувь 6' };
const HEADWEAR_NAMES = { hijab01:'Хиджаб', amira01:'Амира' };
const HAIR_COLORS = [
  ['#1a1412','Чёрный'], ['#3d2618','Тёмно-каштановый'], ['#6b4428','Каштановый'],
  ['#9a6a40','Светло-каштановый'], ['#8e3b1f','Рыжевато-каштановый'], ['#c0602c','Медный'],
  ['#b88c55','Тёмный блонд'], ['#e6c88a','Блонд'], ['#f2ead8','Платиновый'],
  ['#a8a39c','Седой'], ['#f4f2ee','Белый']
];

const FACE_PRESETS = {
  oval: { headOval:0.62, headRound:0, headSquare:0, headHeart:0, jaw:-0.12, cheekBones:0.06, faceFat:0.02 },
  round: { headOval:0, headRound:0.62, headSquare:0, headHeart:0, faceFat:0.25, cheekVolume:0.25, jaw:-0.18 },
  square: { headOval:0, headRound:0, headSquare:0.62, headHeart:0, jaw:0.34, chinWidth:0.18, cheekBones:0.12 },
  heart: { headOval:0, headRound:0, headSquare:0, headHeart:0.65, jaw:-0.26, chinWidth:-0.24, cheekBones:0.2 },
  diamond: { headOval:0.18, headRound:0, headSquare:0, headHeart:0.18, cheekBones:0.55, cheekVolume:-0.18, jaw:-0.3 },
  soft: { headOval:0.35, headRound:0.25, headSquare:0, headHeart:0, faceFat:0.34, cheekVolume:0.3, jaw:-0.25 },
  defined: { headOval:0, headRound:0, headSquare:0.25, headHeart:0, faceFat:-0.18, cheekBones:0.56, jaw:0.34 },
  petite: { headOval:0.42, headRound:0.1, headSquare:0, headHeart:0.12, headWidth:-0.22, headHeight:0.12, chinWidth:-0.2 }
};
const FACE_SHAPE_IDS = ['headOval','headRound','headSquare','headHeart'];
const BODY_GROUPS = [
  { label:'Шея, плечи и грудная клетка', ids:['neckWidth','neckLength','shoulders','chest','vShape'] },
  { label:'Живот и талия', ids:['belly','waist'] },
  { label:'Бёдра', ids:['hips'] }
];

function findControl(editor, sectionId, controlId) {
  const section = editor.sections.find((item) => item.id === sectionId);
  return section?.controls.find((item) => item.id === controlId) || null;
}
function addOption(select, value, label) {
  const option = document.createElement('option');
  option.value = value == null ? '' : String(value);
  option.textContent = label;
  select.appendChild(option);
}
function fillChoice(select, control, labels, emptyText) {
  if (!select || !control) return;
  select.innerHTML = '';
  for (const option of control.options) {
    if (option.id === null) {
      addOption(select, '', emptyText || 'Не выбрано');
    } else {
      addOption(select, option.id, labels?.[option.id] || option.label || option.id);
    }
  }
}
function makeSlider(control, currentConfig, applyConfig, sectionId) {
  const wrap = document.createElement('label');
  wrap.className = 'slider-row advanced-slider';
  const title = document.createElement('span');
  title.textContent = LABELS[control.id] || control.label;
  const output = document.createElement('output');
  output.value = Math.round(control.value(currentConfig) * 100);
  const input = document.createElement('input');
  input.type = 'range';
  input.min = control.min;
  input.max = control.max;
  input.step = control.step || 0.01;
  input.value = control.value(currentConfig);
  input.dataset.advancedSection = sectionId;
  input.dataset.advancedControl = control.id;
  input.addEventListener('input', () => { output.value = Math.round(Number(input.value) * 100); });
  input.addEventListener('change', () => {
    const latest = window.__characterStudio?.getConfig?.() || currentConfig;
    applyConfig(control.apply(latest, Number(input.value)), 'НАСТРОЙКА ПЕРСОНАЖА');
  });
  wrap.append(title, output, input);
  return wrap;
}

function initAdvancedUI({ editorModel, packageData, getConfig, applyConfig }) {
  const allControls = editorModel.sections;
  const faceRoot = $('faceAdvancedControls');
  const bodyRoot = $('bodyAdvancedControls');

  const faceGroupNames = {
    face:'Форма головы и лица', eyes:'Глаза', brows:'Брови', nose:'Нос', mouth:'Губы и рот', ears:'Уши'
  };
  for (const sectionId of ['face','eyes','brows','nose','mouth','ears']) {
    const section = allControls.find((item) => item.id === sectionId);
    if (!section) continue;
    const controls = section.controls.filter((item) => item.kind === 'slider');
    if (!controls.length) continue;
    const details = document.createElement('details');
    details.className = 'nested-editor-group';
    const summary = document.createElement('summary');
    summary.textContent = faceGroupNames[sectionId];
    const content = document.createElement('div');
    content.className = 'nested-editor-content';
    for (const control of controls) content.appendChild(makeSlider(control, getConfig(), applyConfig, sectionId));
    details.append(summary, content);
    faceRoot.appendChild(details);
  }

  const bodySection = allControls.find((item) => item.id === 'body');
  if (bodySection) {
    const bodyControls = new Map(bodySection.controls.filter((item) => item.kind === 'slider').map((item) => [item.id, item]));
    for (const group of BODY_GROUPS) {
      const available = group.ids.map((id) => bodyControls.get(id)).filter(Boolean);
      if (!available.length) continue;
      const details = document.createElement('details');
      details.className = 'nested-editor-group';
      const summary = document.createElement('summary');
      summary.textContent = group.label;
      const content = document.createElement('div');
      content.className = 'nested-editor-content';
      for (const control of available) content.appendChild(makeSlider(control, getConfig(), applyConfig, 'body'));
      details.append(summary, content);
      bodyRoot.appendChild(details);
    }
  }

  const faceSelect = $('faceShape');
  faceSelect.addEventListener('change', () => {
    const name = faceSelect.value;
    if (name === 'custom') return;
    const shape = FACE_PRESETS[name];
    if (!shape) return;
    const detail = Object.fromEntries(FACE_SHAPE_IDS.map((id) => [id, shape[id] || 0]));
    Object.assign(detail, shape);
    applyConfig({ detail }, 'ИЗМЕНЕНИЕ ФОРМЫ ЛИЦА');
  });

  const cup = $('cupSize');
  const cupOut = $('cupOut');
  cup.addEventListener('input', () => { cupOut.value = cup.value; });
  cup.addEventListener('change', () => applyConfig({ cupSize: Number(cup.value) / 100 }, 'ИЗМЕНЕНИЕ ПРОПОРЦИЙ'));
  const butt = $('buttocks');
  const buttOut = $('buttOut');
  butt.addEventListener('input', () => { buttOut.value = butt.value; });
  butt.addEventListener('change', () => applyConfig({ detail: { buttocks: Number(butt.value) / 100 } }, 'ИЗМЕНЕНИЕ ПРОПОРЦИЙ'));
  const prop = $('proportions');
  prop.addEventListener('input', () => { $('proportionsOut').value = prop.value; });
  prop.addEventListener('change', () => applyConfig({ proportions: Number(prop.value) / 100 }, 'ИЗМЕНЕНИЕ ПРОПОРЦИЙ'));

  const controls = {
    hair: findControl(editorModel, 'hair', 'style'),
    eyes: findControl(editorModel, 'eyes', 'color'),
    outfit: findControl(editorModel, 'outfit', 'style'),
    shoes: findControl(editorModel, 'shoes', 'style'),
    headwear: findControl(editorModel, 'headwear', 'style'),
    hat: findControl(editorModel, 'hat', 'style'),
    skin: findControl(editorModel, 'skin', 'tone')
  };

  fillChoice($('hairStyle'), controls.hair, HAIR_NAMES, 'Без причёски');
  fillChoice($('eyes'), controls.eyes, EYES);
  fillChoice($('outfit'), controls.outfit, OUTFIT_NAMES);
  fillChoice($('shoes'), controls.shoes, SHOE_NAMES, 'Без обуви');
  fillChoice($('headwear'), controls.headwear, HEADWEAR_NAMES, 'Без головного убора');
  fillChoice($('hat'), controls.hat, { fedora01:'Федора', fedora_cocked:'Федора набок' }, 'Без шляпы');

  const skinRoot = $('skinSwatches');
  skinRoot.innerHTML = '';
  for (const option of (controls.skin?.options || [])) {
    if (!option.id) continue;
    const button = document.createElement('button');
    button.className = 'skin-swatch';
    button.type = 'button';
    button.dataset.skin = option.id;
    button.style.setProperty('--swatch', option.swatch || '#bd9678');
    button.setAttribute('aria-label', option.label || option.id);
    button.title = SKIN_LABELS[option.id] || option.label || option.id;
    button.addEventListener('click', () => {
      const latest = getConfig();
      applyConfig(controls.skin.apply(latest, option.id), 'ИЗМЕНЕНИЕ ТОНА КОЖИ');
    });
    skinRoot.appendChild(button);
  }

  const hairColors = $('hairSwatches');
  hairColors.innerHTML = '';
  for (const [color, name] of HAIR_COLORS) {
    const button = document.createElement('button');
    button.className = 'color-swatch';
    button.type = 'button';
    button.dataset.color = color;
    button.style.setProperty('--swatch', color);
    button.title = name;
    button.setAttribute('aria-label', name);
    button.addEventListener('click', () => applyConfig({ hairColor: color }, 'ИЗМЕНЕНИЕ ЦВЕТА ВОЛОС'));
    hairColors.appendChild(button);
  }

  let savedWardrobe = null;
  let anatomyMode = false;
  const anatomyButton = $('baseOutfitBtn');
  const restoreButton = $('restoreWardrobeBtn');
  const syncWardrobeButtons = () => {
    anatomyButton.classList.toggle('active', anatomyMode);
    anatomyButton.setAttribute('aria-pressed', String(anatomyMode));
    anatomyButton.textContent = anatomyMode ? 'Анатомический слой включён' : 'Анатомический предпросмотр';
    restoreButton.disabled = !savedWardrobe;
  };

  const applySlot = (slot, value) => {
    const control = controls[slot];
    if (!control) return;
    const latest = getConfig();
    const next = control.apply(latest, value === '' ? null : value);
    if (anatomyMode && ['outfit','shoes','headwear','hat'].includes(slot)) anatomyMode = false;
    applyConfig(next, 'ИЗМЕНЕНИЕ ОДЕЖДЫ');
    syncWardrobeButtons();
  };
  // Capture phase prevents the original minimal demo handlers from replacing other worn items.
  for (const [id, slot] of [['hairStyle','hair'],['eyes','eyes'],['outfit','outfit'],['shoes','shoes'],['headwear','headwear'],['hat','hat']]) {
    const select = $(id);
    if (!select) continue;
    select.addEventListener('change', (event) => {
      event.stopImmediatePropagation();
      const value = select.value;
      applySlot(slot, value);
    }, true);
  }

  anatomyButton.addEventListener('click', async () => {
    if (anatomyMode) return;
    const current = getConfig();
    savedWardrobe = {
      clothes: [...(current.clothes || [])],
      garmentColors: current.garmentColors ? { ...current.garmentColors } : null
    };
    let base = controls.outfit.apply(current, 'female_sportsuit01');
    base = controls.shoes.apply(base, null);
    base = controls.headwear.apply(base, null);
    base = controls.hat.apply(base, null);
    anatomyMode = true;
    const patch = { clothes: base.clothes };
    if (base.garmentColors) patch.garmentColors = base.garmentColors;
    await applyConfig(patch, 'АНАТОМИЧЕСКИЙ ПРЕДПРОСМОТР');
    syncWardrobeButtons();
  });

  restoreButton.addEventListener('click', async () => {
    if (!savedWardrobe) return;
    const patch = { clothes: [...savedWardrobe.clothes] };
    if (savedWardrobe.garmentColors) patch.garmentColors = { ...savedWardrobe.garmentColors };
    anatomyMode = false;
    await applyConfig(patch, 'ВОЗВРАТ ПРЕЖНЕЙ ОДЕЖДЫ');
    savedWardrobe = null;
    syncWardrobeButtons();
  });

  $('removeAccessoriesBtn').addEventListener('click', () => {
    const accessories = new Set([
      ...editorModel.allowed.shoes, ...editorModel.allowed.headwear, ...editorModel.allowed.hat
    ]);
    const clothes = getConfig().clothes.filter((id) => !accessories.has(id));
    applyConfig({ clothes }, 'СНЯТИЕ АКСЕССУАРОВ');
  });
  syncWardrobeButtons();

  const refresh = (config = getConfig()) => {
    for (const input of document.querySelectorAll('[data-advanced-section][data-advanced-control]')) {
      const sectionId = input.dataset.advancedSection;
      const control = findControl(editorModel, sectionId, input.dataset.advancedControl);
      if (control) {
        input.value = control.value(config);
        const output = input.parentElement.querySelector('output');
        if (output) output.value = Math.round(Number(input.value) * 100);
      }
    }
    $('cupSize').value = Math.round((config.cupSize ?? 0.48) * 100);
    $('cupOut').value = $('cupSize').value;
    $('buttocks').value = Math.round((config.detail?.buttocks ?? 0) * 100);
    $('buttOut').value = $('buttocks').value;
    $('proportions').value = Math.round((config.proportions ?? 0.5) * 100);
    $('proportionsOut').value = $('proportions').value;
    const shapeName = Object.entries(FACE_PRESETS).find(([, shape]) =>
      Object.entries(shape).every(([id, value]) => Math.abs((config.detail?.[id] ?? 0) - value) < 0.035) &&
      FACE_SHAPE_IDS.every((id) => Math.abs((config.detail?.[id] ?? 0) - (shape[id] || 0)) < 0.035)
    )?.[0] || 'custom';
    faceSelect.value = shapeName;

    for (const button of skinRoot.querySelectorAll('button')) {
      button.classList.toggle('selected', button.dataset.skin === controls.skin?.value(config));
    }
    for (const button of hairColors.querySelectorAll('button')) {
      button.classList.toggle('selected', button.dataset.color.toLowerCase() === (config.hairColor || '').toLowerCase());
    }
    if (controls.hair) $('hairStyle').value = controls.hair.value(config) ?? '';
    if (controls.eyes) $('eyes').value = controls.eyes.value(config) ?? '';
    if (controls.outfit) $('outfit').value = controls.outfit.value(config) ?? '';
    if (controls.shoes) $('shoes').value = controls.shoes.value(config) ?? '';
    if (controls.headwear) $('headwear').value = controls.headwear.value(config) ?? '';
    if (controls.hat) $('hat').value = controls.hat.value(config) ?? '';
  };

  const publicApi = { refresh, setChoice: applySlot };
  window.addEventListener('character-studio-config-changed', (event) => refresh(event.detail?.config || getConfig()));
  refresh();
  return publicApi;
}

window.addEventListener('character-studio-ready', (event) => {
  try {
    window.__characterStudio = event.detail;
    window.__characterStudioUI = initAdvancedUI(event.detail);
  } catch (error) {
    console.error('Advanced customization controls could not start:', error);
  }
});