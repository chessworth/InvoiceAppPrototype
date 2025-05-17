document.addEventListener('DOMContentLoaded', function() {
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const createCompanyBtn = document.getElementById('createCompanyBtn');
    const viewCompaniesBtn = document.getElementById('viewCompaniesBtn');
    const viewInvoicesBtn = document.getElementById('viewInvoicesBtn');
    
    // Sample companies data
    const sampleCompanies = [
        {
            id: 1001,
            name: "ABC Logistics",
            streetAddress: "123 Main Street",
            city: "Toronto",
            postalCode: "M5V 2H1",
            telephone: "416-555-1234",
            email: "contact@abclogistics.com"
        },
        {
            id: 1002,
            name: "XYZ Transport",
            streetAddress: "456 Queen Street",
            city: "Vancouver",
            postalCode: "V6B 3K9",
            telephone: "604-555-5678",
            email: "info@xyztransport.com"
        },
        {
            id: 1003,
            name: "Maple Freight Services",
            streetAddress: "789 King Road",
            city: "Montreal",
            postalCode: "H3B 2Y7",
            telephone: "514-555-9012",
            email: "service@maplefreight.com"
        },
        {
            id: 1004,
            name: "Coastal Shipping Inc.",
            streetAddress: "321 Harbor Blvd",
            city: "Halifax",
            postalCode: "B3J 2K9",
            telephone: "902-555-3456",
            email: "operations@coastalshipping.com"
        },
        {
            id: 1005,
            name: "Northern Trucking Co.",
            streetAddress: "654 Arctic Avenue",
            city: "Winnipeg",
            postalCode: "R3C 0V1",
            telephone: "204-555-7890",
            email: "dispatch@northerntrucking.com"
        },
        {
            id: 1006,
            name: "Prairie Transport Ltd.",
            streetAddress: "987 Wheat Field Lane",
            city: "Calgary",
            postalCode: "T2P 2M5",
            telephone: "403-555-2345",
            email: "info@prairietransport.com"
        },
        {
            id: 1007,
            name: "Mountain Movers",
            streetAddress: "246 Alpine Road",
            city: "Edmonton",
            postalCode: "T5J 0N3",
            telephone: "780-555-6789",
            email: "contact@mountainmovers.com"
        },
        {
            id: 1008,
            name: "Atlantic Carriers",
            streetAddress: "135 Ocean Drive",
            city: "St. John's",
            postalCode: "A1C 5S7",
            telephone: "709-555-0123",
            email: "bookings@atlanticcarriers.com"
        },
        {
            id: 1009,
            name: "Urban Delivery Services",
            streetAddress: "864 Downtown Street",
            city: "Ottawa",
            postalCode: "K1P 5G3",
            telephone: "613-555-4567",
            email: "service@urbandelivery.com"
        },
        {
            id: 1010,
            name: "Lakeside Logistics",
            streetAddress: "579 Shoreline Road",
            city: "Kingston",
            postalCode: "K7L 2N6",
            telephone: "613-555-8901",
            email: "operations@lakesidelogistics.com"
        }
    ];
    
    // Sample invoices data
    const sampleInvoices = [
        {
            id: 2001,
            invoiceNumber: "1001",
            dateCreated: "2023-05-15",
            companyId: 1001,
            items: [
                {
                    unit: 101,
                    plate: "ABCD 123",
                    make: "Freightliner",
                    vin: "1FUJA6CV57LW91578",
                    odometer: 125000,
                    year: 2020,
                    quantity: 1,
                    price: 350,
                    total: 350
                }
            ],
            pricing: {
                subtotal: 350,
                hst: 45.5,
                total: 395.5
            },
            paymentStatus: "cash"
        },
        {
            id: 2002,
            invoiceNumber: "1002",
            dateCreated: "2023-06-02",
            companyId: 1002,
            items: [
                {
                    unit: 202,
                    plate: "WXYZ 789",
                    make: "Kenworth",
                    vin: "2NKHHM6X16M124135",
                    odometer: 98000,
                    year: 2021,
                    quantity: 1,
                    price: 425,
                    total: 425
                }
            ],
            pricing: {
                subtotal: 425,
                hst: 55.25,
                total: 480.25
            },
            paymentStatus: "unpaid"
        },
        {
            id: 2003,
            invoiceNumber: "1003",
            dateCreated: "2023-06-20",
            companyId: 1003,
            items: [
                {
                    unit: 303,
                    plate: "MAPL 456",
                    make: "Peterbilt",
                    vin: "1XPBD49X1MD730365",
                    odometer: 112000,
                    year: 2019,
                    quantity: 1,
                    price: 375,
                    total: 375
                }
            ],
            pricing: {
                subtotal: 375,
                hst: 48.75,
                total: 423.75
            },
            paymentStatus: "dc"
        },
        {
            id: 2004,
            invoiceNumber: "1004",
            dateCreated: "2023-07-05",
            companyId: 1004,
            items: [
                {
                    unit: 404,
                    plate: "CSTL 789",
                    make: "Volvo",
                    vin: "4V4NC9EH4MN289071",
                    odometer: 85000,
                    year: 2022,
                    quantity: 1,
                    price: 500,
                    total: 500
                }
            ],
            pricing: {
                subtotal: 500,
                hst: 65,
                total: 565
            },
            paymentStatus: "cheque"
        },
        {
            id: 2005,
            invoiceNumber: "1005",
            dateCreated: "2023-07-18",
            companyId: 1005,
            items: [
                {
                    unit: 505,
                    plate: "NRTH 123",
                    make: "Mack",
                    vin: "1M1AW07Y5FM034580",
                    odometer: 130000,
                    year: 2018,
                    quantity: 1,
                    price: 325,
                    total: 325
                }
            ],
            pricing: {
                subtotal: 325,
                hst: 42.25,
                total: 367.25
            },
            paymentStatus: "etransfer"
        },
        {
            id: 2006,
            invoiceNumber: "1006",
            dateCreated: "2023-08-03",
            companyId: 1006,
            items: [
                {
                    unit: 606,
                    plate: "PRRE 456",
                    make: "International",
                    vin: "3HSDJSJR9CN624142",
                    odometer: 95000,
                    year: 2020,
                    quantity: 1,
                    price: 400,
                    total: 400
                }
            ],
            pricing: {
                subtotal: 400,
                hst: 52,
                total: 452
            },
            paymentStatus: "cash"
        },
        {
            id: 2007,
            invoiceNumber: "1007",
            dateCreated: "2023-08-22",
            companyId: 1007,
            items: [
                {
                    unit: 707,
                    plate: "MNTN 789",
                    make: "Western Star",
                    vin: "5KJJAELD2FPFU7142",
                    odometer: 110000,
                    year: 2019,
                    quantity: 1,
                    price: 450,
                    total: 450
                }
            ],
            pricing: {
                subtotal: 450,
                hst: 58.5,
                total: 508.5
            },
            paymentStatus: "unpaid"
        },
        {
            id: 2008,
            invoiceNumber: "1008",
            dateCreated: "2023-09-10",
            companyId: 1008,
            items: [
                {
                    unit: 808,
                    plate: "ATLC 123",
                    make: "Freightliner",
                    vin: "1FUJGLD10DLFU4278",
                    odometer: 75000,
                    year: 2021,
                    quantity: 1,
                    price: 475,
                    total: 475
                }
            ],
            pricing: {
                subtotal: 475,
                hst: 61.75,
                total: 536.75
            },
            paymentStatus: "dc"
        },
        {
            id: 2009,
            invoiceNumber: "1009",
            dateCreated: "2023-09-28",
            companyId: 1009,
            items: [
                {
                    unit: 909,
                    plate: "URBN 456",
                    make: "Kenworth",
                    vin: "2NKMHZ7X5LM761294",
                    odometer: 65000,
                    year: 2022,
                    quantity: 1,
                    price: 525,
                    total: 525
                }
            ],
            pricing: {
                subtotal: 525,
                hst: 68.25,
                total: 593.25
            },
            paymentStatus: "cheque"
        },
        {
            id: 2010,
            invoiceNumber: "1010",
            dateCreated: "2023-10-15",
            companyId: 1010,
            items: [
                {
                    unit: 1010,
                    plate: "LAKE 789",
                    make: "Peterbilt",
                    vin: "1XPBDP9X2ND423781",
                    odometer: 50000,
                    year: 2023,
                    quantity: 1,
                    price: 550,
                    total: 550
                }
            ],
            pricing: {
                subtotal: 550,
                hst: 71.5,
                total: 621.5
            },
            paymentStatus: "etransfer"
        }
    ];
    
    // Initialize localStorage if needed
    if (!localStorage.getItem('companies')) {
        localStorage.setItem('companies', JSON.stringify(sampleCompanies));
    }
    
    if (!localStorage.getItem('invoices')) {
        localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
    }
    
    if (!localStorage.getItem('lastInvoiceNumber')) {
        localStorage.setItem('lastInvoiceNumber', '1010');
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






