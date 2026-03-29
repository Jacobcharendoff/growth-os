'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';

const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => 7 + i);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBREVIATIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TECH_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Marcus: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-700',
  },
  James: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  Team: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    badge: 'bg-purple-100 text-purple-700',
  },
};

interface ScheduledJob {
  dealId: string;
  day: string;
  timeSlot: string;
}

interface DealWithContact {
  id: string;
  title: string;
  customerName: string;
  value: number;
  assignedTo: string;
}

export default function SchedulePage() {
  const { deals, contacts, initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [scheduledJobs, setScheduledJobs] = useState<Record<string, ScheduledJob>>({});
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set(['Marcus', 'James', 'Team']));

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  // Get schedulable deals (filter by stage)
  const getSchedulableDeals = (): DealWithContact[] => {
    const schedulableStages = ['booked', 'in_progress', 'estimate_scheduled'];
    return deals
      .filter((deal) => schedulableStages.includes(deal.stage))
      .map((deal) => {
        const contact = contacts.find((c) => c.id === deal.contactId);
        return {
          id: deal.id,
          title: deal.title,
          customerName: contact?.name || 'Unknown',
          value: deal.value,
          assignedTo: deal.assignedTo || 'Team',
        };
      });
  };

  const allSchedulableDealIds = new Set(getSchedulableDeals().map((d) => d.id));

  // Unscheduled jobs = schedulable deals not in scheduledJobs
  const getUnscheduledJobs = (): DealWithContact[] => {
    return getSchedulableDeals().filter(
      (deal) => !Object.values(scheduledJobs).some((job) => job.dealId === deal.id)
    );
  };

  // Get scheduled jobs for a specific day/slot
  const getJobsForSlot = (day: string, slot: string): DealWithContact[] => {
    const dealIds = Object.values(scheduledJobs)
      .filter((job) => job.day === day && job.timeSlot === slot)
      .map((job) => job.dealId);

    return getSchedulableDeals().filter((deal) => dealIds.includes(deal.id));
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a valid zone
    if (!destination) {
      return;
    }

    // If dropped in the same place
    if (source.droppableId === destination.droppableId) {
      return;
    }

    // If dropped in unscheduled area, remove from schedule
    if (destination.droppableId === 'unscheduled') {
      setScheduledJobs((prev) => {
        const newScheduled = { ...prev };
        Object.keys(newScheduled).forEach((key) => {
          if (newScheduled[key].dealId === draggableId) {
            delete newScheduled[key];
          }
        });
        return newScheduled;
      });
      return;
    }

    // Parse destination (format: "day-timeSlot")
    const [destDay, destSlot] = destination.droppableId.split('-');

    if (!destDay || !destSlot) return;

    setScheduledJobs((prev) => {
      const newScheduled = { ...prev };
      // Remove from previous location if already scheduled
      Object.keys(newScheduled).forEach((key) => {
        if (newScheduled[key].dealId === draggableId) {
          delete newScheduled[key];
        }
      });
      // Add to new location
      const newId = `${destDay}-${destSlot}-${draggableId}`;
      newScheduled[newId] = {
        dealId: draggableId,
        day: destDay,
        timeSlot: destSlot,
      };
      return newScheduled;
    });
  };

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

  const weekDates = getWeekDates();
  const unscheduledJobs = getUnscheduledJobs();

  const countJobsForDay = (day: string): number => {
    return Object.values(scheduledJobs).filter((job) => job.day === day).length;
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

  if (!mounted) {
    return <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Schedule</h1>
          <p className="text-sm sm:text-base text-slate-600">Drag and drop jobs to schedule them for technicians</p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">{formatDateRange()}</span>
              </div>

              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setWeekOffset(0)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Today
              </button>
            </div>

            {/* Technician Filter */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-slate-600" />
              {Object.keys(TECH_COLORS).map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedTechs.has(tech)
                      ? `${TECH_COLORS[tech].badge} border border-current`
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
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <div className="col-span-1 p-4" />
                {DAYS.map((day, idx) => {
                  const date = weekDates[idx];
                  const jobCount = countJobsForDay(day);
                  return (
                    <div key={day} className="col-span-1 p-4 text-center border-l border-slate-200 dark:border-slate-600">
                      <div className="text-sm font-semibold text-slate-600">{DAY_ABBREVIATIONS[idx]}</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">{date.getDate()}</div>
                      <div className="text-xs text-slate-500 mt-2">
                        {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="divide-y divide-slate-200 dark:divide-slate-600">
                {TIME_SLOTS.map((hour) => (
                  <div key={hour} className="grid grid-cols-7">
                    {/* Hour Label */}
                    <div className="col-span-1 p-4 bg-slate-50 dark:bg-slate-700 border-r border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-start">
                      {hour}:00
                    </div>

                    {/* Day Columns */}
                    {DAYS.map((day) => (
                      <Droppable key={`${day}-${hour}`} droppableId={`${day}-${hour}`} type="JOB">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`col-span-1 p-2 border-l border-slate-200 dark:border-slate-600 min-h-24 transition ${
                              snapshot.isDraggingOver
                                ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-l-blue-400'
                                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {getJobsForSlot(day, String(hour)).map((job, index) => (
                              <Draggable key={job.id} draggableId={job.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-2 rounded-lg border-l-4 mb-2 cursor-grab active:cursor-grabbing transition ${
                                      TECH_COLORS[job.assignedTo].bg
                                    } border ${
                                      TECH_COLORS[job.assignedTo].border
                                    } ${
                                      snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-sm'
                                    }`}
                                    style={{
                                      borderLeftColor: snapshot.isDragging ? '' : '',
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div className="flex items-start gap-2">
                                      <GripVertical className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" />
                                      <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-semibold truncate ${TECH_COLORS[job.assignedTo].text}`}>
                                          {job.title}
                                        </div>
                                        <div className="text-xs text-slate-600 truncate">{job.customerName}</div>
                                        <div className="mt-1 flex items-center gap-1">
                                          <DollarSign className="w-2.5 h-2.5 text-slate-500" />
                                          <span className="text-xs font-semibold text-slate-700">
                                            {(job.value / 1000).toFixed(1)}k
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${TECH_COLORS[job.assignedTo].badge}`}>
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
                    ))}
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
                  className={`bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed shadow-sm p-6 sticky top-8 transition ${
                    snapshot.isDraggingOver
                      ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-700'
                      : 'border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Unscheduled</h2>
                  <p className="text-sm text-slate-600 mb-6">{unscheduledJobs.length} jobs ready to schedule</p>

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
                              } border ${
                                TECH_COLORS[job.assignedTo].border
                              } ${
                                snapshot.isDragging
                                  ? 'shadow-lg ring-2 ring-blue-400 opacity-50'
                                  : 'shadow-sm hover:shadow-md'
                              }`}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-semibold truncate ${TECH_COLORS[job.assignedTo].text}`}>
                                    {job.title}
                                  </div>
                                  <div className="text-xs text-slate-600 truncate mt-1">{job.customerName}</div>
                                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${TECH_COLORS[job.assignedTo].badge}`}>
                                    {job.assignedTo}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 text-sm font-semibold text-emerald-600">
                                ${job.value.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : unscheduledJobs.length > 0 ? (
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <Filter className="w-4 h-4 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No jobs match selected technicians</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                        <p className="text-sm font-medium text-emerald-700">All jobs scheduled!</p>
                      </div>
                    )}
                  </div>

                  {provided.placeholder}

                  {/* Summary Stats */}
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 font-medium">Scheduled</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {Object.keys(scheduledJobs).length}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 font-medium">Unscheduled</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {unscheduledJobs.length}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 font-medium">Total Value</div>
                      <div className="text-lg font-bold text-emerald-600 mt-1">
                        ${Object.values(scheduledJobs).reduce((sum, job) => {
                          const deal = getSchedulableDeals().find((d) => d.id === job.dealId);
                          return sum + (deal?.value || 0);
                        }, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
