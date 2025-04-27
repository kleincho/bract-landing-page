import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // First check if we already have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Session found, redirecting...');
        navigate('/', { replace: true });
        return;
      }
    };

    // Check immediate session
    checkSession();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        navigate('/', { replace: true });
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
