import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../app/page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);
jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), interceptors: { request: { use: jest.fn() } } }
}));

describe('LoginPage', () => {
  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    
    await user.type(emailInput, 'john.com');
    await user.click(screen.getByRole('button', { name: /Login/i }));
    
    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    
    // The toggle button is the only button that doesn't say "Login"
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(btn => btn.textContent !== 'Login');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    await user.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
