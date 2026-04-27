/**
 * The Model is like the 'Brain' of our calculator.
 * it stores all the numbers and does the actual math.
 */
class CalculatorModel {
    constructor() {
        // This holds the number currently being typed on the screen
        this.currentOperand = '0';
        // This holds the previous number before you pressed an operator like +
        this.previousOperand = '';
        // This stores which math symbol (+, -, *, /) you clicked
        this.operation = undefined;
        // History starts empty and will be loaded from the server
        this.history = [];
    }

    // This function loads history from the backend API
    async loadHistory() {
        try {
            const response = await fetch('/api/history');
            this.history = await response.json();
            return this.history;
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    }

    // This function wipes everything clean to start a new calculation
    clear() {
        // Set the main number back to zero
        this.currentOperand = '0';
        // Make the top number empty
        this.previousOperand = '';
        // Forget the math symbol
        this.operation = undefined;
    }

    // This function acts like a backspace key
    delete() {
        // If the screen is already zero, there is nothing to delete
        if (this.currentOperand === '0') return;
        // If there is only one number left, turn it back into a zero
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            // Otherwise, just remove the very last character you typed
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    // This function adds a new number to the screen when you click a button
    appendNumber(number) {
        // If you click a dot but there is already a dot, don't add another one
        if (number === '.' && this.currentOperand.includes('.')) return;
        // If the screen shows zero and you type a number, replace the zero with that number
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            // Otherwise, just stick the new number onto the end of what is already there
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // This function saves the current number and the math symbol you clicked
    chooseOperation(operation) {
        // If the screen is empty, you can't choose a math symbol yet
        if (this.currentOperand === '') return;
        // If you already have two numbers ready, do the math for those first
        if (this.previousOperand !== '') {
            this.compute();
        }
        // Save the math symbol you just clicked
        this.operation = operation;
        // Move the number on the screen to the 'top' section
        this.previousOperand = this.currentOperand;
        // Clear the main screen so you can type the next number
        this.currentOperand = '';
    }

    // This is where the actual math happens!
    async compute() {
        // This will hold the final answer
        let computation;
        // Turn the 'top' number string into a real math number
        const prev = parseFloat(this.previousOperand);
        // Turn the 'main' number string into a real math number
        const current = parseFloat(this.currentOperand);
        // If either part is missing, we can't do the math, so stop here
        if (isNaN(prev) || isNaN(current)) return;
        
        // Check which math symbol was used and do the calculation
        switch (this.operation) {
            case '+':
                // Add the numbers together
                computation = prev + current;
                break;
            case '-':
                // Subtract the second number from the first
                computation = prev - current;
                break;
            case '*':
                // Multiply the numbers
                computation = prev * current;
                break;
            case '/':
                // Divide the numbers, but show an error if trying to divide by zero
                computation = current === 0 ? 'Error' : prev / current;
                break;
            default:
                // If something goes wrong, just stop
                return;
        }

        // Save current state for history before updating operands
        const calculation = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;

        // Put the final answer on the main screen
        this.currentOperand = computation.toString();
        // Clear the saved math symbol
        this.operation = undefined;
        // Clear the top number section
        this.previousOperand = '';

        // If the math worked (no errors), save this to our database
        if (computation !== 'Error') {
            await this.saveToHistory(calculation, computation);
        }
    }

    // This function saves your calculation to the database via API
    async saveToHistory(calculation, result) {
        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calculation, result: result.toString() })
            });
            if (response.ok) {
                // Reload history to get the latest list including the new item
                await this.loadHistory();
            }
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    // This function wipes out all your saved history from the database
    async clearHistory() {
        try {
            const response = await fetch('/api/history', { method: 'DELETE' });
            if (response.ok) {
                this.history = [];
            }
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }
}
