import { useState, useCallback } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    <div className="h-full flex flex-col gap-4">
      {/* New note input */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="resize-none min-h-[80px] bg-muted/30 border-muted-foreground/20 focus:border-primary/50 transition-colors"
          disabled={isSubmitting || !isConnected}
        />
        <Button
          onClick={handleCreateNote}
          disabled={!newNote.trim() || isSubmitting}
          size="icon"
          aria-label="Send note"
          className="shrink-0 h-10 w-10"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recent Notes
        </h3>
        {!isConnected ? (
          <Badge variant="destructive" className="flex items-center gap-1 text-[10px] h-5">
            <WifiOff className="h-3 w-3" />
            Offline
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">
            {notes.length} notes
          </span>
        )}
      </div>

      {/* Notes list */}
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-3 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <LoaderWrapper />
              <p className="text-sm">Syncing notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 border-2 border-dashed border-muted rounded-xl bg-muted/10 mx-2">
              <div className="bg-background p-3 rounded-full shadow-sm">
                <MessageSquare className="h-6 w-6 opacity-50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">No notes yet</p>
                <p className="text-xs opacity-75">Start the conversation!</p>
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="group relative p-3 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all duration-200"
              >
                {editingId === note.id ? (
                  // Edit mode
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="resize-none min-h-[60px]"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                        className="h-7 w-7"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditNote(note.id)}
                        disabled={!editContent.trim() || isSubmitting}
                        className="h-7 w-7"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                            {note.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{note.userName}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(note.timestamp, { addSuffix: true })}
                        </span>
                        {note.edited && (
                          <span className="italic opacity-75">(edited)</span>
                        )}
                      </div>

                      {/* Actions - visible on hover */}
                      {user && String(user.id) === note.userId && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-muted"
                            onClick={() => startEditing(note.id, note.content)}
                          >
                            <Edit2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
};

const LoaderWrapper = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
);
