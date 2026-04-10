'use client';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Deal, Contact, PipelineStage } from '@/types';
import { DealCard } from './DealCard';
import { useState } from 'react';
import { useStore } from '@/store';

const STAGES: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: 'new_lead', label: 'New Lead', color: 'from-red-500 to-red-600' },
  {
    stage: 'contacted',
    label: 'Contacted',
    color: 'from-orange-500 to-orange-600',
  },
  {
    stage: 'estimate_scheduled',
    label: 'Estimate Scheduled',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    stage: 'estimate_sent',
    label: 'Estimate Sent',
    color: 'from-amber-500 to-amber-600',
  },
  { stage: 'booked', label: 'Booked', color: 'from-blue-500 to-blue-600' },
  {
    stage: 'in_progress',
    label: 'In Progress',
    color: 'from-purple-500 to-purple-600',
  },
  {
    stage: 'completed',
    label: 'Completed',
    color: 'from-green-500 to-green-600',
  },
  { stage: 'invoiced', label: 'Invoiced', color: 'from-emerald-500 to-emerald-600' },
];

interface PipelineBoardProps {
  deals: Deal[];
  contacts: Contact[];
}

export function PipelineBoard({ deals: initialDeals, contacts }: PipelineBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const { updateDeal } = useStore();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const deal = deals.find((d) => d.id === draggableId);
    if (!deal) return;

    const newStage = destination.droppableId as PipelineStage;
    const updatedDeal = { ...deal, stage: newStage };

    setDeals(
      deals.map((d) => (d.id === draggableId ? updatedDeal : d))
    );

    updateDeal(draggableId, { stage: newStage });
  };

  const contactMap = new Map(contacts.map((c) => [c.id, c]));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 sm:gap-6 min-w-max px-4 sm:px-6">
          {STAGES.map(({ stage, label, color }) => {
            const stageDealIds = deals.filter((d) => d.stage === stage);

            return (
              <div
                key={stage}
                className="flex flex-col w-[75vw] sm:w-72 md:w-80 bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${color} px-4 sm:px-6 py-4 text-white`}
                >
                  <h3 className="font-semibold text-sm">{label}</h3>
                  <p className="text-xs opacity-90 mt-1">
                    {stageDealIds.length} deal{stageDealIds.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-4 space-y-3 min-h-[300px] sm:min-h-[500px] ${
                        snapshot.isDraggingOver ? 'bg-slate-100' : ''
                      }`}
                    >
                      {stageDealIds.map((deal, index) => {
                        const contact = contactMap.get(deal.contactId);

                        return (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <DealCard
                                  deal={deal}
                                  contact={contact}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}
