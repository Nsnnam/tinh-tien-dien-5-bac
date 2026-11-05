/**
 * CÔNG TƠ ĐIỆN TỬ 5 BẬC (ÁP DỤNG TỪ 01/11/2026)
 * Real-time Electricity Bill Calculator
 */

// Official 5-Tier Pricing (effective Nov 1, 2026)
const TIERS_5 = [
  { id: 1, name: 'Bậc 1', min: 0, max: 100, span: 100, price: 1901, bgClass: 't1-bg', barClass: 'seg-tier-1' },
  { id: 2, name: 'Bậc 2', min: 100, max: 200, span: 100, price: 2289, bgClass: 't2-bg', barClass: 'seg-tier-2' },
  { id: 3, name: 'Bậc 3', min: 200, max: 400, span: 200, price: 2894, bgClass: 't3-bg', barClass: 'seg-tier-3' },
  { id: 4, name: 'Bậc 4', min: 400, max: 700, span: 300, price: 3456, bgClass: 't4-bg', barClass: 'seg-tier-4' },
  { id: 5, name: 'Bậc 5', min: 700, max: Infinity, span: Infinity, price: 3844, bgClass: 't5-bg', barClass: 'seg-tier-5' }
];

// Previous 6-Tier Pricing for comparison
const TIERS_6_OLD = [
  { min: 0, max: 50, span: 50, price: 1893 },
  { min: 50, max: 100, span: 50, price: 1956 },
  { min: 100, max: 200, span: 100, price: 2271 },
  { min: 200, max: 300, span: 100, price: 2860 },
  { min: 300, max: 400, span: 100, price: 3197 },
  { min: 400, max: Infinity, span: Infinity, price: 3302 }
];

// State
let currentKwh = 350;
let currentVatRate = 0.08;
let currentMode = 'direct'; // 'direct' or 'indexes'

// DOM Elements
const kwhInput = document.getElementById('kwhInput');
const kwhSlider = document.getElementById('kwhSlider');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const lcdDigits = document.getElementById('lcdDigits');
const lcdTierLevel = document.getElementById('lcdTierLevel');
const hudKwhBadge = document.getElementById('hudKwhBadge');
const totalAmount = document.getElementById('totalAmount');
const amountInWords = document.getElementById('amountInWords');
const subtotalAmount = document.getElementById('subtotalAmount');
const vatAmount = document.getElementById('vatAmount');
const vatPercentLabel = document.getElementById('vatPercentLabel');
const avgPrice = document.getElementById('avgPrice');
const compareCard = document.getElementById('compareCard');
const compareDelta = document.getElementById('compareDelta');
const compareDesc = document.getElementById('compareDesc');
const tierList = document.getElementById('tierList');
const segmentedBar = document.getElementById('segmentedBar');
const tabDirect = document.getElementById('tabDirect');
const tabIndexes = document.getElementById('tabIndexes');
const sectionDirect = document.getElementById('sectionDirect');
const sectionIndexes = document.getElementById('sectionIndexes');
const indexOld = document.getElementById('indexOld');
const indexNew = document.getElementById('indexNew');
const indexCalcNote = document.getElementById('indexCalcNote');
const toastMessage = document.getElementById('toastMessage');
const toastText = document.getElementById('toastText');
const btnThemeToggle = document.getElementById('btnThemeToggle');
const themeIcon = document.getElementById('themeIcon');
const imageModal = document.getElementById('imageModal');
const btnViewOfficialPrice = document.getElementById('btnViewOfficialPrice');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCloseModal2 = document.getElementById('btnCloseModal2');

// ============================================================
// CALCULATION LOGIC
// ============================================================

/**
 * Calculates breakdown for 5-tier pricing
 */
function calculate5Tier(kwh) {
  let remaining = Math.max(0, kwh);
  let subtotal = 0;
  const breakdown = [];

  for (const tier of TIERS_5) {
    let kwhInTier = 0;
    if (kwh > tier.min) {
      if (tier.max === Infinity) {
        kwhInTier = remaining;
      } else {
        kwhInTier = Math.min(remaining, tier.span);
      }
      remaining = Math.max(0, remaining - kwhInTier);
    }

    const tierTotal = kwhInTier * tier.price;
    subtotal += tierTotal;

    breakdown.push({
      ...tier,
      kwhUsed: kwhInTier,
      total: tierTotal,
      percentage: kwh > 0 ? (kwhInTier / kwh) * 100 : 0,
      isFull: tier.max !== Infinity && kwhInTier >= tier.span,
      isActive: kwhInTier > 0 && (tier.max === Infinity || kwhInTier < tier.span)
    });
  }

  const vat = Math.round(subtotal * currentVatRate);
  const total = subtotal + vat;
  const average = kwh > 0 ? Math.round(total / kwh) : 0;

  return { subtotal, vat, total, average, breakdown };
}

/**
 * Calculates old 6-tier pricing for comparison
 */
function calculateOld6Tier(kwh) {
  let remaining = Math.max(0, kwh);
  let subtotal = 0;

  for (const tier of TIERS_6_OLD) {
    let kwhInTier = 0;
    if (kwh > tier.min) {
      if (tier.max === Infinity) {
        kwhInTier = remaining;
      } else {
        kwhInTier = Math.min(remaining, tier.span);
      }
      remaining = Math.max(0, remaining - kwhInTier);
    }
    subtotal += kwhInTier * tier.price;
  }

  const vat = Math.round(subtotal * currentVatRate);
  return subtotal + vat;
}

// ============================================================
// NUMBER TO WORDS (TIẾNG VIỆT)
// ============================================================
const VIETNAMESE_DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readGroupOfThree(group, isFirstGroup = false) {
  let result = '';
  const hundreds = Math.floor(group / 100);
  const tens = Math.floor((group % 100) / 10);
  const units = group % 10;

  if (hundreds > 0 || !isFirstGroup) {
    result += VIETNAMESE_DIGITS[hundreds] + ' trăm ';
  }

  if (tens > 1) {
    result += VIETNAMESE_DIGITS[tens] + ' mươi ';
  } else if (tens === 1) {
    result += 'mười ';
  } else if (tens === 0 && units > 0 && (hundreds > 0 || !isFirstGroup)) {
    result += 'linh ';
  }

  if (tens > 1 && units === 1) {
    result += 'mốt ';
  } else if (tens >= 1 && units === 5) {
    result += 'lăm ';
  } else if (units > 0) {
    result += VIETNAMESE_DIGITS[units] + ' ';
  }

  return result.trim();
}

function numberToVietnameseCurrency(num) {
  if (num === 0) return 'Không đồng';
  if (num < 0) return 'Số âm không hợp lệ';

  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let groups = [];
  let temp = Math.floor(num);

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let words = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i];
    if (groupVal > 0) {
      const isFirst = (i === groups.length - 1);
      const groupText = readGroupOfThree(groupVal, isFirst);
      words.push(groupText + (scales[i] ? ' ' + scales[i] : ''));
    }
  }

  let result = words.join(' ').trim();
  result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
  return 'Bằng chữ: ' + result;
}

// Format VND currency
function formatVND(num) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(num));
}

// ============================================================
// UI UPDATE
// ============================================================

function updateUI() {
  const result = calculate5Tier(currentKwh);
  const oldTotal = calculateOld6Tier(currentKwh);

  // Sync inputs
  kwhInput.value = currentKwh;
  kwhSlider.value = Math.min(1200, currentKwh);

  // Update LCD Digits (6 digits: 000350)
  const padded = String(Math.floor(currentKwh)).padStart(6, '0');
  lcdDigits.innerHTML = padded.split('').map((char, index) => {
    const isHighlight = index >= (6 - String(Math.floor(currentKwh)).length);
    return `<span class="digit-box ${isHighlight ? 'highlight' : ''}">${char}</span>`;
  }).join('');

  // Update LCD Tier info
  let activeTierObj = TIERS_5.find(t => currentKwh <= t.max) || TIERS_5[TIERS_5.length - 1];
  lcdTierLevel.textContent = `Đang áp dụng: ${activeTierObj.name} (${activeTierObj.min} - ${activeTierObj.max === Infinity ? 'trên 700' : activeTierObj.max} kWh)`;

  // Update HUD
  hudKwhBadge.textContent = `${formatVND(currentKwh)} kWh`;
  totalAmount.textContent = formatVND(result.total);
  amountInWords.textContent = numberToVietnameseCurrency(result.total);
  subtotalAmount.textContent = `${formatVND(result.subtotal)} ₫`;
  vatAmount.textContent = `${formatVND(result.vat)} ₫`;
  vatPercentLabel.textContent = `${Math.round(currentVatRate * 100)}%`;
  avgPrice.textContent = `${formatVND(result.average)} ₫/kWh`;

  // Update Comparison Card
  const diff = result.total - oldTotal;
  const diffPercent = oldTotal > 0 ? ((diff / oldTotal) * 100).toFixed(1) : '0';
  
  if (currentKwh === 0) {
    compareDelta.textContent = '0 ₫ (0%)';
    compareDelta.className = 'compare-delta';
    compareDesc.textContent = 'Chưa phát sinh điện năng tiêu thụ.';
  } else if (diff > 0) {
    compareDelta.textContent = `+${formatVND(diff)} ₫ (+${diffPercent}%)`;
    compareDelta.className = 'compare-delta increase';
    compareDesc.textContent = `Biểu giá mới nới rộng Bậc 1 (đến 100 kWh), nhưng từ 400 kWh trở lên biểu giá 5 bậc điều chỉnh tăng để khuyến khích tiết kiệm điện.`;
  } else if (diff < 0) {
    compareDelta.textContent = `${formatVND(diff)} ₫ (${diffPercent}%)`;
    compareDelta.className = 'compare-delta decrease';
    compareDesc.textContent = `Gia đình bạn TIẾT KIỆM được chi phí so với biểu giá cũ nhờ Bậc 1 mới gộp mức 0-100 kWh với đơn giá ưu đãi 1.901 đ/kWh.`;
  } else {
    compareDelta.textContent = '0 ₫ (0%)';
    compareDelta.className = 'compare-delta';
    compareDesc.textContent = `Chi phí tương đương với biểu giá 6 bậc trước đây.`;
  }

  // Update Segmented Bar
  segmentedBar.innerHTML = result.breakdown.map(t => {
    return `<div class="seg-fill ${t.barClass}" style="width: ${t.percentage}%;" title="${t.name}: ${formatVND(t.kwhUsed)} kWh (${t.percentage.toFixed(1)}%)"></div>`;
  }).join('');

  // Update Tier List Items
  tierList.innerHTML = result.breakdown.map(t => {
    let stateClass = 'inactive-tier';
    let stateText = 'Chưa chạm mức';

    if (t.isFull) {
      stateClass = 'completed-tier';
      stateText = `Đã dùng tối đa: ${formatVND(t.kwhUsed)}/${formatVND(t.span)} kWh`;
    } else if (t.isActive) {
      stateClass = 'active-tier';
      stateText = t.max === Infinity 
        ? `Đang tiêu thụ: ${formatVND(t.kwhUsed)} kWh`
        : `Đang tiêu thụ: ${formatVND(t.kwhUsed)}/${formatVND(t.span)} kWh`;
    }

    const progressWidth = t.span === Infinity 
      ? (t.kwhUsed > 0 ? 100 : 0)
      : Math.min(100, (t.kwhUsed / t.span) * 100);

    const rangeLabel = t.max === Infinity 
      ? `Từ ${t.min + 1} kWh trở lên` 
      : `Từ ${t.min === 0 ? 0 : t.min + 1} - ${t.max} kWh`;

    return `
      <div class="tier-item ${stateClass}">
        <div class="tier-item-header">
          <div class="tier-badge-group">
            <span class="tier-badge ${t.bgClass}">${t.name}</span>
            <span class="tier-range-text">${rangeLabel}</span>
            <span class="tier-rate-tag">(${formatVND(t.price)} đ/kWh)</span>
          </div>
          <span class="tier-item-amount">${formatVND(t.total)} ₫</span>
        </div>
        <div class="tier-progress-track">
          <div class="tier-progress-fill ${t.bgClass}" style="width: ${progressWidth}%;"></div>
        </div>
        <div class="tier-item-footer">
          <span>${stateText}</span>
          <span>${t.kwhUsed > 0 ? `${formatVND(t.kwhUsed)} kWh` : '0 kWh'}</span>
        </div>
      </div>
    `;
  }).join('');

  // Re-initialize Lucide Icons for freshly injected elements
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ============================================================
// EVENT HANDLERS
// ============================================================

// Number input handler
kwhInput.addEventListener('input', (e) => {
  let val = parseFloat(e.target.value) || 0;
  if (val < 0) val = 0;
  currentKwh = val;
  updateUI();
  updateUrlParam();
});

// Slider handler
kwhSlider.addEventListener('input', (e) => {
  currentKwh = parseFloat(e.target.value) || 0;
  updateUI();
  updateUrlParam();
});

// Step buttons
btnMinus.addEventListener('click', () => {
  currentKwh = Math.max(0, currentKwh - 10);
  updateUI();
  updateUrlParam();
});

btnPlus.addEventListener('click', () => {
  currentKwh += 10;
  updateUI();
  updateUrlParam();
});

// Tab switching
tabDirect.addEventListener('click', () => {
  currentMode = 'direct';
  tabDirect.classList.add('active');
  tabIndexes.classList.remove('active');
  sectionDirect.classList.remove('hidden');
  sectionIndexes.classList.add('hidden');
});

tabIndexes.addEventListener('click', () => {
  currentMode = 'indexes';
  tabIndexes.classList.add('active');
  tabDirect.classList.remove('active');
  sectionIndexes.classList.remove('hidden');
  sectionDirect.classList.add('hidden');
  calcFromIndexes();
});

function calcFromIndexes() {
  const oldVal = parseFloat(indexOld.value) || 0;
  const newVal = parseFloat(indexNew.value) || 0;
  const diff = Math.max(0, newVal - oldVal);
  indexCalcNote.innerHTML = `Sản lượng = ${newVal} - ${oldVal} = <strong>${formatVND(diff)} kWh</strong>`;
  currentKwh = diff;
  updateUI();
  updateUrlParam();
}

indexOld.addEventListener('input', calcFromIndexes);
indexNew.addEventListener('input', calcFromIndexes);

// Preset chips
document.querySelectorAll('.preset-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentKwh = parseFloat(chip.dataset.kwh);
    updateUI();
    updateUrlParam();
  });
});

// VAT Buttons
document.querySelectorAll('.vat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentVatRate = parseFloat(btn.dataset.vat);
    updateUI();
  });
});

// Theme Toggle
btnThemeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('meter-theme', newTheme);
  
  if (newTheme === 'light') {
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  lucide.createIcons();
});

// Official Price Modal
btnViewOfficialPrice.addEventListener('click', () => {
  imageModal.classList.add('open');
});

btnCloseModal.addEventListener('click', () => {
  imageModal.classList.remove('open');
});

btnCloseModal2.addEventListener('click', () => {
  imageModal.classList.remove('open');
});

imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) {
    imageModal.classList.remove('open');
  }
});

// Copy Result
document.getElementById('btnCopyResult').addEventListener('click', () => {
  const res = calculate5Tier(currentKwh);
  const text = [
    `⚡ HÓA ĐƠN TIỀN ĐIỆN SINH HOẠT (BIỂU GIÁ 5 BẬC MỚI)`,
    `• Sản lượng tiêu thụ: ${formatVND(currentKwh)} kWh`,
    `• Tiền điện trước thuế: ${formatVND(res.subtotal)} đ`,
    `• Thuế GTGT (${Math.round(currentVatRate * 100)}%): ${formatVND(res.vat)} đ`,
    `👉 TỔNG TIỀN PHẢI TRẢ: ${formatVND(res.total)} đ`,
    `• Giá bình quân: ${formatVND(res.average)} đ/kWh`,
    `• ${numberToVietnameseCurrency(res.total)}`,
    `Tra cứu trực tuyến tại: ${window.location.href}`
  ].join('\n');

  navigator.clipboard.writeText(text).then(() => {
    showToast('Đã sao chép hóa đơn vào bộ nhớ tạm!');
  }).catch(() => {
    showToast('Lỗi khi sao chép!');
  });
});

// Share Link
document.getElementById('btnShareLink').addEventListener('click', () => {
  const url = `${window.location.origin}${window.location.pathname}?kwh=${currentKwh}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Đã sao chép link (${currentKwh} kWh) thành công!`);
  }).catch(() => {
    showToast('Không thể tạo liên kết chia sẻ!');
  });
});

// Print
document.getElementById('btnPrintBill').addEventListener('click', () => {
  window.print();
});

function showToast(msg) {
  toastText.textContent = msg;
  toastMessage.classList.add('show');
  setTimeout(() => {
    toastMessage.classList.remove('show');
  }, 2500);
}

function updateUrlParam() {
  const url = new URL(window.location);
  url.searchParams.set('kwh', currentKwh);
  window.history.replaceState({}, '', url);
}

// Initial Setup
window.addEventListener('DOMContentLoaded', () => {
  // Check URL params
  const params = new URLSearchParams(window.location.search);
  if (params.has('kwh')) {
    const pKwh = parseFloat(params.get('kwh'));
    if (!isNaN(pKwh) && pKwh >= 0) {
      currentKwh = pKwh;
    }
  }

  // Check saved theme
  const savedTheme = localStorage.getItem('meter-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
      themeIcon.setAttribute('data-lucide', 'moon');
    }
  }

  updateUI();
  if (window.lucide) {
    lucide.createIcons();
  }
});
