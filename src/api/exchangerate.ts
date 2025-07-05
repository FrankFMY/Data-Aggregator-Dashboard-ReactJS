export async function fetchCurrency() {
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error('Ошибка загрузки курсов валют');
  const json = await res.json();
  if (json.result !== 'success')
    throw new Error('Ошибка API валют: ' + (json['error-type'] || 'unknown'));
  return json.rates; // объект с курсами валют
}
