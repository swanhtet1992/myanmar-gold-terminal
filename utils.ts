
export const EN_TO_MY_DIGITS: { [key: string]: string } = {
  '0': '၀', '1': '၁', '2': '၂', '3': '၃', '4': '၄',
  '5': '၅', '6': '၆', '7': '၇', '8': '၈', '9': '၉'
};

export const MY_TO_EN_DIGITS: { [key: string]: string } = {
  '၀': '0', '၁': '1', '၂': '2', '၃': '3', '၄': '4',
  '၅': '5', '၆': '6', '၇': '7', '၈': '8', '၉': '9'
};

export const toMyanmarDigits = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '';
  // Convert scientific notation to decimal string if needed, or just toString
  let str = num.toString();
  
  // Replace standard digits with Myanmar digits
  return str.replace(/[0-9]/g, (digit) => EN_TO_MY_DIGITS[digit] || digit);
};

export const parseMyanmarToEnglish = (str: string): number => {
  // Replace Myanmar digits with English digits
  const englishStr = str.replace(/[၀-၉]/g, (digit) => MY_TO_EN_DIGITS[digit] || digit);
  // Remove non-numeric characters except dot
  const cleanStr = englishStr.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : val;
};

export interface MyanmarTime {
  period: string;  // မနက်, နေ့လည်, ညနေ, ည
  time: string;    // ၁၀·၃၀·၄၅
}

export const formatMyanmarTime = (date: Date): MyanmarTime => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Determine Myanmar time period
  let period: string;
  if (hour >= 5 && hour < 12) {
    period = 'မနက်'; // morning
  } else if (hour >= 12 && hour < 17) {
    period = 'နေ့လည်'; // afternoon
  } else if (hour >= 17 && hour < 19) {
    period = 'ညနေ'; // evening
  } else {
    period = 'ည'; // night (7pm - 5am)
  }

  // Convert to 12-hour format
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;

  // Format time string and convert to Myanmar digits (using middle dot for better alignment)
  const timeStr = `${hour12}·${minute.toString().padStart(2, '0')}·${second.toString().padStart(2, '0')}`;

  return {
    period,
    time: toMyanmarDigits(timeStr)
  };
};
