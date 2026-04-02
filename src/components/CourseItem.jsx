import { memo } from 'react';

const CourseItem = memo(function CourseItem({ course, onEdit, onDelete }) {
  return (
    <li className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-2 sm:grid-cols-[1.6fr_0.8fr_0.8fr_auto] sm:items-center">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{course.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{course.gradeType === 'letter' ? `Letter: ${course.gradeValue}` : `Numeric: ${course.gradeValue}`}</p>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">Credits: {course.credits}</p>
        <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">GP: {course.gradePoint.toFixed(2)}</p>
        <div className="flex gap-2 sm:justify-end">
          <button
            onClick={() => onEdit(course.id)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-primary-400 dark:hover:text-primary-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/60"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
});

export default CourseItem;
