import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../app/signup/page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);
jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), interceptors: { request: { use: jest.fn() } } }
}));

describe('SignupPage Validations', () => {
  it('renders all form fields with required asterisks', () => {
    render(<SignupPage />);
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('shows error when first name has numbers', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    const inputs = screen.getAllByRole('textbox');
    
    await user.type(inputs[0], 'John123');
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    expect(screen.getByText(/1-20 Alphabets only/i)).toBeInTheDocument();
  });

  it('shows error for weak password (missing symbol)', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'John');
    await user.type(inputs[1], 'Doe');
    await user.type(inputs[2], 'john@example.com');
    
    const allInputs = document.querySelectorAll('input');
    await user.type(allInputs[3], 'Password123'); // No symbol
    await user.type(allInputs[4], 'Password123');
    
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    expect(screen.getByText(/Min 6 chars, 1 Upper, 1 Lower, 1 Digit, 1 Symbol/i)).toBeInTheDocument();
  });
});
