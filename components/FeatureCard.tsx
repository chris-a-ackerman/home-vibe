'use client';

import { useState } from 'react';

export type FeatureCardOption = {
  label: string;
  value: string;
};

export type FeatureCardData = {
  icon: string;
  title: string;
  subtitle: string;
  options: FeatureCardOption[];
  defaultValue?: string;
};

interface FeatureCardProps {
  data: FeatureCardData;
  onValueChange?: (value: string) => void;
  onHide?: () => void;
}

export default function FeatureCard({ data, onValueChange, onHide }: FeatureCardProps) {
  const [selectedValue, setSelectedValue] = useState(
    data.defaultValue || data.options[0]?.value || ''
  );

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    onValueChange?.(value);
  };

  const handleHideClick = () => {
    onHide?.();
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 relative w-full max-w-[392px]">
      {/* Header Section */}
      <div className="flex flex-col gap-1 mb-10">
        <div className="flex items-center gap-2">
          <span className="text-[20px] leading-[28px]" role="img" aria-label={data.title}>
            {data.icon}
          </span>
          <h3 className="font-['Inter'] font-medium text-[18px] leading-[28px] text-neutral-950 tracking-[-0.4395px]">
            {data.title}
          </h3>
        </div>
        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#4a5565] tracking-[-0.1504px]">
          {data.subtitle}
        </p>
      </div>

      {/* Options Section */}
      <div className="flex flex-col gap-2">
        {data.options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`
                px-4 py-2 rounded-[8px] font-['Inter'] font-medium
                text-[14px] leading-[20px] tracking-[-0.1504px]
                text-center transition-all min-h-[26px]
                ${
                  isSelected
                    ? 'bg-[#030213] text-white border border-[#030213]'
                    : 'bg-transparent text-[#4a5565] border border-transparent hover:border-[rgba(0,0,0,0.1)]'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Hide Button */}
      <button
        onClick={handleHideClick}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
        aria-label="Hide card"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.99984 7.99999C1.99984 7.99999 4.6665 2.66666 7.99984 2.66666C11.3332 2.66666 13.9998 7.99999 13.9998 7.99999C13.9998 7.99999 11.3332 13.3333 7.99984 13.3333C4.6665 13.3333 1.99984 7.99999 1.99984 7.99999Z"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="2"
            y1="2"
            x2="14"
            y2="14"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
