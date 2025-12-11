import Header from '@/components/Header';
import PillNavigation from '@/components/PillNavigation';

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-[91px] py-8">
        <PillNavigation />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-neutral-950 mb-4">Compare</h2>
          <p className="text-neutral-600">Compare multiple homes side by side.</p>
        </div>
      </main>
    </div>
  );
}
