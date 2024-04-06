import { render, screen } from '@testing-library/react';
import PotholeMap from '../components/PotholeMap';
import { PotholeContext } from '../components/App';
import testHole from '../components/assets/test.json';

const MockMap = () => {

    const [mockList, mockFunction] = [[testHole], () => {}]

    return (
        <PotholeContext.Provider value={[mockList, mockFunction]}>
            <PotholeMap />
        </PotholeContext.Provider>
    )
}

test('renders map', () => {
    render(<MockMap />);
    const headingElement = screen.getByRole("banner");
    expect(headingElement).toBeInTheDocument();
  });