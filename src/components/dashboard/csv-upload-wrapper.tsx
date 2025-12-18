"use client";

import { useRef } from "react";
import { CsvUpload } from "./csv-upload";
import { AgentsTable, AgentsTableRef } from "./agents-table";

export function CsvUploadWrapper() {
  const refreshTableRef = useRef<AgentsTableRef>(null);

  const handleUploadSuccess = () => {
    if (refreshTableRef.current) {
      refreshTableRef.current.refresh();
    }
  };

  return (
    <>
      <CsvUpload onUploadSuccess={handleUploadSuccess} />
      <AgentsTable ref={refreshTableRef} />
    </>
  );
}

