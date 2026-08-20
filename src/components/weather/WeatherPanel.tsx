import { useState } from 'react';
import type { WeatherCondition, RaceState } from '../types';

interface WeatherPanelProps {
  weather: WeatherCondition;
  raceState: RaceState;
  onWeatherChange?: (weather: Partial<WeatherCondition>) => void;
}

export function WeatherPanel({ weather, raceState, onWeatherChange }: WeatherPanelProps) {
  const [forecast] = useState(() => {
    // Generate a simple forecast based on current weather
    const forecast: WeatherCondition[] = [];
    let currentTemp = weather.trackTemp;
    let currentRain = weather.rainIntensity;
    
    for (let i = 0; i < 10; i++) {
      currentTemp += (Math.random() - 0.5) * 2;
      currentRain = Math.max(0, Math.min(1, currentRain + (Math.random() - 0.5) * 0.2));
      forecast.push({
        ...weather,
        trackTemp: currentTemp,
        airTemp: currentTemp - 8,
        rainIntensity: currentRain,
        humidity: 50 + currentRain * 30,
        windSpeed: 5 + Math.random() * 10,
        windDirection: (weather.windDirection + (Math.random() - 0.5) * 20) % 360,
      });
    }
    return forecast;
  });

  const getWeatherIcon = (rainIntensity: number) => {
    if (rainIntensity > 0.7) return '🌧️';
    if (rainIntensity > 0.3) return '🌦️';
    if (rainIntensity > 0) return '☁️';
    return '☀️';
  };

  const getTrackCondition = (rainIntensity: number) => {
    if (rainIntensity > 0.7) return 'WET';
    if (rainIntensity > 0.3) return 'DAMP';
    if (rainIntensity > 0) return 'DRY-DAMP';
    return 'DRY';
  };

  const getGripLevel = (rainIntensity: number) => {
    return Math.max(0.5, 1 - rainIntensity * 0.4);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        Weather & Track Conditions
      </h3>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-3xl mb-2">{getWeatherIcon(weather.rainIntensity)}</div>
          <div className="text-xs text-gray-400">Condition</div>
          <div className="text-white font-semibold">{getTrackCondition(weather.rainIntensity)}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white mb-1">{weather.trackTemp.toFixed(1)}°C</div>
          <div className="text-xs text-gray-400">Track Temp</div>
          <div className="text-xs text-gray-500">Air: {weather.airTemp.toFixed(1)}°C</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{(weather.rainIntensity * 100).toFixed(0)}%</div>
          <div className="text-xs text-gray-400">Rain Intensity</div>
          <div className="text-xs text-gray-500">Humidity: {weather.humidity.toFixed(0)}%</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{(getGripLevel(weather.rainIntensity) * 100).toFixed(0)}%</div>
          <div className="text-xs text-gray-400">Track Grip</div>
          <div className="text-xs text-gray-500">Wind: {weather.windSpeed.toFixed(1)} km/h</div>
        </div>
      </div>

      {/* Rain Forecast */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Rain Probability Forecast</h4>
        <div className="flex items-end gap-1 h-24 bg-gray-800 rounded-lg p-2">
          {forecast.map((fc, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-600 rounded-t transition-all"
                style={{ 
                  height: `${fc.rainIntensity * 100}%`,
                  minHeight: fc.rainIntensity > 0 ? '4px' : '0'
                }}
              />
              <div className="text-xs text-gray-500 mt-1">+{idx}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Now</span>
          <span>Lap {raceState.session.currentLap + 10}</span>
        </div>
      </div>

      {/* Crossover Estimate */}
      {weather.rainEtaMinutes !== null && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-400 text-sm font-semibold">Crossover Estimate</span>
          </div>
          <p className="text-xs text-gray-300">
            Rain expected in ~{weather.rainEtaMinutes} minutes (Lap {weather.crossoverEstimateLap})
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Consider pitting for wet tires before the rain arrives to avoid losing time on dry tires in wet conditions.
          </p>
        </div>
      )}

      {/* Tire Temperature Recommendations */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Tire Operating Windows</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">SOFT</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded" />
              <span className="text-white font-mono w-16 text-right">80-110°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">MEDIUM</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded" />
              <span className="text-white font-mono w-16 text-right">90-120°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">HARD</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded" />
              <span className="text-white font-mono w-16 text-right">100-130°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">INTER</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded" />
              <span className="text-white font-mono w-16 text-right">60-90°C</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">WET</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded" />
              <span className="text-white font-mono w-16 text-right">50-80°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
