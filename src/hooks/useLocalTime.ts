import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface UseLocalTimeReturn {
  time: string;
  date: string;
  timeZone: string;
  loader?: boolean;
}

interface TimeAPIResponse {
  datetime: string;
  timezone: string;
  dst: boolean;
}

const TIMEZONE_MAP: Record<string, string> = {
  // Asia
  KSA: 'Asia/Riyadh',
  UAE: 'Asia/Dubai',
  BHR: 'Asia/Bahrain',
  OMN: 'Asia/Muscat',
  KWT: 'Asia/Kuwait',
  QTR: 'Asia/Qatar',

  // Africa
  MAR: 'Africa/Casablanca',
  CIV: 'Africa/Abidjan',
  SEN: 'Africa/Dakar',
  BFA: 'Africa/Ouagadougou',
  MLI: 'Africa/Bamako',
  GIN: 'Africa/Conakry',
  GAB: 'Africa/Libreville',
  COG: 'Africa/Brazzaville',
  CMR: 'Africa/Douala',

  // Europe
  ESP: 'Europe/Madrid',
  PRT: 'Europe/Lisbon',
  POL: 'Europe/Warsaw',
  CZE: 'Europe/Prague',
  HUN: 'Europe/Budapest',
  SVK: 'Europe/Bratislava',
  ROU: 'Europe/Bucharest',
  LTU: 'Europe/Vilnius',
  SVN: 'Europe/Ljubljana',
  HRV: 'Europe/Zagreb',

  // Latin America
  COL: 'America/Bogota',
  PAN: 'America/Panama',
};

const formatTimeForTimezone = (date: Date, timeZone: string) => {
  try {
    return {
      time: new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone,
      }).format(date),
      date: new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone,
      }).format(date),
      timeZone:
        new Intl.DateTimeFormat('en-GB', {
          timeZoneName: 'short',
          timeZone,
        })
          .formatToParts(date)
          .find(part => part.type === 'timeZoneName')?.value || timeZone,
    };
  } catch (error) {
    console.warn(`Error formatting time for timezone ${timeZone}:`, error);
    return {
      time: '--:--:--',
      date: '--/--/----',
      timeZone: 'UTC',
    };
  }
};

export function useLocalTime(countryCode: string): UseLocalTimeReturn {
  const [timeDate, setTimeDate] = useState<UseLocalTimeReturn>({
    time: '--:--:--',
    date: '--/--/----',
    timeZone: 'UTC',
    loader: false,
  });

  const updateTime = useCallback(async () => {
    const timeZone = TIMEZONE_MAP[countryCode] || 'UTC';

    try {
      setTimeDate(prev => ({ ...prev, loader: true }));
      // Try to get time from API with a timeout
      const response = await axios.get<TimeAPIResponse>(
        `https://worldtimeapi.org/api/timezone/${timeZone}`,
        { timeout: 5000 } // 5-second timeout
      );

      if (response.data) {
        const now = new Date(response.data.datetime);
        const formattedTime = formatTimeForTimezone(now, timeZone);
        setTimeDate(formattedTime);
      }
      setTimeDate(prev => ({ ...prev, loader: false }));
    } catch (error) {
      console.warn(`Failed to fetch time for timezone ${timeZone}:`, error);
      // Fallback to local time on error
      const now = new Date();
      const formattedTime = formatTimeForTimezone(now, timeZone);
      setTimeDate(formattedTime);
      setTimeDate(prev => ({ ...prev, loader: false }));
    }
  }, [countryCode]);

  useEffect(() => {
    // Initial update
    updateTime();

    // Update every second
    // const interval = setInterval(() => {
    //   updateTime();
    // }, 4000);

    // Cleanup
    // return () => clearInterval(interval);
  }, [updateTime]);

  return timeDate;
}
