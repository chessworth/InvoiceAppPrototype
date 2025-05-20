document.addEventListener('DOMContentLoaded', function() {
    const companyForm = document.getElementById('companyForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    cancelBtn.addEventListener('click', function() {
        navigateTo('index.html');
    });
    
    companyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const company = {
            id: Date.now(), // Use timestamp as unique ID
            name: document.getElementById('companyName').value,
            streetAddress: document.getElementById('streetAddress').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            telephone: document.getElementById('telephone').value,
            email: document.getElementById('email').value
        };
        
        // Save to localStorage
        const companies = JSON.parse(localStorage.getItem('companies'));
        companies.push(company);
        localStorage.setItem('companies', JSON.stringify(companies));
        
        alert('Company saved successfully!');
        navigateTo('index.html');
    });
});

