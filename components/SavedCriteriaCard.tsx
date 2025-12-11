'use client';

import { TrashIcon } from './icons';
import { SavedCriteria } from '@/lib/types';

interface SavedCriteriaCardProps {
  criteria: SavedCriteria;
  onDelete?: (id: string) => void;
}

export default function SavedCriteriaCard({ criteria, onDelete }: SavedCriteriaCardProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(criteria.id);
    }
  };

  const addressesEvaluated = criteria.addresses_evaluated || 0;

  // Format criteria for display
  const formatCriteriaForDisplay = () => {
    const items: string[] = [];

    // Check for commute-related criteria
    const commuteKeys = Object.keys(criteria.criteria).filter(key =>
      key.toLowerCase().includes('commute') || key.toLowerCase().includes('transit')
    );
    if (commuteKeys.length > 0) {
      items.push(`🚗 Commute: ${commuteKeys.length} location(s)`);
    }

    // Check for walkability criteria
    const walkabilityKeys = Object.keys(criteria.criteria).filter(key =>
      key.toLowerCase().includes('walkability') || key.toLowerCase().includes('walk')
    );
    if (walkabilityKeys.length > 0) {
      const walkValue = criteria.criteria[walkabilityKeys[0]];
      items.push(`👣 Walkability: ${walkValue}`);
    }

    // Add other criteria if any
    const otherKeys = Object.keys(criteria.criteria).filter(key =>
      !key.toLowerCase().includes('commute') &&
      !key.toLowerCase().includes('transit') &&
      !key.toLowerCase().includes('walkability') &&
      !key.toLowerCase().includes('walk')
    );

    otherKeys.forEach(key => {
      items.push(`${key}: ${criteria.criteria[key]}`);
    });

    return items;
  };

  const displayItems = formatCriteriaForDisplay();

  return (
    <div
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 relative w-full"
      data-name="SavedCriteriaCard"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <h3 className="font-['Inter'] font-normal text-[20px] leading-[28px] text-neutral-950 tracking-[-0.4492px]">
          {criteria.name}
        </h3>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center rounded-[8px] w-8 h-8 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Delete criteria"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Addresses Evaluated */}
      <div className="mb-8">
        <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#4a5565] tracking-[-0.1504px]">
          {addressesEvaluated} address{addressesEvaluated !== 1 ? 'es' : ''} evaluated
        </p>
      </div>

      {/* Criteria Details */}
      <div className="flex flex-col gap-2">
        {displayItems.map((item, index) => (
          <p
            key={index}
            className="font-['Inter'] font-normal text-[14px] leading-[20px] text-neutral-950 tracking-[-0.1504px]"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
