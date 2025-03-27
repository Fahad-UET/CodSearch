import React from 'react';
import { Settings, Clock } from 'lucide-react';
import { useDefaultSettingsStore } from '../store/defaultSettingsStore';
import { useLocalTime } from '../hooks/useLocalTime';
import { COUNTRIES } from '../services/codNetwork/constants';
import { Keyboard } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import CurrencyConverter from './CurrencyConverter';
import { useLanguageStore } from '../store/languageStore';

interface DefaultSettingsBarProps {
  onOpenSettings: () => void;
    // comment this code because of typescript issues check this if it causes issues
  // showCalculatorFunction?: () => void;
  // showNotesFunction?: () => void;
  // showHabitFunction?: () => void;
  // showPomodoroTimerFunction?: () => void;
}

export function DefaultSettingsBar({
  onOpenSettings,

  // showCalculatorFunction,
  // showNotesFunction,
  // showHabitFunction,
  // showPomodoroTimerFunction,
}: DefaultSettingsBarProps) {
  const [showVirtualKeyboard, setShowVirtualKeyboard] = React.useState(false);
  const { t, language } = useLanguageStore();

  const settings = useDefaultSettingsStore(state => state.settings);
  const updateSettings = useDefaultSettingsStore(state => state.updateSettings);
  const { time, date, timeZone } = useLocalTime(settings.country);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ country: e.target.value });
  };

  // Group countries by continent
  const groupedCountries = Object.entries(COUNTRIES).reduce((acc, [code, country]) => {
    if (!acc[country.continent]) {
      acc[country.continent] = [];
    }
    acc[country.continent].push({ code, ...country });
    return acc;
  }, {} as Record<string, Array<{ code: string; name: string; continent: string }>>);

  return (
    <div className="bg-[#161E2C] h-8 shadow-[0_2px_4px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] border-b border-white/10">
      <div className="max-w-7xl x2lg:max-w-[88%] x4lg:max-w-[97%]  mx-auto px-4 flex justify-between">
        <div className="flex items-center gap-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-4">
            <CurrencyConverter
              // comment this code because CurrencyConverter doesn't take any props check this
              // showCalculatorFunction={showCalculatorFunction}
              // showNotesFunction={showNotesFunction}
              // showHabitFunction={showHabitFunction}
              // showPomodoroTimerFunction={showPomodoroTimerFunction}
            />
          </div>
          <button
            onClick={() => setShowVirtualKeyboard(true)}
            className="text-white hover:text-white/80 transition-colors"
            title={t('virtualKeyboard')}
          >
            <Keyboard size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between h-full gap-3">
          {/* Left Section - Country Selector */}
          <div className="flex items-center gap-3">
            <select
              value={settings.country}
              onChange={handleCountryChange}
              className="bg-white/5 border-0 text-white rounded-lg focus:ring-0 text-xs h-6 px-2 hover:bg-white/10 transition-colors"
            >
              {Object.entries(groupedCountries).map(([continent, countries]) => (
                <optgroup key={continent} label={continent} className="bg-white text-gray-900">
                  {countries.map(({ code, name }) => (
                    <option key={code} value={code} className="text-gray-900">
                      {name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <span className="text-white font-semibold text-base">CoD-Track.com</span>
          </div>

          {/* Right Section - Time and Settings */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors">
              <Clock size={12} className="text-purple-300" />
              <span className="text-xs font-medium text-white">{time}</span>
              <span className="text-purple-300 mx-1">|</span>
              <span className="text-xs text-white">{date}</span>
              <span className="text-purple-300 mx-1">|</span>
              <span className="text-[10px] text-purple-300">{timeZone}</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>
      {showVirtualKeyboard && <VirtualKeyboard onKeyPress={() => setShowVirtualKeyboard(false)} />}
    </div>
  );
}
