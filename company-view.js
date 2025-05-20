document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const editBtn = document.getElementById('editBtn');
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const printStatementBtn = document.getElementById('printStatementBtn');
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const noInvoices = document.getElementById('noInvoices');
    
    // Get company ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('id');
    
    if (!companyId) {
        alert('No company ID provided');
        navigateTo('companies.html');
        return;
    }
    
    // Load company data
    function loadCompanyData() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const company = companies.find(c => c.id == companyId);
        
        if (!company) {
            alert('Company not found');
            navigateTo('companies.html');
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
                    <td><a href="#" class="invoice-number-link" data-id="${invoice.id}">${invoice.invoiceNumber}</a></td>
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
        
        // Add event listeners to invoice number links
        document.querySelectorAll('.invoice-number-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const invoiceId = this.getAttribute('data-id');
                navigateTo('invoice-view.html', { id: invoiceId });
            });
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                navigateTo('invoice-view.html', { id: invoiceId });
            });
        });
    }
    
    // Generate and print company statement
    function generateCompanyStatement() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const company = companies.find(c => c.id == companyId);
        
        if (!company) {
            alert('Company not found');
            return;
        }
        
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const unpaidInvoices = invoices.filter(invoice => 
            invoice.companyId == companyId && 
            invoice.paymentStatus === 'unpaid'
        );
        
        // Create a new window for the statement
        const statementWindow = window.open('', '_blank');
        
        // Calculate total outstanding amount
        const totalOutstanding = unpaidInvoices.reduce((total, invoice) => 
            total + invoice.pricing.total, 0
        );
        
        // Get current date
        const currentDate = new Date().toLocaleDateString();
        
        // Generate statement HTML
        let statementHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Statement for ${company.name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                    }
                    .statement-header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .statement-header h1 {
                        color: #2c3e50;
                        margin-bottom: 5px;
                    }
                    .statement-date {
                        font-style: italic;
                        margin-bottom: 20px;
                    }
                    .company-details, .summary {
                        margin-bottom: 30px;
                    }
                    .company-details h2, .invoice-list h2, .summary h2 {
                        color: #2c3e50;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .total-row {
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 50px;
                        text-align: center;
                        font-size: 0.9em;
                        color: #7f8c8d;
                    }
                    @media print {
                        body {
                            padding: 0;
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="statement-header">
                    <h1>Statement of Account</h1>
                    <div class="statement-date">Generated on: ${currentDate}</div>
                </div>
                
                <div class="company-details">
                    <h2>Company Information</h2>
                    <p><strong>${company.name}</strong><br>
                    ${company.streetAddress}<br>
                    ${company.city}, ${company.postalCode}<br>
                    Tel: ${company.telephone}<br>
                    Email: ${company.email}</p>
                </div>
                
                <div class="invoice-list">
                    <h2>Outstanding Invoices</h2>
        `;
        
        if (unpaidInvoices.length === 0) {
            statementHTML += `
                <p>No outstanding invoices found for this company.</p>
            `;
        } else {
            statementHTML += `
                <table>
                    <thead>
                        <tr>
                            <th>Invoice Number</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Subtotal</th>
                            <th>HST</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            unpaidInvoices.forEach(invoice => {
                statementHTML += `
                    <tr>
                        <td>${invoice.invoiceNumber}</td>
                        <td>${invoice.dateCreated}</td>
                        <td>${invoice.items.length}</td>
                        <td>$${invoice.pricing.subtotal.toFixed(2)}</td>
                        <td>$${invoice.pricing.hst.toFixed(2)}</td>
                        <td>$${invoice.pricing.total.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            statementHTML += `
                    </tbody>
                </table>
            `;
        }
        
        statementHTML += `
                <div class="summary">
                    <h2>Summary</h2>
                    <table>
                        <tr class="total-row">
                            <td>Total Outstanding Balance:</td>
                            <td>$${totalOutstanding.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="footer">
                    <p>Thank you for your business. Please remit payment at your earliest convenience.</p>
                    <p>For questions regarding this statement, please contact our accounting department.</p>
                </div>
            </body>
            </html>
        `;
        
        // Write the HTML to the new window and print
        statementWindow.document.write(statementHTML);
        statementWindow.document.close();
        
        // Wait for resources to load before printing
        setTimeout(() => {
            statementWindow.print();
        }, 500);
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        navigateTo('companies.html');
    });
    
    editBtn.addEventListener('click', function() {
        navigateTo('company-edit.html', { id: companyId });
    });
    
    createInvoiceBtn.addEventListener('click', function() {
        // Use the preSelectCompany function from app.js
        preSelectCompany(companyId);
    });
    
    printStatementBtn.addEventListener('click', function() {
        generateCompanyStatement();
    });
    
    // Load data
    loadCompanyData();
});



