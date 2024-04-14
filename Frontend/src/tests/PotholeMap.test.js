import { render, screen } from '@testing-library/react';
import PotholeMap from '../components/PotholeMap';
import { PotholeContext } from '../components/App';
import testHole from '../components/assets/test.json';
import { useState } from 'react';

const MockMap = () => {

    const [mockList, mockFunction] = useState([testHole]);

    return (
        <PotholeContext.Provider value={[mockList, mockFunction]}>
            <PotholeMap />
        </PotholeContext.Provider>
    )
}

test('renders map', async () => {
    render(<MockMap />);
    const headingElement = await screen.findByRole("banner");
    expect(headingElement).toBeInTheDocument();
  });
