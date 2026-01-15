// Collaboration feature exports

// Store
export { useCollaborationStore } from './collaborationSlice';
export type { Note, PresenceUser, ActivityEvent } from './collaborationSlice';

// Services
export { collaborationService } from './services/collaborationService';

// Hooks
export { useFirebase } from './hooks/useFirebase';
export { usePresence } from './hooks/usePresence';

// Components
export { LiveNotes } from './components/LiveNotes';
export { PresenceIndicator } from './components/PresenceIndicator';
export { ActivityFeed } from './components/ActivityFeed';
