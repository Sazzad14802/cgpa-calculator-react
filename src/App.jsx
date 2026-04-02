import { useCallback, useEffect, useMemo, useState } from 'react';
import CGPAResult from './components/CGPAResult';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';

const COURSE_STORAGE_KEY = 'cgpa-calculator-courses';
const THEME_STORAGE_KEY = 'cgpa-calculator-dark-mode';

const gradePointMap = {
  'A+': 4.0,
  'A': 3.75,
  'A-': 3.5,
  'B+': 3.25,
  'B': 3.0,
  'B-': 2.75,
  'C+': 2.5,
  'C': 2.25,
  'D': 2.0,
  'F': 0.0,
};

const resolveGradePoint = (gradeType, gradeValue) => {
  if (gradeType === 'numeric') {
    const numeric = Number(gradeValue);
    if (Number.isNaN(numeric)) {
      return 0;
    }
    return Math.min(4, Math.max(0, numeric));
  }

  return gradePointMap[gradeValue] ?? 0;
};

const getStoredJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

function App() {
  const [courses, setCourses] = useState(() => getStoredJSON(COURSE_STORAGE_KEY, []));
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === 'true');
  const [toast, setToast] = useState(null);

  const enrichedCourses = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        gradePoint: resolveGradePoint(course.gradeType, course.gradeValue),
      })),
    [courses],
  );

  const stats = useMemo(() => {
    const totalCredits = enrichedCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
    const totalWeighted = enrichedCourses.reduce(
      (sum, course) => sum + Number(course.credits || 0) * course.gradePoint,
      0,
    );

    return {
      totalCredits,
      totalCourses: enrichedCourses.length,
      cgpa: totalCredits > 0 ? totalWeighted / totalCredits : 0,
    };
  }, [enrichedCourses]);

  const editingCourse = useMemo(
    () => courses.find((course) => course.id === editingCourseId) ?? null,
    [courses, editingCourseId],
  );

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (stats.totalCredits <= 0) {
      return;
    }

    
  }, [stats.cgpa, stats.totalCredits]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSaveCourse = useCallback(
    (courseInput) => {
      const safeCourse = {
        ...courseInput,
        credits: Number(courseInput.credits),
      };

      if (editingCourseId) {
        setCourses((previous) =>
          previous.map((course) =>
            course.id === editingCourseId
              ? {
                  ...course,
                  ...safeCourse,
                }
              : course,
          ),
        );
        setEditingCourseId(null);
        showToast('Course updated', 'success');
        return;
      }

      setCourses((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...safeCourse,
        },
      ]);
      showToast('Course added', 'success');
    },
    [editingCourseId, showToast],
  );

  const handleDeleteCourse = useCallback(
    (id) => {
      setCourses((previous) => previous.filter((course) => course.id !== id));
      if (editingCourseId === id) {
        setEditingCourseId(null);
      }
      showToast('Course deleted', 'danger');
    },
    [editingCourseId, showToast],
  );

  const handleEditCourse = useCallback((id) => {
    setEditingCourseId(id);
  }, []);

  const handleResetAll = useCallback(() => {
    const shouldReset = window.confirm('Reset all courses?');
    if (!shouldReset) {
      return;
    }

    setCourses([]);
    setEditingCourseId(null);
    localStorage.removeItem(COURSE_STORAGE_KEY);
    showToast('All data reset', 'danger');
  }, [showToast]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">CGPA Calculator</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track your courses and calculate your CGPA instantly.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:border-primary-500 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-primary-300"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleResetAll}
              className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/60"
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <CGPAResult
              cgpa={stats.cgpa}
              totalCredits={stats.totalCredits}
              totalCourses={stats.totalCourses}
            />
            <CourseForm
              onSubmit={handleSaveCourse}
              editingCourse={editingCourse}
              onCancel={() => setEditingCourseId(null)}
            />
          </div>

          <CourseList
            courses={enrichedCourses}
            onDelete={handleDeleteCourse}
            onEdit={handleEditCourse}
          />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fadeUp">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === 'danger' ? 'bg-rose-600' : 'bg-slate-900'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
