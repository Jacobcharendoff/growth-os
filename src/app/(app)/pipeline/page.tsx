'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { PipelineBoard } from '@/components/PipelineBoard';
import { Modal } from '@/components/Modal';
import { AddDealForm } from '@/components/AddDealForm';
import { Plus } from 'lucide-react';

export default function PipelinePage() {
  const { deals, contacts, initializeSeedData } = useStore();
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pipeline</h1>
            <p className="text-slate-600 mt-1">
              {deals.length} deals across {deals.filter((d) => new Set(deals.map((x) => x.stage)).has(d.stage)).length} stages
            </p>
          </div>
          <button
            onClick={() => setIsAddDealOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-hidden bg-slate-50">
        <PipelineBoard deals={deals} contacts={contacts} />
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title="Add New Deal"
      >
        <AddDealForm
          contacts={contacts}
          onClose={() => setIsAddDealOpen(false)}
        />
      </Modal>
    </div>
  );
}
