import { render, screen } from '@testing-library/react';
import App from './App';

test('renders vocabulary master app', () => {
  render(<App />);
  const titleElement = screen.getByText(/vocabulary master/i);
  expect(titleElement).toBeInTheDocument();
});
