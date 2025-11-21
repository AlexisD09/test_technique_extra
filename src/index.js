const { getAllOrders, getAllProducts, getAllCustomers } = require('./parsing');
const { globalPromotions, fidelityCalculate } = require('./calculs');

function run(){
    const orders = getAllOrders();
    const products = getAllProducts();

    const totalsByCustomer = {};
    for (const order of orders) {
        const customerId = order.customer_id;
        const product = products[order.product_id] || {};
        let promotions = globalPromotions(order, product);

        if (!totalsByCustomer[customerId]) {
            totalsByCustomer[customerId] = {
                subtotal: 0.0,
                items: [],
                weight: 0.0,
                promoDiscount: 0.0,
                morningBonus: 0.0
            };
        }

        totalsByCustomer[customerId].subtotal += promotions.lineTotal;
        totalsByCustomer[customerId].weight += (product.weight || 1.0) * order.qty;
        totalsByCustomer[customerId].items.push(order);
        totalsByCustomer[customerId].morningBonus += promotions.morningBonus;
    }

    const sortedCustomerIds = Object.keys(totalsByCustomer).sort();
    const customers = getAllCustomers();

    for (const customerId of sortedCustomerIds) {
        const customer = customers[customerId] || {};
        const name = customer.name || 'Unknown';
        const level = customer.level || 'BASIC';
        const zone = customer.shipping_zone || 'ZONE1';
        const currency = customer.currency || 'EUR';
    }
}

if (require.main === module) {
    run();
}

module.exports = { run };