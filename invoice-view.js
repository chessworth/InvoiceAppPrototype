document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const editBtn = document.getElementById('editBtn');
    const printBtn = document.getElementById('printBtn');
    
    // Get invoice ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    
    if (!invoiceId) {
        alert('No invoice ID provided');
        window.location.href = 'invoices.html';
        return;
    }
    
    // Load invoice data
    function loadInvoiceData() {
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const invoice = invoices.find(inv => inv.id == invoiceId);
        
        if (!invoice) {
            alert('Invoice not found');
            window.location.href = 'invoices.html';
            return;
        }
        
        // Load company data
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const company = companies.find(c => c.id == invoice.companyId) || { 
            name: 'Unknown Company',
            streetAddress: '',
            city: '',
            postalCode: '',
            telephone: '',
            email: ''
        };
        
        // Display invoice header info
        document.getElementById('invoiceNumber').textContent = invoice.invoiceNumber;
        document.getElementById('dateCreated').textContent = invoice.dateCreated;
        
        // Set payment status with appropriate styling
        const paymentStatusElem = document.getElementById('paymentStatus');
        paymentStatusElem.textContent = invoice.paymentStatus;
        paymentStatusElem.className = invoice.paymentStatus === 'unpaid' ? 'status-unpaid' : `status-${invoice.paymentStatus}`;
        
        // Display company info
        document.getElementById('companyName').textContent = company.name;
        document.getElementById('companyAddress').textContent = 
            `${company.streetAddress}, ${company.city}, ${company.postalCode}`;
        document.getElementById('companyContact').textContent = 
            `Tel: ${company.telephone} | Email: ${company.email}`;
        
        // Display items in table
        const itemsTableBody = document.getElementById('itemsTableBody');
        let itemsHtml = '';
        
        if (invoice.items.length === 0) {
            // Show empty state if no vehicles
            document.querySelector('.table-container').innerHTML = `
                <div class="empty-state">
                    <p>No vehicle details available for this invoice.</p>
                </div>
            `;
        } else {
            // Display items in table
            invoice.items.forEach(item => {
                itemsHtml += `
                    <tr>
                        <td>${item.unit || '-'}</td>
                        <td>${item.plate || '-'}</td>
                        <td>${item.make || '-'}</td>
                        <td>${item.vin || '-'}</td>
                        <td>${item.odometer || '-'}</td>
                        <td>${item.year || '-'}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${item.total.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            itemsTableBody.innerHTML = itemsHtml;
            
            // Create mobile-friendly vehicle cards
            const vehicleCardsContainer = document.createElement('div');
            vehicleCardsContainer.className = 'vehicle-cards-container';
            
            invoice.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'vehicle-card';
                
                const properties = [
                    { label: 'Unit', value: item.unit || '-' },
                    { label: 'Plate', value: item.plate || '-' },
                    { label: 'Make', value: item.make || '-' },
                    { label: 'VIN', value: item.vin || '-' },
                    { label: 'Odometer', value: item.odometer || '-' },
                    { label: 'Year', value: item.year || '-' },
                    { label: 'Quantity', value: item.quantity },
                    { label: 'Price', value: `$${item.price.toFixed(2)}` },
                    { label: 'Total', value: `$${item.total.toFixed(2)}` }
                ];
                
                let cardHtml = '';
                properties.forEach(prop => {
                    cardHtml += `
                        <div class="vehicle-property">
                            <span class="property-label">${prop.label}:</span>
                            <span class="property-value">${prop.value}</span>
                        </div>
                    `;
                });
                
                card.innerHTML = cardHtml;
                vehicleCardsContainer.appendChild(card);
            });
            
            // Add cards after the table
            document.querySelector('.table-container').appendChild(vehicleCardsContainer);
        }
        
        // Display pricing
        document.getElementById('subtotal').textContent = `$${invoice.pricing.subtotal.toFixed(2)}`;
        document.getElementById('hst').textContent = `$${invoice.pricing.hst.toFixed(2)}`;
        document.getElementById('total').textContent = `$${invoice.pricing.total.toFixed(2)}`;
    }
    
    // Event listeners
    backBtn.addEventListener('click', function() {
        window.location.href = 'invoices.html';
    });
    
    editBtn.addEventListener('click', function() {
        window.location.href = `invoice-edit.html?id=${invoiceId}`;
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Load data
    loadInvoiceData();
});

