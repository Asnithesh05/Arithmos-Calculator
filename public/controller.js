/**
 * The Controller is like the 'Manager' of the project.
 * it connects the 'Brain' (Model) to the 'Face' (View).
 */
class CalculatorController {
    constructor(model, view) {
        // Save the Brain (Model) so the Manager can talk to it
        this.model = model;
        // Save the Face (View) so the Manager can tell it what to show
        this.view = view;

        // Immediately update the screen to show what is currently in the Brain
        this.updateView();
        
        // Load history from the server when the app starts
        this.initHistory();
        
        // Tell the Face (View) to call the Manager whenever a button is clicked
        this.view.bindClick(this.handleInput.bind(this));
        
        // Set up the buttons for the History side panel
        this.view.bindHistoryControls(
            // When the toggle is clicked, tell the View to slide the panel
            () => this.view.toggleHistory(),
            // When clear is clicked, run the Manager's clear history function
            () => this.handleClearHistory()
        );
    }

    // This function loads the history from the server and refreshes the view
    async initHistory() {
        await this.model.loadHistory();
        this.updateView();
    }

    // This function decides what to do based on which button you clicked
    async handleInput({ value, action }) {
        // If you clicked the 'AC' button...
        if (action === 'clear') {
            // Tell the Brain to wipe all current numbers
            this.model.clear();
        } 
        // If you clicked the 'DEL' (backspace) button...
        else if (action === 'delete') {
            // Tell the Brain to remove the last number you typed
            this.model.delete();
        } 
        // If you clicked a math symbol (+, -, *, /)...
        else if (action === 'operator') {
            // Tell the Brain which operation you want to do
            this.model.chooseOperation(value);
        } 
        // If you clicked the '=' button...
        else if (action === 'calculate') {
            // Tell the Brain to do the final math and get the answer
            // Note: compute is now async because it saves to the database
            await this.model.compute();
        } 
        // If you clicked a number or a dot...
        else if (value) {
            // Tell the Brain to add that number to the screen
            this.model.appendNumber(value);
        }

        // After the Brain is updated, tell the Face (View) to show the new numbers
        this.updateView();
    }

    // This function handles deleting all the saved history
    async handleClearHistory() {
        // Tell the Brain to delete all saved calculations from the database
        await this.model.clearHistory();
        // Tell the Face (View) to empty the history list shown on the screen
        this.view.renderHistory(this.model.history);
    }

    // This is the Manager's main tool for refreshing the whole screen
    updateView() {
        // Tell the View to update the numbers on the calculator screen
        this.view.updateDisplay(this.model);
        // Tell the View to update the history list in the side panel
        this.view.renderHistory(this.model.history);
    }
}
