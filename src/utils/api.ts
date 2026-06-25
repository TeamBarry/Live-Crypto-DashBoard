// axios asli function hai, isliye uspe type nahi lagega. 
// AxiosInstance aur AxiosRequestConfig types hain, toh unke sath 'type' likh dein.
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// Coin aur ChartDataPoint dono hi types hain, toh shuru mein ek baar 'type' likh dein.
import type { Coin, ChartDataPoint } from '../types';

const apiClient: AxiosInstance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log(`API Request : ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error ;', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 429) {
            console.error('⏳ Rate Limit! Thora wait karo...');
        } else if (error.response?.status === 404) {
            console.error('API Error : 404 Not Found');
        } else if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout ho gaya');
        } else {
            console.error('❌ API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const fetchCoins = async (signal?: AbortSignal): Promise<Coin[]> => {
    const config: AxiosRequestConfig = {
        params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: true,
        },
        signal,
    };

    const response = await apiClient.get<Coin[]>('/coins/markets', config);
    return response.data;
};

export const fetchCoinHistory = async (coinId: string, signal?: AbortSignal): Promise<ChartDataPoint[]> => {
    const config: AxiosRequestConfig = {
        params: {
            vs_currency: 'usd',
            days: 1, // 24 hours
        },
        signal,
    };

    const response = await apiClient.get(`/coins/${coinId}/market_chart`, config);

    const prices: [number, number][] = response.data.prices;

    const chartData: ChartDataPoint[] = prices.map((item) => {
        const timestamp = item[0];
        const price = item[1];

        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return {
            timestamp: `${hours}:${minutes}`,
            price: price,
        };
    });
    
    return chartData.filter((_, index) => index % 10 === 0);
};

export const searchCoins = async (query: string, signal?: AbortSignal): Promise<{ id: string; name: string; symbol: string }[]> => {
    // Yahan config ko theek kar diya gaya hai
    const config: AxiosRequestConfig = {
        params: { query },
        signal,
    };

    const response = await apiClient.get('/search', config);

    // Yahan return object ke ird-gird gol brackets () laga diye hain
    return response.data.coins.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
    }));
};