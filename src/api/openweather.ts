export async function fetchWeather() {
    // Москва, пример
    const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current_weather=true'
    );
    if (!res.ok) throw new Error('Ошибка загрузки погоды');
    return res.json();
}
