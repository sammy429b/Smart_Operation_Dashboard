import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Edit2, Trash2, X, Check, WifiOff } from 'lucide-react';
import { useCollaborationStore } from '../collaborationSlice';
import { collaborationService } from '../services/collaborationService';
import { useAuthStore } from '@/features/auth';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export const LiveNotes = () => {
  const { user } = useAuthStore();
  const { notes, isLoading, isConnected } = useCollaborationStore();
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateNote = useCallback(async () => {
    if (!newNote.trim() || !user) return;

    if (!isConnected) {
      toast.error('Not connected to Firebase. Please wait for connection.');
      return;
    }

    setIsSubmitting(true);
    try {
      await collaborationService.createNote(
        newNote.trim(),
        String(user.id),
        `${user.firstName} ${user.lastName}`
      );
      setNewNote('');
      toast.success('Note created successfully');
    } catch (err) {
      console.error('Failed to create note:', err);
      toast.error('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [newNote, user, isConnected]);

  const handleEditNote = useCallback(async (noteId: string) => {
    if (!editContent.trim() || !user) return;

    if (!isConnected) {
      toast.error('Not connected to Firebase. Please wait for connection.');
      return;
    }

    setIsSubmitting(true);
    try {
      await collaborationService.updateNote(
        noteId,
        editContent.trim(),
        String(user.id),
        `${user.firstName} ${user.lastName}`
      );
      setEditingId(null);
      setEditContent('');
      toast.success('Note updated successfully');
    } catch (err) {
      console.error('Failed to update note:', err);
      toast.error('Failed to update note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [editContent, user, isConnected]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!user) return;

    if (!isConnected) {
      toast.error('Not connected to Firebase. Please wait for connection.');
      return;
    }

    try {
      await collaborationService.deleteNote(
        noteId,
        String(user.id),
        `${user.firstName} ${user.lastName}`
      );
      toast.success('Note deleted');
    } catch (err) {
      console.error('Failed to delete note:', err);
      toast.error('Failed to delete note. Please try again.');
    }
  }, [user, isConnected]);

  const startEditing = (noteId: string, content: string) => {
    setEditingId(noteId);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Live Notes
          {!isConnected ? (
            <Badge variant="destructive" className="ml-auto flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-auto">
              {notes.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* New note input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="resize-none min-h-[60px]"
            disabled={isSubmitting || !isConnected}
          />
          <Button
            onClick={handleCreateNote}
            disabled={!newNote.trim() || isSubmitting}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Notes list */}
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No notes yet. Be the first to add one!
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-muted/50 space-y-2"
                >
                  {editingId === note.id ? (
                    // Edit mode
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="resize-none min-h-[60px]"
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditNote(note.id)}
                          disabled={!editContent.trim() || isSubmitting}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{note.userName}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(note.timestamp, { addSuffix: true })}
                          </span>
                          {note.edited && (
                            <Badge variant="outline" className="text-[10px]">
                              edited
                            </Badge>
                          )}
                        </div>
                        {user && String(user.id) === note.userId && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => startEditing(note.id, note.content)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
