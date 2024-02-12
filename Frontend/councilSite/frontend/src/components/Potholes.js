import './styles/Potholes.css'
import ListEntry from './ListEntry';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APILINK } from './App';

function Potholes() {
    
    const [CFA, setCFA] = useState(0)
    const [potholeList, setPotholeList] = useState([0])

    useEffect(() => {
        const  fetchPotholes = async () => {
            const response = await fetch(
                `${APILINK}pothole`,
                {
                    method: 'GET'
                }
            )
            const data = await response.json()
            setPotholeList(data)
        }
        fetchPotholes()
    }, [])

    
    useEffect(() => {
        setCFA(potholeList.length)
        if (potholeList.length > 5) {
            setCFA(5)
        } 
    }, [])

    function changeListSize(size) {
        if (potholeList.length <= size) {
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


    

    let holes = [...Array(CFA)].map((value, index) => (
        <ListEntry id={index} pothole={potholeList[index]}/>
    ));

    return(
        <header className='List-header'>
            {holes}
            {changeListSize(CFA)}
        </header>
    );
}

export default Potholes