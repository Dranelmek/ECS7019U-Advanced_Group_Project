import './styles/ListEntry.css'
import { useState, useContext } from 'react'
import test from './assets/test.json'
import expanndIcon from './assets/expand-icon.png'
import minIcon from './assets/mini-icon.png'
import { Link } from 'react-router-dom'
import { LoginContext } from './App'



function ListEntry() {
    
    function deleteButton(bool) {
        if (bool) {
            return (<span className='delete-button' onClick={deleteAlert}>Delete</span>)
        } else {
            return <div hidden></div>
        }
    }

    function deleteAlert() {
        window.alert("Deletion requested")
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const [loggedIn, setLoggedIn] = useContext(LoginContext)

    
    function severity(bool) {
        if (bool) {
            return ("This pothole is in urgent need of repair!");
        } else {
            return ("This pothole has been reported." );
        }
    }

    if (isExpanded) {
        return (
            <div className='list-entry expanded'>
                <img src={test.image} alt="pothole" className='pothole-image'/>
                <div className='description-box'>
                    <div className='pothole-location'>
                        location: {test.location}
                    </div>
                    <div className='pothole-details'>
                        <div className='pothole-video'>
                            This pothole's video can be found <Link to={test.video}>here</Link>.
                        </div>
                        <div className='pothole-severity'>
                            {severity(test.repairment_needed)}
                        </div>
                    </div>
                </div>
                {deleteButton(loggedIn)}
                <span className='expand-button' onClick={() => setIsExpanded(!isExpanded)}>
                    <img src={minIcon} alt="expand" className='expand-icon'/>
                </span>
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