import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '../../app/dashboard/page';
import api from '../../services/api';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('../../services/api');

describe('Dashboard Feature', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('redirects to login if no token is present', () => {
    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows confirmation dialog before deleting account', async () => {
    const user = userEvent.setup();
    localStorage.setItem('access_token', 'fake-token');
    (api.get as jest.Mock).mockResolvedValue({
      data: { id: '123', first_name: 'John', last_name: 'Doe', email: 'john@example.com', created_at: new Date().toISOString() }
    });

    render(<DashboardPage />);
    
    // Wait for dashboard to load
    await waitFor(() => expect(screen.getByText(/Delete Account/i)).toBeInTheDocument());
    
    // Click Delete Account button
    await user.click(screen.getByRole('button', { name: /Delete Account/i }));
    
    // Confirmation dialog should appear
    expect(screen.getByText(/Are you sure you want to delete your account permanently?/i)).toBeInTheDocument();
    
    // Click Cancel
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    
    // Dialog should close
    expect(screen.queryByText(/Are you sure you want to delete your account permanently?/i)).toBeNull();
  });
});
