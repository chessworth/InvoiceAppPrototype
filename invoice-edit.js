document.addEventListener('DOMContentLoaded', function() {
    const invoiceForm = document.getElementById('invoiceForm');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsContainer = document.getElementById('itemsContainer');
    const cancelBtn = document.getElementById('cancelBtn');
    const companySelect = document.getElementById('companySelect');
    const addCompanyBtn = document.getElementById('addCompanyBtn');
    const invoiceNumber = document.getElementById('invoiceNumber');
    const dateCreated = document.getElementById('dateCreated');
    const subtotalInput = document.getElementById('subtotalInput');
    const hstInput = document.getElementById('hstInput');
    const totalInput = document.getElementById('totalInput');
    
    // Get invoice ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    
    if (!invoiceId) {
        alert('No invoice ID provided');
        navigateTo( 'invoices.html');
        return;
    }
    
    // Load companies into select dropdown
    function loadCompanies() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        
        // Clear existing options except the first one
        while (companySelect.options.length > 1) {
            companySelect.remove(1);
        }
        
        // Add companies to dropdown
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name;
            companySelect.appendChild(option);
        });
    }
    
    // Display company details when selected
    companySelect.addEventListener('change', function() {
        const companyId = this.value;
        if (!companyId) {
            document.getElementById('companyDetails').style.display = 'none';
            return;
        }
        
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const company = companies.find(c => c.id == companyId);
        
        if (company) {
            document.getElementById('displayCompanyName').textContent = company.name;
            document.getElementById('displayAddress').textContent = 
                `${company.streetAddress}, ${company.city}, ${company.postalCode}`;
            document.getElementById('displayContact').textContent = 
                `Tel: ${company.telephone} | Email: ${company.email}`;
            
            document.getElementById('companyDetails').style.display = 'block';
        }
    });
    
    // Add new company button
    addCompanyBtn.addEventListener('click', function() {
        navigateTo( 'company-form.html');
    });
    
    // Add item row
    function addItemRow(item = null) {
        const newRow = document.createElement('div');
        newRow.className = 'item-row';
        newRow.innerHTML = `
            <input type="number" placeholder="Unit" class="item-unit" value="${item ? item.unit || '' : ''}">
            <input type="text" placeholder="Plate" class="item-plate" value="${item ? item.plate || '' : ''}">
            <input type="text" placeholder="Make" class="item-make" value="${item ? item.make || '' : ''}">
            <input type="text" placeholder="VIN Number" class="item-vin" value="${item ? item.vin || '' : ''}">
            <input type="number" placeholder="Odometer" class="item-odometer" value="${item ? item.odometer || '' : ''}">
            <input type="number" placeholder="Year" class="item-year" value="${item ? item.year || '' : ''}">
            <input type="number" placeholder="Quantity" class="item-quantity" value="${item ? item.quantity || 1 : 1}">
            <input type="number" placeholder="Price" class="item-price" value="${item ? item.price || 0 : ''}">
            <span class="item-total">$${item ? item.total.toFixed(2) : '0.00'}</span>
            <button type="button" class="delete-row-btn">&times;</button>
        `;
        itemsContainer.appendChild(newRow);
        
        // Add event listeners to new inputs
        addCalculationListeners(newRow);
        
        // Add delete button listener
        const deleteBtn = newRow.querySelector('.delete-row-btn');
        deleteBtn.addEventListener('click', function() {
            if (itemsContainer.querySelectorAll('.item-row').length > 1) {
                newRow.remove();
                updatePricing();
            } else {
                alert('You need at least one vehicle entry.');
            }
        });
    }
    
    // Calculate item totals
    function addCalculationListeners(row) {
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const totalSpan = row.querySelector('.item-total');
        
        // Set default quantity to 1
        if (!quantityInput.value) {
            quantityInput.value = 1;
        }
        
        const updateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = quantity * price;
            totalSpan.textContent = '$' + total.toFixed(2);
            updatePricing();
        };
        
        quantityInput.addEventListener('input', updateTotal);
        priceInput.addEventListener('input', updateTotal);
    }
    
    // Calculate subtotal, HST, and total
    function updatePricing() {
        const itemTotals = document.querySelectorAll('.item-total');
        let subtotal = 0;
        
        itemTotals.forEach(item => {
            subtotal += parseFloat(item.textContent.replace('$', '')) || 0;
        });
        
        subtotalInput.value = subtotal.toFixed(2);
        
        // Calculate HST and total based on subtotal
        calculateTax();
    }
    
    // Calculate tax and total based on subtotal
    function calculateTax() {
        const subtotal = parseFloat(subtotalInput.value) || 0;
        const hstRate = 0.13;
        const hst = subtotal * hstRate;
        
        hstInput.value = hst.toFixed(2);
        totalInput.value = (subtotal + hst).toFixed(2);
    }
    
    // Add event listeners to pricing inputs for manual editing
    subtotalInput.addEventListener('input', calculateTax);
    
    hstInput.addEventListener('input', function() {
        const subtotal = parseFloat(subtotalInput.value) || 0;
        const hst = parseFloat(hstInput.value) || 0;
        totalInput.value = (subtotal + hst).toFixed(2);
    });
    
    // Load invoice data
    function loadInvoiceData() {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const invoice = invoices.find(inv => inv.id == invoiceId);
        
        if (!invoice) {
            alert('Invoice not found');
            navigateTo( 'invoices.html');
            return;
        }
        
        // Set form values
        invoiceNumber.value = invoice.invoiceNumber;
        dateCreated.value = invoice.dateCreated;
        companySelect.value = invoice.companyId;
        
        // Trigger company details display
        const event = new Event('change');
        companySelect.dispatchEvent(event);
        
        // Set payment status
        document.querySelector(`input[name="paymentStatus"][value="${invoice.paymentStatus}"]`).checked = true;
        
        // Set pricing
        subtotalInput.value = invoice.pricing.subtotal.toFixed(2);
        hstInput.value = invoice.pricing.hst.toFixed(2);
        totalInput.value = invoice.pricing.total.toFixed(2);
        
        // Clear existing items
        itemsContainer.innerHTML = '';
        
        // Add item rows
        invoice.items.forEach(item => {
            addItemRow(item);
        });
        
        // If no items, add an empty row
        if (invoice.items.length === 0) {
            addItemRow();
        }
    }
    
    // Add item button
    addItemBtn.addEventListener('click', function() {
        addItemRow();
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        navigateTo( 'invoice-view.html', { id: invoiceId });
    });
    
    // Form submission
    invoiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all items
        const items = [];
        const itemRows = document.querySelectorAll('.item-row');
        
        itemRows.forEach(row => {
            const unit = row.querySelector('.item-unit').value;
            const plate = row.querySelector('.item-plate').value;
            const make = row.querySelector('.item-make').value;
            const vin = row.querySelector('.item-vin').value;
            const odometer = row.querySelector('.item-odometer').value;
            const year = row.querySelector('.item-year').value;
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 1;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = quantity * price;
            
            if (unit || plate || make || vin || odometer || year || quantity > 0 || price > 0) {
                items.push({
                    unit,
                    plate,
                    make,
                    vin,
                    odometer,
                    year,
                    quantity,
                    price,
                    total
                });
            }
        });
        
        // Get payment status
        const paymentStatus = document.querySelector('input[name="paymentStatus"]:checked').value;
        
        // Get pricing details (using the input values for manual override)
        const subtotal = parseFloat(subtotalInput.value) || 0;
        const hst = parseFloat(hstInput.value) || 0;
        const total = parseFloat(totalInput.value) || 0;
        
        // Update invoice object
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const invoiceIndex = invoices.findIndex(inv => inv.id == invoiceId);
        
        if (invoiceIndex === -1) {
            alert('Invoice not found');
            return;
        }
        
        invoices[invoiceIndex] = {
            ...invoices[invoiceIndex],
            invoiceNumber: invoiceNumber.value,
            dateCreated: dateCreated.value,
            companyId: companySelect.value,
            items: items,
            pricing: {
                subtotal,
                hst,
                total
            },
            paymentStatus
        };
        
        // Save to localStorage
        localStorage.setItem('invoices', JSON.stringify(invoices));
        
        alert('Invoice updated successfully!');
        navigateTo( 'invoice-view.html', { id: invoiceId });
    });
    
    // Initial load
    loadCompanies();
    loadInvoiceData();
});

