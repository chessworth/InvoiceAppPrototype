document.addEventListener('DOMContentLoaded', function() {
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const createCompanyBtn = document.getElementById('createCompanyBtn');
    const viewCompaniesBtn = document.getElementById('viewCompaniesBtn');
    const viewInvoicesBtn = document.getElementById('viewInvoicesBtn');
    
    // Initialize localStorage if needed
    if (!localStorage.getItem('companies')) {
        localStorage.setItem('companies', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('invoices')) {
        localStorage.setItem('invoices', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('lastInvoiceNumber')) {
        localStorage.setItem('lastInvoiceNumber', '000');
    }
    
    createInvoiceBtn.addEventListener('click', function() {
        window.location.href = 'invoice-form.html';
    });
    
    createCompanyBtn.addEventListener('click', function() {
        window.location.href = 'company-form.html';
    });
    
    viewCompaniesBtn.addEventListener('click', function() {
        window.location.href = 'companies.html';
    });
    
    viewInvoicesBtn.addEventListener('click', function() {
        window.location.href = 'invoices.html';
    });
});




