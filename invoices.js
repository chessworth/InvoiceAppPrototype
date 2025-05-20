document.addEventListener('DOMContentLoaded', function() {
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const noInvoices = document.getElementById('noInvoices');
    const backBtn = document.getElementById('backBtn');
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const invoiceSearch = document.getElementById('invoiceSearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterField = document.getElementById('filterField');
    const paymentStatusFilter = document.getElementById('paymentStatusFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;
    let filteredInvoices = [];
    
    // Load and display invoices
    function loadInvoices() {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        
        // Enrich invoices with company names for easier filtering
        const enrichedInvoices = invoices.map(invoice => {
            const company = companies.find(c => c.id == invoice.companyId) || { name: 'Unknown Company' };
            return {
                ...invoice,
                companyName: company.name
            };
        });
        
        filteredInvoices = [...enrichedInvoices]; // Make a copy for filtering
        
        if (invoices.length === 0) {
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('.pagination').style.display = 'none';
            noInvoices.style.display = 'block';
            return;
        }
        
        document.querySelector('.table-container').style.display = 'block';
        document.querySelector('.pagination').style.display = 'flex';
        noInvoices.style.display = 'none';
        
        updatePagination();
        displayInvoices();
    }
    
    // Display invoices for current page
    function displayInvoices() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const invoicesForPage = filteredInvoices.slice(startIndex, endIndex);
        
        let html = '';
        invoicesForPage.forEach(invoice => {
            const statusClass = invoice.paymentStatus === 'unpaid' ? 'status-unpaid' : `status-${invoice.paymentStatus}`;
            html += `
                <tr class="${statusClass}">
                    <td><a href="#" class="invoice-number-link" data-id="${invoice.id}">${invoice.invoiceNumber}</a></td>
                    <td>${invoice.dateCreated}</td>
                    <td><a href="#" class="company-name-link" data-id="${invoice.companyId}">${invoice.companyName}</a></td>
                    <td>${invoice.items.length}</td>
                    <td>$${invoice.pricing.subtotal.toFixed(2)}</td>
                    <td>$${invoice.pricing.hst.toFixed(2)}</td>
                    <td>$${invoice.pricing.total.toFixed(2)}</td>
                    <td>${invoice.paymentStatus}</td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn view-btn" data-id="${invoice.id}">View</button>
                            <button class="action-btn edit-btn" data-id="${invoice.id}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${invoice.id}">Delete</button>
                        </div>
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
        
        // Add event listeners to company name links
        document.querySelectorAll('.company-name-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const companyId = this.getAttribute('data-id');
                navigateTo('company-view.html', { id: companyId });
            });
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                navigateTo('invoice-view.html', { id: invoiceId });
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                navigateTo('invoice-edit.html', { id: invoiceId });
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this invoice?')) {
                    deleteInvoice(invoiceId);
                }
            });
        });
    }
    
    // Delete invoice
    function deleteInvoice(invoiceId) {
        let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices = invoices.filter(invoice => invoice.id != invoiceId);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        loadInvoices();
    }
    
    // Update pagination controls
    function updatePagination() {
        totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
        
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Search and filter invoices
    function searchInvoices() {
        const searchTerm = invoiceSearch.value.toLowerCase();
        const field = filterField.value;
        const status = paymentStatusFilter.value;
        
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        
        // Enrich invoices with company names for filtering
        const enrichedInvoices = invoices.map(invoice => {
            const company = companies.find(c => c.id == invoice.companyId) || { name: 'Unknown Company' };
            return {
                ...invoice,
                companyName: company.name
            };
        });
        
        // First filter by payment status
        let statusFiltered = enrichedInvoices;
        if (status !== 'all') {
            statusFiltered = enrichedInvoices.filter(invoice => invoice.paymentStatus === status);
        }
        
        // Then filter by search term
        if (searchTerm === '') {
            filteredInvoices = [...statusFiltered];
        } else {
            filteredInvoices = statusFiltered.filter(invoice => {
                if (field === 'all') {
                    return (
                        invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
                        invoice.dateCreated.toLowerCase().includes(searchTerm) ||
                        invoice.companyName.toLowerCase().includes(searchTerm) ||
                        invoice.paymentStatus.toLowerCase().includes(searchTerm)
                    );
                } else if (field === 'invoiceNumber') {
                    return invoice.invoiceNumber.toLowerCase().includes(searchTerm);
                } else if (field === 'company') {
                    return invoice.companyName.toLowerCase().includes(searchTerm);
                } else if (field === 'date') {
                    return invoice.dateCreated.toLowerCase().includes(searchTerm);
                } else if (field === 'status') {
                    return invoice.paymentStatus.toLowerCase().includes(searchTerm);
                }
                return false;
            });
        }
        
        currentPage = 1;
        updatePagination();
        displayInvoices();
        
        // Show no results message if needed
        if (filteredInvoices.length === 0 && invoices.length > 0) {
            document.querySelector('.table-container').style.display = 'none';
            noInvoices.style.display = 'block';
            noInvoices.innerHTML = '<p>No invoices match your search criteria.</p>';
        }
        else {
            document.querySelector('.table-container').style.display = 'block';
            noInvoices.style.display = 'none';
        }
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        navigateTo('index.html');
    });
    
    createInvoiceBtn.addEventListener('click', function() {
        navigateTo('invoice-form.html');
    });
    
    searchBtn.addEventListener('click', searchInvoices);
    
    invoiceSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchInvoices();
        }
    });
    
    filterField.addEventListener('change', searchInvoices);
    
    paymentStatusFilter.addEventListener('change', searchInvoices);
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            displayInvoices();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            displayInvoices();
        }
    });
    
    // Initial load
    loadInvoices();
    
    /* 
    SQL Queries for future implementation:
    
    -- Get all invoices with pagination
    SELECT 
        i.id, i.invoice_number, i.date_created, i.payment_status,
        c.name as company_name,
        COUNT(ii.id) as item_count,
        i.subtotal, i.hst, i.total
    FROM invoices i
    LEFT JOIN companies c ON i.company_id = c.id
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    GROUP BY i.id
    ORDER BY i.date_created DESC
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Count total invoices for pagination
    SELECT COUNT(*) FROM invoices;
    
    -- Search invoices by all fields
    SELECT 
        i.id, i.invoice_number, i.date_created, i.payment_status,
        c.name as company_name,
        COUNT(ii.id) as item_count,
        i.subtotal, i.hst, i.total
    FROM invoices i
    LEFT JOIN companies c ON i.company_id = c.id
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    WHERE 
        i.invoice_number LIKE :searchTerm OR
        i.date_created LIKE :searchTerm OR
        c.name LIKE :searchTerm OR
        i.payment_status LIKE :searchTerm
    GROUP BY i.id
    ORDER BY i.date_created DESC
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Filter invoices by payment status
    SELECT 
        i.id, i.invoice_number, i.date_created, i.payment_status,
        c.name as company_name,
        COUNT(ii.id) as item_count,
        i.subtotal, i.hst, i.total
    FROM invoices i
    LEFT JOIN companies c ON i.company_id = c.id
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    WHERE i.payment_status = :status
    GROUP BY i.id
    ORDER BY i.date_created DESC
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Delete invoice
    DELETE FROM invoice_items WHERE invoice_id = :invoiceId;
    DELETE FROM invoices WHERE id = :invoiceId;
    */
});








