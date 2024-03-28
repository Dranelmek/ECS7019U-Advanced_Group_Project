import './styles/Potholes.css'
import ListEntry from './ListEntry';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APILINK, PotholeContext } from './App';

function Potholes() {
    
    const [CFA, setCFA] = useState(0)
    const [potholeList, setPotholeList] = useContext(PotholeContext)
    
    useEffect(() => {
        if (potholeList.length > 5) {
            setCFA(5)
        } else {
            setCFA(potholeList.length)
        }
    }, [potholeList])

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