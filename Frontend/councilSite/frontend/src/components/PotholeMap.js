import './styles/PotholeMap.css';
import GoogleMapReact from 'google-map-react'

function PotholeMap() {

    const defaultProps = {
        center: {
          lat: 51.5205,
          lng: -0.0375
        },
        zoom: 15
    };

    return (
        <header className="Map-header">
            <div className="Map-container">
                <div className="Map-wrapper">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyAi-NmWDRv39zsehqwfUC1k-8Uagat5Jyk" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >

                    </GoogleMapReact>
                </div>
            </div>
        </header>
    );
}

export default PotholeMap;