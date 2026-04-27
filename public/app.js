/**
 * The App is the 'Starter' of the project.
 * It is the very first piece of code that runs when the page opens.
 */

// This waits for the website to be fully ready before starting the code
document.addEventListener('DOMContentLoaded', () => {
    // 1. First, we create the 'Brain' (Model)
    // This is where the math and storage logic lives
    const model = new CalculatorModel();
    
    // 2. Second, we create the 'Face' (View)
    // This is where the screen and button logic lives
    const view = new CalculatorView();
    
    // 3. Finally, we create the 'Manager' (Controller)
    // We give the Brain and the Face to the Manager so it can make them work together
    new CalculatorController(model, view);
});
