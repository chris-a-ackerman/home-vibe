'use client';

import { useState, useMemo } from 'react';
import AddressInput, { AddressSuggestion } from './AddressInput';

// Mock autocomplete data
const MOCK_AUTOCOMPLETE_DATA: Record<string, AddressSuggestion[]> = {
  "1600": [
    {
      id: "address.1",
      text: "1600 Amphitheatre Parkway, Mountain View, CA",
      latitude: 37.4220,
      longitude: -122.0841
    },
    {
      id: "address.4",
      text: "1600 Pennsylvania Avenue NW, Washington, DC",
      latitude: 38.8977,
      longitude: -77.0365
    }
  ],
  "350": [
    {
      id: "address.2",
      text: "350 5th Avenue, New York, NY",
      latitude: 40.7484,
      longitude: -73.9857
    },
    {
      id: "address.5",
      text: "350 Mission Street, San Francisco, CA",
      latitude: 37.7897,
      longitude: -122.3972
    }
  ],
  "1": [
    {
      id: "poi.3",
      text: "1 Apple Park Way, Cupertino, CA",
      latitude: 37.3349,
      longitude: -122.0091
    }
  ]
};

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

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsVerified(true);
  };

  // Get suggestions based on current input
  const suggestions = useMemo(() => {
    if (!address || address.length < 1) return [];

    // Find matching suggestions from mock data
    const searchKey = Object.keys(MOCK_AUTOCOMPLETE_DATA).find(key =>
      address.toLowerCase().startsWith(key.toLowerCase())
    );

    return searchKey ? MOCK_AUTOCOMPLETE_DATA[searchKey] : [];
  }, [address]);

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
