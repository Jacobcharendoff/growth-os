'use client';

import Link from 'next/link';
import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryOnAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryOnAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[500px] py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full">
        {/* Animated fade-in container with dotted border */}
        <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 sm:p-8 sm:p-12 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 animate-in fade-in duration-500">
          {/* Icon container with subtle background circle */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-full p-4 border border-green-200 dark:border-green-800">
                <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center mb-8 leading-relaxed">
            {description}
          </p>

          {/* Primary Action Button */}
          {actionLabel && (
            <div className="flex flex-col gap-3">
              {actionHref ? (
                <Link
                  href={actionHref}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                >
                  {actionLabel}
                </Link>
              ) : onAction ? (
                <button
                  onClick={onAction}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  {actionLabel}
                </button>
              ) : null}

              {/* Secondary Action Button */}
              {secondaryActionLabel && (
                secondaryActionHref ? (
                  <Link
                    href={secondaryActionHref}
                    className="block w-full border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                  >
                    {secondaryActionLabel}
                  </Link>
                ) : secondaryOnAction ? (
                  <button
                    onClick={secondaryOnAction}
                    className="w-full border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    {secondaryActionLabel}
                  </button>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
