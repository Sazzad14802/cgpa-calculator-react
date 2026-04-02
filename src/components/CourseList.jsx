import { memo } from 'react';
import CourseItem from './CourseItem';

const CourseList = memo(function CourseList({ courses, onEdit, onDelete }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-sm text-slate-600 dark:text-slate-300">No courses added yet. Add your first course to calculate CGPA.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900/70 sm:p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">Course List</h3>
      <ul className="space-y-3">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
});

export default CourseList;
