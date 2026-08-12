import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../app/signup/page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), interceptors: { request: { use: jest.fn() } } }
}));

describe('Signup Page Feature', () => {
  it('shows required validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    // Click Sign Up without typing anything
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Expect to see multiple "Required *" errors
    expect(screen.getAllByText(/Required \*/i).length).toBeGreaterThan(0);
  });

  it('prevents typing numbers in name fields (sanitization)', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Try to type invalid characters
    await user.type(inputs[0], 'John123');
    
    // The sanitizer should strip the '123' immediately, leaving 'John'
    expect(inputs[0]).toHaveValue('John');
  });
});
