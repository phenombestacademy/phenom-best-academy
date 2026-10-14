import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getMySchoolMembership } from '@/lib/school';

export const Route = createFileRoute('/school-report/$studentId')({
  component: SchoolReportPage,
});

/**
 * Safe report-route scaffold.
 *
 * The current repository does not yet establish the live student, marks,
 * attendance, term-placement and comment schema needed to build an accurate
 * official report. Do not substitute guessed table or column names here.
 * Wire this route only after verifying those definitions and the relevant RLS
 * policies. The route intentionally does not fetch or expose student records.
 */
function SchoolReportPage() {
  const { studentId } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Checking school access…');

  useEffect(() => {
    let cancelled = false;

    getMySchoolMembership()
      .then((membership) => {
        if (cancelled) return;
        if (!membership) {
          setMessage('Sign in with an authorised school account to access reports.');
        } else if (membership.role !== 'school_admin' && membership.role !== 'teacher') {
          setMessage('Your school role is not authorised to access this report.');
        } else if (!studentId) {
          setMessage('A student identifier is required.');
        } else {
          setMessage(
            'The report route is ready, but report data is not connected yet. ' +
              'Before enabling it, verify the student, historical class placement, ' +
              'assessment, examination, attendance and comment schemas, and enforce ' +
              'school/class access in database policies.',
          );
        }
      })
      .catch(() => {
        if (!cancelled) setMessage('Could not verify school access. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Official School Report</h1>
      <p className="mt-4 rounded-xl border border-line bg-cream p-4 text-sm" role={loading ? 'status' : 'alert'}>
        {message}
      </p>
    </main>
  );
}
