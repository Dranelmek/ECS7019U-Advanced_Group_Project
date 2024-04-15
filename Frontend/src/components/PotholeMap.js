import './styles/PotholeMap.css';
import GoogleMapReact from 'google-map-react'
import { useState, useEffect, useContext } from 'react';
import { PotholeContext, APILINK } from './App';
import warning from "./assets/035-pothole.png";
import m1 from './assets/marker_1.png';
import m2 from './assets/marker_2.png';
import m3 from './assets/marker_3.png';

function PotholeMap() {
/**
 * Pothole Map page that displays a Google map with custom markers at pothole locations.
 */
    const [potholeList, setPotholeList] = useContext(PotholeContext)
    
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
    }, []);
    
    // Initial center of the map.
    const defaultProps = {
        center: {
            lat: 51.45288660799587,
            lng: 0.1659655873913353
        },
        zoom: 13
    };

    // Parsing location data string.
    function latLongSplit(coordinates) {
        return String(coordinates).split(";")
    }
    
    // Component loop to place all holes onto the map.
    let holes = [...Array(potholeList.length)].map((value, index) => (
        <img 
        id={index} 
        className="location-marker"
        src={warning} 
        alt="HERE!" 
        lat={latLongSplit(potholeList[index]["coordinates"])[0]}
        lng={latLongSplit(potholeList[index]["coordinates"])[1]}
        />
    ));

    return (
        <header className="Map-header">
            <div className="Map-container">
                <div className="Map-wrapper">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyAi-NmWDRv39zsehqwfUC1k-8Uagat5Jyk" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >
                    {holes}
                    </GoogleMapReact>
                </div>
            </div>
        </header>
    );
}

export default PotholeMap;