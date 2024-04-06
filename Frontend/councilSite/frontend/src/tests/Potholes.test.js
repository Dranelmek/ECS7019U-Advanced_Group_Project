import { fireEvent, render, screen } from '@testing-library/react';
import Potholes from '../components/Potholes';
import testHole from '../components/assets/test.json';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LoginContext, PotholeContext } from '../components/App';

function* range(end) {
    for (let i = 1; i <= end; i++) {
        yield i;
    }
}

function testArray(n, obj) {
// helper funtion to create an array of desired size with repeating elements

    let tmp = [...range(n)]
    if (n===0) {
        return []
    } else {
        return tmp.map(x => obj)
    }
    
}

const MockPohotleList = (number) => {
    const [mockList, mockFunction] = [testArray(number.number, testHole), () => {}]
    const [mockBool, mockBoolFunction] = [false, () => {}]

    return (
        <Router>
        <LoginContext.Provider value={[mockBool, mockBoolFunction]}>
        <PotholeContext.Provider value={[mockList, mockFunction]}>
            <Potholes />
        </PotholeContext.Provider>
        </LoginContext.Provider>
        </Router>
    )
}

test('renders no-hole message when list size 0', () => {
    render(<MockPohotleList number={0} />);
    const paragraphElement = screen.getByText(/no potholes detected/i);
    expect(paragraphElement).toBeInTheDocument();
});

test('doesn\'t render list-expander when list size >=5', () => {
    render(<MockPohotleList number={1} />);
    const expandElement = screen.queryByText(/show less/i);
    expect(expandElement).not.toBeInTheDocument();
});

test('renders list-expander when list size <5', () => {
    render(<MockPohotleList number={6} />);
    const expandElement = screen.queryByText(/show more/i);
    expect(expandElement).toBeInTheDocument();
});

test('renders show all when list size <11 and has been expaned', () => {
    render(<MockPohotleList number={11} />);
    const expandElement = screen.queryByText(/show more/i);
    fireEvent.click(expandElement)
    const fullExpandElement = screen.queryByText(/show all/i);
    expect(fullExpandElement).toBeInTheDocument();
});

test('renders show less when list size <11 and has been expaned', () => {
    render(<MockPohotleList number={11} />);
    const expandElement = screen.queryByText(/show more/i);
    fireEvent.click(expandElement)
    const reduceElement = screen.queryByText(/show less/i);
    expect(reduceElement).toBeInTheDocument();
});