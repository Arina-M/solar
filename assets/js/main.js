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
const systemKwEl = document.getElementById("systemKw");
const themeToggle = document.getElementById("theme-toggle");
const themeToggleIcon = themeToggle?.querySelector("use");
const mainNav = document.getElementById("main-nav");
const menuOpenButton = document.querySelector(".menu-toggle--open");
const menuCloseButton = document.querySelector(".menu-toggle--close");
const menuLinks = mainNav?.querySelectorAll(".list-menu-link");

const hasCalculator = [
    billRange,
    kwRange,
    yearsRange,
    billValue,
    kwValue,
    yearsValue,
    calculateBtn,
    totalEl,
    annualEl,
    paybackEl,
    roiEl,
    systemCostEl,
    taxCreditEl,
    newCostEl,
    monthlyEl,
    systemKwEl
].every(Boolean);

//burger menu
if (mainNav && menuOpenButton && menuCloseButton) {
    const setMenuState = isOpen => {
        mainNav.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuOpenButton.setAttribute("aria-expanded", String(isOpen));
    };

    menuOpenButton.addEventListener("click", () => setMenuState(true));
    menuCloseButton.addEventListener("click", () => setMenuState(false));
    menuLinks?.forEach(link => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            setMenuState(false);
        }
    });
}

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


//primary button mouse moving
document.querySelectorAll(".primary-btn").forEach(button => {
    button.addEventListener("mousemove", event => {
        const rect = button.getBoundingClientRect();

        button.style.setProperty("--btn-x", `${event.clientX - rect.left}px`);
        button.style.setProperty("--btn-y", `${event.clientY - rect.top}px`);
    });

    button.addEventListener("mouseleave", () => {
        button.style.removeProperty("--btn-x");
        button.style.removeProperty("--btn-y");
    });
});

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
    systemKwEl.textContent = state.kw;

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

if (hasCalculator) {
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
}





//testimmonials
const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const slider = document.querySelector(".slider");
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

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
    }, 4000);
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

if (track && slider && nextButton && prevButton && slides.length && dots.length) {
    // --- arrows ---

    nextButton.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        updateSlider();
        pauseAutoplay();
    });

    prevButton.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlider();
        pauseAutoplay();
    });

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
}







// FAQ
const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length) {
    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");

        if (!header) {
            return;
        }

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
}




//accordion closing and num highlights
const accordionItems = document.querySelectorAll(".accordion-item");
const markers = document.querySelectorAll(".marker");

if (accordionItems.length) {
    const setChecklistActive = (fitId, shouldToggle = false) => {
        const activeItem = Array.from(accordionItems).find(item => item.dataset.fit === fitId);
        const isActive = activeItem?.classList.contains("active");

        accordionItems.forEach(item => {
            item.classList.remove("active");
        });

        markers.forEach(marker => {
            marker.classList.remove("active");
        });

        if (shouldToggle && isActive) {
            return;
        }

        activeItem?.classList.add("active");

        markers.forEach(marker => {
            if (marker.dataset.fit === fitId) {
                marker.classList.add("active");
            }
        });
    };

    accordionItems.forEach(item => {

        const header = item.querySelector(".accordion-header");

        if (!header) {
            return;
        }

        header.addEventListener("click", () => {
            setChecklistActive(item.dataset.fit, true);
        });

    });

    if (markers.length) {
        markers.forEach(marker => {
            marker.addEventListener("click", () => {
                setChecklistActive(marker.dataset.fit);
            });
        });
    }
}





// contact form validation

const form = document.getElementById("quoteForm");

if (form) {
    const submitButton = form.querySelector(".form-submit");
    const submitButtonText = submitButton?.querySelector(".form-submit__text");
    const defaultSubmitText = submitButtonText?.textContent || "";

    const fields = {
        firstName: {
            input: document.getElementById("firstName"),
            control: document.getElementById("firstName"),
            error: document.getElementById("firstNameError"),
            requiredMessage: "Name is required",
            validate(value) {
                const trimmedValue = value.trim();

                if (!trimmedValue) {
                    return this.requiredMessage;
                }

                return trimmedValue.length < 2 ? "Minimum 2 characters" : "";
            }
        },
        lastName: {
            input: document.getElementById("lastName"),
            control: document.getElementById("lastName"),
            error: document.getElementById("lastNameError"),
            requiredMessage: "Name is required",
            validate(value) {
                const trimmedValue = value.trim();

                if (!trimmedValue) {
                    return this.requiredMessage;
                }

                return trimmedValue.length < 2 ? "Minimum 2 characters" : "";
            }
        },
        userEmail: {
            input: document.getElementById("userEmail"),
            control: document.getElementById("userEmail"),
            error: document.getElementById("userEmailError"),
            validate(value) {
                const trimmedValue = value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!trimmedValue) {
                    return "Mail is required";
                }

                return emailPattern.test(trimmedValue) ? "" : "Invalid email format";
            }
        },
        userPhone: {
            input: document.getElementById("userPhone"),
            control: document.getElementById("userPhone"),
            error: document.getElementById("userPhoneError"),
            validate(value) {
                const trimmedValue = value.trim();
                const phoneCharactersPattern = /^[+\d\s().-]+$/;
                const digitsOnly = trimmedValue.replace(/\D/g, "");

                if (!trimmedValue) {
                    return "Telephone required";
                }

                if (!phoneCharactersPattern.test(trimmedValue) || digitsOnly.length < 7 || digitsOnly.length > 15) {
                    return "Invalid phone format";
                }

                return "";
            }
        },
        userBill: {
            input: document.getElementById("userBill"),
            control: document.querySelector(".custom-select__trigger"),
            error: document.getElementById("userBillError"),
            validate(value) {
                return value.trim() ? "" : "Monthly electricity bill is required";
            }
        },
        tick: {
            input: document.getElementById("tick"),
            control: document.querySelector(".checkbox__box"),
            error: document.getElementById("tickError"),
            validate(_, input) {
                return input.checked ? "" : "Consent is required";
            }
        }
    };

    const getFieldValue = field => field.input.type === "checkbox" ? "" : field.input.value;

    const isFieldReady = field => Boolean(field.input && field.error);

    const setFieldState = (field, errorMessage, isActivelyEditing = false) => {
        if (!isFieldReady(field)) {
            return;
        }

        const hasError = Boolean(errorMessage);

        field.error.textContent = errorMessage;
        field.input.setAttribute("aria-invalid", String(hasError));
        field.control?.setAttribute("aria-invalid", String(hasError));
        field.control?.classList.toggle("is-invalid", hasError && !isActivelyEditing);
        field.control?.classList.toggle("is-fixing", hasError && isActivelyEditing);
    };

    const validateField = (field, isActivelyEditing = false) => {
        if (!isFieldReady(field)) {
            return true;
        }

        const errorMessage = field.validate(getFieldValue(field), field.input);

        setFieldState(field, errorMessage, isActivelyEditing);

        return !errorMessage;
    };

    const setSubmitLoading = isLoading => {
        if (!submitButton || !submitButtonText) {
            return;
        }

        submitButton.classList.toggle("loading", isLoading);
        submitButton.disabled = isLoading;
        submitButton.setAttribute("aria-busy", String(isLoading));
        submitButtonText.textContent = isLoading ? "Sending..." : defaultSubmitText;
    };

    setSubmitLoading(false);

    Object.values(fields).forEach(field => {
        if (!isFieldReady(field)) {
            return;
        }

        setFieldState(field, "");

        const eventName = field.input.type === "checkbox" || field.input.type === "hidden" ? "change" : "input";

        field.input.addEventListener(eventName, () => {
            validateField(field, true);
        });

        field.input.addEventListener("blur", () => {
            validateField(field);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (submitButton?.classList.contains("loading")) {
            return;
        }

        const validationResults = Object.values(fields).map(field => validateField(field));
        const isValid = validationResults.every(Boolean);

        if (isValid) {
            setSubmitLoading(true);

            window.setTimeout(() => {
                window.location.href = "./success.html";
            }, 1000);
        }
    });
}

//select in contact form

const select = document.querySelector(".custom-select");

if (select) {
    const trigger = select.querySelector(".custom-select__trigger");
    const options = select.querySelectorAll(".custom-select__option");
    const value = select.querySelector(".custom-select__value");
    const selectInput = document.getElementById("userBill");

    if (trigger && value && selectInput) {
        // open / close

        trigger.addEventListener("click", (e) => {

            e.stopPropagation();

            select.classList.toggle("open");
            trigger.setAttribute("aria-expanded", String(select.classList.contains("open")));

        });

        // select option

        if (options.length) {
            options.forEach(option => {

                option.addEventListener("click", (e) => {

                    e.stopPropagation();

                    // active

                    options.forEach(o => {
                        o.classList.remove("active");
                    });

                    option.classList.add("active");

                    // text

                    value.textContent = option.textContent;
                    selectInput.value = option.textContent.trim();
                    selectInput.dispatchEvent(new Event("change", { bubbles: true }));

                    // close

                    select.classList.remove("open");
                    trigger.setAttribute("aria-expanded", "false");

                });

            });
        }

        // click outside

        document.addEventListener("click", (e) => {

            if (!select.contains(e.target)) {
                select.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
            }

        });
    }
}
