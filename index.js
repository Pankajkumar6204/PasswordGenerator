// !!!!!!!!!! All Element Fetch using querySelector !!!!!!!!!!
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

let passwordDisplay = document.querySelector("[data-passwordDisplay");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*(){[}+]?/;"<.,>=|:';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to gray
setIndicator("#ccc");


// Set PasswordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min))+ "% 100%";
}

// Indicator show
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}
function generateLowerCase() {
   return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randomNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

// Strength Calculated
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Copy content effects
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    // To make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

// shuffle password
function shufflePassword(array){
    //fisher yates method
    for(let i= array.length -1; i > 0; i--){
        // Random j, find out using ramdom function
        const j= Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;


}
// Generate password Effects


// Slider Effects
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// Copied
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value);
    copyContent();
})

// All Checkboxes Effects
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked){
            checkCount++;
        }
    })  
    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    } 
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// Generate Button Effects
generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if (checkCount == 0) 
    return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // Let's start to find new password

    console.log('starting the journey');
    //Remove old password
    password = "";
    // Let's puts the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password = password + generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    // Compulsory addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }
    console.log('compulsory addition done');

    // Remaining addition
    for(let i=0; i<passwordLength-funArr.length; i++){
        let randIndex = getRndInteger(0,funArr.length);
        password += funArr[randIndex]();
    }
    console.log('remaining addition done');

    // suffle the password
    password = shufflePassword(Array.from(password));
    console.log('suffling done')
    // show in UI
    passwordDisplay.value = password;
    console.log('UI done')
    // calculate Strength
    calcStrength();

});