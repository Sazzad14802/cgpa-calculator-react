import { useEffect, useState } from 'react';

const letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];

function CourseForm({ onSubmit, editingCourse, onCancel }) {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [gradeType, setGradeType] = useState('letter');
  const [gradeValue, setGradeValue] = useState('A');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setCredits(String(editingCourse.credits));
      setGradeType(editingCourse.gradeType);
      setGradeValue(editingCourse.gradeValue);
      setError('');
      return;
    }

    setName('');
    setCredits('');
    setGradeType('letter');
    setGradeValue('A+');
    setError('');
  }, [editingCourse]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedCredits = Number(credits);
    const normalizedName = name.trim();

    if (!normalizedName) {
      setError('Please enter a course name.');
      return;
    }

    if (!Number.isFinite(parsedCredits) || parsedCredits <= 0) {
      setError('Credit hours must be a number greater than 0.');
      return;
    }

    if (gradeType === 'numeric') {
      const numericGrade = Number(gradeValue);
      if (!Number.isFinite(numericGrade) || numericGrade < 0 || numericGrade > 4) {
        setError('Numeric grade must be between 0.0 and 4.0.');
        return;
      }
    }

    setError('');

    onSubmit({
      name: normalizedName,
      credits: Number(parsedCredits.toFixed(2)),
      gradeType,
      gradeValue: gradeType === 'numeric' ? String(Number(gradeValue).toFixed(2)) : gradeValue,
    });

    if (!editingCourse) {
      setName('');
      setCredits('');
      setGradeType('letter');
      setGradeValue('A+');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeUp rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900/90 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
        {editingCourse && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Course Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Data Structures"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-900"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Credit Hours</span>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={credits}
            onChange={(event) => setCredits(event.target.value)}
            placeholder="3"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-900"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">Grade Input</span>
          <select
            value={gradeType}
            onChange={(event) => {
              const nextType = event.target.value;
              setGradeType(nextType);
              setGradeValue(nextType === 'letter' ? 'A+' : '4.00');
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-900"
          >
            <option value="letter">Letter Grade</option>
            <option value="numeric">Numeric Grade</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">{gradeType === 'letter' ? 'Letter Grade' : 'Numeric Grade (0.0 to 4.0)'}</span>
          {gradeType === 'letter' ? (
            <select
              value={gradeValue}
              onChange={(event) => setGradeValue(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-900"
            >
              {letterGrades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              min="0"
              max="4"
              step="0.01"
              value={gradeValue}
              onChange={(event) => setGradeValue(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-primary-900"
            />
          )}
        </label>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-700 active:scale-[0.99]"
      >
        {editingCourse ? 'Update Course' : 'Add Course'}
      </button>
    </form>
  );
}

export default CourseForm;
