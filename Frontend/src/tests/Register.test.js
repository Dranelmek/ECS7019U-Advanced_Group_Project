import { fireEvent, render, screen } from '@testing-library/react';
import Register from '../components/Register';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState } from 'react';
import { LoginContext, UserContext } from '../components/App';

const MockRegister = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: "No User"});

  return(
    <Router>
      <UserContext.Provider value={[user, setUser]}>
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
          <Register />
      </LoginContext.Provider>
      </UserContext.Provider>
    </Router>
  )
}

test('renders Register heading', async () => {

  render(<MockRegister />);
  const headingElement = screen.getByText(/Pothole Detection/i)
  expect(headingElement).toBeInTheDocument();
});

test('renders Register sub-heading', async () => {

  render(<MockRegister />);
  const headingElement = screen.getByTestId("Register-subtitle")
  expect(headingElement).toBeInTheDocument();
});

test('renders Register form', async () => {

  render(<MockRegister />);
  const formElement = screen.getByTestId("Register-form")
  expect(formElement).toBeInTheDocument();
});

test('renders Username field label', async () => {

  render(<MockRegister />);
  const inputElement = screen.getByLabelText("Username:")
  expect(inputElement).toBeInTheDocument();
});

test('renders all textfields', async () => {

  render(<MockRegister />);
  const inputElements = screen.getAllByRole("textbox")
  expect(inputElements.length).toBe(4);
});

test('renders all password fields', async () => {

  render(<MockRegister />);
  const inputElements = screen.getAllByTestId("password")
  expect(inputElements.length).toBe(2);
});

test('renders register button', async () => {

  render(<MockRegister />);
  const inputElement = screen.getByRole("button")
  expect(inputElement).toBeInTheDocument();
});
