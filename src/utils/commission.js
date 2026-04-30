/**
 * Commission Engine - Tiered Slab System
 * ═══════════════════════════════════════
 * 
 * Rules:
 *   $0   - $99   → 0 PKR
 *   $100 - $199  → 5,000 PKR
 *   $200 - $299  → 10,000 PKR
 *   ...and so on (floor(amount / 100) * 5,000)
 *
 * Formula: amount < 100 ? 0 : floor(amount / 100) * 5000
 *
 * CRITICAL TEST VALUES:
 *   $50   → 0 PKR       ✓
 *   $99   → 0 PKR       ✓
 *   $100  → 5,000 PKR   ✓
 *   $150  → 5,000 PKR   ✓
 *   $199  → 5,000 PKR   ✓
 *   $200  → 10,000 PKR  ✓
 *   $250  → 10,000 PKR  ✓
 *   $500  → 25,000 PKR  ✓
 *   $1000 → 50,000 PKR  ✓
 */

/**
 * Calculate commission for a SINGLE sale amount in USD.
 * Returns commission in PKR.
 * @param {number} amountUsd - The sale amount in USD
 * @returns {number} Commission in PKR
 */
export const calculateCommission = (amountUsd) => {
  const amount = Number(amountUsd) || 0;
  if (amount < 100) return 0;
  return Math.floor(amount / 100) * 5000;
};

/**
 * Calculate total commission for an array of sales.
 * Each sale's commission is calculated individually using the slab system.
 * @param {Array} sales - Array of sale objects with amount_usd field
 * @returns {number} Total commission in PKR
 */
export const calculateTotalCommission = (sales) => {
  if (!Array.isArray(sales)) return 0;
  return sales.reduce((total, sale) => {
    return total + calculateCommission(sale.amount_usd || 0);
  }, 0);
};
