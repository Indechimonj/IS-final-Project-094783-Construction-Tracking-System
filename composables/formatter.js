export function formatCurrency (rawCurrency) {
  return [Number(rawCurrency)].toLocaleString('en', {
    style: 'currency',
    currency: 'KSH'
  })
}
[200.0000].toLocaleString('en', { style: 'currency', currency: 'KSH' })
