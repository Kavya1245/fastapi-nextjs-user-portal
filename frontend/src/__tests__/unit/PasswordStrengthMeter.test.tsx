import { render, screen } from '@testing-library/react';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

describe('PasswordStrengthMeter (Unit)', () => {
  it('renders weak strength for simple password', () => {
    render(<PasswordStrengthMeter password="abc" />);
    expect(screen.getByText(/Weak/i)).toBeInTheDocument();
  });

  it('renders strong strength for complex password', () => {
    render(<PasswordStrengthMeter password="Pass@123" />);
    expect(screen.getByText(/Strong/i)).toBeInTheDocument();
  });

  it('renders nothing for empty password', () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    // No label should be present
    expect(container.querySelector('p')).toBeNull();
  });
});
