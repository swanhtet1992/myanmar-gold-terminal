import React, { useState, useEffect } from 'react';
import { toMyanmarDigits, parseMyanmarToEnglish } from '../utils';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 999999999;

interface TerminalInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
  actionHighlight?: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  label,
  value,
  onChange,
  prefix = "$",
  suffix = "",
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  onAction,
  actionLabel,
  isActionLoading = false,
  actionHighlight = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  // Sync internal display state with prop value
  useEffect(() => {
    // If focused, we generally let the user type, but if the prop updates externally (like Live Data fetch), we must update.
    if (value === 0 && !isFocused) {
      setDisplayValue('');
    } else {
      setDisplayValue(toMyanmarDigits(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numericValue = parseMyanmarToEnglish(inputValue);

    // Reject invalid numbers (NaN, Infinity, -Infinity)
    if (!Number.isFinite(numericValue)) {
      return;
    }

    let newDisplay = inputValue;
    newDisplay = newDisplay.replace(/[0-9]/g, (d) => toMyanmarDigits(d));

    const parts = newDisplay.split('.');
    if (parts.length > 2) {
      newDisplay = parts[0] + '.' + parts.slice(1).join('');
    }

    setDisplayValue(newDisplay);

    // Clamp value within bounds
    const clampedValue = Math.max(min, Math.min(numericValue, max));
    onChange(clampedValue);
  };

  return (
    <div className={`
      relative group border-b-2 border-neutral-800 transition-all duration-300
      ${isFocused ? 'bg-neutral-900' : 'bg-transparent'}
    `}>
      {/* Label Tag - Moved slightly higher to avoid overlap with tall Burmese glyphs */}
      <div className={`
        absolute -top-5 left-0 text-sm px-1 transition-colors duration-300 font-mono-chatu
        ${isFocused ? 'bg-orange-600 text-white' : 'bg-neutral-800 text-white'}
      `}>
        {label}
      </div>

      {/* Action Button (Top Right) */}
      {onAction && (
        <button
          onClick={onAction}
          disabled={isActionLoading}
          className={`
            absolute -top-5 right-0 text-sm px-2 transition-all duration-300 z-10 flex items-center gap-2 border font-mono-chatu
            ${actionHighlight
              ? 'bg-orange-600 text-white hover:bg-orange-700 border-orange-600'
              : (isFocused
                  ? 'bg-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 border-transparent'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-800 hover:text-white border-transparent')
            }
            ${isActionLoading ? 'cursor-wait opacity-80' : ''}
          `}
        >
          {isActionLoading && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse block"/>}
          {isActionLoading ? 'ချိတ်ဆက်နေသည်...' : `[ ${actionLabel} ]`}
        </button>
      )}

      {/* Increased top padding (pt-10) to accommodate tall Burmese ascenders */}
      <div className="flex items-center px-4 pt-10 pb-6">
        <span className={`
          text-xl font-bold mr-2 font-mono transition-colors duration-300 mb-1
          ${isFocused ? 'text-orange-500' : 'text-neutral-500'}
        `}>
          {prefix}
        </span>
        
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-transparent border-none outline-none text-3xl font-bold font-burmese-num tracking-wide
            placeholder-neutral-600 transition-colors duration-300 !leading-tight
            ${isFocused ? 'text-white' : 'text-neutral-900'}
          `}
          placeholder="၀"
        />

        <span className={`
          text-xs font-bold uppercase ml-2 transition-colors duration-300
          ${isFocused ? 'text-neutral-400' : 'text-neutral-500'}
        `}>
          {suffix}
        </span>
      </div>

      {/* Active Indicator Bar */}
      <div className={`
        absolute bottom-0 left-0 h-[4px] bg-orange-600 transition-all duration-500 ease-out
        ${isFocused ? 'w-full' : 'w-0'}
      `} />
    </div>
  );
};

export default TerminalInput;