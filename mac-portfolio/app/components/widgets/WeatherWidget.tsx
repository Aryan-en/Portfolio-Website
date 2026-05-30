"use client";

import { useEffect, useState } from 'react';

// ─── WMO weather-code map ──────────────────────────────────────────────────

interface WMOEntry { label: string; emoji: string }

const WMO_MAP: Record<number, WMOEntry> = {
  0:  { label: 'Clear Sky',      emoji: '☀️' },
  1:  { label: 'Mainly Clear',   emoji: '🌤️' },
  2:  { label: 'Partly Cloudy',  emoji: '⛅' },
  3:  { label: 'Overcast',       emoji: '☁️' },
  45: { label: 'Foggy',          emoji: '🌫️' },
  48: { label: 'Icy Fog',        emoji: '🌫️' },
  51: { label: 'Light Drizzle',  emoji: '🌦️' },
  53: { label: 'Drizzle',        emoji: '🌦️' },
  55: { label: 'Heavy Drizzle',  emoji: '🌧️' },
  61: { label: 'Light Rain',     emoji: '🌧️' },
  63: { label: 'Rain',           emoji: '🌧️' },
  65: { label: 'Heavy Rain',     emoji: '🌧️' },
  71: { label: 'Light Snow',     emoji: '🌨️' },
  73: { label: 'Snow',           emoji: '🌨️' },
  75: { label: 'Heavy Snow',     emoji: '❄️' },
  77: { label: 'Snow Grains',    emoji: '🌨️' },
  80: { label: 'Showers',        emoji: '🌦️' },
  81: { label: 'Showers',        emoji: '🌧️' },
  82: { label: 'Heavy Showers',  emoji: '⛈️' },
  85: { label: 'Snow Showers',   emoji: '🌨️' },
  86: { label: 'Heavy Snow',     emoji: '❄️' },
  95: { label: 'Thunderstorm',   emoji: '⛈️' },
  96: { label: 'Thunderstorm',   emoji: '⛈️' },
  99: { label: 'Thunderstorm',   emoji: '⛈️' },
};

function wmoInfo(code: number): WMOEntry {
  if (WMO_MAP[code]) return WMO_MAP[code];
  if (code <= 3)  return WMO_MAP[code] ?? WMO_MAP[0];
  if (code <= 48) return { label: 'Foggy',        emoji: '🌫️' };
  if (code <= 55) return { label: 'Drizzle',      emoji: '🌦️' };
  if (code <= 67) return { label: 'Rain',          emoji: '🌧️' };
  if (code <= 77) return { label: 'Snow',          emoji: '🌨️' };
  if (code <= 82) return { label: 'Showers',       emoji: '🌦️' };
  return { label: 'Thunderstorm', emoji: '⛈️' };
}

// ─── Fetchers ─────────────────────────────────────────────────────────────

interface WeatherState {
  city: string;
  temp: number;
  high: number;
  low:  number;
  code: number;
}

async function fetchWeather(lat: number, lon: number, city: string): Promise<WeatherState> {
  const params = new URLSearchParams({
    latitude:     String(lat),
    longitude:    String(lon),
    current:      'temperature_2m,weathercode',
    daily:        'temperature_2m_max,temperature_2m_min',
    timezone:     'auto',
    forecast_days: '1',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('weather fetch failed');
  const j = await res.json();
  return {
    city,
    temp: Math.round(j.current.temperature_2m),
    high: Math.round(j.daily.temperature_2m_max[0]),
    low:  Math.round(j.daily.temperature_2m_min[0]),
    code: j.current.weathercode,
  };
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    { headers: { 'Accept-Language': 'en' } },
  );
  if (!res.ok) throw new Error('geocode failed');
  const j = await res.json();
  return j.address?.city ?? j.address?.town ?? j.address?.village ?? 'My Location';
}

// ─── Widget ────────────────────────────────────────────────────────────────

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [failed,  setFailed]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadNewDelhi = () =>
      fetchWeather(28.6139, 77.2090, 'New Delhi')
        .then(w => { if (!cancelled) setWeather(w); })
        .catch(() => { if (!cancelled) setFailed(true); });

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      loadNewDelhi();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (cancelled) return;
        try {
          const city = await reverseGeocode(coords.latitude, coords.longitude)
            .catch(() => 'My Location');
          const w = await fetchWeather(coords.latitude, coords.longitude, city);
          if (!cancelled) setWeather(w);
        } catch {
          if (!cancelled) loadNewDelhi();
        }
      },
      () => { if (!cancelled) loadNewDelhi(); },
      { timeout: 8000 },
    );

    return () => { cancelled = true; };
  }, []);

  const info = weather ? wmoInfo(weather.code) : null;

  return (
    <div className="w-[220px] rounded-2xl bg-gradient-to-br from-[#4A8FD5] to-[#1A5FA8] border border-white/20 p-4 select-none">
      {failed ? (
        <p className="text-white/60 text-[12px]">Weather unavailable</p>
      ) : !weather ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-20 rounded bg-white/20" />
          <div className="h-12 w-14 rounded bg-white/20" />
          <div className="h-3 w-28 rounded bg-white/20" />
          <div className="h-3 w-24 rounded bg-white/20" />
        </div>
      ) : (
        <>
          <p className="text-white font-semibold text-[14px] leading-snug mb-0.5">
            {weather.city}
          </p>
          <p
            className="text-white leading-none mb-3 tabular-nums"
            style={{ fontSize: '3.4rem', fontWeight: 100 }}
          >
            {weather.temp}°
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[22px] leading-none">{info!.emoji}</span>
            <span className="text-white font-semibold text-[13px]">{info!.label}</span>
          </div>
          <p className="text-white/80 text-[12px] tabular-nums">
            H:{weather.high}°&nbsp;&nbsp;L:{weather.low}°
          </p>
        </>
      )}
    </div>
  );
}
