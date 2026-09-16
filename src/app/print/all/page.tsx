import { AirgappedEoiSheet, HomeSheets, Sf26FlyerSheet, Sf26Sheets } from "../_pages";

export default function PhysicalEverythingPage() {
  return (
    <main className="sheet-stack">
      <HomeSheets />
      <Sf26Sheets />
      <Sf26FlyerSheet />
      <Sf26FlyerSheet />
      <AirgappedEoiSheet />
    </main>
  );
}
