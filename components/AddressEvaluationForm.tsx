'use client';

import { useState, useEffect } from 'react';
import AddressInput, { AddressSuggestion } from './AddressInput';
import { getAddressSuggestions } from '@/lib/addressEvaluationData';

interface AddressEvaluationFormProps {
  onEvaluate?: (address: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

export default function AddressEvaluationForm({ onEvaluate, disabled = false, disabledMessage }: AddressEvaluationFormProps) {
  const [address, setAddress] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AddressSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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
    if (e.key === 'Enter' && isVerified) {
      handleEvaluate();
    }
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    // Reset verification when user types
    setIsVerified(false);
    setSelectedSuggestion(null);
  };

  // Fetch suggestions when address changes
  useEffect(() => {
    // Cancel previous request if user is still typing
    const abortController = new AbortController();

    const fetchSuggestions = async () => {
      if (!address || address.length < 3) {
        setSuggestions([]);
        return;
      }

      const currentAddress = address; // Capture current value
      setIsLoadingSuggestions(true);

      try {
        const results = await getAddressSuggestions(address);

        // Only update suggestions if address hasn't changed and request wasn't cancelled
        if (!abortController.signal.aborted && currentAddress === address) {
          setSuggestions(results);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    };

    // Increased debounce for faster typing
    const timeoutId = setTimeout(fetchSuggestions, 500);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [address]);

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsVerified(true);
  };

  return (
    <div
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] pl-[33px] pr-px py-[33px] w-full flex flex-col gap-12"
      data-name="AddressEvaluationForm"
    >
      {/* Heading */}
      <div className="h-9">
        <h2 className="font-['Inter'] font-normal text-[30px] leading-[36px] text-neutral-950 tracking-[0.3955px]">
          Where are you considering?
        </h2>
      </div>

      {/* Input and Button Section */}
      <div className="flex flex-col gap-4 w-full pr-[33px]">
        {/* Address Input */}
        <AddressInput
          value={address}
          onChange={handleAddressChange}
          onSelect={handleSuggestionSelect}
          onKeyPress={handleKeyPress}
          placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
          disabled={isEvaluating}
          verified={isVerified}
          suggestions={suggestions}
        />

        {/* Evaluate Button */}
        <div className="relative group">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || !isVerified || disabled}
            className={`
              rounded-[8px] h-[40px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-center transition-colors
              ${isVerified && !disabled && !isEvaluating
                ? 'bg-[#030213] text-white hover:bg-[#1a1a2e] active:bg-[#000000]'
                : 'bg-[#d1d5dc] text-[#6a7282] cursor-not-allowed'
              }
            `}
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
