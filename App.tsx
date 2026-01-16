import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TerminalInput from './components/TerminalInput';
import CountUp from './components/CountUp';
import InfoBlock from './components/InfoBlock';
import { OZ_TO_KYATTHAR_CONSTANT, DEFAULT_WORLD_PRICE, DEFAULT_EXCHANGE_RATE, DEFAULT_MMK_GOLD_PRICE, LABELS, GOLD_API_URL } from './constants';
import { CalculationMode } from './types';
import { toMyanmarDigits, formatMyanmarTime } from './utils';

const API_TIMEOUT_MS = 10000;
const MIN_VALID_GOLD_PRICE = 100;
const MAX_VALID_GOLD_PRICE = 100000;

const App: React.FC = () => {
  // State
  const [mode, setMode] = useState<CalculationMode>('PRICE');
  const [time, setTime] = useState(new Date());

  // Inputs
  const [worldPrice, setWorldPrice] = useState<number>(DEFAULT_WORLD_PRICE);
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);
  const [mmkGoldPrice, setMmkGoldPrice] = useState<number>(DEFAULT_MMK_GOLD_PRICE);

  const [isFetching, setIsFetching] = useState(false);
  const [isLivePrice, setIsLivePrice] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLivePrice = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const response = await fetch(GOLD_API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP_ERROR_${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data.price !== 'number') {
        throw new Error('INVALID_RESPONSE_FORMAT');
      }

      if (!Number.isFinite(data.price) || data.price < MIN_VALID_GOLD_PRICE || data.price > MAX_VALID_GOLD_PRICE) {
        throw new Error('PRICE_OUT_OF_BOUNDS');
      }

      setWorldPrice(data.price);
      setIsLivePrice(true);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to fetch gold price:", error);
      }
      setFetchError("ကမ္ဘာ့ရွှေဈေး ရယူ၍မရပါ။ ထပ်စမ်းကြည့်ပါ။");
      setIsLivePrice(false);
    } finally {
      setTimeout(() => setIsFetching(false), 800);
    }
  }, []);

  // Auto-load live data on mount
  useEffect(() => {
    fetchLivePrice();
  }, [fetchLivePrice]);

  // Handle manual price change
  const handleWorldPriceChange = (val: number) => {
    setWorldPrice(val);
    setIsLivePrice(false);
  };

  // --- Calculations ---

  // 1. Calculate MMK Price (Mode: PRICE)
  const calculatedPrice = useMemo(() => {
    if (!worldPrice || !exchangeRate) return 0;
    return (worldPrice / OZ_TO_KYATTHAR_CONSTANT) * exchangeRate;
  }, [worldPrice, exchangeRate]);

  // 2. Calculate Implied Rate (Mode: IMPLIED_RATE)
  const impliedRate = useMemo(() => {
    if (!worldPrice || !mmkGoldPrice) return 0;
    // Formula: (MMK_Price * 1.873) / World
    return (mmkGoldPrice * OZ_TO_KYATTHAR_CONSTANT) / worldPrice;
  }, [worldPrice, mmkGoldPrice]);

  // Derived values for "Lakhs" formatting
  const formattedLakhs = useMemo(() => {
    const val = mode === 'PRICE' ? calculatedPrice : mmkGoldPrice;
    if (val === 0) return { lakhs: 0, remainder: 0 };
    const lakhs = Math.floor(val / 100000);
    const remainder = Math.floor(val % 100000);
    return { lakhs, remainder };
  }, [calculatedPrice, mmkGoldPrice, mode]);

  // Time formatter (returns { period, time } for separate font styling)
  const myanmarTime = useMemo(() => {
    return formatMyanmarTime(time);
  }, [time]);
  
  const formattedDate = useMemo(() => {
    return toMyanmarDigits(time.toLocaleDateString());
  }, [time]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden selection:bg-orange-500 selection:text-white bg-[#EAE5D9]">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0" 
        style={{
            backgroundImage: `linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(to right, #1A1A1A 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Header Bar */}
      <header className="bg-neutral-900 text-white p-3 flex justify-between items-center border-b-4 border-orange-600 z-10 relative shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-orange-600 animate-pulse rounded-full"></div>
          <h1 className="text-lg md:text-xl font-mm-bold">
            {LABELS.APP_TITLE}
          </h1>
        </div>
        <div className="text-xs md:text-sm text-neutral-400 font-burmese-num-light">
           {myanmarTime.period} {myanmarTime.time} <span className="text-orange-600 mx-2">|</span> {formattedDate}
        </div>
      </header>

      {/* Marquee Tape */}
      <div className="bg-neutral-200 border-b border-neutral-400 overflow-hidden py-1 z-10">
        <div className="animate-marquee font-mono-chatu text-xs text-neutral-600 flex space-x-12">
          <span className="mr-8">{mode === 'PRICE' ? 'စနစ် - ဈေးနှုန်း တွက်ချက်ခြင်း' : 'စနစ် - ဒေါ်လာဈေး ခန့်မှန်းခြင်း'}</span>
          <span className="mr-8">ကမ္ဘာ့ရွှေဈေး - ဈေးကွက်ဖွင့်</span>
          <span className="mr-8">ငွေလဲလှယ်နှုန်း - အတက်အကျရှိ</span>
          <span className="mr-8">စနစ်အခြေအနေ - အဆင်ပြေ</span>
          <span className="mr-8">ကိန်းသေ - <span className="font-burmese-num-light">၁.၈၇၃</span> (အောင်စ မှ ကျပ်သား)</span>
          <span className="mr-8">အချက်အလက် - {isFetching ? "ချိတ်ဆက်နေသည်..." : (fetchError ? <span className="text-red-600">{fetchError}</span> : (isLivePrice ? "တိုက်ရိုက်ထုတ်လွှင့်မှု" : "ကိုယ်တိုင်ထည့်သွင်းမှု"))}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-8 relative z-10 max-w-5xl">
        
        {/* Top Section: Inputs & Visualizer */}
        <div className="grid md:grid-cols-12 gap-0 border-2 border-neutral-900 bg-[#FDFBF7] shadow-2xl">
          
          {/* Inputs Column */}
          <div className="md:col-span-5 border-b-2 md:border-b-0 md:border-r-2 border-neutral-900 p-8 flex flex-col relative">
            
            {/* Mode Switcher */}
            <div className="flex bg-neutral-200 p-1 mb-10 rounded">
                <button
                    onClick={() => setMode('PRICE')}
                    className={`flex-1 py-1.5 text-xs rounded transition-all font-mono-chatu ${mode === 'PRICE' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                    ရွှေဈေး တွက်ရန်
                </button>
                <button
                    onClick={() => setMode('IMPLIED_RATE')}
                    className={`flex-1 py-1.5 text-xs rounded transition-all font-mono-chatu ${mode === 'IMPLIED_RATE' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                    ဒေါ်လာဈေး ရှာရန်
                </button>
            </div>

            <div className="flex flex-col space-y-12">
                {/* Input 1: World Price (Always visible) */}
                <TerminalInput
                label="01 // ကမ္ဘာ့ရွှေဈေး" 
                value={worldPrice} 
                onChange={handleWorldPriceChange} 
                prefix="$"
                suffix="USD / OZ"
                onAction={fetchLivePrice}
                actionLabel="နောက်ဆုံးရ ဈေးနှုန်း"
                actionHighlight={isLivePrice}
                isActionLoading={isFetching}
                />
                
                {/* Operator Visual */}
                <div className="flex justify-center text-neutral-400 text-2xl font-mono">
                    {mode === 'PRICE' ? '×' : '÷'}
                </div>

                {/* Input 2: Changes based on Mode */}
                {mode === 'PRICE' ? (
                    <TerminalInput
                    label="02 // ဒေါ်လာပေါက်ဈေး" 
                    value={exchangeRate} 
                    onChange={setExchangeRate} 
                    prefix="K"
                    suffix="MMK / USD"
                    />
                ) : (
                    <TerminalInput
                    label="02 // မြန်မာ့ရွှေဈေး" 
                    value={mmkGoldPrice} 
                    onChange={setMmkGoldPrice} 
                    prefix="K"
                    suffix="1 KYAT THAR"
                    />
                )}
            </div>
          </div>

          {/* Result Column */}
          <div className="md:col-span-7 bg-neutral-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
             {/* Decorative Elements */}
             <div className="absolute top-4 right-4 text-neutral-700 font-mono text-[10px] text-right">
                OUTPUT_CHANNEL: {mode === 'PRICE' ? 'A-01 (PRICE)' : 'B-02 (RATE)'}<br/>
                PRECISION: HIGH
             </div>

             <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600 opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>

             <div className="mt-8 md:mt-0">
                <h2 className="text-orange-500 font-burmese-num-light text-2xl mb-4">
                  {mode === 'PRICE' ? LABELS.CALCULATED_PRICE : LABELS.IMPLIED_RATE}
                </h2>
                
                {/* Main Big Number */}
                <div className="text-5xl md:text-7xl font-bold font-burmese-num tracking-tighter mb-2 flex flex-wrap items-baseline">
                  <CountUp
                    end={mode === 'PRICE' ? calculatedPrice : impliedRate}
                    duration={800}
                  />
                  <span className="text-orange-500 ml-3 text-3xl md:text-4xl font-burmese-num-light">ကျပ်</span>
                </div>
                
                {/* Divider */}
                <div className="w-full h-px bg-neutral-700 my-6"></div>

                {/* Secondary Breakdown */}
                {mode === 'PRICE' ? (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="font-burmese-num-light">
                            <span className="block text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono-chatu">သိန်းဂဏန်း</span>
                            <div className="text-2xl font-bold">
                            <CountUp end={formattedLakhs.lakhs} duration={800} /> <span className="text-sm text-neutral-400">သိန်း</span>
                            </div>
                        </div>
                        <div className="font-burmese-num-light">
                            <span className="block text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono-chatu">ကျန်ငွေ</span>
                            <div className="text-2xl font-bold">
                            <CountUp end={formattedLakhs.remainder} duration={800} /> <span className="text-sm text-neutral-400">ကျပ်</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                         <span className="block text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono-chatu">ဈေးကွက် သုံးသပ်ချက်</span>
                         <div className="text-xl font-bold text-neutral-300">
                             <span className="font-burmese-num-light">၁</span> <span className="font-mono-chatu">ဒေါ်လာ ≈</span> <CountUp end={impliedRate} duration={800} /> <span className="font-mono-chatu">ကျပ်</span>
                         </div>
                         <p className="text-xs text-neutral-500 mt-2 font-mono-chatu">
                         ကမ္ဘာ့ရွှေဈေးနှင့် ပြည်တွင်းရွှေဈေး ကွာဟချက်ကို မူတည်၍ တွက်ချက်ထားပါသည်
                         </p>
                    </div>
                )}
               
             </div>

             <div className="mt-12 text-[10px] text-neutral-500 font-mono border border-neutral-800 p-2 inline-block rounded self-start">
               {mode === 'PRICE'
                 ? <span>ƒ: (SPOT / 1.873) × RATE</span>
                 : <span>ƒ: (MMK_GOLD × 1.873) / SPOT</span>}
             </div>
          </div>
        </div>

        {/* Info / Explanation Section */}
        <InfoBlock />

      </main>

      {/* Footer */}
      <footer className="p-4 text-center font-mono text-[10px] text-neutral-500 relative z-10">
      ရွှေဈေး တွက်ချက်မှု တာမီနယ် V2.0 // ဘက်စုံသုံး စနစ်
      </footer>
    </div>
  );
};

export default App;