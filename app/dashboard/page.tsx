'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import PillNavigation from '@/components/PillNavigation';
import FeatureCard, { FeatureCardData } from '@/components/FeatureCard';
import CommuteCard from '@/components/CommuteCard';
import HiddenCardsNotification from '@/components/HiddenCardsNotification';
import AddressEvaluationForm from '@/components/AddressEvaluationForm';
import LocationScorecard from '@/components/LocationScorecard';
import QuickEvaluation from '@/components/QuickEvaluation';
import { featureCards } from '@/lib/featureCardData';
import { supabase } from '@/lib/supabase';

interface CommuteLocation {
  id: string;
  address: string;
  maxCommute: string;
  commuteType: string;
}

export default function DashboardPage() {
  const [hiddenCards, setHiddenCards] = useState<FeatureCardData[]>([]);
  const [isCommuteHidden, setIsCommuteHidden] = useState(false);
  const [commuteLocations, setCommuteLocations] = useState<CommuteLocation[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<{
    address: string;
    score: number;
    criteriaUsed: Record<string, string>;
  } | null>(null);
  const [criteriaName, setCriteriaName] = useState('');
  const [savedCriteriaId, setSavedCriteriaId] = useState<string | null>(null);
  const [isSavingCriteria, setIsSavingCriteria] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasSavedCriteria, setHasSavedCriteria] = useState(false);
  const [savedCriteriaList, setSavedCriteriaList] = useState<Array<{ id: string; name: string }>>([]);
  const scorecardRef = useRef<HTMLDivElement>(null);

  // Initialize criteriaValues with default values from featureCards
  const initialCriteriaValues = useMemo(() => {
    return featureCards.reduce((acc, card) => {
      acc[card.title] = card.defaultValue || card.options[0]?.value || '';
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const [criteriaValues, setCriteriaValues] = useState<Record<string, string>>(initialCriteriaValues);

  // Check for saved criteria on mount
  useEffect(() => {
    const checkForSavedCriteria = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setHasSavedCriteria(false);
          setSavedCriteriaList([]);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('evaluation_criteria')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setHasSavedCriteria(data && data.length > 0);
        setSavedCriteriaList(data || []);
      } catch (err) {
        console.error('Error checking for saved criteria:', err);
        setHasSavedCriteria(false);
        setSavedCriteriaList([]);
      }
    };

    checkForSavedCriteria();
  }, []);

  const handleHideCard = (card: FeatureCardData) => {
    setHiddenCards((prev) => [...prev, card]);
  };

  const handleShowCard = (card: FeatureCardData) => {
    setHiddenCards((prev) => prev.filter((c) => c.title !== card.title));
  };

  const handleValueChange = (title: string, value: string) => {
    setCriteriaValues((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const handleSaveCriteria = async () => {
    if (!criteriaName.trim()) {
      setSaveMessage({ type: 'error', text: 'Please enter a name for your criteria' });
      return;
    }

    setIsSavingCriteria(true);
    setSaveMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSaveMessage({ type: 'error', text: 'Please sign in to save your criteria' });
        setIsSavingCriteria(false);
        // setTimeout(() => {
        //   window.location.href = '/signup';
        // }, 1500);
        return;
      }

      const { data: savedCriteria, error: saveError } = await supabase
        .from('evaluation_criteria')
        .insert([
          {
            name: criteriaName,
            criteria: visibleCriteriaValues,
            user_id: user.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (saveError) throw saveError;

      setSaveMessage({ type: 'success', text: 'Evaluation criteria saved successfully!' });
      setSavedCriteriaId(savedCriteria.id);
      setHasSavedCriteria(true);
      setSavedCriteriaList((prev) => [{ id: savedCriteria.id, name: savedCriteria.name }, ...prev]);

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save evaluation criteria';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSavingCriteria(false);
    }
  };

  const handleEvaluateAddress = async (address: string) => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // User not signed in - evaluate without saving
        console.log('Evaluating address without saving (user not signed in):', address);
        console.log('Criteria values:', visibleCriteriaValues);

        // TODO: Call API endpoint to evaluate address
        // const response = await fetch('/api/evaluate-address', {
        //   method: 'POST',
        //   body: JSON.stringify({ address, criteria: visibleCriteriaValues }),
        // });
        // const result = await response.json();

        // Set evaluation result without saving
        setEvaluationResult({
          address: address,
          score: 85, // This would come from the API
          criteriaUsed: visibleCriteriaValues,
        });

        // Show message to sign in
        setSaveMessage({
          type: 'error',
          text: 'Please sign in to save your criteria and score'
        });

        // Scroll to scorecard
        setTimeout(() => {
          scorecardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        return;
      }

      // User is signed in - check if criteria name is provided
      if (!criteriaName.trim()) {
        setSaveMessage({
          type: 'error',
          text: 'Please enter a name for your criteria before evaluating'
        });
        return;
      }

      // Check if criteria already exists for this user with this name
      let criteriaId = savedCriteriaId;

      if (!criteriaId) {
        // Check if criteria with this name already exists
        const { data: existingCriteria, error: checkError } = await supabase
          .from('evaluation_criteria')
          .select('id, criteria')
          .eq('user_id', user.id)
          .eq('name', criteriaName)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingCriteria) {
          // Update existing criteria
          const { data: updatedCriteria, error: updateError } = await supabase
            .from('evaluation_criteria')
            .update({
              criteria: visibleCriteriaValues,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingCriteria.id)
            .select()
            .single();

          if (updateError) throw updateError;

          console.log('Criteria updated:', updatedCriteria);
          criteriaId = updatedCriteria.id;
          setSavedCriteriaId(updatedCriteria.id);
          setHasSavedCriteria(true);
          // Update the criteria in the list
          setSavedCriteriaList((prev) =>
            prev.map((item) => (item.id === updatedCriteria.id ? { id: updatedCriteria.id, name: updatedCriteria.name } : item))
          );
        } else {
          // Create new criteria
          const { data: newCriteria, error: saveError } = await supabase
            .from('evaluation_criteria')
            .insert([
              {
                name: criteriaName,
                criteria: visibleCriteriaValues,
                user_id: user.id,
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (saveError) throw saveError;

          console.log('Criteria saved:', newCriteria);
          criteriaId = newCriteria.id;
          setSavedCriteriaId(newCriteria.id);
          setHasSavedCriteria(true);
          // Add new criteria to the list
          setSavedCriteriaList((prev) => [{ id: newCriteria.id, name: newCriteria.name }, ...prev]);
        }
      }

      // Evaluate the address using the saved criteria
      console.log('Evaluating address:', address);
      console.log('With saved criteria ID:', criteriaId);
      console.log('Criteria values:', visibleCriteriaValues);

      // TODO: Call API endpoint to evaluate address with the saved criteria ID
      // const response = await fetch('/api/evaluate-address', {
      //   method: 'POST',
      //   body: JSON.stringify({ address, criteriaId: savedCriteria.id }),
      // });
      // const result = await response.json();

      // Set evaluation result
      setEvaluationResult({
        address: address,
        score: 85, // This would come from the API
        criteriaUsed: visibleCriteriaValues,
      });

      setSaveMessage({
        type: 'success',
        text: 'Criteria saved and address evaluated successfully!'
      });

      // Scroll to scorecard
      setTimeout(() => {
        scorecardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error during evaluation:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save criteria and evaluate address. Please try again.'
      });
    }
  };

  const visibleCards = featureCards.filter(
    (card) => !hiddenCards.some((hidden) => hidden.title === card.title)
  );

  // Filter criteriaValues to only include visible cards
  const visibleCriteriaValues = useMemo(() => {
    const visibleTitles = new Set(visibleCards.map(card => card.title));
    const result = Object.keys(criteriaValues)
      .filter(key => visibleTitles.has(key))
      .reduce((acc, key) => {
        acc[key] = criteriaValues[key];
        return acc;
      }, {} as Record<string, string>);

    // Add commute data if not hidden and has at least one location with an address
    if (!isCommuteHidden && commuteLocations.length > 0) {
      const validLocations = commuteLocations.filter(loc => loc.address.trim() !== '');
      if (validLocations.length > 0) {
        result['Commute'] = JSON.stringify(validLocations);
      }
    }

    return result;
  }, [criteriaValues, visibleCards, isCommuteHidden, commuteLocations]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-[91px] py-8">
        <PillNavigation />

        {/* Quick Evaluation - only shows if user has saved criteria */}
        <div className="mt-8">
          <QuickEvaluation
            hasSavedCriteria={hasSavedCriteria}
            savedCriteriaList={savedCriteriaList}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-neutral-950 mb-4">New Evaluation</h2>
          <p className="text-neutral-600 mb-8">Configure your home preferences below.</p>

          {/* Hidden Cards Notification */}
          <HiddenCardsNotification
            hiddenCards={hiddenCards}
            onShowCard={handleShowCard}
            isCommuteHidden={isCommuteHidden}
            onShowCommute={() => setIsCommuteHidden(false)}
          />

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Commute Card */}
            {!isCommuteHidden && (
              <CommuteCard
                onValueChange={setCommuteLocations}
                onHide={() => setIsCommuteHidden(true)}
              />
            )}

            {/* Regular Feature Cards */}
            {visibleCards.map((card, index) => (
              <FeatureCard
                key={`${card.title}-${index}`}
                data={card}
                onValueChange={(value) => handleValueChange(card.title, value)}
                onHide={() => handleHideCard(card)}
              />
            ))}
          </div>

          {/* Criteria Name Input and Save Button */}
          <div className="mb-8 flex flex-col gap-3 w-full max-w-[1230px]">
            <input
              type="text"
              value={criteriaName}
              onChange={(e) => setCriteriaName(e.target.value)}
              placeholder="Name your criteria (e.g., 'Family-Friendly', 'Urban Professional')"
              className="bg-[#f3f3f5] border border-transparent rounded-[8px] px-3 py-2 h-[36px] w-full font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-[rgba(0,0,0,0.2)] transition-colors"
              disabled={isSavingCriteria}
            />

            <button
              onClick={handleSaveCriteria}
              disabled={isSavingCriteria}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] h-[36px] w-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSavingCriteria ? 'Saving...' : 'Save Evaluation Criteria'}
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

          {/* Address Evaluation Form */}
          <div className="mb-8">
            <AddressEvaluationForm
              onEvaluate={handleEvaluateAddress}
              disabled={visibleCards.length === 0 && isCommuteHidden}
              disabledMessage="You must have at least one criteria feature to evaluate an address"
            />
          </div>

          {/* Location Scorecard - Only show after evaluation */}
          {evaluationResult && (
            <div ref={scorecardRef} className="mb-8">
              <LocationScorecard
                score={evaluationResult.score}
                address={evaluationResult.address}
                criteriaUsed={Object.keys(evaluationResult.criteriaUsed)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
