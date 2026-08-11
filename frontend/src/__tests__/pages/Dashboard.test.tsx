import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../app/dashboard/page';
import api from '../../services/api';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../services/api');

describe('DashboardPage Security', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('redirects to login if no token is present', () => {
    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('fetches and displays user data when token is valid', async () => {
    localStorage.setItem('access_token', 'fake-token');
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: '123', first_name: 'John', last_name: 'Doe', email: 'john@example.com', created_at: new Date().toISOString() }
    });

    render(<DashboardPage />);
    
    await waitFor(() => {
      // Use getAllByText because the email is displayed in both the banner and the data grid
      expect(screen.getAllByText(/john@example.com/i).length).toBeGreaterThan(0);
    });
  });
});
