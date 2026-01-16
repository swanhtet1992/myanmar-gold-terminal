import React, { useState } from 'react';

const InfoBlock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t-4 border-neutral-900 mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-neutral-200 hover:bg-neutral-900 hover:text-white transition-colors duration-300 p-4 group"
      >
        <span className="flex items-center gap-2">
          <span className="font-mm-bold text-base">// စနစ်လမ်းညွှန် နှင့် တွက်နည်းအညွှန်း</span>
        </span>
        <span className="font-mono text-xl group-hover:text-orange-500">
          {isOpen ? '[-]' : '[+]'}
        </span>
      </button>

      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out bg-white
        ${isOpen ? 'max-h-[2000px] opacity-100 border-b-2 border-neutral-900' : 'max-h-0 opacity-50'}
      `}>
        <div className="p-6 md:p-8 space-y-8 font-mm text-neutral-800 leading-relaxed max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold border-b-2 border-orange-500 inline-block mb-3 text-neutral-900 font-mono-mm">
                01. <span className="font-mm-bold">ပုံသေနည်း</span>
              </h3>
              <p className="mb-4 text-sm">
                မြန်မာ့ရွှေဈေး (အခေါက်ရွှေ ၁ ကျပ်သား) တွက်ချက်ပုံမှာ -
              </p>
              <div className="bg-neutral-100 p-4 border-l-4 border-orange-500 font-mm-bold text-xs md:text-sm my-4">
                (World Price / 1.873) * Exchange Rate
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
                <li><strong className="text-neutral-900 font-mm">1.873 =</strong> ၁ အောင်စတွင် ရှိသော ကျပ်သား (ကိန်းသေ)။</li>
                <li><strong className="text-neutral-900 font-mm">World Price =</strong> ကမ္ဘာ့ရွှေဈေး (USD/Oz)။</li>
                <li><strong className="text-neutral-900 font-mm">Exchange Rate =</strong> ဒေါ်လာပေါက်ဈေး (MMK)။</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold border-b-2 border-orange-500 inline-block mb-3 text-neutral-900 font-mono-mm">
                 02. <span className="font-mm-bold">ယူနစ်ပြောင်းလဲခြင်း</span>
              </h3>
              <p className="mb-4 text-sm">
                 အောင်စ (Troy Ounce) နှင့် ကျပ်သား ကွာခြားချက် -
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-dashed border-neutral-300 pb-2">
                  <span className="text-neutral-900 font-mm">1 Troy Ounce</span>
                  <span className="text-neutral-900 font-mm">31.1035 g</span>
                </li>
                <li className="flex justify-between border-b border-dashed border-neutral-300 pb-2">
                  <span className="text-neutral-900 font-mm">၁ ကျပ်သား</span>
                  <span className="text-neutral-900 font-mm">16.606 g</span>
                </li>
                <li className="pt-2 text-xs italic text-neutral-500">
                  31.1035 ÷ 16.606 ≈ 1.873
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dashed border-neutral-300 pt-6">
             <h3 className="text-lg font-bold border-b-2 border-orange-500 inline-block mb-3 text-neutral-900 font-mono-mm">
                 03. <span className="font-mm-bold">ဒေါ်လာဈေး ပြန်ရှာခြင်း</span>
              </h3>
              <p className="mb-4 text-sm">
                လက်ရှိ မြန်မာ့ရွှေပေါက်ဈေးနှင့် ကမ္ဘာ့ရွှေဈေးကို အခြေခံပြီး ပြင်ပဒေါ်လာဈေးမှန်ကို ခန့်မှန်းတွက်ချက်နည်း ဖြစ်သည်။
              </p>
              <div className="bg-neutral-100 p-4 border-l-4 border-orange-500 font-mm-bold text-xs md:text-sm my-4">
                 (MMK Gold Price * 1.873) / World Price
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
                <li>ပြင်ပဒေါ်လာဈေး အတက်အကျကို အချိန်နှင့်တပြေးညီ ခန့်မှန်းနိုင်သည်။</li>
                <li>ရွှေဈေးနှင့် ဒေါ်လာဈေးအကြား ကွာဟချက် (Gap) ကို စောင့်ကြည့်ရန် အသုံးဝင်သည်။</li>
              </ul>
          </div>

          <div className="bg-neutral-900 text-neutral-300 p-6 rounded-sm text-sm">
            <h4 className="text-orange-500 font-bold mb-2 font-mm-bold">// မှတ်ချက်</h4>
            <p className="mb-2">
              ဤတွက်ချက်မှုသည် <strong>အခေါက်ရွှေ (24K/99.9%)</strong> အတွက် အခြေခံတွက်နည်းသာ ဖြစ်ပါသည်။
            </p>
            <p>
              လက်တွေ့ဈေးကွက်တွင် ရည်ညွှန်းဈေး၊ ပြင်ပပေါက်ဈေး၊ နှင့် ၁၅-ပဲရည် ဈေးကွက်သဘောတရားများအပေါ်မူတည်၍ အနည်းငယ် ကွာခြားနိုင်ပါသည်။
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBlock;
