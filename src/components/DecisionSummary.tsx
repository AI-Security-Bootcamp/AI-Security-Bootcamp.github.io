/** SF-specific facts, repeated near the top only in the information treatment. */
export function DecisionSummary({ homepage = false }: { homepage?: boolean }) {
  return (
    <aside aria-label="San Francisco application essentials" data-testid="decision-summary" className="max-w-2xl border-l-4 border-[#ef4444] pl-4 my-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
      <p className="font-black text-black dark:text-white mb-2">
        {homepage ? "Next open cohort: San Francisco, 10–16 January 2027" : "Before you apply"}
      </p>
      <ul className="space-y-2">
        <li><strong className="text-black dark:text-white">Who it’s for:</strong> 5+ years in hands-on security and comfortable with Python. No prior AI/ML experience needed; pre-work is provided.</li>
        <li><strong className="text-black dark:text-white">Funding:</strong> Tuition, accommodation and meals during programme hours are covered. Need-based travel support is available.</li>
        <li><strong className="text-black dark:text-white">Selection:</strong> Short application, technical assessment, then a 30-minute interview. 20 places; applications reviewed on a rolling basis.</li>
        <li><strong className="text-black dark:text-white">Commitment:</strong> Seven full days in person, plus pre-reading. Apply by 7 November 2026 (AoE).</li>
      </ul>
    </aside>
  );
}
