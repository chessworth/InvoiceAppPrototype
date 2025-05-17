document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const expenseType = document.getElementById('expenseType');
    const otherTypeGroup = document.getElementById('otherTypeGroup');
    const otherExpenseType = document.getElementById('otherExpenseType');
    
    // Get expense ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const expenseId = urlParams.get('id');
    
    if (!expenseId) {
        alert('No expense ID provided');
        window.location.href = 'expenses.html';
        return;
    }
    
    // Load expense data
    function loadExpenseData() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const expense = expenses.find(exp => exp.id == expenseId);
        
        if (!expense) {
            alert('Expense not found');
            window.location.href = 'expenses.html';
            return;
        }
        
        // Set form values
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseDescription').value = expense.description || '';
        
        // Handle expense type
        const predefinedTypes = ['gas', 'utility', 'maintenance', 'insurance', 'office'];
        if (predefinedTypes.includes(expense.type.toLowerCase())) {
            expenseType.value = expense.type.toLowerCase();
        } else {
            expenseType.value = 'other';
            otherTypeGroup.style.display = 'block';
            otherExpenseType.value = expense.type;
        }
    }
    
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
        window.location.href = 'expenses.html';
    });
    
    // Form submission
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const finalExpenseType = expenseType.value === 'other' ? otherExpenseType.value : expenseType.value;
        
        // Update expense object
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const expenseIndex = expenses.findIndex(exp => exp.id == expenseId);
        
        if (expenseIndex === -1) {
            alert('Expense not found');
            return;
        }
        
        expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            date: document.getElementById('expenseDate').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            type: finalExpenseType,
            description: document.getElementById('expenseDescription').value
        };
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        alert('Expense updated successfully!');
        window.location.href = 'expenses.html';
    });
    
    // Initialize
    loadExpenseData();
});

