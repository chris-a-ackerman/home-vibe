'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SavedCriteria } from '@/lib/types';
import SavedCriteriaCard from './SavedCriteriaCard';

export default function SavedCriteriaList() {
  const router = useRouter();
  const [criteria, setCriteria] = useState<SavedCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved criteria on component mount
  useEffect(() => {
    fetchSavedCriteria();
  }, []);

  const fetchSavedCriteria = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to view saved criteria');
        setLoading(false);
        return;
      }

      // Fetch criteria for the current user
      const { data, error: fetchError } = await supabase
        .from('evaluation_criteria')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCriteria(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load saved criteria';
      setError(errorMessage);
      console.error('Error fetching saved criteria:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('evaluation_criteria')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setCriteria(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete criteria';
      alert(errorMessage);
      console.error('Error deleting criteria:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="font-['Inter'] font-normal text-[14px] text-[#4a5565]">
          Loading saved criteria...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="font-['Inter'] font-normal text-[14px] text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (criteria.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <div className="card flex items-center justify-center min-h-[200px]">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-transparent border-0 px-4 py-2 rounded-lg font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-[#0a0a0a] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            + Create new criteria set
          </button>
        </div>
      </div>
      
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {criteria.map((item) => (
        <SavedCriteriaCard
          key={item.id}
          criteria={item}
          onDelete={handleDelete}
        />
      ))}
      
      <div className="card flex items-center justify-center min-h-[200px]">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-transparent border-0 px-4 py-2 rounded-lg font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-[#0a0a0a] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          + Create new criteria set
        </button>
      </div>
      
    </div>
  );
}
