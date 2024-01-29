import './styles/ListEntry.css'
import { useState } from 'react'
import test from './assets/test.json'
import expanndIcon from './assets/expand-icon.png';

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
                <img src={test.image} alt="pothole" className='pothole-image'/>
                <div className='pothole-location'>
                    location: {test.location}
                </div>
                <span className='expand-button' onClick={() => setIsExpanded(!isExpanded)}>
                    <img src={expanndIcon} alt="expand" className='expand-icon'/>
                </span>
            </div>
        );
    }
}

export default ListEntry;