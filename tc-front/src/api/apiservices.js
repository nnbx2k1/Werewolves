const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    } catch (e) {
      throw new Error('Something went wrong');
    }
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    throw new Error('No user data found');
  }
  const userData = JSON.parse(user);
  return {
    'Authorization': `Bearer ${userData.token}`,
    'Content-Type': 'application/json'
  };
};

// Authentication API
export const authService = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (!data.user || typeof data.user !== 'object') {
        throw new Error('No user data received');
      }

      // Store user data with token
      const userWithToken = {
        ...data.user,
        token: data.accessToken
      };
      localStorage.setItem('user', JSON.stringify(userWithToken));

      return {
        user: userWithToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (!data.accessToken) {
        throw new Error('No authentication token received');
      }

      if (!data.user || typeof data.user !== 'object') {
        throw new Error('No user data received');
      }

      // Store user data with token
      const userWithToken = {
        ...data.user,
        token: data.accessToken
      };
      localStorage.setItem('user', JSON.stringify(userWithToken));
      
      return {
        user: userWithToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return !!userData.token;
    } catch (error) {
      return false;
    }
  }
};

// Chat and Conversation API
export const chatService = {
  // Admin only: Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Admin only: Create a new conversation
  createConversation: async (conversationData) => {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(conversationData),
    });
    return handleResponse(response);
  },

  // Get user's conversations
  getConversations: async () => {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Send a message
  sendMessage: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    });
    return handleResponse(response);
  },

  // Chat with bot
  chatWithBot: async (message) => {
    const response = await fetch(`${API_BASE_URL}/chat/bot`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  }
};

// Documents API
export const documentService = {
  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  uploadDocument: async (documentData) => {
    const formData = new FormData();
    formData.append('file', documentData.file);
    if (documentData.metadata) {
      formData.append('metadata', JSON.stringify(documentData.metadata));
    }

    const headers = getAuthHeaders();
    delete headers['Content-Type']; // Let the browser set the correct content-type for FormData

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    return handleResponse(response);
  },

  getDocumentDetails: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Notifications API
export const notificationService = {
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
