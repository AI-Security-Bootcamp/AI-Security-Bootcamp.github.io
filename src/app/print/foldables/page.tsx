import { BrandMark, QrBlock } from "../_components";

const triangleWords = ["AI", "Security", "Bootcamp"];

export default function FoldablesPage() {
  return (
    <main className="sheet-stack foldable-stack">
      <article className="print-sheet foldable-sheet tent-sheet">
        <section className="tent-panel tent-panel--logo">
          <BrandMark />
          <p>aisb.dev</p>
        </section>

        <section className="tent-panel tent-panel--program">
          <p className="eyebrow red">Fully funded · In-person</p>
          <h1>AI Security<br />Bootcamp</h1>
          <div>
            <strong>San Francisco</strong>
            <span>Oct 4-10, 2026</span>
          </div>
        </section>

        <section className="tent-panel tent-panel--apply">
          <p className="eyebrow red">Applications open</p>
          <h2>San<br />Francisco</h2>
          <QrBlock large />
          <p className="tent-deadline">Apply by <strong>August 16</strong></p>
        </section>

        <div className="fold-guide fold-guide--one"><span>Fold</span></div>
        <div className="fold-guide fold-guide--two"><span>Fold</span></div>
      </article>

      <article className="print-sheet foldable-sheet giant-logo-sheet">
        <BrandMark />
      </article>

      <article className="print-sheet foldable-sheet horizontal-program-sheet">
        <p>AI Security Bootcamp</p>
      </article>

      {triangleWords.map((word, index) => (
        <article className="print-sheet foldable-sheet triangle-face-sheet" key={word}>
          <div className="triangle-face-header">
            <BrandMark compact />
            <span>{index + 1} / 3</span>
          </div>
          <p className={`triangle-word triangle-word--${word.toLowerCase()}`}>{word}</p>
          <p className="triangle-face-url">aisb.dev/sf26</p>
        </article>
      ))}
    </main>
  );
}
