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
const themeToggle = document.getElementById("theme-toggle");
const themeToggleIcon = themeToggle?.querySelector("use");

//toggle theme
if (themeToggle) {
    const setThemeIcon = isDark => {
        themeToggleIcon?.setAttribute(
            "href",
            `./assets/images/symbol-defs.svg#icon-${isDark ? "moon" : "sun"}`
        );
    };

    const savedTheme = localStorage.getItem("theme");
    const isDarkTheme = savedTheme === "dark";

    if (isDarkTheme) {
        document.body.classList.add("dark");
    }

    themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
    setThemeIcon(isDarkTheme);

    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");

        themeToggle.setAttribute("aria-pressed", String(isDark));
        setThemeIcon(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// --- STATE ---

let state = {
    bill: 120,
    kw: 6,
    years: 20
};

// --- HELPERS ---

function format(num) {
    // return Math.round(num).toLocaleString("en-US");
    return Math.round(num)
        .toLocaleString("en-US")
        .replace(/,/g, " ");
}

function setProgress(range) {
    const percent =
        ((range.value - range.min) / (range.max - range.min)) * 100;

    range.style.setProperty("--progress", percent + "%");
}

// --- UI UPDATE ---

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

// --- CALCULATE ---

function calculate() {
    const systemCost = state.kw * 2500;
    const taxCredit = systemCost * 0.3;
    const newCost = systemCost - taxCredit;

    const annualSavings = state.bill * 12 * 0.85;

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

calculateBtn.addEventListener("click", () => {
    calculate();
});

// --- INIT ---

updateUI();
calculate(); 






//accordion Why Solar
const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        items.forEach(i => i.classList.remove("active"));

        if (!isActive) {
            item.classList.add("active");
        }
    });
});





//testimmonials
const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const slider = document.querySelector(".slider");

let index = 0;

// timer
let autoplayInterval;
let restartTimeout;

function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlider();
    }, 4000); // каждые 4 сек
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

function pauseAutoplay() {
    stopAutoplay();

    clearTimeout(restartTimeout);

    restartTimeout = setTimeout(() => {
        startAutoplay();
    }, 10000); 
}

// --- arrows ---

document.querySelector(".next").onclick = () => {
    index = (index + 1) % slides.length;
    updateSlider();
    pauseAutoplay();
};

document.querySelector(".prev").onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
    pauseAutoplay();
};

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        index = +dot.dataset.index;
        updateSlider();
        pauseAutoplay();
    });
});

slider.addEventListener("mouseenter", stopAutoplay);
slider.addEventListener("mouseleave", startAutoplay);

updateSlider();
startAutoplay();







// FAQ

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const header = item.querySelector(".faq-header");

    header.addEventListener("click", () => {

        const isActive = item.classList.contains("active");

        faqItems.forEach(i => {
            i.classList.remove("active");
        });

        if (!isActive) {
            item.classList.add("active");
        }
    });
});
