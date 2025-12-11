'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SaveEvaluationFormProps {
  criteriaData: Record<string, string>;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export default function SaveEvaluationForm({
  criteriaData,
  onSaveSuccess,
  onSaveError,
}: SaveEvaluationFormProps) {
  const router = useRouter();
  const [criteriaName, setCriteriaName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    if (!criteriaName.trim()) {
      setSaveMessage({ type: 'error', text: 'Please enter a name for your criteria' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Check if user is logged in
      if (!user) {
        setSaveMessage({ type: 'error', text: 'Please sign in to save your criteria' });
        setIsSaving(false);
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push('/signup');
        }, 1500);
        return;
      }

      console.log('Current User:', user);
      const { data, error } = await supabase
        .from('evaluation_criteria')
        .insert([
          {
            name: criteriaName,
            criteria: criteriaData,
            user_id: user?.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

  

      setSaveMessage({ type: 'success', text: 'Evaluation criteria saved successfully!' });
      setCriteriaName('');
      onSaveSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save evaluation criteria';
      setSaveMessage({ type: 'error', text: errorMessage });
      onSaveError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[1230px]">
      {/* Input Box */}
      <input
        type="text"
        value={criteriaName}
        onChange={(e) => setCriteriaName(e.target.value)}
        placeholder="Name your criteria (e.g., 'Family-Friendly', 'Urban Professional')"
        className="bg-[#f3f3f5] border border-transparent rounded-[8px] px-3 py-2 h-[36px] w-full font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-[rgba(0,0,0,0.2)] transition-colors"
        disabled={isSaving}
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? 'Saving...' : 'Save Evaluation Criteria'}
      </button>

      

      {/* Status Message */}
      {saveMessage && (
        <div
          className={`px-4 py-2 rounded-[8px] text-[14px] font-['Inter'] ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage.text}
        </div>
      )}
    </div>
  );
}
