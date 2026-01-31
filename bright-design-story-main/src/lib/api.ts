import { API_BASE_URL, AuthResponse, LoginRequest, RegisterRequest } from '../types/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getProfile(): Promise<any> {
    return this.request('/protected/profile');
  }

  async healthCheck(): Promise<any> {
    return this.request('/health');
  }

async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Posts API methods
  async getPosts(limit?: number): Promise<{ posts: any[] }> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/posts${query}`);
  }

  async getPost(id: number): Promise<{ post: any }> {
    return this.request(`/posts/${id}`);
  }

  async getUserPosts(userId: number, limit?: number): Promise<{ posts: any[] }> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/posts/user/${userId}${query}`);
  }

  async createPost(postData: {
    content_type: 'photo' | 'video' | 'text';
    content: string;
    caption: string;
    filter_tags?: string;
    location?: string;
  }): Promise<{ post: any }> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: number, updates: {
    caption?: string;
    likes?: number;
    comments?: number;
    reposts?: number;
    filter_tags?: string;
    location?: string;
  }): Promise<{ post: any }> {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePost(id: number): Promise<{ message: string }> {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleLike(id: number, increment: boolean = true): Promise<{ post: any }> {
    return this.request(`/posts/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ increment }),
    });
  }
}

export { ApiClient };
export const apiClient = new ApiClient();