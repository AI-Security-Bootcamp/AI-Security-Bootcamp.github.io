import type { Metadata } from "next";
import PrintToolbar from "./print-toolbar";
import "./print.css";

export const metadata: Metadata = {
  title: "AISB Physical Edition",
  description: "Print-ready AISB conference materials.",
};

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-edition">
      <PrintToolbar />
      {children}
    </div>
  );
}
