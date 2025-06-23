let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '' && previousInput !== '' && operator !== '') {
            calculateResult();
        }
        operator = value;
        previousInput = currentInput;
        currentInput = '';
        display.value += value;
    } 
    // Handle decimal point
    else if (value === '.') {
        if (!currentInput.includes('.')) {
            if (currentInput === '') {
                currentInput = '0.';
                display.value += '0.';
            } else {
                currentInput += '.';
                display.value += '.';
            }
        }
    }
    // Handle numbers
    else {
        currentInput += value;
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    if (display.value.length > 0) {
        let lastChar = display.value.slice(-1);
        display.value = display.value.slice(0, -1);
        
        if (['+', '-', '*', '/'].includes(lastChar)) {
            operator = '';
            currentInput = previousInput;
            previousInput = '';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }
}

function calculateResult() {
    if (previousInput !== '' && currentInput !== '' && operator !== '') {
        let result;
        let prev = parseFloat(previousInput);
        let curr = parseFloat(currentInput);
        
        switch (operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                if (curr === 0) {
                    display.value = 'Error';
                    clearDisplay();
                    return;
                }
                result = prev / curr;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});