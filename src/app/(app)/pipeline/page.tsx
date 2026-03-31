'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Deal, PipelineStage, Contact, LeadSource, getLeadSourceRing, getRingDisplayLabel } from '@/types';
import { Modal } from '@/components/Modal';
import { AddDealForm } from '@/components/AddDealForm';
import { Plus, Search, X, Eye, List, Edit, Phone, MessageSquare, Trash2 } from 'lucide-react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const PIPELINE_STAGES_CONFIG: { stage: PipelineStage; labelKey: string; color: string }[] = [
  { stage: 'new_lead', labelKey: 'pipeline.newLead', color: 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600' },
  { stage: 'contacted', labelKey: 'pipeline.contacted', color: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' },
  { stage: 'estimate_scheduled', labelKey: 'pipeline.estScheduled', color: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700' },
  { stage: 'estimate_sent', labelKey: 'pipeline.estSent', color: 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700' },
  { stage: 'booked', labelKey: 'pipeline.booked', color: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700' },
  { stage: 'in_progress', labelKey: 'pipeline.inProgress', color: 'bg-cyan-100 dark:bg-cyan-900 border-cyan-300 dark:border-cyan-700' },
  { stage: 'completed', labelKey: 'pipeline.completed', color: 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700' },
  { stage: 'invoiced', labelKey: 'pipeline.invoiced', color: 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' },
];

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'existing_customer', label: 'Existing Customer' },
  { value: 'reactivation', label: 'Reactivation' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'referral', label: 'Referral' },
  { value: 'review', label: 'Review' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'google_lsa', label: 'Google LSA' },
  { value: 'seo', label: 'SEO' },
  { value: 'gbp', label: 'Google Business' },
];

const PIPELINE_STAGES: { stage: PipelineStage; label: string }[] = [
  { stage: 'new_lead', label: 'New Lead' },
  { stage: 'contacted', label: 'Contacted' },
  { stage: 'estimate_scheduled', label: 'Estimate Scheduled' },
  { stage: 'estimate_sent', label: 'Estimate Sent' },
  { stage: 'booked', label: 'Booked' },
  { stage: 'in_progress', label: 'In Progress' },
  { stage: 'completed', label: 'Completed' },
  { stage: 'invoiced', label: 'Invoiced' },
];

interface EditFormData {
  contactId: string;
  title: string;
  value: string;
  stage: PipelineStage;
  source: LeadSource;
  assignedTo: string;
  notes: string;
  scheduledDate: string;
}

export default function PipelinePage() {
  const { t } = useLanguage();
  const { deals, contacts, initializeSeedData, updateDeal, deleteDeal, getContact, addActivity, addDeal } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isEditDealOpen, setIsEditDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteConfirmDealId, setDeleteConfirmDealId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [valueFilter, setValueFilter] = useState<string>('all');
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [sortColumn, setSortColumn] = useState<'title' | 'contact' | 'value' | 'days'>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mobileSelectedStage, setMobileSelectedStage] = useState<PipelineStage>('new_lead');

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, debouncedSearchQuery, assignedToFilter, sourceFilter, valueFilter]);

  const applyFilters = () => {
    let filtered = deals.filter((deal) => {
      const contact = getContact(deal.contactId);
      const contactName = contact?.name || '';

      const matchesSearch =
        debouncedSearchQuery === '' ||
        deal.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contactName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesAssigned =
        assignedToFilter === 'all' ||
        deal.assignedTo === assignedToFilter ||
        (assignedToFilter === 'team' && deal.assignedTo === 'Team');

      const sourceRing = getLeadSourceRing(deal.source);
      const matchesSource =
        sourceFilter === 'all' || sourceRing === sourceFilter;

      const matchesValue =
        valueFilter === 'all' ||
        (valueFilter === 'under_1k' && deal.value < 1000) ||
        (valueFilter === '1k_5k' && deal.value >= 1000 && deal.value < 5000) ||
        (valueFilter === '5k_10k' && deal.value >= 5000 && deal.value < 10000) ||
        (valueFilter === 'over_10k' && deal.value >= 10000);

      return matchesSearch && matchesAssigned && matchesSource && matchesValue;
    });

    setFilteredDeals(filtered);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStage = destination.droppableId as PipelineStage;
    const deal = deals.find(d => d.id === draggableId);
    updateDeal(draggableId, { stage: newStage });

    // Log activity for stage transition
    if (deal) {
      const stageLabel = PIPELINE_STAGES.find(s => s.stage === newStage)?.label || newStage;
      addActivity({
        dealId: draggableId,
        contactId: deal.contactId,
        type: 'note',
        description: `Moved ${deal.title} to ${stageLabel}`,
      });
    }
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setIsEditDealOpen(true);
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedDeal = {
      contactId: formData.get('contactId') as string,
      title: formData.get('title') as string,
      value: parseInt(formData.get('value') as string),
      stage: formData.get('stage') as PipelineStage,
      source: formData.get('source') as LeadSource,
      assignedTo: formData.get('assignedTo') as string,
      notes: formData.get('notes') as string,
      scheduledDate: formData.get('scheduledDate') ? new Date(formData.get('scheduledDate') as string).getTime() : undefined,
    };

    updateDeal(editingDeal.id, updatedDeal);

    // Log activity
    addActivity({
      dealId: editingDeal.id,
      contactId: editingDeal.contactId,
      type: 'note',
      description: `Updated job: ${updatedDeal.title}`,
    });

    setIsEditDealOpen(false);
    setEditingDeal(null);
  };

  const handleDeleteDeal = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    deleteDeal(dealId);
    addActivity({
      dealId: dealId,
      contactId: deal.contactId,
      type: 'note',
      description: `Deleted job: ${deal.title}`,
    });

    setDeleteConfirmDealId(null);
  };

  const calculateMetrics = () => {
    const total = filteredDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      totalDeals: filteredDeals.length,
      totalValue: total,
      avgValue: filteredDeals.length > 0 ? Math.round(total / filteredDeals.length) : 0,
    };
  };

  const getDaysInStage = (deal: Deal): number => {
    return Math.floor((Date.now() - deal.updatedAt) / (1000 * 60 * 60 * 24));
  };

  const getStageMetrics = (stage: PipelineStage) => {
    const stageDeals = filteredDeals.filter((d) => d.stage === stage);
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return { count: stageDeals.length, value };
  };

  const getDealsByStage = (stage: PipelineStage) => {
    return filteredDeals.filter((d) => d.stage === stage);
  };

  const metrics = calculateMetrics();
  const clearFilters = () => {
    setSearchQuery('');
    setAssignedToFilter('all');
    setSourceFilter('all');
    setValueFilter('all');
  };

  const hasActiveFilters =
    debouncedSearchQuery || assignedToFilter !== 'all' || sourceFilter !== 'all' || valueFilter !== 'all';

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-28 shadow-sm"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header Section */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{t('pipeline.title')}</h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mt-1 font-semibold">
              ${metrics.totalValue.toLocaleString()} across {metrics.totalDeals} jobs
            </p>
          </div>
          <button
            onClick={() => setIsAddDealOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('pipeline.addDeal')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('pipeline.searchJobs')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={assignedToFilter}
            onChange={(e) => setAssignedToFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allAssigned')}</option>
            <option value="Marcus">Marcus</option>
            <option value="James">James</option>
            <option value="Team">Team</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allSources')}</option>
            <option value="ring_1">{t('pipeline.ring1')}</option>
            <option value="ring_2">{t('pipeline.ring2')}</option>
            <option value="ring_3">{t('pipeline.ring3')}</option>
          </select>

          <select
            value={valueFilter}
            onChange={(e) => setValueFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allValues')}</option>
            <option value="under_1k">{t('pipeline.under1k')}</option>
            <option value="1k_5k">{t('pipeline.1kTo5k')}</option>
            <option value="5k_10k">{t('pipeline.5kTo10k')}</option>
            <option value="over_10k">{t('pipeline.over10k')}</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              {t('pipeline.clearFilters')}
            </button>
          )}

          <div className="ml-auto flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              {t('pipeline.board')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              {t('pipeline.list')}
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
          {/* Mobile: Stage Tab Strip + Vertical Deal List */}
          <div className="md:hidden flex flex-col h-full">
            {/* Scrollable stage tabs */}
            <div className="overflow-x-auto flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex min-w-max" role="tablist">
                {PIPELINE_STAGES_CONFIG.map(({ stage, labelKey }) => {
                  const count = getDealsByStage(stage).length;
                  return (
                    <button
                      key={stage}
                      onClick={() => setMobileSelectedStage(stage)}
                      className={`flex-shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        mobileSelectedStage === stage
                          ? 'border-[#27AE60] text-[#27AE60] bg-emerald-50 dark:bg-emerald-950'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                      role="tab"
                      aria-selected={mobileSelectedStage === stage}
                      aria-label={`${t(labelKey as any)} stage with ${count} ${count === 1 ? 'job' : 'jobs'}`}
                    >
                      {t(labelKey as any)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Mobile stage summary */}
            <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {getStageMetrics(mobileSelectedStage).count} {getStageMetrics(mobileSelectedStage).count === 1 ? 'job' : 'jobs'}
              </span>
              <span className="text-sm font-bold text-[#27AE60]">
                ${getStageMetrics(mobileSelectedStage).value.toLocaleString()}
              </span>
            </div>
            {/* Mobile deal cards list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {getDealsByStage(mobileSelectedStage).length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <p className="text-sm">No jobs in this stage</p>
                </div>
              ) : (
                getDealsByStage(mobileSelectedStage).map((deal) => {
                  const contact = getContact(deal.contactId);
                  const daysInStage = getDaysInStage(deal);
                  const ring = getLeadSourceRing(deal.source);
                  return (
                    <Link
                      key={deal.id}
                      href={`/pipeline/${deal.id}`}
                      className="block p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{deal.title}</h4>
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{daysInStage}d</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{contact?.name} &middot; {deal.assignedTo}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white">${deal.value.toLocaleString()}</span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-medium">{getRingDisplayLabel(ring)}</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Desktop: Full Kanban Board */}
          <div className="hidden md:block overflow-x-auto overflow-y-hidden p-3 sm:p-6 h-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 sm:gap-6 min-w-max">
              {PIPELINE_STAGES_CONFIG.map(({ stage, labelKey, color }) => {
                const label = t(labelKey as any);
                const stageDeals = getDealsByStage(stage);
                const metrics = getStageMetrics(stage);

                return (
                  <Droppable key={stage} droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-64 sm:w-80 rounded-lg border-2 transition-all ${color} ${
                          snapshot.isDraggingOver ? 'shadow-xl ring-2 ring-blue-400' : 'shadow'
                        }`}
                        aria-label={`${label} column with ${metrics.count} ${metrics.count === 1 ? 'job' : 'jobs'}`}
                      >
                        {/* Column Header */}
                        <div className="sticky top-0 p-4 border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-t-md">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
                            <button
                              onClick={() => setIsAddDealOpen(true)}
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                              aria-label={`Add job to ${label} stage`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400">{metrics.count} {metrics.count === 1 ? 'job' : 'jobs'}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              ${metrics.value.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Deal Cards */}
                        <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                          {stageDeals.map((deal, index) => {
                            const contact = getContact(deal.contactId);
                            const daysInStage = getDaysInStage(deal);
                            const ring = getLeadSourceRing(deal.source);
                            const isHovered = hoveredCardId === deal.id;

                            return (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-move transition-all hover:shadow-lg active:shadow-xl relative group ${
                                      snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredCardId(deal.id)}
                                    onMouseLeave={() => setHoveredCardId(null)}
                                  >
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                                        {deal.title}
                                      </h4>
                                      <span className="flex-shrink-0 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                                        {daysInStage}d
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{contact?.name}</p>
                                    <div className="flex justify-between items-end mb-2">
                                      <span className="font-bold text-lg text-slate-900 dark:text-white">
                                        ${deal.value.toLocaleString()}
                                      </span>
                                      <span className="text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                        {getRingDisplayLabel(ring)}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                      {deal.assignedTo}
                                    </div>

                                    {/* Quick Actions on Hover */}
                                    {isHovered && (
                                      <div className="absolute top-2 right-2 flex gap-1 bg-white dark:bg-slate-700 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 p-1">
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleOpenEdit(deal);
                                          }}
                                          className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
                                          title="Edit job"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
                                          title="Call contact"
                                        >
                                          <Phone className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
                                          title="Add note"
                                        >
                                          <MessageSquare className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.contact')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">Stage</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.value')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('contacts.source')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.assignedTo')}</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-900 dark:text-white">Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => {
                const contact = getContact(deal.contactId);
                const daysInStage = getDaysInStage(deal);
                const ring = getLeadSourceRing(deal.source);
                const stageInfo = PIPELINE_STAGES_CONFIG.find((s) => s.stage === deal.stage);

                return (
                  <tr
                    key={deal.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/pipeline/${deal.id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {deal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{contact?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${stageInfo?.color}`}>
                        {t((stageInfo as any)?.labelKey)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-medium">
                        {getRingDisplayLabel(ring)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{deal.assignedTo}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{daysInStage}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pipeline Summary Bar */}
      <div className="px-4 sm:px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.totalDeals')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalDeals}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.totalValue')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${metrics.totalValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.averageDeal')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${metrics.avgValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.winRate')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.totalDeals > 0
              ? `${Math.round((getDealsByStage('completed').length / metrics.totalDeals) * 100)}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Add Job Modal */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title={t('pipeline.addDeal')}
      >
        <AddDealForm
          contacts={contacts}
          onClose={() => {
            setIsAddDealOpen(false);
            // Add activity after deal creation
            const lastDeal = deals[deals.length - 1];
            if (lastDeal) {
              addActivity({
                dealId: lastDeal.id,
                contactId: lastDeal.contactId,
                type: 'note',
                description: `Created new job: ${lastDeal.title}`,
              });
            }
          }}
        />
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        isOpen={isEditDealOpen}
        onClose={() => {
          setIsEditDealOpen(false);
          setEditingDeal(null);
        }}
        title="Edit Job"
      >
        {editingDeal && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contact *
              </label>
              <select
                name="contactId"
                defaultValue={editingDeal.contactId}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={editingDeal.title}
                placeholder="e.g., Water Heater Replacement"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Value ($) *
              </label>
              <input
                type="number"
                name="value"
                defaultValue={editingDeal.value}
                placeholder="1000"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stage
              </label>
              <select
                name="stage"
                defaultValue={editingDeal.stage}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PIPELINE_STAGES.map(({ stage, label }) => (
                  <option key={stage} value={stage}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lead Source
              </label>
              <select
                name="source"
                defaultValue={editingDeal.source}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LEAD_SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assigned To
              </label>
              <select
                name="assignedTo"
                defaultValue={editingDeal.assignedTo}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Team">Team</option>
                <option value="Marcus">Marcus</option>
                <option value="James">James</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Scheduled Date
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                defaultValue={
                  editingDeal.scheduledDate
                    ? new Date(editingDeal.scheduledDate).toISOString().slice(0, 16)
                    : ''
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                defaultValue={editingDeal.notes}
                placeholder="Add any notes about this job..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmDealId(editingDeal.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                title="Delete job"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditDealOpen(false);
                  setEditingDeal(null);
                }}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmDealId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirmDealId(null)}
          title="Delete Job"
        >
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleDeleteDeal(deleteConfirmDealId);
                  setIsEditDealOpen(false);
                  setEditingDeal(null);
                }}
                className="flex-1 bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmDealId(null)}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
