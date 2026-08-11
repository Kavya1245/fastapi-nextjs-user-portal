import api from '../../services/api';

describe('API Service Interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('attaches JWT token to headers if present in localStorage', () => {
    localStorage.setItem('access_token', 'fake-jwt-token');
    const config = { headers: {} } as any;
    // Execute the interceptor's fulfilled handler manually
    const modifiedConfig = api.interceptors.request.handlers[0].fulfilled(config);
    expect(modifiedConfig.headers.Authorization).toBe('Bearer fake-jwt-token');
  });

  it('does not attach JWT token if not present', () => {
    const config = { headers: {} } as any;
    const modifiedConfig = api.interceptors.request.handlers[0].fulfilled(config);
    expect(modifiedConfig.headers.Authorization).toBeUndefined();
  });
});
