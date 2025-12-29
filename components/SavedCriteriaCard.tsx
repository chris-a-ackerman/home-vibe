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
      className="card"
      data-name="SavedCriteriaCard"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <h3 className="text-heading-md">
          {criteria.name}
        </h3>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="btn-icon"
          aria-label="Delete criteria"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Addresses Evaluated */}
      <div className="mb-8">
        <p className="card-subtitle">
          {addressesEvaluated} address{addressesEvaluated !== 1 ? 'es' : ''} evaluated
        </p>
      </div>

      {/* Criteria Details */}
      <div className="flex flex-col gap-2">
        {displayItems.map((item, index) => (
          <p
            key={index}
            className="card-subtitle text-neutral-950"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
