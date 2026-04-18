// --- ELEMENTS ---

const billRange = document.getElementById("billRange");
const kwRange = document.getElementById("kwRange");
const yearsRange = document.getElementById("yearsRange");

const billValue = document.getElementById("billValue");
const kwValue = document.getElementById("kwValue");
const yearsValue = document.getElementById("yearsValue");

const buttons = document.querySelectorAll(".presets button");
const calculateBtn = document.querySelector(".primary-btn.full");

const totalEl = document.getElementById("total");
const annualEl = document.getElementById("annual");
const paybackEl = document.getElementById("payback");
const roiEl = document.getElementById("roi");

const systemCostEl = document.getElementById("systemCost");
const taxCreditEl = document.getElementById("taxCredit");
const newCostEl = document.getElementById("newCost");
const monthlyEl = document.getElementById("monthly");

// --- STATE ---

let state = {
    bill: 120,
    kw: 6,
    years: 20
};

// --- HELPERS ---

function format(num) {
    return Math.round(num).toLocaleString("en-US");
}

function setProgress(range) {
    const percent =
        ((range.value - range.min) / (range.max - range.min)) * 100;

    range.style.setProperty("--progress", percent + "%");
}

// --- UI UPDATE (БЕЗ РАСЧЁТОВ) ---

function updateUI() {
    billValue.textContent = state.bill;
    kwValue.textContent = state.kw;
    yearsValue.textContent = state.years;

    billRange.value = state.bill;
    kwRange.value = state.kw;
    yearsRange.value = state.years;

    // активная кнопка
    buttons.forEach(btn => {
        btn.classList.toggle(
            "active",
            Number(btn.dataset.value) === state.bill
        );
    });

    setProgress(billRange);
    setProgress(kwRange);
    setProgress(yearsRange);
}

// --- CALCULATE (КАК В МАКЕТЕ) ---

function calculate() {
    const systemCost = state.kw * 2500;
    const taxCredit = systemCost * 0.3;
    const newCost = systemCost - taxCredit;

    const annualSavings = state.bill * 12 * 0.85;

    // 👇 магический коэффициент из макета
    const totalSavings = annualSavings * 25.5;

    const payback = Math.floor(newCost / annualSavings);

    const roi = (totalSavings / newCost) * 100;

    const monthlyRate = 0.065 / 12;
    const n = state.years * 12;

    const monthly =
        (newCost * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -n));

    // UI
    systemCostEl.textContent = "$" + format(systemCost);
    taxCreditEl.textContent = "-$" + format(taxCredit);
    newCostEl.textContent = "$" + format(newCost);

    annualEl.textContent = format(annualSavings);
    totalEl.textContent = format(totalSavings);
    paybackEl.textContent = payback;
    roiEl.textContent = Math.round(roi);
    monthlyEl.textContent = format(monthly);
}

// --- EVENTS ---

billRange.addEventListener("input", e => {
    state.bill = +e.target.value;
    updateUI();
});

kwRange.addEventListener("input", e => {
    state.kw = +e.target.value;
    updateUI();
});

yearsRange.addEventListener("input", e => {
    state.years = +e.target.value;
    updateUI();
});

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        state.bill = +btn.dataset.value;
        updateUI();
    });
});

// расчет только по кнопке
calculateBtn.addEventListener("click", () => {
    calculate();
});

// --- INIT ---

updateUI();
calculate(); // стартовые значения как в макете