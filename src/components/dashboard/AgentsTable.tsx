"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Loader2, Pencil, Eye } from "lucide-react";
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
import Link from "next/link";

interface Agent {
  id: string;
  agentId: string;
  agentName: string;
  agentSurname: string;
  agentEmail: string;
  agentPhone: string | null;
  agentSlack: string | null;
  agentDiscord: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentsTableRef {
  refresh: () => void;
}

export const AgentsTable = forwardRef<AgentsTableRef>((_props, ref) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    agentName: "",
    agentSurname: "",
    agentEmail: "",
    agentPhone: "",
    agentSlack: "",
    agentDiscord: "",
  });
  const { toast } = useToast();

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agents");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch agents");
      }

      setAgents(data.agents || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load agents";
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
    fetchAgents();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchAgents,
  }));

  const handleEditClick = (agent: Agent) => {
    setEditingAgent(agent);
    setEditFormData({
      agentName: agent.agentName,
      agentSurname: agent.agentSurname,
      agentEmail: agent.agentEmail,
      agentPhone: agent.agentPhone || "",
      agentSlack: agent.agentSlack || "",
      agentDiscord: agent.agentDiscord || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingAgent) return;

    // Validate required fields
    if (!editFormData.agentName.trim() || !editFormData.agentSurname.trim() || !editFormData.agentEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Name, Surname, and Email are required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(editFormData.agentEmail.trim())) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/agents", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: editingAgent.id,
          agentName: editFormData.agentName.trim(),
          agentSurname: editFormData.agentSurname.trim(),
          agentEmail: editFormData.agentEmail.trim(),
          agentPhone: editFormData.agentPhone.trim() || null,
          agentSlack: editFormData.agentSlack.trim() || null,
          agentDiscord: editFormData.agentDiscord.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update agent");
      }

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingAgent(null);
      // Refresh the agents list
      await fetchAgents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update agent";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (agentId: string) => {
    try {
      setDeletingId(agentId);
      const response = await fetch("/api/agents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete agent");
      }

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      // Refresh the agents list
      await fetchAgents();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete agent";
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

  if (agents.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Agents ({agents.length})</CardTitle>
        <CardDescription>Manage your agents list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Surname</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Slack</TableHead>
                <TableHead>Discord</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.agentId}</TableCell>
                  <TableCell>{agent.agentName}</TableCell>
                  <TableCell>{agent.agentSurname}</TableCell>
                  <TableCell>{agent.agentEmail}</TableCell>
                  <TableCell>{agent.agentPhone || "-"}</TableCell>
                  <TableCell>{agent.agentSlack || "-"}</TableCell>
                  <TableCell>{agent.agentDiscord || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/dashboard/agents/${agent.id}`} aria-label={`View ${agent.agentName}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Dialog open={isEditDialogOpen && editingAgent?.id === agent.id} onOpenChange={(open) => {
                        if (!open) {
                          setIsEditDialogOpen(false);
                          setEditingAgent(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSaving || deletingId === agent.id}
                            onClick={() => handleEditClick(agent)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Agent</DialogTitle>
                            <DialogDescription>Update the agent information. Agent ID cannot be changed.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="agentId">Agent ID</Label>
                              <Input id="agentId" value={agent.agentId} disabled className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentName">Name *</Label>
                              <Input
                                id="agentName"
                                value={editFormData.agentName}
                                onChange={(e) => setEditFormData({ ...editFormData, agentName: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentSurname">Surname *</Label>
                              <Input
                                id="agentSurname"
                                value={editFormData.agentSurname}
                                onChange={(e) => setEditFormData({ ...editFormData, agentSurname: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentEmail">Email *</Label>
                              <Input
                                id="agentEmail"
                                type="email"
                                value={editFormData.agentEmail}
                                onChange={(e) => setEditFormData({ ...editFormData, agentEmail: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentPhone">Phone</Label>
                              <Input
                                id="agentPhone"
                                value={editFormData.agentPhone}
                                onChange={(e) => setEditFormData({ ...editFormData, agentPhone: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentSlack">Slack</Label>
                              <Input
                                id="agentSlack"
                                value={editFormData.agentSlack}
                                onChange={(e) => setEditFormData({ ...editFormData, agentSlack: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="agentDiscord">Discord</Label>
                              <Input
                                id="agentDiscord"
                                value={editFormData.agentDiscord}
                                onChange={(e) => setEditFormData({ ...editFormData, agentDiscord: e.target.value })}
                                disabled={isSaving}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditingAgent(null);
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
                            disabled={deletingId === agent.id || isSaving}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === agent.id ? (
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
                              This action cannot be undone. This will permanently delete the agent{" "}
                              <strong>{agent.agentName} {agent.agentSurname}</strong> ({agent.agentId}) from your
                              account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(agent.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});

AgentsTable.displayName = "AgentsTable";

