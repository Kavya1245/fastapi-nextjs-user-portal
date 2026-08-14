import api from '../../services/api';

describe('API Service Interceptor (Unit)', => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('attaches JWT token to headers if present in localStorage', () => {
    localStorage.setItem('access_token', 'fake-jwt-token');
    const config = { headers: {} } as any;
    // Safely check if handlers exist and have the fulfilled function
    const handler = api.interceptors.request.handlers[0];
    if (handler && typeof handler.fulfilled === 'function') {
      const modifiedConfig = handler.fulfilled(config);
      expect(modifiedConfig.headers.Authorization).toBe('Bearer fake-jwt-token');
    } else {
      fail('Interceptor fulfilled handler not found');
    }
  });

  it('does not attach JWT token if not present', () => {
    const config = { headers: {} } as any;
    const handler = api.interceptors.request.handlers[0];
    if (handler && typeof handler.fulfilled === 'function') {
      const modifiedConfig = handler.fulfilled(config);
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    } else {
      fail('Interceptor fulfilled handler not found');
    }
  });
});
