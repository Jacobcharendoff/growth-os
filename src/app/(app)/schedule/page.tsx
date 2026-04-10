'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  DollarSign,
  User,
  GripVertical,
  Filter,
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
} from 'lucide-react';

const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => 7 + i);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_KEYS = ['schedule.monday', 'schedule.tuesday', 'schedule.wednesday', 'schedule.thursday', 'schedule.friday', 'schedule.saturday'] as const;
const DAY_ABBR_KEYS = ['schedule.mondayAbbr', 'schedule.tuesdayAbbr', 'schedule.wednesdayAbbr', 'schedule.thursdayAbbr', 'schedule.fridayAbbr', 'schedule.saturdayAbbr'] as const;
const TECHNICIANS = ['Marcus', 'James', 'Team'];

const TECH_COLORS: Record<string, { bg: string; darkBg: string; border: string; darkBorder: string; text: string; darkText: string; badge: string; darkBadge: string }> = {
  Marcus: {
    bg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900',
    border: 'border-blue-200',
    darkBorder: 'dark:border-blue-700',
    text: 'text-blue-900',
    darkText: 'dark:text-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    darkBadge: 'dark:bg-blue-800 dark:text-blue-200',
  },
  James: {
    bg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-900',
    border: 'border-emerald-200',
    darkBorder: 'dark:border-emerald-700',
    text: 'text-emerald-900',
    darkText: 'dark:text-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    darkBadge: 'dark:bg-emerald-800 dark:text-emerald-200',
  },
  Team: {
    bg: 'bg-purple-50',
    darkBg: 'dark:bg-purple-900',
    border: 'border-purple-200',
    darkBorder: 'dark:border-purple-700',
    text: 'text-purple-900',
    darkText: 'dark:text-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    darkBadge: 'dark:bg-purple-800 dark:text-purple-200',
  },
};

interface DealWithContact {
  id: string;
  title: string;
  customerName: string;
  value: number;
  assignedTo: string;
  stage: string;
  scheduledDate?: number;
}

type ModalMode = 'schedule' | 'edit' | null;

interface ScheduleModalState {
  mode: ModalMode;
  dealId?: string;
  selectedDate?: Date;
  selectedHour?: number;
}

export default function SchedulePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { deals, contacts, updateDeal } = useStore();
  const [mounted, setMounted] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDayForDayView, setSelectedDayForDayView] = useState<Date | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set(['Marcus', 'James', 'Team']));
  const [modalState, setModalState] = useState<ScheduleModalState>({ mode: null });
  const [editingDealData, setEditingDealData] = useState({
    selectedDeal: '',
    assignedTo: 'Team',
    hour: 10,
    notes: '',
    duration: 1,
  });
  const { deals: allDeals, initializeSeedData } = useStore();

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
    // Force day view on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('day');
      setSelectedDayForDayView(new Date());
    }
  }, []);

  // Get schedulable deals (filter by stage)
  const getSchedulableDeals = (): DealWithContact[] => {
    const schedulableStages = ['booked', 'in_progress', 'estimate_scheduled'];
    return allDeals
      .filter((deal) => schedulableStages.includes(deal.stage))
      .map((deal) => {
        const contact = contacts.find((c) => c.id === deal.contactId);
        return {
          id: deal.id,
          title: deal.title,
          customerName: contact?.name || 'Unknown',
          value: deal.value,
          assignedTo: deal.assignedTo || 'Team',
          stage: deal.stage,
          scheduledDate: deal.scheduledDate,
        };
      });
  };

  // Unscheduled jobs = schedulable deals without scheduledDate
  const getUnscheduledJobs = (): DealWithContact[] => {
    return getSchedulableDeals().filter((deal) => !deal.scheduledDate);
  };

  // Get scheduled jobs for a specific day/slot
  const getJobsForSlot = (date: Date, hour: number): DealWithContact[] => {
    return getSchedulableDeals().filter((deal) => {
      if (!deal.scheduledDate) return false;
      const jobDate = new Date(deal.scheduledDate);
      return jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear() &&
        jobDate.getHours() === hour;
    });
  };

  // Get week dates
  const getWeekDates = () => {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    return DAYS.map((_, i) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      return date;
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const isTodayInWeek = () => {
    const today = getTodayDate();
    const weekDates = getWeekDates();
    return weekDates.some(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth());
  };

  const getTodayIndex = () => {
    const today = getTodayDate();
    const weekDates = getWeekDates();
    return weekDates.findIndex(d => d.getDate() === today.getDate() && d.getMonth() === today.getMonth());
  };

  const formatDateRange = () => {
    const dates = getWeekDates();
    if (dates.length === 0) return '';
    const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dates[dates.length - 1].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} - ${end}`;
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // If dropped in unscheduled area, remove scheduling
    if (destination.droppableId === 'unscheduled') {
      updateDeal(draggableId, { scheduledDate: undefined });
      return;
    }

    // Parse destination (format: "date-hour")
    const parts = destination.droppableId.split('-');
    if (parts.length < 2) return;

    const dateStr = parts.slice(0, -1).join('-');
    const hour = parseInt(parts[parts.length - 1], 10);

    const destDate = new Date(dateStr);
    if (isNaN(destDate.getTime())) return;

    destDate.setHours(hour, 0, 0, 0);
    const timestamp = destDate.getTime();

    updateDeal(draggableId, { scheduledDate: timestamp });
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tech)) {
        newSet.delete(tech);
      } else {
        newSet.add(tech);
      }
      return newSet;
    });
  };

  const filterUnscheduledByTech = (jobs: DealWithContact[]) => {
    return jobs.filter((job) => selectedTechs.has(job.assignedTo));
  };

  const handleSlotClick = (date: Date, hour: number) => {
    setModalState({
      mode: 'schedule',
      selectedDate: date,
      selectedHour: hour,
    });
    setEditingDealData({
      selectedDeal: '',
      assignedTo: 'Team',
      hour,
      notes: '',
      duration: 1,
    });
  };

  const handleScheduleJob = () => {
    if (!editingDealData.selectedDeal || !modalState.selectedDate) return;

    const date = new Date(modalState.selectedDate);
    date.setHours(editingDealData.hour, 0, 0, 0);
    const timestamp = date.getTime();

    updateDeal(editingDealData.selectedDeal, {
      scheduledDate: timestamp,
      assignedTo: editingDealData.assignedTo,
      notes: editingDealData.notes,
    });

    setModalState({ mode: null });
  };

  const handleEditJobClick = (dealId: string) => {
    const deal = getSchedulableDeals().find(d => d.id === dealId);
    if (!deal || !deal.scheduledDate) return;

    const jobDate = new Date(deal.scheduledDate);
    setModalState({
      mode: 'edit',
      dealId,
      selectedDate: jobDate,
      selectedHour: jobDate.getHours(),
    });

    setEditingDealData({
      selectedDeal: dealId,
      assignedTo: deal.assignedTo,
      hour: jobDate.getHours(),
      notes: '',
      duration: 1,
    });
  };

  const handleUpdateJob = () => {
    if (!editingDealData.selectedDeal || !modalState.selectedDate) return;

    const date = new Date(modalState.selectedDate);
    date.setHours(editingDealData.hour, 0, 0, 0);
    const timestamp = date.getTime();

    updateDeal(editingDealData.selectedDeal, {
      scheduledDate: timestamp,
      assignedTo: editingDealData.assignedTo,
      notes: editingDealData.notes,
    });

    setModalState({ mode: null });
  };

  const handleCompleteJob = () => {
    if (!modalState.dealId) return;
    updateDeal(modalState.dealId, { stage: 'completed' });
    setModalState({ mode: null });
  };

  const handleUnscheduleJob = () => {
    if (!modalState.dealId) return;
    updateDeal(modalState.dealId, { scheduledDate: undefined });
    setModalState({ mode: null });
  };

  const handleDeleteJob = () => {
    if (!modalState.dealId) return;
    updateDeal(modalState.dealId, { scheduledDate: undefined });
    setModalState({ mode: null });
  };

  const weekDates = getWeekDates();
  const unscheduledJobs = getUnscheduledJobs();
  const todayIndex = getTodayIndex();

  if (!mounted) {
    return (
      <div className={`p-4 sm:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen flex items-center justify-center`}>
        Loading...
      </div>
    );
  }

  // Day view rendering
  if (viewMode === 'day' && selectedDayForDayView) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={`p-4 sm:p-8 min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('schedule.title')}
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {selectedDayForDayView.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Day Navigation */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm`}>
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('schedule.backToWeek')}
              </button>
              <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedDayForDayView.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={() => setSelectedDayForDayView(getTodayDate())}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('schedule.today')}
              </button>
            </div>
          </div>

          {/* Day View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            <div className="lg:col-span-3">
              <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border shadow-sm overflow-x-auto`}>
                <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                  {TIME_SLOTS.map((hour) => (
                    <div key={hour} className="grid grid-cols-2">
                      <div className={`col-span-1 p-4 ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border-r ${isDark ? 'border-slate-700' : 'border-slate-200'} text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} flex items-start`}>
                        {hour}:00
                      </div>
                      <Droppable droppableId={`${selectedDayForDayView.toISOString().split('T')[0]}-${hour}`} type="JOB">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            onClick={() => handleSlotClick(selectedDayForDayView, hour)}
                            className={`col-span-1 p-4 min-h-24 transition cursor-pointer ${
                              snapshot.isDraggingOver
                                ? isDark
                                  ? 'bg-blue-900 border-l-4 border-l-blue-400'
                                  : 'bg-blue-50 border-l-4 border-l-blue-400'
                                : isDark
                                ? 'bg-slate-900 hover:bg-slate-800'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            {getJobsForSlot(selectedDayForDayView, hour).map((job, index) => (
                              <Draggable key={job.id} draggableId={job.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditJobClick(job.id);
                                    }}
                                    className={`p-2 rounded-lg border-l-4 mb-2 cursor-grab active:cursor-grabbing transition ${
                                      TECH_COLORS[job.assignedTo].bg
                                    } ${isDark ? TECH_COLORS[job.assignedTo].darkBg : ''} border ${
                                      TECH_COLORS[job.assignedTo].border
                                    } ${isDark ? TECH_COLORS[job.assignedTo].darkBorder : ''} ${
                                      snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <GripVertical className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                      <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-semibold truncate ${TECH_COLORS[job.assignedTo].text} ${isDark ? TECH_COLORS[job.assignedTo].darkText : ''}`}>
                                          {job.title}
                                        </div>
                                        <div className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{job.customerName}</div>
                                        <div className="mt-1 flex items-center gap-1">
                                          <DollarSign className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`} />
                                          <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {(job.value / 1000).toFixed(1)}k
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${TECH_COLORS[job.assignedTo].badge} ${isDark ? TECH_COLORS[job.assignedTo].darkBadge : ''}`}>
                                      {job.assignedTo}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Unscheduled Sidebar */}
            <div className="lg:col-span-1">
              <Droppable droppableId="unscheduled" type="JOB">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'} rounded-xl border-2 border-dashed shadow-sm p-6 sticky top-8 transition ${
                      snapshot.isDraggingOver
                        ? isDark
                          ? 'border-slate-500 bg-slate-700'
                          : 'border-slate-400 bg-slate-50'
                        : ''
                    }`}
                  >
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {t('schedule.unscheduled')}
                    </h2>
                    <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {unscheduledJobs.length} {t('schedule.jobsReadyToSchedule')}
                    </p>

                    <div className="space-y-3">
                      {filterUnscheduledByTech(unscheduledJobs).length > 0 ? (
                        filterUnscheduledByTech(unscheduledJobs).map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-lg border-l-4 transition ${
                                  TECH_COLORS[job.assignedTo].bg
                                } ${isDark ? TECH_COLORS[job.assignedTo].darkBg : ''} border ${
                                  TECH_COLORS[job.assignedTo].border
                                } ${isDark ? TECH_COLORS[job.assignedTo].darkBorder : ''} ${
                                  snapshot.isDragging
                                    ? 'shadow-lg ring-2 ring-blue-400 opacity-50'
                                    : 'shadow-sm hover:shadow-md'
                                }`}
                                style={provided.draggableProps.style}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold truncate ${TECH_COLORS[job.assignedTo].text} ${isDark ? TECH_COLORS[job.assignedTo].darkText : ''}`}>
                                      {job.title}
                                    </div>
                                    <div className={`text-xs truncate mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {job.customerName}
                                    </div>
                                    <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${TECH_COLORS[job.assignedTo].badge} ${isDark ? TECH_COLORS[job.assignedTo].darkBadge : ''}`}>
                                      {job.assignedTo}
                                    </div>
                                  </div>
                                </div>
                                <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                  ${job.value.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : unscheduledJobs.length > 0 ? (
                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} text-center`}>
                          <Filter className={`w-4 h-4 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            No jobs match selected technicians
                          </p>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-emerald-900 border-emerald-700' : 'bg-emerald-50 border-emerald-200'} text-center`}>
                          <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            All jobs scheduled!
                          </p>
                        </div>
                      )}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Schedule Modal */}
          {modalState.mode && (
            <ScheduleModal
              mode={modalState.mode}
              isDark={isDark}
              t={t}
              editingDealData={editingDealData}
              setEditingDealData={setEditingDealData}
              unscheduledJobs={getUnscheduledJobs()}
              onSave={modalState.mode === 'schedule' ? handleScheduleJob : handleUpdateJob}
              onComplete={modalState.mode === 'edit' ? handleCompleteJob : undefined}
              onUnschedule={modalState.mode === 'edit' ? handleUnscheduleJob : undefined}
              onDelete={modalState.mode === 'edit' ? handleDeleteJob : undefined}
              onClose={() => setModalState({ mode: null })}
            />
          )}
        </div>
      </DragDropContext>
    );
  }

  // Week view rendering
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`p-4 sm:p-8 min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('schedule.title')}
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('schedule.dragDropJobs')}
          </p>
        </div>

        {/* Week Navigation */}
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className={`p-2 rounded-lg transition ${
                  isDark
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Go to previous week"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-blue-900 border-blue-700'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatDateRange()}
                </span>
              </div>

              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className={`p-2 rounded-lg transition ${
                  isDark
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Go to next week"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setWeekOffset(0)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Go to current week"
              >
                {t('schedule.today')}
              </button>
            </div>

            {/* View Mode Toggle - hidden on mobile (always day view) */}
            <div className="hidden md:flex items-center gap-2" role="tablist">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  viewMode === 'week'
                    ? isDark
                      ? 'bg-blue-900 text-blue-100 border border-blue-700'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                    : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                role="tab"
                aria-selected={viewMode === 'week'}
                aria-label="Week view"
              >
                Week
              </button>
              <button
                onClick={() => {
                  setViewMode('day');
                  setSelectedDayForDayView(getTodayDate());
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  viewMode === 'day'
                    ? isDark
                      ? 'bg-blue-900 text-blue-100 border border-blue-700'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                    : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                role="tab"
                aria-selected={viewMode === 'day'}
                aria-label="Day view"
              >
                Day
              </button>
            </div>

            {/* Technician Filter */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              {TECHNICIANS.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedTechs.has(tech)
                      ? `${TECH_COLORS[tech].badge} ${isDark ? TECH_COLORS[tech].darkBadge : ''} border border-current`
                      : isDark
                      ? 'bg-slate-700 text-slate-400 border border-slate-600'
                      : 'bg-slate-200 text-slate-500 border border-slate-300'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl border shadow-sm overflow-x-auto`}>
              {/* Day Headers */}
              <div className={`grid grid-cols-7 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border-b`}>
                <div className="col-span-1 p-4" />
                {DAY_KEYS.map((dayKey, idx) => {
                  const date = weekDates[idx];
                  const isToday = todayIndex === idx;
                  return (
                    <div
                      key={dayKey}
                      onClick={() => {
                        setViewMode('day');
                        setSelectedDayForDayView(date);
                      }}
                      className={`col-span-1 p-4 text-center border-l ${isDark ? 'border-slate-600' : 'border-slate-200'} cursor-pointer transition ${
                        isToday
                          ? isDark
                            ? 'bg-blue-900'
                            : 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t(DAY_ABBR_KEYS[idx] as any)}
                      </div>
                      <div className={`text-lg font-bold mt-1 ${isToday ? (isDark ? 'text-blue-400' : 'text-blue-600') : isDark ? 'text-white' : 'text-slate-900'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {TIME_SLOTS.map((hour) => (
                  <div key={hour} className="grid grid-cols-7">
                    {/* Hour Label */}
                    <div className={`col-span-1 p-4 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border-r text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'} flex items-start`}>
                      {hour}:00
                    </div>

                    {/* Day Columns */}
                    {DAY_KEYS.map((dayKey, idx) => {
                      const date = weekDates[idx];
                      const isToday = todayIndex === idx;
                      return (
                        <Droppable
                          key={`${date.toISOString().split('T')[0]}-${hour}`}
                          droppableId={`${date.toISOString().split('T')[0]}-${hour}`}
                          type="JOB"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              onClick={() => handleSlotClick(date, hour)}
                              className={`col-span-1 p-2 min-h-24 transition cursor-pointer border-l ${
                                snapshot.isDraggingOver
                                  ? isDark
                                    ? 'bg-blue-900 border-l-4 border-l-blue-400'
                                    : 'bg-blue-50 border-l-4 border-l-blue-400'
                                  : isToday
                                  ? isDark
                                    ? 'bg-slate-800 border-slate-600'
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-50'
                                  : isDark
                                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-600'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              {getJobsForSlot(date, hour).map((job, index) => (
                                <Draggable key={job.id} draggableId={job.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditJobClick(job.id);
                                      }}
                                      className={`p-2 rounded-lg border-l-4 mb-2 cursor-grab active:cursor-grabbing transition ${
                                        TECH_COLORS[job.assignedTo].bg
                                      } ${isDark ? TECH_COLORS[job.assignedTo].darkBg : ''} border ${
                                        TECH_COLORS[job.assignedTo].border
                                      } ${isDark ? TECH_COLORS[job.assignedTo].darkBorder : ''} ${
                                        snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-sm'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <GripVertical className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <div className="flex-1 min-w-0">
                                          <div className={`text-xs font-semibold truncate ${TECH_COLORS[job.assignedTo].text} ${isDark ? TECH_COLORS[job.assignedTo].darkText : ''}`}>
                                            {job.title}
                                          </div>
                                          <div className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {job.customerName}
                                          </div>
                                          <div className="mt-1 flex items-center gap-1">
                                            <DollarSign className={`w-2.5 h-2.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`} />
                                            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                              {(job.value / 1000).toFixed(1)}k
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${TECH_COLORS[job.assignedTo].badge} ${isDark ? TECH_COLORS[job.assignedTo].darkBadge : ''}`}>
                                        {job.assignedTo}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unscheduled Sidebar */}
          <div className="lg:col-span-1">
            <Droppable droppableId="unscheduled" type="JOB">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'} rounded-xl border-2 border-dashed shadow-sm p-6 sticky top-8 transition ${
                    snapshot.isDraggingOver
                      ? isDark
                        ? 'border-slate-500 bg-slate-700'
                        : 'border-slate-400 bg-slate-50'
                      : ''
                  }`}
                >
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t('schedule.unscheduled')}
                  </h2>
                  <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {unscheduledJobs.length} {t('schedule.jobsReadyToSchedule')}
                  </p>

                  <div className="space-y-3">
                    {filterUnscheduledByTech(unscheduledJobs).length > 0 ? (
                      filterUnscheduledByTech(unscheduledJobs).map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-lg border-l-4 transition ${
                                TECH_COLORS[job.assignedTo].bg
                              } ${isDark ? TECH_COLORS[job.assignedTo].darkBg : ''} border ${
                                TECH_COLORS[job.assignedTo].border
                              } ${isDark ? TECH_COLORS[job.assignedTo].darkBorder : ''} ${
                                snapshot.isDragging
                                  ? 'shadow-lg ring-2 ring-blue-400 opacity-50'
                                  : 'shadow-sm hover:shadow-md'
                              }`}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-semibold truncate ${TECH_COLORS[job.assignedTo].text} ${isDark ? TECH_COLORS[job.assignedTo].darkText : ''}`}>
                                    {job.title}
                                  </div>
                                  <div className={`text-xs truncate mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {job.customerName}
                                  </div>
                                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${TECH_COLORS[job.assignedTo].badge} ${isDark ? TECH_COLORS[job.assignedTo].darkBadge : ''}`}>
                                    {job.assignedTo}
                                  </div>
                                </div>
                              </div>
                              <div className={`mt-2 text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                ${job.value.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : unscheduledJobs.length > 0 ? (
                      <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} text-center`}>
                        <Filter className={`w-4 h-4 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          No jobs match selected technicians
                        </p>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg border ${isDark ? 'bg-emerald-900 border-emerald-700' : 'bg-emerald-50 border-emerald-200'} text-center`}>
                        <p className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          All jobs scheduled!
                        </p>
                      </div>
                    )}
                  </div>

                  {provided.placeholder}

                  {/* Summary Stats */}
                  <div className={`mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} space-y-3`}>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('schedule.scheduled')}
                      </div>
                      <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {getSchedulableDeals().filter(d => d.scheduledDate).length}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('schedule.unscheduled')}
                      </div>
                      <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {unscheduledJobs.length}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                      <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {t('schedule.totalValue')}
                      </div>
                      <div className={`text-lg font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ${getSchedulableDeals()
                          .filter(d => d.scheduledDate)
                          .reduce((sum, d) => sum + d.value, 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* Schedule Modal */}
        {modalState.mode && (
          <ScheduleModal
            mode={modalState.mode}
            isDark={isDark}
            t={t}
            editingDealData={editingDealData}
            setEditingDealData={setEditingDealData}
            unscheduledJobs={getUnscheduledJobs()}
            onSave={modalState.mode === 'schedule' ? handleScheduleJob : handleUpdateJob}
            onComplete={modalState.mode === 'edit' ? handleCompleteJob : undefined}
            onUnschedule={modalState.mode === 'edit' ? handleUnscheduleJob : undefined}
            onDelete={modalState.mode === 'edit' ? handleDeleteJob : undefined}
            onClose={() => setModalState({ mode: null })}
          />
        )}
      </div>
    </DragDropContext>
  );
}

interface ScheduleModalProps {
  mode: ModalMode;
  isDark: boolean;
  t: (key: any, vars?: Record<string, any>) => string;
  editingDealData: {
    selectedDeal: string;
    assignedTo: string;
    hour: number;
    notes: string;
    duration: number;
  };
  setEditingDealData: (data: any) => void;
  unscheduledJobs: DealWithContact[];
  onSave: () => void;
  onComplete?: () => void;
  onUnschedule?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

function ScheduleModal({
  mode,
  isDark,
  t,
  editingDealData,
  setEditingDealData,
  unscheduledJobs,
  onSave,
  onComplete,
  onUnschedule,
  onDelete,
  onClose,
}: ScheduleModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'schedule' ? 'Schedule Job' : 'Edit Job'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-10 transition ${
              isDark
                ? 'text-slate-400 hover:bg-white'
                : 'text-slate-600 hover:bg-black'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {mode === 'schedule' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Select Job
              </label>
              <select
                value={editingDealData.selectedDeal}
                onChange={(e) => setEditingDealData({ ...editingDealData, selectedDeal: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              >
                <option value="">Choose a job...</option>
                {unscheduledJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.customerName} (${job.value.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Technician
            </label>
            <select
              value={editingDealData.assignedTo}
              onChange={(e) => setEditingDealData({ ...editingDealData, assignedTo: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            >
              {TECHNICIANS.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Time
            </label>
            <select
              value={editingDealData.hour}
              onChange={(e) => setEditingDealData({ ...editingDealData, hour: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            >
              {Array.from({ length: 12 }, (_, i) => 7 + i).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Duration (hours)
            </label>
            <input
              type="number"
              min="0.5"
              max="8"
              step="0.5"
              value={editingDealData.duration}
              onChange={(e) => setEditingDealData({ ...editingDealData, duration: parseFloat(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Notes
            </label>
            <textarea
              value={editingDealData.notes}
              onChange={(e) => setEditingDealData({ ...editingDealData, notes: e.target.value })}
              placeholder="Add any notes..."
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onSave}
            disabled={mode === 'schedule' ? !editingDealData.selectedDeal : false}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              (mode === 'schedule' && !editingDealData.selectedDeal)
                ? isDark
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Plus className="w-4 h-4" />
            {mode === 'schedule' ? 'Schedule' : 'Update'}
          </button>
          {mode === 'edit' && onComplete && (
            <button
              onClick={onComplete}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Cancel
          </button>
        </div>

        {/* Edit Mode Actions */}
        {mode === 'edit' && (
          <div className="flex gap-2 mt-3">
            {onUnschedule && (
              <button
                onClick={onUnschedule}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition ${
                  isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Unschedule
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1 ${
                  isDark
                    ? 'bg-red-900 text-red-200 hover:bg-red-800'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
