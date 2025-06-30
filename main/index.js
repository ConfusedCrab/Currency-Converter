const fromCurrency = document.querySelector("#fromCurrency");
const toCurrency = document.querySelector("#toCurrency");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");
const amountInput = document.querySelector("#amount");
const resultDiv = document.querySelector("#result");
const form = document.querySelector("form");
const apiURL = "https://api.exchangerate-api.com/v4/latest/"; // Working API

//  Update flag image based on currency code
function updateFlag(imgElement, currencyCode) {
    const countryCode = countryList[currencyCode];  // Get country code from list
    imgElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`; // Update flag
}

// Populate currency dropdowns
function populateDropdowns() {
    for (let code in countryList) {
        const option1 = new Option(code, code);
        const option2 = new Option(code, code);
        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    }

    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    updateFlag(fromFlag, "USD");
    updateFlag(toFlag, "INR");
}

//  Fetch exchange rate
async function fetchExchangeRate(from, to) {
    try {
        const res = await fetch(`${apiURL}${from}`);
        const data = await res.json();
        return data.rates[to];
    } catch (err) {
        console.error("Fetch error:", err);
        throw new Error("Failed to fetch exchange rate");
    }
}

//  Handle conversion
async function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }

    resultDiv.innerText = "Fetching exchange rate...";

    try {
        const rate = await fetchExchangeRate(from, to);
        const converted = (amount * rate).toFixed(2);
        resultDiv.innerText = `${amount} ${from} = ${converted} ${to}`;
    } catch (error) {
        resultDiv.innerText = "⚠️ Unable to fetch exchange rate. Please try again.";
    }
}

//  Event listeners
fromCurrency.addEventListener("change", () => updateFlag(fromFlag, fromCurrency.value));
toCurrency.addEventListener("change", () => updateFlag(toFlag, toCurrency.value));

//  Handle form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    convertCurrency();
});

//  Initial setup
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
    amountInput.value = "1";
    convertCurrency();
});
