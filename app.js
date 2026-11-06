/**
 * CÔNG TƠ ĐIỆN TỬ - SO SÁNH GIÁ ĐIỆN 5 BẬC MỚI (01/11/2026) VS 6 BẬC CŨ
 * Real-time Electricity Bill Comparison Engine
 */

// Biểu giá mới 5 bậc (Quyết định từ 01/11/2026)
const TIERS_5 = [
  { id: 1, name: 'Bậc 1', min: 0, max: 100, span: 100, price: 1901, bgClass: 't1-bg', barClass: 'seg-tier-1' },
  { id: 2, name: 'Bậc 2', min: 100, max: 200, span: 100, price: 2289, bgClass: 't2-bg', barClass: 'seg-tier-2' },
  { id: 3, name: 'Bậc 3', min: 200, max: 400, span: 200, price: 2894, bgClass: 't3-bg', barClass: 'seg-tier-3' },
  { id: 4, name: 'Bậc 4', min: 400, max: 700, span: 300, price: 3456, bgClass: 't4-bg', barClass: 'seg-tier-4' },
  { id: 5, name: 'Bậc 5', min: 700, max: Infinity, span: Infinity, price: 3844, bgClass: 't5-bg', barClass: 'seg-tier-5' }
];

// Biểu giá cũ 6 bậc (Theo QĐ 2699/QĐ-BCT từ 11/10/2024 - Khớp thực tế 100% các kỳ hóa đơn)
const TIERS_6_OLD = [
  { id: 1, name: 'Bậc 1', min: 0, max: 50, span: 50, price: 1984 },
  { id: 2, name: 'Bậc 2', min: 50, max: 100, span: 50, price: 2050 },
  { id: 3, name: 'Bậc 3', min: 100, max: 200, span: 100, price: 2380 },
  { id: 4, name: 'Bậc 4', min: 200, max: 300, span: 100, price: 2998 },
  { id: 5, name: 'Bậc 5', min: 300, max: 400, span: 100, price: 3350 },
  { id: 6, name: 'Bậc 6', min: 400, max: Infinity, span: Infinity, price: 3460 }
];

// 7 Đoạn thang đối chiếu trực tiếp giữa Cũ và Mới (Khớp bảng văn bản chính thức 1000 kWh)
const COMPARISON_SEGMENTS = [
  {
    label: 'Đoạn 0 – 50 kWh',
    sublabel: 'cũ B1 / mới B1',
    min: 0,
    max: 50,
    span: 50,
    oldPrice: 1984,
    newPrice: 1901
  },
  {
    label: 'Đoạn 51 – 100 kWh',
    sublabel: 'cũ B2 / mới B1',
    min: 50,
    max: 100,
    span: 50,
    oldPrice: 2050,
    newPrice: 1901
  },
  {
    label: 'Đoạn 101 – 200 kWh',
    sublabel: 'cũ B3 / mới B2',
    min: 100,
    max: 200,
    span: 100,
    oldPrice: 2380,
    newPrice: 2289
  },
  {
    label: 'Đoạn 201 – 300 kWh',
    sublabel: 'cũ B4 / mới B3',
    min: 200,
    max: 300,
    span: 100,
    oldPrice: 2998,
    newPrice: 2894
  },
  {
    label: 'Đoạn 301 – 400 kWh',
    sublabel: 'cũ B5 / mới B3',
    min: 300,
    max: 400,
    span: 100,
    oldPrice: 3350,
    newPrice: 2894
  },
  {
    label: 'Đoạn 401 – 700 kWh',
    sublabel: 'cũ B6 / mới B4',
    min: 400,
    max: 700,
    span: 300,
    oldPrice: 3460,
    newPrice: 3456
  },
  {
    label: 'Đoạn > 700 kWh',
    sublabel: 'cũ B6 / mới B5',
    min: 700,
    max: Infinity,
    span: Infinity,
    oldPrice: 3460,
    newPrice: 3844
  }
];

// App State
let currentKwh = 348; // Khởi tạo với số điện thực tế tháng gần nhất của người dùng
let currentVatRate = 0.08; // 8% theo hóa đơn tiền điện thực tế
let currentMode = 'direct'; // 'direct' or 'indexes'

// DOM Elements
const kwhInput = document.getElementById('kwhInput');
const kwhSlider = document.getElementById('kwhSlider');
const kwhEcho = document.getElementById('kwhEcho');
const btnMinus50 = document.getElementById('btnMinus50');
const btnMinus10 = document.getElementById('btnMinus10');
const btnPlus10 = document.getElementById('btnPlus10');
const btnPlus50 = document.getElementById('btnPlus50');

const lcdDigits = document.getElementById('lcdDigits');
const lcdTierLevel = document.getElementById('lcdTierLevel');
const lcdRateTag = document.getElementById('lcdRateTag');

const tabDirect = document.getElementById('tabDirect');
const tabIndexes = document.getElementById('tabIndexes');
const sectionDirect = document.getElementById('sectionDirect');
const sectionIndexes = document.getElementById('sectionIndexes');

const indexOld = document.getElementById('indexOld');
const indexNew = document.getElementById('indexNew');
const indexDiffKwh = document.getElementById('indexDiffKwh');
const indexFormulaText = document.getElementById('indexFormulaText');

// Comparison HUD elements
const deckKwhNotice = document.getElementById('deckKwhNotice');
const masterDeltaBadge = document.getElementById('masterDeltaBadge');
const deltaStatusIcon = document.getElementById('deltaStatusIcon');
const deltaLabel = document.getElementById('deltaLabel');
const deltaNumber = document.getElementById('deltaNumber');
const deltaPercent = document.getElementById('deltaPercent');

const newTotalAmount = document.getElementById('newTotalAmount');
const newVatTag = document.getElementById('newVatTag');
const newAmountWords = document.getElementById('newAmountWords');
const newSubtotal = document.getElementById('newSubtotal');
const newVat = document.getElementById('newVat');
const newVatPercent = document.getElementById('newVatPercent');
const newAvgPrice = document.getElementById('newAvgPrice');
const newTierDesc = document.getElementById('newTierDesc');

const oldTotalAmount = document.getElementById('oldTotalAmount');
const oldVatTag = document.getElementById('oldVatTag');
const oldAmountWords = document.getElementById('oldAmountWords');
const oldSubtotal = document.getElementById('oldSubtotal');
const oldVat = document.getElementById('oldVat');
const oldVatPercent = document.getElementById('oldVatPercent');
const oldAvgPrice = document.getElementById('oldAvgPrice');
const oldTierDesc = document.getElementById('oldTierDesc');

const insightAlert = document.getElementById('insightAlert');
const insightTitle = document.getElementById('insightTitle');
const insightBody = document.getElementById('insightBody');

// Table & Breakdown
const detailedTableBody = document.getElementById('detailedTableBody');
const detailedTableFoot = document.getElementById('detailedTableFoot');
const breakdownKwhTotal = document.getElementById('breakdownKwhTotal');
const segmentedBar = document.getElementById('segmentedBar');
const tierCardGrid = document.getElementById('tierCardGrid');

// Modals & Tools
const toastMessage = document.getElementById('toastMessage');
const toastText = document.getElementById('toastText');
const btnThemeToggle = document.getElementById('btnThemeToggle');
const themeIcon = document.getElementById('themeIcon');
const imageModal = document.getElementById('imageModal');
const btnViewOfficialPrice = document.getElementById('btnViewOfficialPrice');
const btnOpenDocsModal = document.getElementById('btnOpenDocsModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCloseModal2 = document.getElementById('btnCloseModal2');
const modalTab1 = document.getElementById('modalTab1');
const modalTab2 = document.getElementById('modalTab2');
const modalImg1 = document.getElementById('modalImg1');
const modalImg2 = document.getElementById('modalImg2');
const modalCaption = document.getElementById('modalCaption');

// ============================================================
// COMPUTATION ENGINE
// ============================================================

/**
 * Calculates step-by-step breakdown across the 7 segments
 */
function calculateSegments(kwh) {
  let subtotalOld = 0;
  let subtotalNew = 0;
  const segmentsData = [];

  for (const seg of COMPARISON_SEGMENTS) {
    let kwhInSeg = 0;
    if (kwh > seg.min) {
      if (seg.max === Infinity) {
        kwhInSeg = kwh - seg.min;
      } else {
        kwhInSeg = Math.min(kwh - seg.min, seg.span);
      }
    }

    const costOld = kwhInSeg * seg.oldPrice;
    const costNew = kwhInSeg * seg.newPrice;
    const diffCost = costNew - costOld;
    const diffRate = seg.newPrice - seg.oldPrice;
    const diffRatePct = ((diffRate / seg.oldPrice) * 100).toFixed(2);
    const diffCostPct = costOld > 0 ? ((diffCost / costOld) * 100).toFixed(2) : '0';

    subtotalOld += costOld;
    subtotalNew += costNew;

    segmentsData.push({
      ...seg,
      kwhUsed: kwhInSeg,
      costOld,
      costNew,
      diffCost,
      diffRate,
      diffRatePct,
      diffCostPct,
      isActive: kwhInSeg > 0
    });
  }

  const vatOld = Math.round(subtotalOld * currentVatRate);
  const totalOld = subtotalOld + vatOld;
  const avgOld = kwh > 0 ? Math.round(totalOld / kwh) : 0;

  const vatNew = Math.round(subtotalNew * currentVatRate);
  const totalNew = subtotalNew + vatNew;
  const avgNew = kwh > 0 ? Math.round(totalNew / kwh) : 0;

  const diffTotal = totalNew - totalOld;
  const diffSubtotal = subtotalNew - subtotalOld;
  const diffPercent = totalOld > 0 ? ((diffTotal / totalOld) * 100).toFixed(2) : '0';

  return {
    kwh,
    subtotalOld,
    vatOld,
    totalOld,
    avgOld,
    subtotalNew,
    vatNew,
    totalNew,
    avgNew,
    diffTotal,
    diffSubtotal,
    diffPercent,
    segments: segmentsData
  };
}

/**
 * Calculates tier breakdown for 5-tier graph
 */
function calculate5TierBreakdown(kwh) {
  let remaining = Math.max(0, kwh);
  const tiers = [];

  for (const t of TIERS_5) {
    let kwhInTier = 0;
    if (kwh > t.min) {
      if (t.max === Infinity) {
        kwhInTier = remaining;
      } else {
        kwhInTier = Math.min(remaining, t.span);
      }
      remaining = Math.max(0, remaining - kwhInTier);
    }

    const tierCost = kwhInTier * t.price;
    tiers.push({
      ...t,
      kwhUsed: kwhInTier,
      total: tierCost,
      percentage: kwh > 0 ? (kwhInTier / kwh) * 100 : 0,
      isFull: t.max !== Infinity && kwhInTier >= t.span,
      isActive: kwhInTier > 0 && (t.max === Infinity || kwhInTier < t.span)
    });
  }

  return tiers;
}

// ============================================================
// VIETNAMESE NUMBER TO WORDS
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
  if (num === 0) return 'Bằng chữ: Không đồng';
  if (num < 0) return 'Bằng chữ: Không đồng';

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

function formatVND(num) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(num));
}

// ============================================================
// UI RENDERING
// ============================================================

function updateUI() {
  const data = calculateSegments(currentKwh);
  const tierBreakdown = calculate5TierBreakdown(currentKwh);

  // Sync inputs
  kwhInput.value = currentKwh;
  kwhSlider.value = Math.min(1000, currentKwh);
  kwhEcho.textContent = `${formatVND(currentKwh)} kWh`;

  // Update LCD Digits (6 digits e.g. 000348)
  const padded = String(Math.floor(currentKwh)).padStart(6, '0');
  lcdDigits.innerHTML = padded.split('').map((char, index) => {
    const isHighlight = index >= (6 - String(Math.floor(currentKwh)).length);
    return `<span class="digit-box ${isHighlight ? 'highlight' : ''}">${char}</span>`;
  }).join('');

  // Active Tier in 5-tier
  let activeTierObj = TIERS_5.find(t => currentKwh <= t.max) || TIERS_5[TIERS_5.length - 1];
  lcdTierLevel.innerHTML = `<i data-lucide="check-circle-2"></i> ${activeTierObj.name} mới (${activeTierObj.min} - ${activeTierObj.max === Infinity ? 'trên 700' : activeTierObj.max} kWh)`;
  lcdRateTag.textContent = `${formatVND(activeTierObj.price)} đ/kWh`;

  // Update Index Diff echo if in index mode
  const oVal = parseFloat(indexOld.value) || 0;
  const nVal = parseFloat(indexNew.value) || 0;
  indexDiffKwh.textContent = `${formatVND(Math.max(0, nVal - oVal))} kWh`;
  indexFormulaText.textContent = `${nVal} - ${oVal} = ${Math.max(0, nVal - oVal)} kWh`;

  // Update Deck Heading
  deckKwhNotice.textContent = `Cho sản lượng: ${formatVND(currentKwh)} kWh trong tháng (Thuế VAT: ${Math.round(currentVatRate * 100)}%)`;

  // Update Master Delta Badge
  const vatText = currentVatRate > 0 ? `(đã gồm ${Math.round(currentVatRate * 100)}% VAT)` : `(chưa VAT)`;
  newVatTag.textContent = vatText;
  oldVatTag.textContent = vatText;
  newVatPercent.textContent = `${Math.round(currentVatRate * 100)}%`;
  oldVatPercent.textContent = `${Math.round(currentVatRate * 100)}%`;

  if (currentKwh === 0) {
    masterDeltaBadge.className = 'master-delta-badge';
    deltaStatusIcon.innerHTML = `<i data-lucide="minus"></i>`;
    deltaLabel.textContent = 'CHÊNH LỆCH:';
    deltaNumber.textContent = '0 ₫';
    deltaPercent.textContent = '(0%)';
  } else if (data.diffTotal < 0) {
    masterDeltaBadge.className = 'master-delta-badge';
    deltaStatusIcon.innerHTML = `<i data-lucide="trending-down"></i>`;
    deltaLabel.textContent = 'TIẾT KIỆM ĐƯỢC:';
    deltaNumber.textContent = `${formatVND(data.diffTotal)} ₫`;
    deltaPercent.textContent = `(${data.diffPercent}%)`;
  } else if (data.diffTotal > 0) {
    masterDeltaBadge.className = 'master-delta-badge increased';
    deltaStatusIcon.innerHTML = `<i data-lucide="trending-up"></i>`;
    deltaLabel.textContent = 'CHI PHÍ TĂNG:';
    deltaNumber.textContent = `+${formatVND(data.diffTotal)} ₫`;
    deltaPercent.textContent = `(+${data.diffPercent}%)`;
  } else {
    masterDeltaBadge.className = 'master-delta-badge';
    deltaStatusIcon.innerHTML = `<i data-lucide="equal"></i>`;
    deltaLabel.textContent = 'CHI PHÍ:';
    deltaNumber.textContent = '0 ₫';
    deltaPercent.textContent = '(0%)';
  }

  // Update Dual Cards
  newTotalAmount.textContent = formatVND(data.totalNew);
  newAmountWords.textContent = numberToVietnameseCurrency(data.totalNew);
  newSubtotal.textContent = `${formatVND(data.subtotalNew)} ₫`;
  newVat.textContent = `${formatVND(data.vatNew)} ₫`;
  newAvgPrice.textContent = `${formatVND(data.avgNew)} ₫/kWh`;
  newTierDesc.textContent = `${activeTierObj.name} mới (${activeTierObj.min} - ${activeTierObj.max === Infinity ? 'trên 700' : activeTierObj.max} kWh) • Đơn giá: ${formatVND(activeTierObj.price)} đ`;

  // Old Tier Active
  let activeOldTier = TIERS_6_OLD.find(t => currentKwh <= t.max) || TIERS_6_OLD[TIERS_6_OLD.length - 1];
  oldTotalAmount.textContent = formatVND(data.totalOld);
  oldAmountWords.textContent = numberToVietnameseCurrency(data.totalOld);
  oldSubtotal.textContent = `${formatVND(data.subtotalOld)} ₫`;
  oldVat.textContent = `${formatVND(data.vatOld)} ₫`;
  oldAvgPrice.textContent = `${formatVND(data.avgOld)} ₫/kWh`;
  oldTierDesc.textContent = `${activeOldTier.name} (${activeOldTier.min} - ${activeOldTier.max === Infinity ? 'trên 400' : activeOldTier.max} kWh) • Đơn giá: ${formatVND(activeOldTier.price)} đ`;

  // Update Insight Alert
  if (currentKwh === 0) {
    insightAlert.className = 'insight-alert';
    insightTitle.textContent = 'Chưa phát sinh sản lượng điện trong tháng';
    insightBody.textContent = 'Hãy nhập số điện tiêu thụ (kWh) hoặc điền chỉ số công tơ để xem đối chiếu chi tiết.';
  } else if (data.diffTotal < 0) {
    insightAlert.className = 'insight-alert';
    insightTitle.textContent = `Gia đình bạn TIẾT KIỆM ĐƯỢC ${formatVND(Math.abs(data.diffTotal))} ₫/tháng (${Math.abs(data.diffPercent)}%) với biểu giá mới!`;
    if (currentKwh <= 100) {
      insightBody.textContent = `Ở mức dưới 100 kWh, Bậc 1 mới gộp mức 0-100 kWh với đơn giá ưu đãi chỉ 1.901 đ/kWh, rẻ hơn giá cũ Bậc 1 (1.984 đ) và Bậc 2 (2.050 đ/kWh).`;
    } else if (currentKwh <= 400) {
      insightBody.textContent = `Sản lượng của gia đình bạn (${formatVND(currentKwh)} kWh) rơi trọn vào khung Bậc 3 mới (201-400 kWh) với đơn giá chỉ 2.894 đ/kWh. So với biểu giá cũ (đoạn 201-300 kWh giá 2.998 đ và đoạn 301-400 kWh lên tới 3.350 đ/kWh), bạn được giảm tới 456 đ/kWh ở đoạn 301-400 kWh!`;
    } else {
      insightBody.textContent = `Mặc dù đoạn trên 400 kWh có đơn giá cao hơn để khuyến khích tiết kiệm, nhưng nhờ các đoạn đầu (đặc biệt đoạn 201-400 kWh giảm sâu), tổng chi phí vẫn thấp hơn biểu giá cũ.`;
    }
  } else if (data.diffTotal > 0) {
    insightAlert.className = 'insight-alert warning';
    insightTitle.textContent = `Chi phí tăng thêm ${formatVND(data.diffTotal)} ₫/tháng (+${data.diffPercent}%) so với biểu giá cũ`;
    insightBody.textContent = `Khi sử dụng trên 700 kWh, Bậc 5 mới áp dụng mức giá 3.844 đ/kWh (cao hơn bậc 6 cũ là 3.460 đ/kWh) nhằm hạn chế lãng phí điện năng ở các hộ tiêu thụ quy mô rất lớn. Bạn nên áp dụng các giải pháp tiết kiệm điện để hạ bớt sản lượng về khung bậc thấp hơn.`;
  } else {
    insightAlert.className = 'insight-alert';
    insightTitle.textContent = 'Chi phí tương đương giữa biểu giá cũ và mới';
    insightBody.textContent = 'Mức tiêu thụ này cho tổng tiền thanh toán xấp xỉ nhau giữa 2 biểu giá.';
  }

  // Render Detailed Comparison Table
  renderDetailedTable(data);

  // Render Segmented Bar & Cards
  breakdownKwhTotal.textContent = `Tổng: ${formatVND(currentKwh)} kWh`;
  segmentedBar.innerHTML = tierBreakdown.map(t => {
    return `<div class="seg-fill ${t.barClass}" style="width: ${t.percentage}%;" title="${t.name}: ${formatVND(t.kwhUsed)} kWh (${t.percentage.toFixed(1)}%)"></div>`;
  }).join('');

  tierCardGrid.innerHTML = tierBreakdown.map(t => {
    let stateClass = 'inactive-tier';
    if (t.isFull) stateClass = 'completed-tier';
    else if (t.isActive) stateClass = 'active-tier';

    const rangeLabel = t.max === Infinity ? `Từ ${t.min + 1} kWh trở lên` : `${t.min} - ${t.max} kWh`;

    return `
      <div class="tier-mini-card ${stateClass}">
        <div class="tier-mini-head">
          <span class="tier-pill-small ${t.bgClass}">${t.name}</span>
          <span class="tier-mini-rate">${formatVND(t.price)} đ</span>
        </div>
        <div class="tier-mini-amount">${formatVND(t.total)} ₫</div>
        <div class="tier-mini-used">${formatVND(t.kwhUsed)} kWh (${rangeLabel})</div>
      </div>
    `;
  }).join('');

  // Re-generate Lucide SVG icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Renders the 7-segment comparison table
 */
function renderDetailedTable(data) {
  let rowsHtml = '';

  data.segments.forEach(seg => {
    const rowClass = seg.isActive ? 'active-row' : 'inactive-row';
    const rateDiffClass = seg.diffRate < 0 ? 'diff-negative' : (seg.diffRate > 0 ? 'diff-positive' : 'diff-zero');
    const costDiffClass = seg.diffCost < 0 ? 'diff-negative' : (seg.diffCost > 0 ? 'diff-positive' : 'diff-zero');
    const rateDiffSign = seg.diffRate > 0 ? `+${formatVND(seg.diffRate)}` : `${formatVND(seg.diffRate)}`;
    const costDiffSign = seg.diffCost > 0 ? `+${formatVND(seg.diffCost)}` : `${formatVND(seg.diffCost)}`;
    const pctSign = seg.diffRate > 0 ? `+${seg.diffRatePct}%` : `${seg.diffRatePct}%`;

    rowsHtml += `
      <tr class="${rowClass}">
        <td class="col-segment">
          <strong>${seg.label}</strong>
          <div style="font-size: 11px; color: var(--text-muted);">${seg.sublabel}</div>
        </td>
        <td class="col-kwh font-digital"><strong>${formatVND(seg.kwhUsed)}</strong></td>
        <td class="sub-th-old font-digital">${formatVND(seg.oldPrice)}</td>
        <td class="sub-th-new font-digital">${formatVND(seg.newPrice)}</td>
        <td class="font-digital ${rateDiffClass}">${rateDiffSign} đ</td>
        <td class="sub-th-old font-digital">${formatVND(seg.costOld)} ₫</td>
        <td class="sub-th-new font-digital">${formatVND(seg.costNew)} ₫</td>
        <td class="font-digital ${costDiffClass}">${costDiffSign} ₫</td>
        <td class="font-digital ${rateDiffClass}">${pctSign}</td>
      </tr>
    `;
  });

  detailedTableBody.innerHTML = rowsHtml;

  // Table Footer
  const diffSubSign = data.diffSubtotal > 0 ? `+${formatVND(data.diffSubtotal)}` : `${formatVND(data.diffSubtotal)}`;
  const diffTotSign = data.diffTotal > 0 ? `+${formatVND(data.diffTotal)}` : `${formatVND(data.diffTotal)}`;
  const diffSubClass = data.diffSubtotal < 0 ? 'diff-negative' : (data.diffSubtotal > 0 ? 'diff-positive' : 'diff-zero');
  const diffTotClass = data.diffTotal < 0 ? 'diff-negative' : (data.diffTotal > 0 ? 'diff-positive' : 'diff-zero');

  detailedTableFoot.innerHTML = `
    <tr class="tfoot-subtotal">
      <td colspan="5" style="text-align: left;">Tổng tiền điện chưa thuế (A):</td>
      <td class="font-digital sub-th-old">${formatVND(data.subtotalOld)} ₫</td>
      <td class="font-digital sub-th-new">${formatVND(data.subtotalNew)} ₫</td>
      <td class="font-digital ${diffSubClass}">${diffSubSign} ₫</td>
      <td class="font-digital ${diffSubClass}">${data.diffPercent}%</td>
    </tr>
    <tr class="tfoot-vat">
      <td colspan="5" style="text-align: left;">Thuế GTGT (${Math.round(currentVatRate * 100)}%) (B):</td>
      <td class="font-digital sub-th-old">${formatVND(data.vatOld)} ₫</td>
      <td class="font-digital sub-th-new">${formatVND(data.vatNew)} ₫</td>
      <td class="font-digital ${diffTotClass}">${formatVND(data.vatNew - data.vatOld)} ₫</td>
      <td class="font-digital">-</td>
    </tr>
    <tr class="tfoot-total">
      <td colspan="5" style="text-align: left;"><strong>TỔNG TIỀN PHẢI THANH TOÁN (A + B):</strong></td>
      <td class="font-digital sub-th-old">${formatVND(data.totalOld)} ₫</td>
      <td class="font-digital sub-th-new" style="color: var(--neon-cyan); font-size: 16px;">${formatVND(data.totalNew)} ₫</td>
      <td class="font-digital ${diffTotClass}" style="font-size: 16px;">${diffTotSign} ₫</td>
      <td class="font-digital ${diffTotClass}">${data.diffPercent}%</td>
    </tr>
  `;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Direct Input
kwhInput.addEventListener('input', (e) => {
  let val = parseFloat(e.target.value) || 0;
  if (val < 0) val = 0;
  currentKwh = val;
  updateUI();
  updateUrlParam();
});

kwhSlider.addEventListener('input', (e) => {
  currentKwh = parseFloat(e.target.value) || 0;
  updateUI();
  updateUrlParam();
});

// Steppers
btnMinus50.addEventListener('click', () => {
  currentKwh = Math.max(0, currentKwh - 50);
  updateUI();
  updateUrlParam();
});

btnMinus10.addEventListener('click', () => {
  currentKwh = Math.max(0, currentKwh - 10);
  updateUI();
  updateUrlParam();
});

btnPlus10.addEventListener('click', () => {
  currentKwh += 10;
  updateUI();
  updateUrlParam();
});

btnPlus50.addEventListener('click', () => {
  currentKwh += 50;
  updateUI();
  updateUrlParam();
});

// Tabs
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
  const oVal = parseFloat(indexOld.value) || 0;
  const nVal = parseFloat(indexNew.value) || 0;
  const diff = Math.max(0, nVal - oVal);
  currentKwh = diff;
  updateUI();
  updateUrlParam();
}

indexOld.addEventListener('input', calcFromIndexes);
indexNew.addEventListener('input', calcFromIndexes);

// Preset Buttons
document.querySelectorAll('.preset-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentKwh = parseFloat(btn.dataset.kwh);

    if (btn.dataset.old && btn.dataset.new) {
      indexOld.value = btn.dataset.old;
      indexNew.value = btn.dataset.new;
    }

    updateUI();
    updateUrlParam();
  });
});

// VAT Selector
document.querySelectorAll('.vat-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vat-pill').forEach(b => b.classList.remove('active'));
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

// Copy Comparison Results
document.getElementById('btnCopyComparison').addEventListener('click', () => {
  const data = calculateSegments(currentKwh);
  const vatPct = Math.round(currentVatRate * 100);
  const diffSign = data.diffTotal > 0 ? `+${formatVND(data.diffTotal)}` : `${formatVND(data.diffTotal)}`;
  
  const text = [
    `⚡ KẾT QUẢ ĐỐI CHIẾU TIỀN ĐIỆN: CŨ (6 BẬC) VS MỚI (5 BẬC)`,
    `• Sản lượng tiêu thụ: ${formatVND(currentKwh)} kWh/tháng`,
    `----------------------------------------`,
    `📌 THEO BIỂU GIÁ MỚI 5 BẬC (Từ 01/11/2026):`,
    `• Tiền chưa thuế: ${formatVND(data.subtotalNew)} đ`,
    `• Thuế VAT (${vatPct}%): ${formatVND(data.vatNew)} đ`,
    `👉 TỔNG TIỀN MỚI: ${formatVND(data.totalNew)} đ (${numberToVietnameseCurrency(data.totalNew)})`,
    `----------------------------------------`,
    `📌 THEO BIỂU GIÁ CŨ 6 BẬC (Hiện hành):`,
    `• Tiền chưa thuế: ${formatVND(data.subtotalOld)} đ`,
    `• Thuế VAT (${vatPct}%): ${formatVND(data.vatOld)} đ`,
    `👉 TỔNG TIỀN CŨ: ${formatVND(data.totalOld)} đ`,
    `----------------------------------------`,
    `🎯 CHÊNH LỆCH: ${diffSign} đ (${data.diffPercent}%)`,
    data.diffTotal < 0 ? `=> TIẾT KIỆM ĐƯỢC: ${formatVND(Math.abs(data.diffTotal))} đ/tháng!` : `=> Tăng ${formatVND(data.diffTotal)} đ/tháng`,
    `Tra cứu trực tuyến tại: ${window.location.href}`
  ].join('\n');

  navigator.clipboard.writeText(text).then(() => {
    showToast('Đã sao chép bảng đối chiếu vào bộ nhớ tạm!');
  }).catch(() => {
    showToast('Lỗi khi sao chép!');
  });
});

// Share Link
document.getElementById('btnShareLink').addEventListener('click', () => {
  const url = `${window.location.origin}${window.location.pathname}?kwh=${currentKwh}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Đã sao chép liên kết (${currentKwh} kWh)!`);
  }).catch(() => {
    showToast('Không thể tạo liên kết chia sẻ!');
  });
});

// Print
document.getElementById('btnPrintBill').addEventListener('click', () => {
  window.print();
});

// Modal Logic
function openDocsModal(tab = 1) {
  imageModal.classList.add('open');
  switchModalTab(tab);
}

function switchModalTab(tab) {
  if (tab === 1) {
    modalTab1.classList.add('active');
    modalTab2.classList.remove('active');
    modalImg1.classList.remove('hidden');
    modalImg2.classList.add('hidden');
    modalCaption.textContent = 'Văn bản biểu giá bán lẻ điện sinh hoạt 5 bậc áp dụng từ 01/11/2026';
  } else {
    modalTab2.classList.add('active');
    modalTab1.classList.remove('active');
    modalImg2.classList.remove('hidden');
    modalImg1.classList.add('hidden');
    modalCaption.textContent = 'Bảng đối chiếu chi tiết đoạn thang 1000 kWh giữa giá cũ và giá mới';
  }
}

btnViewOfficialPrice.addEventListener('click', () => openDocsModal(1));
if (btnOpenDocsModal) {
  btnOpenDocsModal.addEventListener('click', () => openDocsModal(2));
}

modalTab1.addEventListener('click', () => switchModalTab(1));
modalTab2.addEventListener('click', () => switchModalTab(2));

btnCloseModal.addEventListener('click', () => imageModal.classList.remove('open'));
btnCloseModal2.addEventListener('click', () => imageModal.classList.remove('open'));
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) imageModal.classList.remove('open');
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

// Init
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('kwh')) {
    const pKwh = parseFloat(params.get('kwh'));
    if (!isNaN(pKwh) && pKwh >= 0) {
      currentKwh = pKwh;
    }
  }

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
