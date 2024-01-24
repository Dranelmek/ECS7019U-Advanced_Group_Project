import './styles/Potholes.css'
import ListEntry from './ListEntry';
import { useState } from 'react';

function Potholes() {
    
    const [CFA, setCFA] = useState(5)

    let holes = [...Array(CFA)].map((value, index) => (
        <ListEntry />
    ));
    return(
        <header className='List-header'>
            {holes}
        </header>
    );
}

export default Potholes