'use client'; 
import {useEffect, useState} from 'react';
import '../styles/Weather.css';

interface WeatherInfo {
    temp_c: number;
    humidity: number;
    condition: {
        text: string;
        icon: string;
    }
}

interface CityInfo {
    name: string;
    region: string;
    country: string;
}

const Weather = () => {

    const [city, setCity] = useState<string>('San Salvador');
    const [selectedCity, setSelectedCity] = useState<string>('San Salvador');
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
    const [cityInfo, setCityInfo] = useState<CityInfo | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');


    // TRIAL Ends on 20/May/2025
    const apiKey = 'e6b13a5e85974150ab1220627250605';

    const fetchWeather = async (city: string) => {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
            
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                setErrorMessage('Sin datos disponibles. Intente con nueva ciudad');
                return; 
            }
    
            const data = await response.json();
            if (!data.current) {
                setErrorMessage('Sin datos disponibles. Intente con nueva ciudad');
                return;
            }
    
            setErrorMessage('');

            //setCity(city);
            setSelectedCity(city);
            setWeatherInfo(data.current);        
    
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    return <>
        <div className="wth-container">
        <h1 className="wth-h1">Clima en {selectedCity}</h1>
        <br></br>
        <p>Temperatura actual: {weatherInfo?.temp_c}°C</p>
        <p>Humedad: {weatherInfo?.humidity}%</p>
        <p>Descripción: {weatherInfo?.condition.text}</p>
        <img className="wth-img" src={weatherInfo?.condition.icon} alt={weatherInfo?.condition.text} /> 
        <br></br>
        <p>Ingresa nueva ciudad:</p>
        <input 
            className="wth-input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ciudad"        
        />
        <br></br>
        <button
            onClick={() => fetchWeather(city)}
            className="wth-button"
        >
            Nueva búsqueda
        </button>
        <p className="wth-error">{errorMessage}</p>
        </div>
    </>
};

export default Weather;