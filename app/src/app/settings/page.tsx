"use client";

import { useRef, useState } from "react";
import { exportJourney, importJourney, resetAllData } from "@/lib/db";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  async function handleReset() {
    await resetAllData();
    setConfirmingReset(false);
    setStatus("All local data cleared. Refresh to start from a clean slate.");
  }

  async function handleExport() {
    const data = await exportJourney();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grindstone-journey.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importJourney(data);
      setStatus("Journey imported.");
    } catch {
      setStatus("Could not import that file.");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text">Settings</h1>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm font-medium text-text">Data Safety</div>
        <p className="mt-1 text-sm text-text-dim">
          Grindstone stores everything locally in your browser. No account required — but if you
          clear browser storage or switch devices, export your journey first.
        </p>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" onClick={handleExport}>
            Export My Journey
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            Import Journey
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {status && <p className="mt-3 text-sm text-text-dim">{status}</p>}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <div className="text-sm font-medium text-text">AI Backend</div>
        <p className="mt-1 text-sm text-text-dim">
          Running locally via Ollama (llama3.2:3b). No API key, no data leaves your machine.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-danger/30 bg-surface p-6">
        <div className="text-sm font-medium text-danger">Danger Zone</div>
        <p className="mt-1 text-sm text-text-dim">
          Permanently clears every session, insight, review, and streak stored in this browser.
          Export your journey first if you want to keep it.
        </p>

        {!confirmingReset ? (
          <Button variant="secondary" className="mt-4" onClick={() => setConfirmingReset(true)}>
            Reset All Data
          </Button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-text">Are you sure? This can&rsquo;t be undone.</span>
            <Button onClick={handleReset}>Yes, reset everything</Button>
            <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
