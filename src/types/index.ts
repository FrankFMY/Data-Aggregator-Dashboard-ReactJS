export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface Weather {
    current_weather: {
        temperature: number;
        windspeed: number;
        weathercode: number;
    };
}

export interface CurrencyRates {
    base: string;
    rates: Record<string, number>;
    date: string;
}
