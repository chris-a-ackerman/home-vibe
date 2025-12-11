import Header from '@/components/Header';
import PillNavigation from '@/components/PillNavigation';
import SavedCriteriaList from '@/components/SavedCriteriaList';

export default function ByCriteriaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-[91px] py-8">
        <PillNavigation />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-neutral-950 mb-4">By Criteria</h2>
          <p className="text-neutral-600 mb-8">View and filter homes based on your criteria.</p>

          <SavedCriteriaList />
        </div>
      </main>
    </div>
  );
}
