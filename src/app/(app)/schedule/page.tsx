'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import type { TranslationKey } from '@/i18n/translations';
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

interface ScheduleEvent {
  id: string;
  title: string;
  technician: 'Marcus' | 'James' | 'Team';
  startTime: number;
  endTime: number;
  description?: string;
}

interface DragItem {
  index: number;
  technician: 'Marcus' | 'James' | 'Team';
}

export default function SchedulePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { deals } = useStore();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [filterTech, setFilterTech] = useState<'Marcus' | 'James' | 'Team' | 'all'>('all');
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const eventIndex = parseInt(draggableId.split('-')[1], 10);
    const newEvents = [...events];
    const event = newEvents[eventIndex];

    if (event) {
      event.technician = destination.droppableId as 'Marcus' | 'James' | 'Team';
      event.startTime = parseInt(destination.index.toString(), 10) + 7;
      setEvents(newEvents);
    }
  };

  const handleAddEvent = (newEvent: ScheduleEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const filteredEvents = filterTech === 'all' ? events : events.filter((e) => e.technician === filterTech);

  const renderDayColumn = (dayIndex: number, dayKey: TranslationKey) => (
    <div key={dayIndex} className="flex-1 min-w-0">
      <h3 className="font-semibold text-center py-2 text-slate-900 dark:text-white text-sm">
        {t(dayKey)}
      </h3>
      {TIME_SLOTS.map((time) => (
        <div key={time} className="h-20 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 p-1" />
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-4 sm:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t('schedule.title' as TranslationKey)}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('schedule.subtitle' as TranslationKey)}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('schedule.addEvent' as TranslationKey)}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {TECHNICIANS.map((tech) => {
              const techEvents = filteredEvents.filter((e) => e.technician === tech as 'Marcus' | 'James' | 'Team');
              const colors = TECH_COLORS[tech];
              return (
                <div key={tech} className={`rounded-lg border ${colors.border} ${colors.darkBorder} p-4 ${colors.bg} ${colors.darkBg}`}>
                  <h2 className={`font-semibold ${colors.text} ${colors.darkText} mb-4`}>{tech}</h2>
                  <div className="space-y-2">
                    {techEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {event.startTime}:00 - {event.endTime}:00
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}