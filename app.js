document.addEventListener('DOMContentLoaded', function() {
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const createCompanyBtn = document.getElementById('createCompanyBtn');
    const viewCompaniesBtn = document.getElementById('viewCompaniesBtn');
    const viewInvoicesBtn = document.getElementById('viewInvoicesBtn');
    const trackExpenseBtn = document.getElementById('trackExpenseBtn');
    const viewExpensesBtn = document.getElementById('viewExpensesBtn');
    
    // Dashboard elements
    const newCompaniesElement = document.getElementById('newCompanies');
    const totalRevenueElement = document.getElementById('totalRevenue');
    const totalExpensesElement = document.getElementById('totalExpenses');
    const netIncomeElement = document.getElementById('netIncome');
    
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
        },
        // 10 new invoices for current month
        {
            id: 2011,
            invoiceNumber: "1011",
            dateCreated: "2025-05-01",
            companyId: 1001,
            items: [
                {
                    unit: 111,
                    plate: "ABCD 456",
                    make: "Freightliner",
                    vin: "1FUJA6CV57LW91579",
                    odometer: 130000,
                    year: 2020,
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
            paymentStatus: "cash"
        },
        {
            id: 2012,
            invoiceNumber: "1012",
            dateCreated: `2025-05-03`,
            companyId: 1002,
            items: [
                {
                    unit: 222,
                    plate: "WXYZ 123",
                    make: "Kenworth",
                    vin: "2NKHHM6X16M124136",
                    odometer: 105000,
                    year: 2021,
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
            paymentStatus: "etransfer"
        },
        {
            id: 2013,
            invoiceNumber: "1013",
            dateCreated: `2025-05-05`,
            companyId: 1003,
            items: [
                {
                    unit: 333,
                    plate: "MAPL 789",
                    make: "Peterbilt",
                    vin: "1XPBD49X1MD730366",
                    odometer: 118000,
                    year: 2019,
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
            paymentStatus: "dc"
        },
        {
            id: 2014,
            invoiceNumber: "1014",
            dateCreated: `2025-05-07`,
            companyId: 1004,
            items: [
                {
                    unit: 444,
                    plate: "CSTL 123",
                    make: "Volvo",
                    vin: "4V4NC9EH4MN289072",
                    odometer: 90000,
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
            id: 2015,
            invoiceNumber: "1015",
            dateCreated: `2025-05-09`,
            companyId: 1005,
            items: [
                {
                    unit: 555,
                    plate: "NRTH 456",
                    make: "Mack",
                    vin: "1M1AW07Y5FM034581",
                    odometer: 135000,
                    year: 2018,
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
            id: 2016,
            invoiceNumber: "1016",
            dateCreated: `2025-05-11`,
            companyId: 1006,
            items: [
                {
                    unit: 666,
                    plate: "PRRE 789",
                    make: "International",
                    vin: "3HSDJSJR9CN624143",
                    odometer: 100000,
                    year: 2020,
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
            id: 2017,
            invoiceNumber: "1017",
            dateCreated: `2025-05-13`,
            companyId: 1007,
            items: [
                {
                    unit: 777,
                    plate: "MNTN 123",
                    make: "Western Star",
                    vin: "5KJJAELD2FPFU7143",
                    odometer: 115000,
                    year: 2019,
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
            id: 2018,
            invoiceNumber: "1018",
            dateCreated: `2025-05-15`,
            companyId: 1008,
            items: [
                {
                    unit: 888,
                    plate: "ATLC 456",
                    make: "Freightliner",
                    vin: "1FUJGLD10DLFU4279",
                    odometer: 80000,
                    year: 2021,
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
            id: 2019,
            invoiceNumber: "1019",
            dateCreated: `2025-05-17`,
            companyId: 1009,
            items: [
                {
                    unit: 999,
                    plate: "URBN 789",
                    make: "Kenworth",
                    vin: "2NKMHZ7X5LM761295",
                    odometer: 70000,
                    year: 2022,
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
        },
        {
            id: 2020,
            invoiceNumber: "1020",
            dateCreated: `2025-05-19`,
            companyId: 1010,
            items: [
                {
                    unit: 1020,
                    plate: "LAKE 123",
                    make: "Peterbilt",
                    vin: "1XPBDP9X2ND423782",
                    odometer: 60000,
                    year: 2023,
                    quantity: 1,
                    price: 600,
                    total: 600
                }
            ],
            pricing: {
                subtotal: 600,
                hst: 78,
                total: 678
            },
            paymentStatus: "cash"
        }
    ];
    
    // Sample expenses data
    const sampleExpenses = [
        {
            id: 3001,
            date: "2023-10-10",
            amount: 125.50,
            type: "gas",
            description: "Monthly fuel expense",
            companyId: 1001
        },
        {
            id: 3002,
            date: "2023-10-15",
            amount: 250.75,
            type: "utility",
            description: "Electricity bill",
            companyId: 1002
        },
        {
            id: 3003,
            date: "2023-10-20",
            amount: 350.00,
            type: "maintenance",
            description: "Office equipment repair",
            companyId: 1003
        },
        {
            id: 3004,
            date: "2023-10-25",
            amount: 500.00,
            type: "insurance",
            description: "Monthly insurance premium",
            companyId: 1004
        },
        {
            id: 3005,
            date: "2023-10-30",
            amount: 75.25,
            type: "office",
            description: "Office supplies",
            companyId: 1005
        },
        {
            id: 3001,
            date: "2025-05-01",
            amount: 125.50,
            type: "gas",
            description: "Monthly fuel expense",
            companyId: 1001
        },
        {
            id: 3002,
            date: "2025-05-02",
            amount: 210.00,
            type: "utility",
            description: "Water and electricity bills",
            companyId: 1002
        },
        {
            id: 3003,
            date: "2025-05-04",
            amount: 95.25,
            type: "maintenance",
            description: "Printer maintenance service",
            companyId: 1003
        },
        {
            id: 3004,
            date: "2025-05-06",
            amount: 340.75,
            type: "insurance",
            description: "Vehicle insurance premium",
            companyId: 1001
        },
        {
            id: 3005,
            date: "2025-05-08",
            amount: 185.90,
            type: "office",
            description: "Purchase of office chairs",
            companyId: 1004
        },
        {
            id: 3006,
            date: "2025-05-10",
            amount: 130.00,
            type: "gas",
            description: "Fuel for company van",
            companyId: 1002
        },
        {
            id: 3007,
            date: "2025-05-12",
            amount: 275.40,
            type: "utility",
            description: "Internet and phone service",
            companyId: 1003
        },
        {
            id: 3008,
            date: "2025-05-14",
            amount: 160.00,
            type: "maintenance",
            description: "Air conditioner repair",
            companyId: 1005
        },
        {
            id: 3009,
            date: "2025-05-16",
            amount: 390.00,
            type: "insurance",
            description: "Office liability insurance",
            companyId: 1004
        },
        {
            id: 3010,
            date: "2025-05-17",
            amount: 220.30,
            type: "office",
            description: "Printer and paper supplies",
            companyId: 1001
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
    
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Function to load dashboard data
    function loadDashboardData() {
        const currentYear = new Date().getFullYear();
        
        // Get companies added this year
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        const newCompaniesThisYear = companies.filter(company => {
            // Since we don't have a creation date for companies, we'll use the ID as a timestamp
            // This is an approximation since your actual data might be different
            const creationDate = new Date(company.id);
            return creationDate.getFullYear() === currentYear;
        }).length;
        
        // Get total revenue this year (from invoices)
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        const revenueThisYear = invoices.reduce((total, invoice) => {
            const invoiceDate = new Date(invoice.dateCreated);
            if (invoiceDate.getFullYear() === currentYear) {
                return total + invoice.pricing.total;
            }
            return total;
        }, 0);
        
        // Get total expenses this year
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const expensesThisYear = expenses.reduce((total, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getFullYear() === currentYear) {
                return total + expense.amount;
            }
            return total;
        }, 0);
        
        // Calculate net income
        const netIncome = revenueThisYear - expensesThisYear;
        
        // Update dashboard UI
        newCompaniesElement.textContent = newCompaniesThisYear;
        totalRevenueElement.textContent = `$${revenueThisYear.toFixed(2)}`;
        totalExpensesElement.textContent = `$${expensesThisYear.toFixed(2)}`;
        netIncomeElement.textContent = `$${netIncome.toFixed(2)}`;
        
        // Set color for net income (green for positive, red for negative)
        if (netIncome < 0) {
            netIncomeElement.style.color = '#ff4d4d';
        } else {
            netIncomeElement.style.color = 'white';
        }
    }
    
    createInvoiceBtn.addEventListener('click', function() {
        navigateTo('invoice-form.html');
    });
    
    createCompanyBtn.addEventListener('click', function() {
        navigateTo('company-form.html');
    });
    
    viewCompaniesBtn.addEventListener('click', function() {
        navigateTo('companies.html');
    });
    
    viewInvoicesBtn.addEventListener('click', function() {
        navigateTo('invoices.html');
    });
    
    trackExpenseBtn.addEventListener('click', function() {
        navigateTo('expense-form.html');
    });
    
    viewExpensesBtn.addEventListener('click', function() {
        navigateTo('expenses.html');
    });
});

