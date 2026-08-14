import api from '../../services/api';
import type { InternalAxiosRequestConfig } from 'axios';

describe('API Service Interceptor (Unit)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('attaches JWT token to headers if present in localStorage', () => {
    localStorage.setItem('access_token', 'fake-jwt-token');
    
    const handlers = api.interceptors.request.handlers;
    const handler = handlers && handlers.length > 0 ? handlers[0] : undefined;
    
    if (handler && typeof handler.fulfilled === 'function') {
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const modifiedConfig = handler.fulfilled(config) as InternalAxiosRequestConfig;
      expect(modifiedConfig.headers.Authorization).toBe('Bearer fake-jwt-token');
    } else {
      fail('Interceptor fulfilled handler not found');
    }
  });

  it('does not attach JWT token if not present', () => {
    const handlers = api.interceptors.request.handlers;
    const handler = handlers && handlers.length > 0 ? handlers[0] : undefined;
    
    if (handler && typeof handler.fulfilled === 'function') {
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const modifiedConfig = handler.fulfilled(config) as InternalAxiosRequestConfig;
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    } else {
      fail('Interceptor fulfilled handler not found');
    }
  });
});
