document.addEventListener('DOMContentLoaded', function() {
    const companiesTableBody = document.getElementById('companiesTableBody');
    const noCompanies = document.getElementById('noCompanies');
    const backBtn = document.getElementById('backBtn');
    const addCompanyBtn = document.getElementById('addCompanyBtn');
    const companySearch = document.getElementById('companySearch');
    const searchBtn = document.getElementById('searchBtn');
    const filterField = document.getElementById('filterField');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;
    let filteredCompanies = [];
    
    // Load and display companies
    function loadCompanies() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        filteredCompanies = [...companies]; // Make a copy for filtering
        
        if (companies.length === 0) {
            document.querySelector('.table-container').style.display = 'none';
            document.querySelector('.pagination').style.display = 'none';
            noCompanies.style.display = 'block';
            return;
        }
        
        document.querySelector('.table-container').style.display = 'block';
        document.querySelector('.pagination').style.display = 'flex';
        noCompanies.style.display = 'none';
        
        updatePagination();
        displayCompanies();
    }
    
    // Display companies for current page
    function displayCompanies() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const companiesForPage = filteredCompanies.slice(startIndex, endIndex);
        
        let html = '';
        companiesForPage.forEach(company => {
            html += `
                <tr>
                    <td>${company.name}</td>
                    <td>${company.streetAddress}</td>
                    <td>${company.city}</td>
                    <td>${company.postalCode}</td>
                    <td>${company.telephone}</td>
                    <td>${company.email}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${company.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${company.id}">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        companiesTableBody.innerHTML = html;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const companyId = this.getAttribute('data-id');
                window.location.href = `company-edit.html?id=${companyId}`;
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const companyId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this company?')) {
                    deleteCompany(companyId);
                }
            });
        });
    }
    
    // Delete company
    function deleteCompany(companyId) {
        let companies = JSON.parse(localStorage.getItem('companies')) || [];
        companies = companies.filter(company => company.id != companyId);
        localStorage.setItem('companies', JSON.stringify(companies));
        
        // Check if company is used in any invoices
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const hasInvoices = invoices.some(invoice => invoice.companyId == companyId);
        
        if (hasInvoices) {
            alert('This company has associated invoices. The company has been deleted, but invoices will show "Unknown Company".');
        }
        
        loadCompanies();
    }
    
    // Update pagination controls
    function updatePagination() {
        totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
        
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Search and filter companies
    function searchCompanies() {
        const searchTerm = companySearch.value.toLowerCase();
        const field = filterField.value;
        
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        
        if (searchTerm === '') {
            filteredCompanies = [...companies];
        } else {
            filteredCompanies = companies.filter(company => {
                if (field === 'all') {
                    return (
                        company.name.toLowerCase().includes(searchTerm) ||
                        company.city.toLowerCase().includes(searchTerm) ||
                        company.email.toLowerCase().includes(searchTerm) ||
                        company.streetAddress.toLowerCase().includes(searchTerm) ||
                        company.postalCode.toLowerCase().includes(searchTerm) ||
                        company.telephone.toLowerCase().includes(searchTerm)
                    );
                } else {
                    return company[field].toLowerCase().includes(searchTerm);
                }
            });
        }
        
        currentPage = 1;
        updatePagination();
        displayCompanies();
        
        // Show no results message if needed
        if (filteredCompanies.length === 0 && companies.length > 0) {
            document.querySelector('.table-container').style.display = 'none';
            noCompanies.style.display = 'block';
            noCompanies.innerHTML = '<p>No companies match your search criteria.</p>';
        }
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    addCompanyBtn.addEventListener('click', function() {
        window.location.href = 'company-form.html';
    });
    
    searchBtn.addEventListener('click', searchCompanies);
    
    companySearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchCompanies();
        }
    });
    
    filterField.addEventListener('change', searchCompanies);
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            displayCompanies();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            displayCompanies();
        }
    });
    
    // Initial load
    loadCompanies();
    
    /* 
    SQL Queries for future implementation:
    
    -- Get all companies with pagination
    SELECT * FROM companies
    ORDER BY name
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Count total companies for pagination
    SELECT COUNT(*) FROM companies;
    
    -- Search companies by all fields
    SELECT * FROM companies
    WHERE 
        name LIKE :searchTerm OR
        street_address LIKE :searchTerm OR
        city LIKE :searchTerm OR
        postal_code LIKE :searchTerm OR
        telephone LIKE :searchTerm OR
        email LIKE :searchTerm
    ORDER BY name
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Search companies by specific field
    SELECT * FROM companies
    WHERE :field LIKE :searchTerm
    ORDER BY name
    LIMIT :itemsPerPage OFFSET :offset;
    
    -- Delete company
    DELETE FROM companies WHERE id = :companyId;
    
    -- Check if company has invoices
    SELECT COUNT(*) FROM invoices WHERE company_id = :companyId;
    */
});




