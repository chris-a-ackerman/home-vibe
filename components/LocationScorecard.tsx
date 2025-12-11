'use client';

import { useState } from 'react';

interface CriteriaScore {
  name: string;
  score: number;
  icon: string;
}

interface LocationScorecardProps {
  score?: number;
  address?: string;
  narrative?: string;
  criteriaScores?: CriteriaScore[];
  criteriaUsed?: string[]; // Array of criteria names that were evaluated
}

const defaultCriteriaScores: CriteriaScore[] = [
  { name: 'Restaurants', score: 100, icon: '☕' },
  { name: 'Gym & Fitness', score: 85, icon: '🏋️' },
  { name: 'Public Transit', score: 92, icon: '🚇' },
  { name: 'Grocery Stores', score: 88, icon: '🛒' },
  { name: 'Parks & Recreation', score: 83, icon: '🏞️' },
  { name: 'Schools', score: 70, icon: '🏫' },
];

export default function LocationScorecard({
  score = 85,
  address = '63 Bristol',
  narrative = 'Living at 63 Bristol offers a practical lifestyle. Your commute is remarkably convenient, typically under 15 minutes. The area offers decent walkability, though some errands may require a short drive. Dining options abound, from casual cafes to upscale restaurants within easy reach. There is minimal flood risk to consider for this location. Local schools are adequate though not exceptional, which may be a consideration for families. Weekend evenings can get lively with neighborhood activity, though weekdays are generally quieter.',
  criteriaScores = defaultCriteriaScores,
  criteriaUsed
}: LocationScorecardProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Filter criteria scores to only show those that were evaluated
  const filteredCriteriaScores = criteriaUsed
    ? criteriaScores.filter(criteria => criteriaUsed.includes(criteria.name))
    : criteriaScores;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-[#00a63e]';
    return 'bg-[#155dfc]';
  };

  return (
    <div
      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 w-full"
      data-name="LocationScorecard"
    >
      <div className="flex flex-col gap-4 items-center">
        {/* Score Display */}
        <div className="flex flex-col items-center">
          <div className="w-[160px] h-[160px] flex flex-col items-center justify-center">
            <p
              className={`font-['Inter'] font-semibold text-[48px] leading-[48px] tracking-[0.3516px] ${getScoreColor(score)}`}
            >
              {score}
            </p>
            <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#4a5565] tracking-[-0.1504px] mt-4">
              Overall Score
            </p>
          </div>
        </div>

        {/* Address */}
        <p className="font-['Inter'] font-normal text-[24px] leading-[32px] text-neutral-950 tracking-[0.0703px]">
          {address}
        </p>

        {/* Narrative */}
        <div className="w-full mt-8">
          <p className="font-['Inter'] font-normal text-[16px] leading-[26px] text-[#364153] tracking-[-0.3125px]">
            {narrative}
          </p>
        </div>

        {/* Score Breakdown Section */}
        <div className="w-full mt-4 flex flex-col gap-4">
          {/* Toggle Button */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950 hover:bg-gray-50 transition-colors relative flex items-center justify-center"
          >
            <span className="absolute left-[83px] translate-x-[-50%]">See score breakdown</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute right-4 transition-transform ${showBreakdown ? '' : 'rotate-180'}`}
            >
              <path
                d="M12 10L8 6L4 10"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Breakdown Items */}
          {showBreakdown && (
            <div className="flex flex-col gap-3">
              {filteredCriteriaScores.map((criteria, index) => (
                <div
                  key={index}
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] p-4 flex flex-col gap-2"
                >
                  {/* Criteria Name with Icon */}
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{criteria.icon}</span>
                    <p className="font-['Inter'] font-normal text-[16px] leading-[24px] text-neutral-950 tracking-[-0.3125px]">
                      {criteria.name}
                    </p>
                  </div>

                  {/* Progress Bar and Score */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 h-[8px] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(criteria.score)}`}
                        style={{ width: `${criteria.score}%` }}
                      />
                    </div>
                    <p className="font-['Inter'] font-normal text-[16px] leading-[24px] text-neutral-950 tracking-[-0.3125px] w-[60px] text-right">
                      {criteria.score}/100
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
