document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const editBtn = document.getElementById('editBtn');
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const noInvoices = document.getElementById('noInvoices');
    
    // Get company ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('id');
    
    if (!companyId) {
        alert('No company ID provided');
        window.location.href = 'companies.html';
        return;
    }
    
    // Load company data
    function loadCompanyData() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const company = companies.find(c => c.id == companyId);
        
        if (!company) {
            alert('Company not found');
            window.location.href = 'companies.html';
            return;
        }
        
        // Display company info
        document.getElementById('companyName').textContent = company.name;
        document.getElementById('streetAddress').textContent = company.streetAddress;
        document.getElementById('city').textContent = company.city;
        document.getElementById('postalCode').textContent = company.postalCode;
        document.getElementById('telephone').textContent = company.telephone;
        document.getElementById('email').textContent = company.email;
        
        // Load related invoices
        loadRelatedInvoices(companyId);
    }
    
    // Load invoices related to this company
    function loadRelatedInvoices(companyId) {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const relatedInvoices = invoices.filter(invoice => invoice.companyId == companyId);
        
        if (relatedInvoices.length === 0) {
            document.querySelector('.table-container table').style.display = 'none';
            noInvoices.style.display = 'block';
            return;
        }
        
        document.querySelector('.table-container table').style.display = 'table';
        noInvoices.style.display = 'none';
        
        let html = '';
        relatedInvoices.forEach(invoice => {
            const statusClass = invoice.paymentStatus === 'unpaid' ? 'status-unpaid' : `status-${invoice.paymentStatus}`;
            html += `
                <tr class="${statusClass}">
                    <td>${invoice.invoiceNumber}</td>
                    <td>${invoice.dateCreated}</td>
                    <td>${invoice.items.length}</td>
                    <td>$${invoice.pricing.total.toFixed(2)}</td>
                    <td>${invoice.paymentStatus}</td>
                    <td>
                        <button class="action-btn view-btn" data-id="${invoice.id}">View</button>
                    </td>
                </tr>
            `;
        });
        
        invoicesTableBody.innerHTML = html;
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                window.location.href = `invoice-view.html?id=${invoiceId}`;
            });
        });
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        window.location.href = 'companies.html';
    });
    
    editBtn.addEventListener('click', function() {
        window.location.href = `company-edit.html?id=${companyId}`;
    });
    
    createInvoiceBtn.addEventListener('click', function() {
        // Store the company ID in sessionStorage to pre-select it in the invoice form
        sessionStorage.setItem('preselectedCompany', companyId);
        window.location.href = 'invoice-form.html';
    });
    
    // Load data
    loadCompanyData();
});
