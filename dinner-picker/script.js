/* ============================================
   今晚吃什么 · 抽选逻辑
   level: easy=半小时内 / medium=半小时以上 / hard=需特殊食材或复杂工序
   ============================================ */

'use strict';

/* ---------- 菜品数据库（可自由增删） ---------- */
const DISHES = [
  // 🥢 中餐
  { name: '番茄炒蛋', emoji: '🍅', category: 'chinese', level: 'easy', tags: ['家常', '快手'] },
  { name: '宫保鸡丁', emoji: '🍗', category: 'chinese', level: 'medium', tags: ['经典', '下饭'] },
  { name: '麻婆豆腐', emoji: '🌶️', category: 'chinese', level: 'easy', tags: ['川菜', '下饭'] },
  { name: '红烧肉', emoji: '🥘', category: 'chinese', level: 'hard', tags: ['硬菜', '解馋'] },
  { name: '鱼香肉丝', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['川菜', '经典'] },
  { name: '水饺', emoji: '🥟', category: 'chinese', level: 'easy', tags: ['主食', '温暖'] },
  { name: '小笼包', emoji: '🥢', category: 'chinese', level: 'hard', tags: ['点心', '热乎'] },
  { name: '蛋炒饭', emoji: '🍚', category: 'chinese', level: 'easy', tags: ['快手', '主食'] },
  { name: '西红柿炖牛腩', emoji: '🍲', category: 'chinese', level: 'hard', favorite: true, tags: ['炖菜', '滋补'] },
  { name: '青椒肉丝', emoji: '🫑', category: 'chinese', level: 'easy', tags: ['家常', '快手'] },
  { name: '孜然洋葱炒牛肉', emoji: '🥩', category: 'chinese', level: 'easy', favorite: true, tags: ['新疆风味', '下饭'] },
  { name: '土豆炖牛肉', emoji: '🥘', category: 'chinese', level: 'hard', favorite: true, tags: ['炖菜', '经典'] },
  { name: '干煸杏鲍菇', emoji: '🍄', category: 'chinese', level: 'easy', favorite: true, tags: ['素菜', '下饭'] },
  { name: '水煮肉片', emoji: '🌶️', category: 'chinese', level: 'medium', favorite: true, tags: ['川菜', '麻辣'] },
  // 🍆 茄子专区
  { name: '凉拌蒜泥茄子', emoji: '🍆', category: 'chinese', level: 'easy', tags: ['凉菜', '快手'] },
  { name: '蒜蓉烤茄子', emoji: '🍆', category: 'chinese', level: 'easy', tags: ['蒜香', '烤制'] },
  { name: '肉末茄子', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['下饭', '家常'] },
  { name: '鱼香茄子', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['川菜', '下饭'] },
  { name: '地三鲜', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['东北', '硬菜'] },
  { name: '茄子烧豆角', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['家常', '咸香'] },
  { name: '擂椒皮蛋茄子', emoji: '🍆', category: 'chinese', level: 'medium', tags: ['湘菜', '风味'] },
  // 🍣 日料
  { name: '寿司拼盘', emoji: '🍣', category: 'japanese', level: 'hard', tags: ['生食', '精致'] },
  { name: '鳗鱼饭', emoji: '🍱', category: 'japanese', level: 'hard', tags: ['主食', '浓郁'] },
  { name: '日式拉面', emoji: '🍜', category: 'japanese', level: 'medium', tags: ['热汤', '治愈'] },
  { name: '天妇罗', emoji: '🍤', category: 'japanese', level: 'hard', tags: ['油炸', '香脆'] },
  { name: '豚骨乌冬', emoji: '🍥', category: 'japanese', level: 'medium', tags: ['热汤', '主食'] },
  { name: '刺身拼盘', emoji: '🐟', category: 'japanese', level: 'hard', tags: ['生食', '新鲜'] },
  // 🍝 西餐
  { name: '黑椒牛排', emoji: '🥩', category: 'western', level: 'medium', tags: ['硬菜', '仪式感'] },
  { name: '意大利肉酱面', emoji: '🍝', category: 'western', level: 'medium', tags: ['主食', '经典'] },
  { name: '奶油蘑菇意面', emoji: '🍄', category: 'western', level: 'medium', tags: ['浓郁', '主食'] },
  { name: '凯撒沙拉', emoji: '🥗', category: 'western', level: 'easy', tags: ['轻食', '健康'] },
  { name: '法式烤鸡', emoji: '🍗', category: 'western', level: 'hard', tags: ['香嫩', '硬菜'] },
  { name: '披萨', emoji: '🍕', category: 'western', level: 'medium', tags: ['分享', '经典'] },
  // 🍲 火锅
  { name: '麻辣火锅', emoji: '🌶️', category: 'hotpot', level: 'medium', tags: ['川味', '热闹'] },
  { name: '番茄火锅', emoji: '🍅', category: 'hotpot', level: 'medium', tags: ['温和', '鲜甜'] },
  { name: '菌菇鸡汤锅', emoji: '🍄', category: 'hotpot', level: 'medium', tags: ['滋补', '养生'] },
  { name: '椰子鸡火锅', emoji: '🥥', category: 'hotpot', level: 'medium', tags: ['清甜', '粤式'] },
  // 🍔 快餐
  { name: '汉堡薯条', emoji: '🍔', category: 'fast', level: 'medium', tags: ['方便', '快乐'] },
  { name: '炸鸡', emoji: '🍗', category: 'fast', level: 'medium', tags: ['香脆', '快乐'] },
  { name: '炒面', emoji: '🍝', category: 'fast', level: 'easy', tags: ['锅气', '饱腹'] },
  { name: '麻辣烫', emoji: '🍢', category: 'fast', level: 'easy', tags: ['自由选', '暖胃'] },
  { name: '螺蛳粉', emoji: '🍜', category: 'fast', level: 'easy', tags: ['重口', '上瘾'] },
  { name: '黄焖鸡米饭', emoji: '🍛', category: 'fast', level: 'medium', tags: ['下饭', '实惠'] },
  // 🍰 甜品
  { name: '提拉米苏', emoji: '🍰', category: 'dessert', level: 'hard', tags: ['经典', '意式'] },
  { name: '芒果班戟', emoji: '🥭', category: 'dessert', level: 'hard', tags: ['清新', '港式'] },
  { name: '冰淇淋', emoji: '🍨', category: 'dessert', level: 'easy', tags: ['清凉', '治愈'] },
  { name: '舒芙蕾', emoji: '🥞', category: 'dessert', level: 'hard', tags: ['轻盈', '现烤'] },
];

const CATEGORY_LABELS = {
  all: '全部',
  favorite: '我的最爱',
  chinese: '中餐',
  japanese: '日料',
  western: '西餐',
  hotpot: '火锅',
  fast: '快餐',
  dessert: '甜品',
};

const LEVEL_META = {
  easy: { label: '简单', stars: '⭐', cls: 'level-easy' },
  medium: { label: '中等', stars: '⭐⭐', cls: 'level-medium' },
  hard: { label: '费事', stars: '⭐⭐⭐', cls: 'level-hard' },
};

/* ---------- 状态 ---------- */
let currentCategory = 'all';
let homeMode = true; // 在家做模式：默认开启，过滤 hard 难做的菜
let history = [];
const HISTORY_KEY = 'dinner-picker-history';

/* ---------- DOM 引用 ---------- */
const $ = (sel) => document.querySelector(sel);
const resultCard = $('#resultCard');
const resultEmoji = $('#resultEmoji');
const resultName = $('#resultName');
const resultTags = $('#resultTags');
const pickBtn = $('#pickBtn');
const pickFastBtn = $('#pickFastBtn');
const poolHint = $('#poolHint');
const overlay = $('#overlay');
const overlayEmoji = $('#overlayEmoji');
const historyList = $('#historyList');
const clearHistoryBtn = $('#clearHistoryBtn');
const homeToggle = $('#homeToggle');
const chips = document.querySelectorAll('.filter-chip');

/* ---------- 工具函数 ---------- */
function loadHistory() {
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    history = [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}

function getPool() {
  let pool;
  if (currentCategory === 'favorite') {
    pool = DISHES.filter((d) => d.favorite);
  } else {
    pool =
      currentCategory === 'all'
        ? DISHES
        : DISHES.filter((d) => d.category === currentCategory);
  }
  // 在家做模式：过滤 hard 菜，但"我的最爱"不受限
  if (homeMode) {
    pool = pool.filter((d) => d.level !== 'hard' || d.favorite);
  }
  return pool;
}

function formatTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

/* ---------- 抽选 ---------- */
function pickDish(fast = false) {
  const pool = getPool();
  if (pool.length === 0) {
    resultEmoji.textContent = '😵';
    resultName.textContent = '这个分类没有合适的菜了';
    resultTags.innerHTML = '';
    return null;
  }

  // 避免连续抽到同一道菜（历史最后一条）
  let candidates = pool;
  const last = history[0];
  if (last && pool.length > 1) {
    candidates = pool.filter((d) => d.name !== last.name);
  }

  const dish = candidates[randInt(candidates.length)];
  history.unshift({
    name: dish.name,
    emoji: dish.emoji,
    time: Date.now(),
  });
  if (history.length > 12) history.pop();
  saveHistory();

  return dish;
}

function renderResult(dish) {
  if (!dish) return;
  const level = LEVEL_META[dish.level] || LEVEL_META.easy;
  resultEmoji.textContent = dish.emoji;
  resultName.textContent = dish.name;
  resultName.classList.remove('idle');
  resultTags.innerHTML =
    (dish.favorite ? `<span class="tag tag-fav">❤️ 我的最爱</span>` : '') +
    `<span class="tag ${level.cls}">${level.stars} ${level.label}</span>` +
    dish.tags.map((t) => `<span class="tag">${t}</span>`).join('');
  resultCard.classList.remove('pop');
  // 强制重排以重触发动画
  void resultCard.offsetWidth;
  resultCard.classList.add('pop');
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML =
      '<li class="history-empty">还没有记录，抽一个试试吧～</li>';
    return;
  }
  historyList.innerHTML = history
    .map(
      (h) => `
      <li class="history-item">
        <span><span class="h-emoji">${h.emoji}</span>${h.name}</span>
        <span class="h-time">${formatTime(h.time)}</span>
      </li>`
    )
    .join('');
}

function updateHint() {
  const pool = getPool();
  const label =
    currentCategory === 'all'
      ? '道菜'
      : `道${CATEGORY_LABELS[currentCategory]}`;
  const mode = homeMode ? '（仅在家可做）' : '';
  poolHint.textContent = `从 ${pool.length} ${label}${mode}中为你挑选`;
}

/* ---------- 动画流程 ---------- */
const OVERLAY_EMOJIS = ['🍜', '🍕', '🍣', '🍔', '🥘', '🍢', '🍲', '🥟'];

function runPick(fast = false) {
  if (pickBtn.disabled) return;

  pickBtn.disabled = true;
  pickBtn.classList.add('charging');

  // 遮罩：快速闪烁切换 emoji 营造"轮盘"感
  overlay.classList.add('show');
  let frame = 0;
  const spin = setInterval(() => {
    overlayEmoji.textContent = OVERLAY_EMOJIS[frame % OVERLAY_EMOJIS.length];
    frame++;
  }, 90);

  const totalSpin = fast ? 500 : 1100;
  setTimeout(() => {
    clearInterval(spin);
    const dish = pickDish(fast);

    if (dish) {
      // 落定前最后一帧展示结果 emoji
      overlayEmoji.textContent = dish.emoji;
      setTimeout(() => {
        overlay.classList.remove('show');
        renderResult(dish);
        renderHistory();
        pickBtn.disabled = false;
        pickBtn.classList.remove('charging');
      }, 320);
    } else {
      overlay.classList.remove('show');
      renderResult(null);
      pickBtn.disabled = false;
      pickBtn.classList.remove('charging');
    }
  }, totalSpin);
}

/* ---------- 事件绑定 ---------- */
pickBtn.addEventListener('click', () => runPick(false));
pickFastBtn.addEventListener('click', () => runPick(true));

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.dataset.category;
    updateHint();
  });
});

homeToggle.addEventListener('change', () => {
  homeMode = homeToggle.checked;
  updateHint();
});

clearHistoryBtn.addEventListener('click', () => {
  if (history.length === 0) return;
  if (confirm('确定要清空历史记录吗？')) {
    history = [];
    saveHistory();
    renderHistory();
  }
});

/* ---------- 初始化 ---------- */
(function init() {
  loadHistory();
  renderHistory();
  updateHint();
  resultName.classList.add('idle');
})();
