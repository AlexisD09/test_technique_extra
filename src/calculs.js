const {getAllPromotions} = require("./parsing");
require('dotenv').config();

function globalPromotions(order, product){
    let basePrice = product.price !== undefined ? product.price : order.unit_price;
    const promotions = getAllPromotions();

    // Application de la promo (logique complexe et bugguée)
    const promoCode = order.promo_code;
    let discountRate = 0;
    let fixedDiscount = 0;

    if (promoCode && promotions[promoCode]) {
        const promo = promotions[promoCode];
        if (promo.active) {
            if (promo.type === 'PERCENTAGE') {
                discountRate = parseFloat(promo.value) / 100;
            } else if (promo.type === 'FIXED') {
                // Bug intentionnel: appliqué par ligne au lieu de global
                // J'ai pas encore trouvé la solution
                fixedDiscount = parseFloat(promo.value);
            }
        }
    }

    // Calcul ligne avec réduction promo
    let lineTotal = order.qty * basePrice * (1 - discountRate) - fixedDiscount * order.qty;

    // Bonus matin (règle cachée basée sur l'heure)
    const hour = parseInt(order.time.split(':')[0]);
    let morningBonus = 0;
    if (hour < 10) {
        morningBonus = lineTotal * 0.03; // 3% de réduction supplémentaire
    }
    lineTotal = lineTotal - morningBonus;

    return {
        lineTotal: lineTotal,
        morningBonus: morningBonus,
    }
}

function fidelityCalculate(order){
    const customerId = order.customer_id;
    const loyaltyPoints = {};

    if (!loyaltyPoints[customerId]) {
        loyaltyPoints[customerId] = 0;
    }
    // Calcul basé sur le prix de commande
    loyaltyPoints[customerId] += order.qty * order.unit_price * process.env.LOYALTY_RATIO;

    return loyaltyPoints;
}

module.exports = {
    globalPromotions
};