import { useEffect, useState } from 'react';

export interface WeatherData {
  temp: number;
  unitSymbol: 'F' | 'C';
  weatherCode: number;
  city: string;
  isDay: boolean;
  precipProb: number;
  sunrise: string;
  sunset: string;
}

const fahrenheitCountries = ['US', 'BS', 'KY', 'LR', 'PW', 'FM', 'MH'];

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      try {
        const geoRes = await fetch('https://ipwho.is/');
        const geo = await geoRes.json();

        if (geo.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        const useFahrenheit = fahrenheitCountries.includes(geo.country_code);
        const tempUnit = useFahrenheit ? 'fahrenheit' : 'celsius';
        const unitSymbol = useFahrenheit ? 'F' : 'C';

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,weather_code,is_day,precipitation_probability&daily=sunrise,sunset&temperature_unit=${tempUnit}&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        const data = await res.json();

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          unitSymbol,
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
          precipProb: data.current.precipitation_probability ?? 0,
          sunrise: data.daily.sunrise[0],
          sunset: data.daily.sunset[0],
          city: geo.city ?? '',
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  return { weather, loading, error, permissionDenied: false };
}
