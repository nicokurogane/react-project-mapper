import React, { Component } from 'react';
import mapKey from './MapConfig';

import '../components/map.css'

class Map extends Component {

    onScriptLoad = () => {
        const map = new window.google.maps.Map(
            document.getElementById(this.props.id),
            this.props.options
        );
        this.props.onMapLoad(map);
        map.addListener('click', e => {
            if (!this.props.addMarkerModeFlag) return;

            let newLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            this.addMarkerToMap(map, newLatLng);
            this.props.onShowInfoForm(newLatLng);
        })
    }

    addMarkerToMap(map, markerLatLng) {
        let newMarker = new window.google.maps.Marker({
            position: markerLatLng,
            map,
            title: 'Otro Marker'
        });

        newMarker.addListener('click', e => {
            this.props.onMarkerClick(e, map, 'Marcador creado');
        });
        this.props.onMarkerAdded(newMarker);
    }

    componentDidMount() {
        if (!window.google) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = mapKey;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            // Below is important. 
            //We cannot access google.maps until it's finished loading
            s.addEventListener('load', e => {
                this.onScriptLoad()
            })
        } else {
            this.onScriptLoad();
        }
    }
    // this.props.addMarkerModeFlag esta bandera se activa cuando se da click a "agregar"
    render() {
        return (
            <div className="map-div" id={this.props.id} />
        );
    }
}

export default Map;