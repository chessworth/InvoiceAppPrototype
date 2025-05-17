document.addEventListener('DOMContentLoaded', function() {
    const expensesTableBody = document.getElementById('expensesTableBody');
    const noExpenses = document.getElementById('noExpenses');
    const backBtn = document.getElementById('backBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseSearch = document.getElementById('expenseSearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterField = document.getElementById('filterField');
    const expenseTypeFilter = document.getElementById('expenseTypeFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const totalExpenses = document.getElementById('totalExpenses');
    const exportBtn = document.getElementById('exportBtn');
    
    // Date filter elements
    const dateFilterType = document.getElementById('dateFilterType');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const applyDateFilter = document.getElementById('applyDateFilter');
    
    // Set default dates for custom range
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    startDate.value = firstDayOfMonth.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];
    
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredExpenses = [];
    
    // Date filter variables
    let currentDateFilter = 'all';
    let customStartDate = null;
    let customEndDate = null;
    
    // Load and display expenses
    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        
        if (expenses.length === 0) {
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('.pagination').style.display = 'none';
            noExpenses.style.display = 'block';
            return;
        }
        
        // Sort expenses by date (newest first)
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Apply initial filters
        applyFilters(expenses);
        
        document.querySelector('.table-container').style.display = 'block';
        document.querySelector('.pagination').style.display = 'flex';
        noExpenses.style.display = 'none';
    }
    
    // Apply all filters (search, type, date)
    function applyFilters(expenses) {
        const searchTerm = expenseSearch.value.toLowerCase();
        const field = filterField.value;
        const typeFilter = expenseTypeFilter.value;

        // First apply date filter
        let dateFiltered = applyDateFilterToExpenses(expenses);
        
        // Then filter by expense type
        let typeFiltered = dateFiltered;
        if (typeFilter && typeFilter !== 'all') {
            typeFiltered = dateFiltered.filter(expense => {
                if (typeFilter === 'other') {
                    // For "other", check if the type is not one of the predefined types
                    const predefinedTypes = ['gas', 'utility', 'maintenance', 'insurance', 'office'];
                    return !predefinedTypes.includes(expense.type.toLowerCase());
                } else {
                    return expense.type.toLowerCase() === typeFilter;
                }
            });
        }
        
        // Finally filter by search term
        if (!searchTerm) {
            filteredExpenses = typeFiltered;
        } else {
            filteredExpenses = typeFiltered.filter(expense => {
                if (field === 'all') {
                    return expense.type.toLowerCase().includes(searchTerm) ||
                           expense.date.includes(searchTerm) ||
                           (expense.description && expense.description.toLowerCase().includes(searchTerm));
                } else if (field === 'type') {
                    return expense.type.toLowerCase().includes(searchTerm);
                } else if (field === 'date') {
                    return expense.date.includes(searchTerm);
                }
                return true;
            });
        }
        
        // Sort by date (newest first)
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        currentPage = 1;
        updatePagination();
        displayExpenses();
        
        // Show no results message if needed
        if (filteredExpenses.length === 0 && expenses.length > 0) {
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('.pagination').style.display = 'none';
            noExpenses.style.display = 'block';
            noExpenses.innerHTML = '<p>No expenses match your filter criteria.</p>';
        } else {
            document.querySelector('.table-container').style.display = 'block';
            document.querySelector('.pagination').style.display = 'flex';
            noExpenses.style.display = 'none';
        }
    }
    
    // Apply date filter based on selected option
    function applyDateFilterToExpenses(expenses) {
        if (currentDateFilter === 'all') {
            return expenses;
        }
        
        const today = new Date();
        let filterStartDate, filterEndDate;
        
        if (currentDateFilter === 'thisMonth') {
            // This month: from the 1st day of current month to today
            filterStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
            filterEndDate = today;
        } else if (currentDateFilter === 'thisYear') {
            // This year: from January 1st of current year to today
            filterStartDate = new Date(today.getFullYear(), 0, 1);
            filterEndDate = today;
        } else if (currentDateFilter === 'custom') {
            // Custom range: use the selected dates
            filterStartDate = customStartDate ? new Date(customStartDate) : null;
            filterEndDate = customEndDate ? new Date(customEndDate) : null;
            
            // Set time to end of day for end date to include the full day
            if (filterEndDate) {
                filterEndDate.setHours(23, 59, 59, 999);
            }
        }
        
        // If no valid dates, return all expenses
        if (!filterStartDate || !filterEndDate) {
            return expenses;
        }
        
        // Filter expenses by date range
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= filterStartDate && expenseDate <= filterEndDate;
        });
    }
    
    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Display expenses for current page
    function displayExpenses() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const expensesToDisplay = filteredExpenses.slice(startIndex, endIndex);
        
        let html = '';
        let total = 0;
        
        expensesToDisplay.forEach(expense => {
            
            html += `
                <tr>
                    <td>${formatDate(expense.date)}</td>
                    <td>${capitalizeFirstLetter(expense.type)}</td>
                    <td>${expense.description || '-'}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>
                        <button class="edit-btn" data-id="${expense.id}">Edit</button>
                        <button class="delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                </tr>
            `;
            
            total += expense.amount;
        });
        
        expensesTableBody.innerHTML = html;
        
        // Calculate grand total of all filtered expenses
        const grandTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalExpenses.textContent = `$${grandTotal.toFixed(2)}`;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const expenseId = this.getAttribute('data-id');
                window.location.href = `expense-edit.html?id=${expenseId}`;
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const expenseId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this expense?')) {
                    deleteExpense(expenseId);
                }
            });
        });
    }
    
    // Delete expense
    function deleteExpense(expenseId) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(expense => expense.id != expenseId);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        loadExpenses();
    }
    
    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Search expenses
    function searchExpenses() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        applyFilters(expenses);
    }
    
    // Export to CSV
    function exportToCSV() {
        if (filteredExpenses.length === 0) {
            alert('No expenses to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = "Date,Type,Description,Amount\n";
        
        filteredExpenses.forEach(expense => {
            const description = expense.description ? `"${expense.description.replace(/"/g, '""')}"` : '';
            
            csvContent += `${expense.date},${expense.type},${description},$${expense.amount.toFixed(2)}\n`;
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        
        // Add date range info to filename if filtering by date
        let filename = 'expenses';
        if (currentDateFilter === 'thisMonth') {
            const today = new Date();
            filename += `-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
        } else if (currentDateFilter === 'thisYear') {
            filename += `-${new Date().getFullYear()}`;
        } else if (currentDateFilter === 'custom' && customStartDate && customEndDate) {
            filename += `-${customStartDate.replace(/-/g, '')}-to-${customEndDate.replace(/-/g, '')}`;
        }
        
        a.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    addExpenseBtn.addEventListener('click', function() {
        window.location.href = 'expense-form.html';
    });
    
    searchBtn.addEventListener('click', searchExpenses);
    
    expenseSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchExpenses();
        }
    });
    
    filterField.addEventListener('change', searchExpenses);
    
    expenseTypeFilter.addEventListener('change', searchExpenses);
    
    // Date filter event listeners
    dateFilterType.addEventListener('change', function() {
        currentDateFilter = this.value;
        
        if (currentDateFilter === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
            
            // Apply filter immediately for non-custom options
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            applyFilters(expenses);
        }
    });
    
    applyDateFilter.addEventListener('click', function() {
        customStartDate = startDate.value;
        customEndDate = endDate.value;
        
        if (!customStartDate || !customEndDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        if (new Date(customStartDate) > new Date(customEndDate)) {
            alert('Start date cannot be after end date');
            return;
        }
        
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        applyFilters(expenses);
    });
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            displayExpenses();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            displayExpenses();
        }
    });
    
    exportBtn.addEventListener('click', exportToCSV);
    
    // Initial load
    loadExpenses();
});


