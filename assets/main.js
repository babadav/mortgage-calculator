//Elements On Page
const clearAllButton = document.querySelector(".clear-all");

const mortTermInput = document.getElementById("mortgage-term-input");
const mortAmountInput = document.getElementById("mortgage-amount-input");
const interestRateInput = document.getElementById("interest-rate-input");

const radioWrappers = document.querySelectorAll(".radio-wrapper");
const repaymentRadio = document.querySelector("#repayment-radio");
const interestOnlyRadio = document.querySelector("#interest-only-radio");
const calculateButton = document.querySelector(".calculate-button");

const monthlyAmountOutput = document.querySelector(".monthly-amount");
const totalTermOutput = document.querySelector(".term-amount");

const defaultResultsContainer = document.querySelector(
  ".results-container.default"
);
const liveResultsContainer = document.querySelector(
  ".results-container.live-results"
);

const resultsWrap = document.querySelector(".results-wrap");
const interestResult = document.querySelector(".interest-only-result");
const monthlyRepaymentsWrap = document.querySelector(".monthly-repayments");
const totalTermWrap = document.querySelector(".total-term");
const interestOnlyOutput = document.querySelector(".interest-amount");

const textInputs = document.querySelectorAll('input[type="number"]');
const radioInputs = document.querySelectorAll('input[type="radio"]');

const errorStates = document.querySelectorAll(".error-state");
const errorMessages = document.querySelectorAll(".error-message");
const textInputArr = [];

//Clear All button
function clearAll() {
  //Clear text inputs
  textInputs.forEach((tInput) => {
	tInput.value = "";
	tInput.parentElement.classList.remove("error-state");
  });

  //Clear radio inputs
  radioInputs.forEach((rInput) => {
	rInput.checked = false;
  });

  //Clear error mesages
  errorMessages.forEach((message) => {
	message.style.display = "none";
  });

  //Reset to default containers
  liveResultsContainer.classList.add("displayNone");
  defaultResultsContainer.classList.remove("displayNone");
}

//Handle error states
function handleErrorState() {
  // Get all the input groups
  const textInputGroups = document.querySelectorAll(".input-group");

  const radioErrorMessage = document.querySelector(
	".calculator-selector .error-message"
  );

  // Loop through each input group
  textInputGroups.forEach((group) => {
	const input = group.querySelector("input");
	const errorMessage = group.querySelector(".error-message");

	// Check if the input is empty
	if (input.value.trim() === "") {
	  errorMessage.style.display = "block"; // Show the error message
	  input.parentElement.classList.add("error-state");
	} else {
	  errorMessage.style.display = "none"; // Hide the error message
	  input.parentElement.classList.remove("error-state");
	}
  });

  // Check if any radio input is checked
  let isChecked = false;
  radioInputs.forEach((radio) => {
	if (radio.checked) {
	  isChecked = true;
	}
  });

  // Show or hide the error message based on the validation
  if (!isChecked) {
	radioErrorMessage.style.display = "block"; // Show the error message
  } else {
	radioErrorMessage.style.display = "none"; // Hide the error message
  }
}

function whichContainerShows() {
  const isRepaymentOnly = repaymentRadio.checked;
  const isInterestOnly = interestOnlyRadio.checked;

  if (isRepaymentOnly) {
	liveResultsContainer.classList.remove("displayNone");
	defaultResultsContainer.classList.add("displayNone");
	resultsWrap.classList.remove("interest-only");

	document.querySelector(".total-term").classList.remove("displayNone");
	document
	  .querySelector(".monthly-repayments")
	  .classList.remove("displayNone");
	interestResult.classList.add("displayNone");
  } else if (isInterestOnly) {
	resultsWrap.classList.add("interest-only");
	liveResultsContainer.classList.remove("displayNone");
	defaultResultsContainer.classList.add("displayNone");
	document.querySelector(".total-term").classList.add("displayNone");
	document.querySelector(".monthly-repayments").classList.add("displayNone");
	interestResult.classList.remove("displayNone");
  }
}

//Format numbers with commas
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Handle calculations
//ADD DO NOTHING IF INPUTS NOT FILLED IN
function handleMortgageCalculations() {
  let isRepaymentOnly = repaymentRadio.checked; //help

  const mortTermInputVal = +mortTermInput.value;
  const mortAmountInputVal = +mortAmountInput.value;
  const interestRateInputVal = +interestRateInput.value / 100;

  if (isRepaymentOnly) {
	const numberOfPayments = mortTermInputVal * 12;
	const monthlyInterestRate = interestRateInputVal / 12;

	// Formula to calculate monthly payment
	const monthlyRepayment =
	  (mortAmountInputVal *
		(monthlyInterestRate *
		  Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
	  (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
	const totalRepayment = monthlyRepayment * numberOfPayments;

	// Display results
	monthlyAmountOutput.textContent =
	  "\u00A3" + formatNumberWithCommas(monthlyRepayment.toFixed(2));

	totalTermOutput.textContent =
	  "\u00A3" + formatNumberWithCommas(totalRepayment.toFixed(2));
  } else {
	interestResult.classList.remove("displayNone");
	monthlyRepaymentsWrap.classList.add("displayNone");
	totalTermWrap.classList.add("displayNone");

	let monthlyInterestRate = interestRateInputVal;
	const annualInterestRate = interestRateInputVal;
	const mortgageAmount = document.getElementById(
	  "mortgage-amount-input"
	).value;

	// Convert annual interest rate to decimal and calculate monthly rate
	monthlyInterestRate = annualInterestRate / 12;

	// Calculate the interest-only monthly payment
	const interestOnlyPayment = mortgageAmount * monthlyInterestRate;

	// Display interest rate
	interestOnlyOutput.textContent =
	  "\u00A3" + formatNumberWithCommas(interestOnlyPayment.toFixed(2));
  }
}

function inputAutoUpdate() {
  calculateRepayments();
}

// Calculate Repayments Button
function calculateRepayments(e) {
  e.preventDefault();
  handleErrorState();
  whichContainerShows();
  handleMortgageCalculations();
}

//Auto update results
textInputs.forEach((input) => {
  input.addEventListener("keyup", () => {
	setTimeout(() => {
	  handleMortgageCalculations();
	}, 300);
  });
});

//Set Event Listeners
clearAllButton.addEventListener("click", clearAll);
calculateButton.addEventListener("click", calculateRepayments);
