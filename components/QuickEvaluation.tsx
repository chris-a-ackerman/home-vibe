'use client';

import { useState, useEffect, useRef } from 'react';
import AddressInput, { AddressSuggestion } from './AddressInput';
import { getAddressSuggestions } from '@/lib/addressEvaluationData';

interface SavedCriteriaItem {
  id: string;
  name: string;
}

interface QuickEvaluationProps {
  hasSavedCriteria: boolean;
  savedCriteriaList: SavedCriteriaItem[];
}

export default function QuickEvaluation({ hasSavedCriteria, savedCriteriaList }: QuickEvaluationProps) {
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Address autocomplete state
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AddressSuggestion | null>(null);

  // Auto-select the first criteria when the list changes
  useEffect(() => {
    if (savedCriteriaList.length > 0 && !selectedCriteriaId) {
      setSelectedCriteriaId(savedCriteriaList[0].id);
    }
  }, [savedCriteriaList, selectedCriteriaId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch address suggestions when address changes
  useEffect(() => {
    const abortController = new AbortController();

    const fetchSuggestions = async () => {
      if (!address || address.length < 3) {
        setSuggestions([]);
        return;
      }

      const currentAddress = address;

      try {
        const results = await getAddressSuggestions(address);

        if (!abortController.signal.aborted && currentAddress === address) {
          setSuggestions(results);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [address]);

  // Don't render if no saved criteria
  if (!hasSavedCriteria || savedCriteriaList.length === 0) {
    return null;
  }

  const selectedCriteria = savedCriteriaList.find((c) => c.id === selectedCriteriaId);

  const handleSelectCriteria = (id: string) => {
    setSelectedCriteriaId(id);
    setIsDropdownOpen(false);
  };

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    setIsVerified(false);
    setSelectedSuggestion(null);
  };

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsVerified(true);
  };

  const handleEvaluate = () => {
    if (!isVerified || !selectedCriteriaId) {
      console.log('Cannot evaluate: address not verified or no criteria selected');
      return;
    }

    console.log('Evaluating:', {
      address,
      criteriaId: selectedCriteriaId,
      suggestion: selectedSuggestion
    });

    // TODO: Implement evaluation logic
  };

  return (
    <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-[14px] p-[25px] flex flex-col gap-[40px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2L4 13H10L9 18L16 7H10L11 2Z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <h3 className="font-['Inter'] font-normal text-[20px] leading-[28px] tracking-[-0.4492px] text-[#0a0a0a]">
          Quick Evaluation
        </h3>
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-3">
        {/* Dropdown */}
        <div ref={dropdownRef} className="relative w-[428px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-transparent rounded-[8px] px-[13px] py-px h-[36px] flex items-center justify-between w-full hover:border-[rgba(0,0,0,0.1)] transition-colors"
          >
            <span className="font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#0a0a0a]">
              {selectedCriteria?.name || 'Select criteria...'}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[38px] left-0 w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
              {savedCriteriaList.map((criteria) => (
                <button
                  key={criteria.id}
                  onClick={() => handleSelectCriteria(criteria.id)}
                  className={`w-full text-left px-[13px] py-[8px] font-['Inter'] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] hover:bg-gray-50 transition-colors ${
                    selectedCriteriaId === criteria.id ? 'bg-[#eff6ff] text-[#0a0a0a]' : 'text-[#0a0a0a]'
                  }`}
                >
                  {criteria.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Address Input */}
        <div className="flex-1">
          <AddressInput
            value={address}
            onChange={handleAddressChange}
            onSelect={handleSuggestionSelect}
            placeholder="63 Bristol St, Cambridge, MA 02141"
            verified={isVerified}
            suggestions={suggestions}
            className="bg-white border border-transparent rounded-[8px] px-[12px] py-[4px] h-[36px] w-full font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:border-[rgba(0,0,0,0.2)] transition-colors"
            containerClassName="relative w-full"
          />
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={!isVerified || !selectedCriteriaId}
          className="bg-[#030213] text-white rounded-[8px] px-[16px] py-[8px] h-[36px] font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] hover:bg-[#1a1a2e] active:bg-[#000000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Evaluate
        </button>
      </div>
    </div>
  );
}
