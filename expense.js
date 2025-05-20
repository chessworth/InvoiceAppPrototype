document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const expenseType = document.getElementById('expenseType');
    const otherTypeGroup = document.getElementById('otherTypeGroup');
    const otherExpenseType = document.getElementById('otherExpenseType');
    const expenseDate = document.getElementById('expenseDate');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    expenseDate.value = today;
    
    // Show/hide other expense type field
    expenseType.addEventListener('change', function() {
        if (this.value === 'other') {
            otherTypeGroup.style.display = 'block';
            otherExpenseType.setAttribute('required', 'required');
        } else {
            otherTypeGroup.style.display = 'none';
            otherExpenseType.removeAttribute('required');
        }
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        navigateTo('index.html');
    });
    
    // Form submission
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const finalExpenseType = expenseType.value === 'other' ? otherExpenseType.value : expenseType.value;
        
        const expense = {
            id: Date.now(),
            date: expenseDate.value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            type: finalExpenseType,
            description: document.getElementById('expenseDescription').value
        };
        
        // Save to localStorage
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        alert('Expense saved successfully!');
        navigateTo('expenses.html');
    });
});
