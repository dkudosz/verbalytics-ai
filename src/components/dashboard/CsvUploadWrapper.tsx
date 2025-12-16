"use client";

import { useRef } from "react";
import { CsvUpload } from "./CsvUpload";
import { AgentsTable, AgentsTableRef } from "./AgentsTable";

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

