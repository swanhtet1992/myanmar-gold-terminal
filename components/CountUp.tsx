import React, { useEffect, useState } from 'react';
import { toMyanmarDigits } from '../utils';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  className?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 1000, decimals = 0, prefix = "", className = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = count;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out expo
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      const current = startValue + (end - startValue) * ease;
      
      setCount(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration]);

  // Format using English locale first to get commas/decimals correctly, then map to Myanmar
  const formattedEnglish = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(count);

  const formattedMyanmar = toMyanmarDigits(formattedEnglish);

  // Note: We use font-burmese-num for the class to ensure correct font
  return <span className={`font-burmese-num ${className}`}>{prefix}{formattedMyanmar}</span>;
};

export default CountUp;