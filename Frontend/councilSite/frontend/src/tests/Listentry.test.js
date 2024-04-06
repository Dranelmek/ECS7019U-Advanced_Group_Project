import { fireEvent, render, screen } from '@testing-library/react';
import ListEntry from '../components/ListEntry';
import testHole from '../components/assets/test.json';
import { LoginContext, PotholeContext } from '../components/App';

const MockEntry = (bool) => {
    const [_, mockFunction] = [null, () => {}]
    const [mockBool, mockBoolFunction] = [bool, () => {}]

    return (
        <LoginContext.Provider value={[mockBool, mockBoolFunction]}>
        <PotholeContext.Provider value={[_, mockFunction]}>
            <ListEntry id={1} pothole={testHole} />
        </PotholeContext.Provider>
        </LoginContext.Provider>
    )
}

test('renders pothole location', () => {
  render(<MockEntry bool={false}/>);
  const listElement = screen.getByText(`location: ${testHole.location}`);
  expect(listElement).toBeInTheDocument();
});

test('renders pothole image', () => {
    render(<MockEntry bool={false}/>);
    const imageElement = screen.getByAltText('pothole');
    expect(imageElement).toBeInTheDocument();
  });

test('renders expand button', () => {
    render(<MockEntry bool={false}/>);
    const spanElement = screen.getByAltText('expand');
    expect(spanElement).toBeInTheDocument();
});

test('expands list entry', () => {
    function severity(bool) {
        if (bool) {
            return ("This pothole is in urgent need of repair!");
        } else {
            return ("This pothole has been reported." );
        }
    }

    render(<MockEntry bool={false}/>);
    const expandButton = screen.getByAltText('expand');
    fireEvent.click(expandButton)
    const descriptionElement = screen.getByText(severity(testHole.repairment_needed));
    expect(descriptionElement).toBeInTheDocument();
});

test('renders pothole video', async () => {

    render(<MockEntry bool={false}/>);
    const expandButton = screen.getByAltText('expand');
    fireEvent.click(expandButton)
    const videoElement = await screen.findByTestId("pothole-video");
    expect(videoElement).toBeInTheDocument();
});

test('renders delete button', async () => {

    render(<MockEntry bool={true}/>);
    const expandButton = screen.getByAltText('expand');
    fireEvent.click(expandButton)
    const buttonElement = screen.getByText(/delete/i);
    expect(buttonElement).toBeInTheDocument();
});
