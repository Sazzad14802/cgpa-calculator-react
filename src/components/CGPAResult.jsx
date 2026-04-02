import { memo } from 'react';

const CGPAResult = memo(function CGPAResult({ cgpa, totalCredits, totalCourses}) {
  return (
    <section className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5 shadow-soft dark:border-primary-900 dark:from-slate-900 dark:to-slate-900 sm:p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">Current CGPA</p>
      <p className="mt-1 text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">{cgpa.toFixed(2)}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Credits</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{totalCredits.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Courses</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{totalCourses}</p>
        </div>
      </div>
    </section>
  );
});

export default CGPAResult;
