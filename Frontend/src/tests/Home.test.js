import { render, screen } from '@testing-library/react';
import Home from '../components/Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const template = (
  <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
)

test('renders homepage heading', () => {
  render(template);
  const headingElement = screen.getByText(/pothole detection/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders homepage sub-heading', () => {
  render(template);
  const headingElement = screen.getByText(/advanced group project/i);
  expect(headingElement).toBeInTheDocument();
});
