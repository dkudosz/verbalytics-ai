"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Loader2, Pencil, Plus, FileText, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Script {
  id: string;
  scriptName: string;
  scriptText: string;
  createdAt: string;
  updatedAt: string;
}

export function ScriptsTable() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    scriptName: "",
    scriptText: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/scripts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch scripts");
      }

      setScripts(data.scripts || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load scripts";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleCreateClick = () => {
    setFormData({
      scriptName: "",
      scriptText: "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (script: Script) => {
    setEditingScript(script);
    setFormData({
      scriptName: script.scriptName,
      scriptText: script.scriptText,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateSave = async () => {
    if (!formData.scriptName.trim() || !formData.scriptText.trim()) {
      toast({
        title: "Validation Error",
        description: "Script name and script text are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scriptName: formData.scriptName.trim(),
          scriptText: formData.scriptText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create script");
      }

      toast({
        title: "Success",
        description: "Script created successfully",
      });

      setIsCreateDialogOpen(false);
      setFormData({
        scriptName: "",
        scriptText: "",
      });
      await fetchScripts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create script";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingScript) return;

    if (!formData.scriptName.trim() || !formData.scriptText.trim()) {
      toast({
        title: "Validation Error",
        description: "Script name and script text are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/scripts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scriptId: editingScript.id,
          scriptName: formData.scriptName.trim(),
          scriptText: formData.scriptText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update script");
      }

      toast({
        title: "Success",
        description: "Script updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingScript(null);
      await fetchScripts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update script";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: "Script ID copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy ID to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (scriptId: string) => {
    try {
      setDeletingId(scriptId);
      const response = await fetch("/api/scripts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scriptId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete script");
      }

      toast({
        title: "Success",
        description: "Script deleted successfully",
      });

      await fetchScripts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete script";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Scripts ({scripts.length})</CardTitle>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Upload Script
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Script</DialogTitle>
              <DialogDescription>
                Create a new script with a name and text content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="create-scriptName">Script Name *</Label>
                <Input
                  id="create-scriptName"
                  value={formData.scriptName}
                  onChange={(e) => setFormData({ ...formData, scriptName: e.target.value })}
                  disabled={isSaving}
                  placeholder="Enter script name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-scriptText">Script Text *</Label>
                <Textarea
                  id="create-scriptText"
                  value={formData.scriptText}
                  onChange={(e) => setFormData({ ...formData, scriptText: e.target.value })}
                  disabled={isSaving}
                  placeholder="Enter script text"
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setFormData({
                    scriptName: "",
                    scriptText: "",
                  });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Script"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Script Name</TableHead>
                <TableHead>Script Text</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scripts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No scripts yet. Click "Upload Script" to create your first script.
                  </TableCell>
                </TableRow>
              ) : (
                scripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell
                      className="font-mono text-xs cursor-pointer hover:bg-muted/50 transition-colors select-all group"
                      onClick={() => handleCopyId(script.id)}
                      title="Click to copy ID"
                    >
                      <div className="flex items-center gap-2">
                        <span>{script.id}</span>
                        {copiedId === script.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{script.scriptName}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={script.scriptText}>
                        {script.scriptText.length > 100
                          ? `${script.scriptText.substring(0, 100)}...`
                          : script.scriptText}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && editingScript?.id === script.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setIsEditDialogOpen(false);
                              setEditingScript(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSaving || deletingId === script.id}
                              onClick={() => handleEditClick(script)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Script</DialogTitle>
                              <DialogDescription>
                                Update the script information. ID cannot be changed.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-scriptId">ID</Label>
                                <Input
                                  id="edit-scriptId"
                                  value={script.id}
                                  disabled
                                  className="bg-muted font-mono text-xs"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-scriptName">Script Name *</Label>
                                <Input
                                  id="edit-scriptName"
                                  value={formData.scriptName}
                                  onChange={(e) =>
                                    setFormData({ ...formData, scriptName: e.target.value })
                                  }
                                  disabled={isSaving}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-scriptText">Script Text *</Label>
                                <Textarea
                                  id="edit-scriptText"
                                  value={formData.scriptText}
                                  onChange={(e) =>
                                    setFormData({ ...formData, scriptText: e.target.value })
                                  }
                                  disabled={isSaving}
                                  className="min-h-[200px]"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setEditingScript(null);
                                }}
                                disabled={isSaving}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleEditSave} disabled={isSaving}>
                                {isSaving ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingId === script.id || isSaving}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {deletingId === script.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the script{" "}
                                <strong>{script.scriptName}</strong> from your account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(script.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

