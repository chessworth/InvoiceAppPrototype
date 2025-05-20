// Centralized utility functions

// Navigation function
window.navigateTo = function(page, params = {}) {
    let url = page;
    
    // Add query parameters if provided
    if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
            queryParams.append(key, params[key]);
        }
        url += `?${queryParams.toString()}`;
    }
    
    window.location.href = url;
};

// Store company ID in session storage for pre-selection
window.preSelectCompany = function(companyId) {
    sessionStorage.setItem('preselectedCompany', companyId);
    navigateTo('invoice-form.html');
};