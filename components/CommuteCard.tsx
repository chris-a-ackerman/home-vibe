'use client';

import { useState } from 'react';

interface CommuteLocation {
  id: string;
  address: string;
  maxCommute: string;
  commuteType: string;
}

interface CommuteCardProps {
  onValueChange?: (locations: CommuteLocation[]) => void;
  onHide?: () => void;
}

const commuteTimeOptions = ['10', '15', '20', '25', '30', '45', '60', '60+'];
const commuteTypeOptions = ['Walk', 'Train', 'Bus', 'Car'];

export default function CommuteCard({ onValueChange, onHide }: CommuteCardProps) {
  const [locations, setLocations] = useState<CommuteLocation[]>([
    {
      id: '1',
      address: '',
      maxCommute: '30',
      commuteType: 'Car',
    },
  ]);

  const updateLocation = (id: string, field: keyof CommuteLocation, value: string) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, [field]: value } : loc
    );
    setLocations(updatedLocations);
    onValueChange?.(updatedLocations);
  };

  const addLocation = () => {
    const newLocation: CommuteLocation = {
      id: Date.now().toString(),
      address: '',
      maxCommute: '30',
      commuteType: 'Car',
    };
    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    onValueChange?.(updatedLocations);
  };

  const deleteLocation = (id: string) => {
    // Don't allow deleting if it's the only location
    if (locations.length === 1) return;

    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    onValueChange?.(updatedLocations);
  };

  const handleHideClick = () => {
    onHide?.();
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-6 relative w-full max-w-[392px]">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-10">
        <span className="text-[20px] leading-[28px]" role="img" aria-label="Commute">
          🚗
        </span>
        <h3 className="font-['Inter'] font-medium text-[18px] leading-[28px] text-neutral-950 tracking-[-0.4395px]">
          Commute
        </h3>
      </div>

      {/* Location Entries */}
      <div className="flex flex-col gap-4">
        {locations.map((location, index) => (
          <div key={location.id} className="flex flex-col gap-4">
            {/* Work Address Input with Delete Button */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={location.address}
                onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                placeholder="Work address"
                className="flex-1 bg-[#f3f3f5] border border-transparent rounded-[8px] px-3 h-[36px] font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-[rgba(0,0,0,0.2)] transition-colors"
              />
              {/* Delete Button - Only show if there's more than one location */}
              {locations.length > 1 && (
                <button
                  onClick={() => deleteLocation(location.id)}
                  className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
                  aria-label="Delete location"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Max Commute (minutes) */}
            <div className="flex flex-col gap-1">
              <label className="font-['Inter'] font-medium text-[12px] leading-[16px] text-[#4a5565]">
                Max commute (minutes)
              </label>
              <div className="flex gap-[7.96px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] rounded-[8px]">
                {commuteTimeOptions.map((time) => {
                  const isSelected = location.maxCommute === time;
                  return (
                    <button
                      key={time}
                      onClick={() => updateLocation(location.id, 'maxCommute', time)}
                      className={`
                        h-[36px] px-[13px] py-px rounded-[8px] font-['Inter'] font-medium
                        text-[14px] leading-[20px] tracking-[-0.1504px] text-center transition-all
                        ${
                          isSelected
                            ? 'bg-[#030213] text-white border border-[#030213]'
                            : 'bg-transparent text-[#4a5565] border border-transparent'
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Commute Type */}
            <div className="flex flex-col gap-1">
              <label className="font-['Inter'] font-medium text-[12px] leading-[16px] text-[#4a5565]">
                Preferred commute type
              </label>
              <div className="flex gap-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] rounded-[8px]">
                {commuteTypeOptions.map((type) => {
                  const isSelected = location.commuteType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => updateLocation(location.id, 'commuteType', type)}
                      className={`
                        h-[36px] px-[13px] py-px rounded-[8px] font-['Inter'] font-medium
                        text-[14px] leading-[20px] tracking-[-0.1504px] text-center transition-all
                        ${
                          isSelected
                            ? 'bg-[#030213] text-white border border-[#030213]'
                            : 'bg-transparent text-[#4a5565] border border-transparent'
                        }
                      `}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Button */}
        <button
          onClick={addLocation}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[32px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33334V12.6667M3.33333 8H12.6667"
              stroke="#030213"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add another
        </button>
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
