/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './Login';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
 
// Define the type for children prop with React.ReactNode
interface WrapperProps extends BrowserRouterProps {
  children?: React.ReactNode;
}
 
// Wrapper to include Router since the LoginPage uses <Link>
const Wrapper: React.FC<WrapperProps> = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
 
describe('LoginPage Component', () => {
  afterEach(async () => {
    await userEvent.clear(screen.getByPlaceholderText("eg:- xyz@email.com"));
    await userEvent.clear(screen.getByPlaceholderText("********"));
  });
 
  test('renders LoginPage component', () => {
    render(<LoginPage />, { wrapper: Wrapper });
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
 
  test('allows the user to enter email and password', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    await userEvent.type(screen.getByPlaceholderText("eg:- xyz@email.com"), "valid@example.com");
    const passwordInput = screen.getByPlaceholderText("********");
    fireEvent.change(passwordInput, { target: { value: 'Valid123@' } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("valid@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Valid123@")).toBeInTheDocument();
    });
  });
 
  test('displays error when entering an invalid email', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    userEvent.type(screen.getByLabelText(/email/i), 'test@');
    fireEvent.blur(screen.getByLabelText(/email/i));
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });
 
  test('displays error when entering a short password', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    userEvent.type(screen.getByLabelText(/password/i), 'short');
    fireEvent.blur(screen.getByLabelText(/password/i));
    await waitFor(() => {
      expect(screen.getByText(/password must be 8-16 characters long/i)).toBeInTheDocument();
    });
  });
 
  test('submit button is disabled when form inputs are invalid', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const submitButton = screen.getByRole('button', { name: /login/i });
 
    userEvent.type(screen.getByLabelText(/email/i), 'test@');
    userEvent.type(screen.getByLabelText(/password/i), 'short');
    fireEvent.blur(screen.getByLabelText(/email/i));
    fireEvent.blur(screen.getByLabelText(/password/i));
 
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
 
  test('submit button is enabled when form inputs are valid', async () => {
    render(<LoginPage />, { wrapper: Wrapper });
    const submitButton = screen.getByRole('button', { name: /Login/ });
 
    await userEvent.type(screen.getByPlaceholderText("eg:- xyz@email.com"), "valid1@example.com");
    const passwordInput = screen.getByPlaceholderText("********");
    fireEvent.change(passwordInput, { target: { value: 'Valid123@' } });
 
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});