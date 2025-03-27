import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Globe, Clock } from 'lucide-react';

interface TimeData {
  datetime: string;
  timezone: string;
}

interface Country {
  name: string;
  timezone: string;
  region: string;
  code: string;
}

const countries: Country[] = [
  // Asia
  { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', region: 'Asia', code: 'sa' },
  { name: 'UAE', timezone: 'Asia/Dubai', region: 'Asia', code: 'ae' },
  { name: 'Iraq', timezone: 'Asia/Baghdad', region: 'Asia', code: 'iq' },
  { name: 'Bahrain', timezone: 'Asia/Bahrain', region: 'Asia', code: 'bh' },
  { name: 'Oman', timezone: 'Asia/Muscat', region: 'Asia', code: 'om' },
  { name: 'Kuwait', timezone: 'Asia/Kuwait', region: 'Asia', code: 'kw' },
  { name: 'Qatar', timezone: 'Asia/Qatar', region: 'Asia', code: 'qa' },

  // Africa
  { name: 'Morocco', timezone: 'Africa/Casablanca', region: 'Africa', code: 'ma' },
  { name: 'Algeria', timezone: 'Africa/Algiers', region: 'Africa', code: 'dz' },
  { name: 'Tunisia', timezone: 'Africa/Tunis', region: 'Africa', code: 'tn' },
  { name: "Côte d'Ivoire", timezone: 'Africa/Abidjan', region: 'Africa', code: 'ci' },
  { name: 'Senegal', timezone: 'Africa/Dakar', region: 'Africa', code: 'sn' },
  { name: 'Burkina Faso', timezone: 'Africa/Ouagadougou', region: 'Africa', code: 'bf' },
  { name: 'Mali', timezone: 'Africa/Bamako', region: 'Africa', code: 'ml' },
  { name: 'Guinea', timezone: 'Africa/Conakry', region: 'Africa', code: 'gn' },
  { name: 'Gabon', timezone: 'Africa/Libreville', region: 'Africa', code: 'ga' },
  { name: 'Congo', timezone: 'Africa/Brazzaville', region: 'Africa', code: 'cg' },
  { name: 'Cameroon', timezone: 'Africa/Douala', region: 'Africa', code: 'cm' },

  // Europe
  { name: 'Spain', timezone: 'Europe/Madrid', region: 'Europe', code: 'es' },
  { name: 'France', timezone: 'Europe/Paris', region: 'Europe', code: 'fr' },
  { name: 'United Kingdom', timezone: 'Europe/London', region: 'Europe', code: 'gb' },
  { name: 'Germany', timezone: 'Europe/Berlin', region: 'Europe', code: 'de' },
  { name: 'Italy', timezone: 'Europe/Rome', region: 'Europe', code: 'it' },
  { name: 'Switzerland', timezone: 'Europe/Zurich', region: 'Europe', code: 'ch' },
  { name: 'Portugal', timezone: 'Europe/Lisbon', region: 'Europe', code: 'pt' },
  { name: 'Poland', timezone: 'Europe/Warsaw', region: 'Europe', code: 'pl' },
  { name: 'Czech Republic', timezone: 'Europe/Prague', region: 'Europe', code: 'cz' },
  { name: 'Hungary', timezone: 'Europe/Budapest', region: 'Europe', code: 'hu' },
  { name: 'Slovakia', timezone: 'Europe/Bratislava', region: 'Europe', code: 'sk' },
  { name: 'Romania', timezone: 'Europe/Bucharest', region: 'Europe', code: 'ro' },
  { name: 'Lithuania', timezone: 'Europe/Vilnius', region: 'Europe', code: 'lt' },
  { name: 'Slovenia', timezone: 'Europe/Ljubljana', region: 'Europe', code: 'si' },
  { name: 'Croatia', timezone: 'Europe/Zagreb', region: 'Europe', code: 'hr' },

  // Latin America
  { name: 'Colombia', timezone: 'America/Bogota', region: 'Latin America', code: 'co' },
  { name: 'Panama', timezone: 'America/Panama', region: 'Latin America', code: 'pa' },
];

const CountryTimeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [currentTime, setCurrentTime] = useState<TimeData | null>(null);
  const intervalRef = useRef<number>();

  const getLocalTime = (timezone: string) => {
    try {
      const now = new Date();
      return {
        datetime: now.toLocaleString('en-GB', { timeZone: timezone }),
        timezone: timezone,
      };
    } catch (err) {
      console.error('Error getting local time:', err);
      return {
        datetime: new Date().toISOString(),
        timezone: timezone,
      };
    }
  };

  const updateTime = () => {
    const localTime = getLocalTime(selectedCountry.timezone);
    setCurrentTime(localTime);
  };

  const fetchTime = async (timezone: string) => {
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!response.ok) throw new Error('Failed to fetch time');
      const data: TimeData = await response.json();
      setCurrentTime(data);
    } catch (err) {
      updateTime();
      console.info('World Time API unavailable, using local time fallback');
    }
  };

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    fetchTime(selectedCountry.timezone);

    // Set up new interval for local time updates
    intervalRef.current = window.setInterval(() => {
      updateTime();
    }, 1000); // Update every second

    // Clean up interval on unmount or country change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedCountry]);

  const formatDateTime = (datetime: string) => {
    return {
      time: datetime?.split(',')[1]?.trim(),
      date: datetime?.split(',')[0]?.trim(),
    };
  };

  const getTimezoneAbbr = (timezone: string) => {
    if (!currentTime) return '';
    const date = new Date(currentTime.datetime);
    try {
      return (
        Intl.DateTimeFormat('en', { timeZoneName: 'short', timeZone: timezone })
          .formatToParts(date)
          .find(part => part.type === 'timeZoneName')?.value || ''
      );
    } catch (err) {
      return timezone.split('/')[1].replace('_', ' ');
    }
  };

  const groupedCountries = countries.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors
          hover:bg-white/5 rounded px-3 py-2 border border-white/10 bg-white/5"
      >
        <img
          src={`https://flagcdn.com/${selectedCountry.code}.svg`}
          alt={selectedCountry.name}
          className="w-5 h-4 rounded object-cover"
        />
        <span>{selectedCountry.name}</span>
        {currentTime && (
          <>
            <Clock size={16} className="ml-2 text-purple-400" />
            <span>{formatDateTime(currentTime.datetime).time}</span>
            <span className="text-white/40">{formatDateTime(currentTime.datetime).date}</span>
            <span className="text-white/40">{getTimezoneAbbr(selectedCountry.timezone)}</span>
          </>
        )}
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 max-h-[calc(100vh-80px)] overflow-y-auto
          bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl
          border border-white/10 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] py-2 z-50"
        >
          {Object.entries(groupedCountries).map(([region, countries]) => (
            <div key={region} className="relative">
              <div
                className="sticky top-0 px-4 py-2 text-xs font-semibold text-purple-300 
                uppercase tracking-wider bg-gradient-to-r from-purple-500/20 to-transparent
                border-y border-purple-500/20 backdrop-blur-sm"
              >
                {region}
              </div>
              {countries.map(country => (
                <button
                  key={country.name}
                  onClick={() => {
                    setSelectedCountry(country);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200
                    hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-transparent
                    group flex items-center justify-between
                    ${
                      selectedCountry.name === country.name
                        ? 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-transparent'
                        : 'text-white/80'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/${country.code}.svg`}
                      alt={country.name}
                      className="w-5 h-4 rounded object-cover"
                    />
                    <span>{country.name}</span>
                  </div>
                  <span className="text-white/40 group-hover:text-white/60 transition-colors text-xs">
                    {getTimezoneAbbr(country.timezone)}
                  </span>
                </button>
              ))}
            </div>
          ))}
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default CountryTimeSelector;
