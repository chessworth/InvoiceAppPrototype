document.addEventListener('DOMContentLoaded', function() {
    const companyForm = document.getElementById('companyForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
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
        
        // Set form values
        document.getElementById('companyName').value = company.name;
        document.getElementById('streetAddress').value = company.streetAddress;
        document.getElementById('city').value = company.city;
        document.getElementById('postalCode').value = company.postalCode;
        document.getElementById('telephone').value = company.telephone;
        document.getElementById('email').value = company.email;
    }
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        navigateTo('company-view.html', { id: companyId });
    });
    
    // Form submission
    companyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const updatedCompany = {
            name: document.getElementById('companyName').value,
            streetAddress: document.getElementById('streetAddress').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            telephone: document.getElementById('telephone').value,
            email: document.getElementById('email').value
        };
        
        // Update company in localStorage
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const companyIndex = companies.findIndex(c => c.id == companyId);
        
        if (companyIndex === -1) {
            alert('Company not found');
            return;
        }
        
        // Preserve the ID
        companies[companyIndex] = {
            ...companies[companyIndex],
            ...updatedCompany
        };
        
        localStorage.setItem('companies', JSON.stringify(companies));
        
        alert('Company updated successfully!');
        navigateTo('company-view.html', { id: companyId });
    });
    
    // Initial load
    loadCompanyData();
});

