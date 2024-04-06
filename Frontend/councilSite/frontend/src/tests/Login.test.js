import { render, screen } from '@testing-library/react';
import Login from '../components/Login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, useContext , createContext} from 'react';
import { LoginContext, UserContext } from '../components/App';

const MockLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: "No User"});

  return(
    <Router>
      <UserContext.Provider value={[user, setUser]}>
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
          <Login />
      </LoginContext.Provider>
      </UserContext.Provider>
    </Router>
  )
}

test('renders login heading', async () => {

  render(<MockLogin />);
  const headingElement = screen.getByText(/Pothole Detection/i)
  expect(headingElement).toBeInTheDocument();
});

test('renders login sub-heading', async () => {

  render(<MockLogin />);
  const headingElement = screen.getByTestId("Login-subtitle")
  expect(headingElement).toBeInTheDocument();
});

test('renders login form', async () => {

  render(<MockLogin />);
  const formElement = screen.getByTestId("Login-form")
  expect(formElement).toBeInTheDocument();
});

test('renders login field', async () => {

  render(<MockLogin />);
  const inputElement = screen.getByRole("textbox")
  expect(inputElement).toBeInTheDocument();
});

test('renders password field', async () => {

  render(<MockLogin />);
  const inputElement = screen.getByTestId("password")
  expect(inputElement).toBeInTheDocument();
});

test('renders login button', async () => {

  render(<MockLogin />);
  const inputElement = screen.getByRole("button")
  expect(inputElement).toBeInTheDocument();
});

test('does not render register button', async () => {

  render(<MockLogin />);
  const inputElement = screen.queryByText(/register/i)
  expect(inputElement).not.toBeInTheDocument();
});