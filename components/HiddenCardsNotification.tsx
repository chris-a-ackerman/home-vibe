'use client';

import { FeatureCardData } from './FeatureCard';

interface HiddenCardsNotificationProps {
  hiddenCards: FeatureCardData[];
  onShowCard: (card: FeatureCardData) => void;
  isCommuteHidden?: boolean;
  onShowCommute?: () => void;
}

export default function HiddenCardsNotification({
  hiddenCards,
  onShowCard,
  isCommuteHidden = false,
  onShowCommute,
}: HiddenCardsNotificationProps) {
  const totalHiddenCount = hiddenCards.length + (isCommuteHidden ? 1 : 0);

  if (totalHiddenCount === 0) return null;

  const factorText = totalHiddenCount === 1 ? 'factor' : 'factors';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-[14px] p-[17px] mb-6">
      <div className="flex items-start gap-2">
        {/* Info Icon */}
        <div className="w-[20px] h-[20px] mt-0.5 flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="8" stroke="#9CA3AF" strokeWidth="1.5" />
            <path
              d="M10 6V10"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="10" cy="13" r="0.5" fill="#9CA3AF" />
          </svg>
        </div>

        <div className="flex-1">
          {/* Message */}
          <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#364153] tracking-[-0.1504px] mb-[8px]">
            {totalHiddenCount} {factorText} {totalHiddenCount === 1 ? 'is' : 'are'} hidden and won't be included in evaluations
          </p>

          {/* Hidden Cards Pills */}
          <div className="flex flex-wrap gap-2">
            {/* Commute Card */}
            {isCommuteHidden && onShowCommute && (
              <button
                onClick={onShowCommute}
                className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[8px] py-[7px] h-[32px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-[12px] leading-[16px]" role="img" aria-label="Commute">
                  🚗
                </span>
                <span className="font-['Inter'] font-medium text-[12px] leading-[16px] text-neutral-950">
                  Commute
                </span>
                {/* Plus Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33334V12.6667"
                    stroke="#030213"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33334 8H12.6667"
                    stroke="#030213"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Regular Feature Cards */}
            {hiddenCards.map((card) => (
              <button
                key={card.title}
                onClick={() => onShowCard(card)}
                className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[8px] py-[7px] h-[32px] flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-[12px] leading-[16px]" role="img" aria-label={card.title}>
                  {card.icon}
                </span>
                <span className="font-['Inter'] font-medium text-[12px] leading-[16px] text-neutral-950">
                  {card.title}
                </span>
                {/* Plus Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33334V12.6667"
                    stroke="#030213"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33334 8H12.6667"
                    stroke="#030213"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
