'use client';

import { useState } from 'react';

interface AddressEvaluationFormProps {
  onEvaluate?: (address: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function AddressEvaluationForm({ onEvaluate, disabled = false, disabledMessage }: AddressEvaluationFormProps) {
  const [address, setAddress] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!address.trim()) {
      alert('Please enter an address');
      return;
    }

    setIsEvaluating(true);

    try {
      // Call the onEvaluate callback if provided
      if (onEvaluate) {
        await onEvaluate(address);
      }
    } catch (error) {
      console.error('Error evaluating address:', error);
      alert('Failed to evaluate address');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEvaluate();
    }
  };

  return (
    <div
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 w-full"
      data-name="AddressEvaluationForm"
    >
      {/* Heading */}
      <div className="mb-12">
        <h2 className="font-['Inter'] font-normal text-[30px] leading-[36px] text-neutral-950 tracking-[0.3955px]">
          Where are you considering?
        </h2>
      </div>

      {/* Input and Button Section */}
      <div className="flex flex-col gap-4">
        {/* Address Input */}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter address"
          className="bg-[#f3f3f5] border border-transparent rounded-[8px] px-3 h-[50px] w-full font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-[rgba(0,0,0,0.2)] transition-colors"
          disabled={isEvaluating}
        />

        {/* Evaluate Button */}
        <div className="relative group">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !address.trim() || disabled}
            className="bg-[#030213] rounded-[8px] h-[40px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center hover:bg-[#1a1a2e] active:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEvaluating ? 'Evaluating...' : 'Evaluate Location'}
          </button>

          {/* Tooltip */}
          {disabled && disabledMessage && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-[12px] rounded-[6px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {disabledMessage}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
