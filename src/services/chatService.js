import { supabase } from './supabaseClient';
import { API_URL } from './config';

// Function ONLY for creating new thread and getting title
export async function createNewThread(initialMessage) {
  try {
    // Create thread and get title from backend
    const response = await fetch(`${API_URL}/api/threads/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        initial_message: initialMessage
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create thread');
    }

    const { thread_id, title } = await response.json();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Only save to Supabase if user is logged in
    if (user) {
      const { error } = await supabase
        .from('user_threads')
        .insert({
          user_id: user.id,
          thread_id: thread_id,
          title: title,
          last_message: initialMessage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return {
      thread_id,
      title
    };
  } catch (error) {
    console.error('Error creating new thread:', error);
    throw error;
  }
}

// Function for sending messages to existing threads
export async function sendMessage(message, threadId, field) {
  if (!threadId) {
    throw new Error('threadId is required for sending messages');
  }

  try {
    const targetPersona = localStorage.getItem('targetPersona');
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        thread_id: threadId,
        targetPersona: targetPersona || null,
        field: field
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();

    // Update last_message in Supabase
    if ((await supabase.auth.getUser()).data.user) {
      await supabase
        .from('user_threads')
        .update({ 
          last_message: message,
          updated_at: new Date().toISOString()
        })
        .eq('thread_id', threadId);
    }

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/*
// Save new thread to Supabase with auto-generated title
async function saveThreadToSupabase(threadId, initialMessage) {
  try {
    // First generate a title
    const title = await generateThreadTitle(initialMessage);

    // Save to Supabase with explicit user_id
    const { data, error } = await supabase
      .from('user_threads')
      .insert({
        thread_id: threadId,
        title: title,
        user_id: (await supabase.auth.getUser()).data.user.id,
        last_message: initialMessage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving thread:', error);
    throw error;
  }
}
*/

/*
// Generate title using the backend API
async function generateThreadTitle(message) {
  try {
    const response = await fetch('http://localhost:8000/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate title');
    }

    const { title } = await response.json();
    return title;
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Conversation'; // Fallback title
  }
}
*/

// Fetch user's threads from Supabase
export async function fetchUserThreads() {
  try {
    const { data, error } = await supabase
      .from('user_threads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
}

/*
// Load messages from a specific thread
export async function loadThreadMessages(threadId) {
  try {
    const response = await fetch(`http://localhost:8000/api/threads/${threadId}/messages`);
    if (!response.ok) {
      throw new Error('Failed to load thread messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading thread messages:', error);
    throw error;
  }
}
*/

/*
// Add function to save new threads
export async function saveNewThread(threadId, initialMessage) {
  try {
    // First, get a summary title from GPT
    const titleResponse = await fetch('http://localhost:8000/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: initialMessage }),
    });
    
    const { title } = await titleResponse.json();

    // Save thread to Supabase
    const { data, error } = await supabase
      .from('user_threads')
      .insert({
        thread_id: threadId,
        title: title,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving thread:', error);
    throw error;
  }
}
*/
