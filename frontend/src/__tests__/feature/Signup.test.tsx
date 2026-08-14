import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '../../app/signup/page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
  return MockLink;
});
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), interceptors: { request: { use: jest.fn() } } }
}));

describe('SignupPage Validations', () => {
  it('shows required validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    expect(screen.getAllByText(/Required \*/i).length).toBeGreaterThan(0);
  });

  it('prevents typing numbers in name fields (sanitization)', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    
    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'John123');
    
    expect(inputs[0]).toHaveValue('John');
  });
});
