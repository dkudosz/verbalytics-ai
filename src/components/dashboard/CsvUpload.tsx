"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CsvUploadProps {
  onUploadSuccess?: () => void;
}

export function CsvUpload({ onUploadSuccess }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        e.target.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/agents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to upload CSV file";
        const errorDetails = data.details;
        throw new Error(
          errorDetails && Array.isArray(errorDetails)
            ? `${errorMessage}\n${errorDetails.slice(0, 3).join("\n")}${errorDetails.length > 3 ? `\n...and ${errorDetails.length - 3} more errors` : ""}`
            : errorMessage
        );
      }

      const successMessage =
        data.errors && data.errors.length > 0
          ? `Uploaded ${data.processed || 0} agents with ${data.errors.length} validation warning(s).`
          : data.message || `Successfully uploaded ${data.processed || 0} agents.`;

      toast({
        title: "Upload successful",
        description: successMessage,
      });

      // Show warnings if there are validation errors
      if (data.errors && data.errors.length > 0) {
        setTimeout(() => {
          toast({
            title: "Validation warnings",
            description: `${data.errors.length} row(s) had validation issues. Check the console for details.`,
            variant: "default",
          });
        }, 1000);
        console.warn("CSV validation warnings:", data.errors);
      }

      // Reset file input
      setFile(null);
      const fileInput = document.getElementById("csv-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Trigger refresh callback
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Agents CSV
        </CardTitle>
        <CardDescription>
          Upload a CSV file to import agents. The CSV should contain columns: agentId, agentName, agentSurname, agentEmail, agentPhone, agentSlack, agentDiscord.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/docs/agentListExample.csv";
              link.download = "agentListExample.csv";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Example CSV
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="min-w-[140px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
        {file && (
          <div className="text-sm text-muted-foreground">
            Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

