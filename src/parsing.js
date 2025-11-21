const fs = require('fs');
const path = require('path');

/**
 * Parsing text from a CSV files
 * @param fileName name of the CSV file
 */
function parseCSV(fileName) {
    const filePath = path.join(__dirname, '..', 'legacy', 'data', fileName);

    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        return fileData.split('\n').filter(l => l.trim());
    }catch(err) {
        console.error(err);
    }
}

/**
 * Return object with all customers
 * @returns {{}}
 */
function getAllCustomers(){
    const custLines = parseCSV("customers.csv");
    let customers = {};

    for (let i = 1; i < custLines.length; i++) {
        const parts = custLines[i].split(',');
        const id = parts[0];

        try {
            customers[id] = {
                id: parts[0],
                name: parts[1],
                level: parts[2] || 'BASIC',
                shipping_zone: parts[3] || 'ZONE1',
                currency: parts[4] || 'EUR'
            };
        }catch(e) {
            console.error(e);
        }
    }

    return customers;
}

/**
 * Return object with all products
 * @returns {{}}
 */
function getAllProducts(){
    const prodLines = parseCSV("products.csv");
    let products = {};

    for (let i = 1; i < prodLines.length; i++) {
        const parts = prodLines[i].split(',');

        try {
            products[parts[0]] = {
                id: parts[0],
                name: parts[1],
                category: parts[2],
                price: parseFloat(parts[3]),
                weight: parseFloat(parts[4] || '1.0'),
                taxable: parts[5] === 'true'
            };
        } catch (e) {
            console.error(e);
        }
    }

    return products;
}

/**
 * Return object with all shipping zone
 * @returns {{}}
 */
function getAllShippingZones(){
    const shipLines = parseCSV("shipping_zones.csv");
    let shippingZones = {};

    for (let i = 1; i < shipLines.length; i++) {
        const parts = shipLines[i].split(',');

        try{
            shippingZones[parts[0]] = {
                zone: parts[0],
                base: parseFloat(parts[1]),
                per_kg: parseFloat(parts[2] || '0.5')
            };
        }catch(e) {
            console.error(e);
        }
    }

    return shippingZones;
}

/**
 * Return object with all promotion
 * @returns {{}}
 */
function getAllPromotions(){
    const promoLines = parseCSV("promotions.csv");
    let promotions = {};

    for (let i = 1; i < promoLines.length; i++) {
        const parts = promoLines[i].split(',');

        try{
            promotions[parts[0]] = {
                code: parts[0],
                type: parts[1], // PERCENTAGE ou FIXED
                value: parts[2],
                active: parts[3] !== 'false'
            };
        }catch(e) {
            console.error(e);
        }
    }

    return promotions;
}

/**
 * Return object with all orders
 * @returns [{}]
 */
function getAllOrders(){
    const orderLines = parseCSV("orders.csv");
    let orders = [];

    for (let i = 1; i < orderLines.length; i++) {
        const parts = orderLines[i].split(',');

        try {
            const qty = parseInt(parts[3]);
            const price = parseFloat(parts[4]);

            orders.push({
                id: parts[0],
                customer_id: parts[1],
                product_id: parts[2],
                qty: qty,
                unit_price: price,
                date: parts[5],
                promo_code: parts[6] || '',
                time: parts[7] || '12:00'
            });
        } catch (e) {
            console.error(e);
        }
    }

    return orders;
}

module.exports = {
    parseCSV,
    getAllCustomers,
    getAllProducts,
    getAllShippingZones,
    getAllPromotions,
    getAllOrders
};