import './styles/ListEntry.css'
import { useState } from 'react'
import test from './assets/test.json'

function ListEntry() {
    
    const [isExpanded, setIsExpanded] = useState(false);

    if (isExpanded) {
        return (
            <div className='list-entry expanded'>
    
            </div>
        );
    } else {
        return (
            <div className='list-entry compact'>
                {test.location}
            </div>
        );
    }
}

export default ListEntry;