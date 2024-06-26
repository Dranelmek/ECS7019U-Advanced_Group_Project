import './styles/Potholes.css'
import ListEntry from './ListEntry';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PotholeContext } from './App';

function Potholes() {
/**
 * Parent component for list-entries.
 * Displays all potholes in an expandable list.
 * Allows logged in users to delete potholes.
 */

    const [CFA, setCFA] = useState(0)
    const [potholeList, _] = useContext(PotholeContext)
    
    // Setup to not display more than 5 potholes on the first page load.
    useEffect(() => {
        if (potholeList.length > 5) {
            setCFA(5)
        } else {
            setCFA(potholeList.length)
        }
    }, [potholeList])

    // Allows user to view different numbers of holes.
    function changeListSize(size) {
        if (potholeList.length < size || potholeList.length == 1) {
            return (
                <div hidden>
                </div>
            );
            
        } else if (size <= 5) {
            return (
                <div className='show-more alone'>
                    <Link onClick={showMore}>Show more</Link>
                </div>
            );
            
        } else if (potholeList.length == size) {
            return (
                <div className='show-less alone'>
                        <Link onClick={showLess}>Show less</Link>
                </div>
            );
        } else {
            return (
                <div className='show-less-all'>
                    <div className='show-less'>
                        <Link onClick={showLess}>Show less</Link>
                    </div>
                    <div className='show-all'>
                        <Link onClick={showAll}>Show all</Link>
                    </div>
                </div>
            );
        }
    }

    function showMore() {
        if (potholeList.length >= 10) {
            setCFA(10)
        } else {
            setCFA(potholeList.length)
        }
        
    }

    function showLess() {
        setCFA(5)
    }

    function showAll() {
        setCFA(potholeList.length)
    }

    // Handling for empty pothole list.
    function noHoles() {
        if (potholeList.length < 1) {
            return(
                <div className='no-holes'>
                <p>No Potholes Detected</p>
                </div>
            )
        } else {
            return(
                <div className='List-container'>
                {holes}
                {changeListSize(CFA)}
                </div>
            )
        }
    }
    
    // Component loop that displays all potholes.
    let holes = [...Array(CFA)].map((value, index) => (
        <ListEntry id={index} pothole={potholeList[index]}/>
    ));

    return(
        <header className='List-header'>
            <div className='List-container'>
            {noHoles()}
            </div>
        </header>
    );
}

export default Potholes