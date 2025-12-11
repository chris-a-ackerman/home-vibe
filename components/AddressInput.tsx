'use client';

import { useState, useRef, useEffect } from 'react';

interface AddressSuggestion {
  id: string;
  text: string;
  latitude: number;
  longitude: number;
}

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  verified?: boolean;
  suggestions?: AddressSuggestion[];
}

export default function AddressInput({
  value,
  onChange,
  onSelect,
  onKeyPress,
  placeholder = "Enter address",
  disabled = false,
  verified = false,
  suggestions = []
}: AddressInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setShowDropdown(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.text);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {/* Input Container */}
      <div className="relative h-[50px] w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          onFocus={() => setShowDropdown(value.length > 0 && suggestions.length > 0)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-[50px] px-3 pr-12 rounded-lg
            font-['Inter'] font-normal text-[14px] tracking-[-0.1504px]
            transition-all
            ${verified
              ? 'bg-white border-2 border-[#00c950] text-[#717182]'
              : 'bg-gray-100 border border-transparent text-[#717182] focus:border-[rgba(0,0,0,0.2)] shadow-[0px_0px_0px_0.489px_rgba(161,161,161,0.08)]'
            }
            placeholder:text-[#717182]
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />

        {/* Checkmark Icon */}
        {verified && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6667 5L7.50004 14.1667L3.33337 10"
                stroke="#00c950"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-[50px] left-0 right-0 z-10 bg-white border border-gray-200 rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full flex items-center gap-3 px-4 h-11 text-left
                hover:bg-gray-50 transition-colors
                ${index === 0 ? 'rounded-t-[10px]' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-[10px]' : ''}
              `}
            >
              {/* Location Pin Icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M8 8.66667C8.73638 8.66667 9.33333 8.06971 9.33333 7.33333C9.33333 6.59695 8.73638 6 8 6C7.26362 6 6.66667 6.59695 6.66667 7.33333C6.66667 8.06971 7.26362 8.66667 8 8.66667Z"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14C10 11.3333 13.3333 9.07619 13.3333 6.66667C13.3333 3.72115 10.9455 1.33333 8 1.33333C5.05448 1.33333 2.66667 3.72115 2.66667 6.66667C2.66667 9.07619 6 11.3333 8 14Z"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Address Text */}
              <p className="font-['Inter'] font-normal text-[14px] leading-5 tracking-[-0.1504px] text-neutral-950">
                {suggestion.text}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Verification Message */}
      {verified && (
        <div className="flex items-center gap-1 h-4">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="#00c950"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-['Inter'] font-normal text-[12px] leading-4 text-[#00c950]">
            Address verified
          </p>
        </div>
      )}
    </div>
  );
}

export type { AddressSuggestion };
