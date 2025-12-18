"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

type Props = {
  fromParam?: string;
  toParam?: string;
  transcriptIdQuery?: string;
};

export function TranscriptFilters({ fromParam, toParam, transcriptIdQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [from, setFrom] = useState(fromParam || "");
  const [to, setTo] = useState(toParam || "");
  const [transcriptId, setTranscriptId] = useState(transcriptIdQuery || "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (transcriptId) params.set("transcriptId", transcriptId);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setTranscriptId("");
    router.replace(pathname);
  };

  return (
    <Card className="mb-6 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 items-end" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="from">
              Date from
            </label>
            <input
              id="from"
              name="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="to">
              Date to
            </label>
            <input
              id="to"
              name="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <label className="text-sm font-medium text-foreground" htmlFor="transcriptId">
              Transcript ID
            </label>
            <input
              id="transcriptId"
              name="transcriptId"
              type="text"
              placeholder="Search by Transcript ID"
              value={transcriptId}
              onChange={(e) => setTranscriptId(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>
          <div className="flex gap-3 md:col-span-4 lg:col-span-1">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Apply filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Reset
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

