type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quiz-backend-ruddy.vercel.app';
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
  
    // Retrieve token from local storage
    const token = localStorage.getItem('authToken');
    console.log('token', token);
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // Attach token if available
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
}
