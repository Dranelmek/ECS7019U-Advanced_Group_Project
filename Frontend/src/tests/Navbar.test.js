import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LoginContext, UserContext } from '../components/App';
import { useState, useContext , createContext} from 'react';

const MockNav = (bool) => {
    const [user, setUser] = useState({username: "No User"});
    const [mockBool, mockBoolFunction] = [bool.bool, () => {}]

    return (
        <Router>
        <LoginContext.Provider value={[mockBool, mockBoolFunction]}>
        <UserContext.Provider value={[user, setUser]}>
            <Navbar />
        </UserContext.Provider>
        </LoginContext.Provider>
        </Router>
    )
}

test('renders nav buttons', () => {
    render(<MockNav bool={false} />);
    const navElements = screen.getAllByRole("link");
    expect(navElements).toBeTruthy();
});

test('renders Login button when not logged in', () => {
    render(<MockNav bool={false} />);
    const navElement = screen.getByText(/login/i);
    expect(navElement).toBeInTheDocument();
});

test('renders Profile button when logged in', () => {
    render(<MockNav bool={true} />);
    const navElement = screen.getByText(/profile/i);
    expect(navElement).toBeInTheDocument();
});

test('Logout button is visible when active', () => {
    render(<MockNav bool={true} />);
    const buttonElement = screen.getByText(/profile/i);
    fireEvent.click(buttonElement)
    const navElements = screen.getByText(/log out/i);
    expect(navElements).toBeVisible();
});