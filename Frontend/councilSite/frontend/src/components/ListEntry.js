import './styles/ListEntry.css'
import { useState, useContext, useEffect } from 'react'
import expanndIcon from './assets/expand-icon.png'
import minIcon from './assets/mini-icon.png'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { APILINK, LoginContext, PotholeContext } from './App'

function ListEntry(props) {

    const [_, setPotholeList] = useContext(PotholeContext)
    const [potholelocation, setPotholeLocation] = useState()
    
    useEffect(() => {
        if (props.pothole && props.pothole.location) {
            const [latitude, longitude] = props.pothole.location.split('; ');
    
            // Reverse geocoding to get address from coordinates
            axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => {
                const address = response.data;
                const fulladdress = (`${address.address.road}, ${address.address.postcode}`)
                setPotholeLocation(fulladdress);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, [props.pothole]);
    
    

    function deleteButton(bool) {
        if (bool) {
            return (<span className='delete-button' onClick={deleteAlert}>Delete</span>)
        } else {
            return <div hidden></div>
        }
    }

    function deleteCleanup() {
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
    }

    function deleteAlert() {
        let ID = props.pothole._id
        const  killPothole = async () => {
            const response = await fetch(
                `${APILINK}pothole/deletePothole/${ID}`,
                {
                    method: 'DELETE'
                }
            )
            const data = await response.json()
        }
        killPothole()
        deleteCleanup()
        window.alert("Pothole deleted.")
        window.location.reload()
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
            <div className='list-entry expanded' id={props.id}>
                <div className="image-container">
                    <img src={`http://localhost:8800/api/file/${props.pothole.image}`} alt="pothole" className='pothole-image'/>
                </div>
                <div className='description-box'>
                    <div className='pothole-location'>
                        Location: {potholelocation}
                    </div>
                    <div className='pothole-details'>
                        <video className="pothole-video" controls>
                            <source 
                            src={`http://localhost:8800/api/file/${props.pothole.video}`} 
                            />
                        </video>
                        <div className='pothole-severity'>
                            {severity(props.pothole.repairment_needed)}
                        </div>
                    </div>
                </div>
                <div className='util-buttons'>
                    <span className='expand-button' onClick={() => setIsExpanded(!isExpanded)}>
                        <img src={minIcon} alt="expand" className='expand-icon'/>
                    </span>
                    {deleteButton(loggedIn)}
                </div>
            </div>
        );
    } else {
        return (
            <div className='list-entry compact' id={props.id}>
                <img src={`http://localhost:8800/api/file/${props.pothole.image}`} alt="pothole" className='pothole-image'/>
                <div className='pothole-location'>
                    Location: {potholelocation}
                </div>
                <span className='expand-button' onClick={() => setIsExpanded(!isExpanded)}>
                    <img src={expanndIcon} alt="expand" className='expand-icon'/>
                </span>
            </div>
        );
    }
}

export default ListEntry;