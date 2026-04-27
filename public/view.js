/**
 * The View is like the 'Face' of our calculator.
 * it handles everything you see on the screen and how it looks.
 */
class CalculatorView {
    constructor() {
        // Find the 'top' part of the screen where the previous number goes
        this.previousOperandElement = document.getElementById('previous-operand');
        // Find the 'main' part of the screen where the big numbers show up
        this.currentOperandElement = document.getElementById('current-operand');
        
        // Find the side panel where we show the history
        this.historyPanel = document.getElementById('history-panel');
        // Find the actual list inside that side panel
        this.historyList = document.getElementById('history-list');
        // Find the button that opens the history
        this.historyToggle = document.getElementById('history-toggle');
        // Find the 'X' button that closes the history
        this.closeHistoryBtn = document.getElementById('close-history');
        // Find the button that deletes all history
        this.clearHistoryBtn = document.getElementById('clear-history');
        
        // Grab every button on the calculator that has a number or an action
        this.buttons = document.querySelectorAll('button[data-value], button[data-action]');
    }

    // This function updates what is shown on the calculator screen
    updateDisplay(model) {
        // Take the number from our 'Brain' (Model) and put it on the main screen
        this.currentOperandElement.innerText = this.formatNumber(model.currentOperand);
        
        // If we are currently doing math (like 5 + ...), show the '5 +' at the top
        if (model.operation != null) {
            this.previousOperandElement.innerText = `${this.formatNumber(model.previousOperand)} ${this.getOperatorSymbol(model.operation)}`;
        } else {
            // If we aren't doing math yet, keep the top section empty
            this.previousOperandElement.innerText = '';
        }
    }

    // This function makes numbers look nice by adding commas (like 1,000 instead of 1000)
    formatNumber(number) {
        // If the screen says 'Error', just leave it as 'Error'
        if (number === 'Error') return 'Error';
        // Turn the number into text so we can work with it
        const stringNumber = number.toString();
        // Split the number into the part before the dot and the part after the dot
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        // This will hold the pretty version of the number
        let integerDisplay;
        
        // If there are no numbers yet, leave it empty
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Use the browser's built-in tool to add commas where they belong
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        // If there is a decimal part (like .5), put it back onto the formatted number
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            // Otherwise, just return the pretty whole number
            return integerDisplay;
        }
    }

    // This function changes code symbols like '*' into pretty symbols like '×'
    getOperatorSymbol(operator) {
        // Create a map that links the code symbol to the pretty screen symbol
        const symbols = { '*': '×', '/': '÷', '+': '+', '-': '−' };
        // Return the pretty symbol, or just the original if we don't have a pretty one
        return symbols[operator] || operator;
    }

    // This function builds the list of old calculations in the history side panel
    renderHistory(history) {
        // Empty the list first so we don't show old things twice
        this.historyList.innerHTML = '';
        // Go through every saved calculation in our list
        history.forEach(item => {
            // Create a new box for each calculation
            const historyItem = document.createElement('div');
            // Give the box a style name so CSS can make it look good
            historyItem.className = 'history-item';
            // Put the math and the answer inside the box
            historyItem.innerHTML = `
                <div class="calc">${item.calculation} =</div>
                <div class="res">${this.formatNumber(item.result)}</div>
            `;
            // Add this box into the history list on the screen
            this.historyList.appendChild(historyItem);
        });
    }

    // This function slides the history panel in or out
    toggleHistory() {
        // This 'active' word tells CSS to slide the panel onto the screen
        this.historyPanel.classList.toggle('active');
    }

    // This function specifically closes the history panel
    closeHistory() {
        // Remove the 'active' word so the panel slides away
        this.historyPanel.classList.remove('active');
    }

    // This function lets the Controller know whenever ANY button is clicked
    bindClick(handler) {
        // For every button we found earlier...
        this.buttons.forEach(button => {
            // Listen for a click...
            button.addEventListener('click', () => {
                // Get the number or action stored on that button
                const { value, action } = button.dataset;
                // Send that information to the 'Handler' (which is in the Controller)
                handler({ value, action });
            });
        });
    }

    // This function sets up the buttons for the History panel
    bindHistoryControls(toggleHandler, clearHandler) {
        // When you click the main History button, run the 'toggle' function
        this.historyToggle.addEventListener('click', toggleHandler);
        // When you click the 'X' button, close the panel
        this.closeHistoryBtn.addEventListener('click', () => this.closeHistory());
        // When you click 'Clear History', run the 'clear' function
        this.clearHistoryBtn.addEventListener('click', clearHandler);
    }
}
