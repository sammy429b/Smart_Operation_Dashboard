import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/shared/components';
import { router } from './router';
import { useFirebase } from '@/features/collaboration';

// Component to initialize Firebase connection
function FirebaseInitializer({ children }: { children: React.ReactNode }) {
  useFirebase();
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <FirebaseInitializer>
        <RouterProvider router={router} />
      </FirebaseInitializer>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;