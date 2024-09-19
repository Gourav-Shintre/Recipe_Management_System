/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import Registration from './Registration';
 
interface WrapperProps extends BrowserRouterProps {
  children?: React.ReactNode;
}
 
const Wrapper: React.FC<WrapperProps> = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
 
describe('Registration Component', () => {
  afterEach(async () => {
    const inputs = screen.getAllByRole("textbox");
    for (let input of inputs) {
      await userEvent.clear(input);
    }
  });
 
  test('renders the registration form correctly', () => {
    render(<Registration />, { wrapper: Wrapper });
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(1);
    expect(screen.getByRole('button', { name: /Signup/ })).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });
 
  test('allows the user to enter required registration details', async () => {
    render(<Registration />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText("First Name"), 'John');
    await userEvent.type(screen.getByLabelText("Last Name"), 'Doe');
    await userEvent.type(screen.getByLabelText("Email"), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText("Password"), 'ValidPassw0rd!');
    await userEvent.type(screen.getByLabelText("Confirm Password"), 'ValidPassw0rd!');
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("ValidPassw0rd!")).toHaveLength(2);
    });
  });
 
  test('displays error when entering an invalid email or incomplete details', async () => {
    render(<Registration />, { wrapper: Wrapper });
    await userEvent.type(screen.getByLabelText("Email"), 'invalidemail');
    await userEvent.type(screen.getByLabelText("Password"), 'short');
    await waitFor(() => {
      expect(screen.getByText("Email format is incorrect. Please use the format: john.doe@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("must be between 8 and 16 in length")).toBeInTheDocument();
    });
  });
 
  test('submit button is disabled when form input are invalid', async () => {
    render(<Registration />, { wrapper: Wrapper });
    const submitButton = screen.getByRole('button', { name: /Signup/ });
    userEvent.type(screen.getByLabelText("Email"), 'test@');
    userEvent.type(screen.getByLabelText("Password"), '123');
    fireEvent.blur(screen.getByLabelText("Email"));
    fireEvent.blur(screen.getByLabelText("Password"));
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });


  test('ensures the local part of the email is not too short', async () => {
    render(<Registration />, { wrapper: Wrapper });
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    await userEvent.type(emailInput, 'a@b.com');
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText("Email format is incorrect. Please use the format: john.doe@gmail.com")).toBeInTheDocument();
    });
  });
  test('TLd should not contain numbers and at least 2 chars long.', async () => {
    render(<Registration />, { wrapper: Wrapper });
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    await userEvent.type(emailInput, 'john@gmail.788');
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText("Email format is incorrect. Please use the format: john.doe@gmail.com")).toBeInTheDocument();
    });

  });
  test('submit button is enabled when valid input', async () => {
    render(<Registration />, { wrapper: Wrapper });
    const submitButton = screen.getByRole('button', { name: /Signup/ });
 
    await userEvent.type(screen.getByLabelText("First Name"), 'John');
    await userEvent.type(screen.getByLabelText("Last Name"), 'Doe');
    await userEvent.type(screen.getByLabelText("Email"), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText("Password"), 'ValidPassw0rd!');
    await userEvent.type(screen.getByLabelText("Confirm Password"), 'ValidPassw0rd!');
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
   
  }); 
 
});