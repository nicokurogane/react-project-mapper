import React, { Component } from 'react';
import { render } from 'react-dom';
import MapHeader from './components/MapHeader';
import Map from './components/Map';
import InfoWindow from './components/InfoWindow';
import firestoreDb from './firebase/firebaseconfig.js';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import './css/markerform.css'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      isAddMarkerMode: false,
      showMarkerForm: false,
      formMarkerControls: {
        proyectName: "",
        proyectDescription: "",
        lat: 0.0,
        lng: 0.0
      },
    }
  }

  changeAddMarkerMode = () => {
    this.setState({
      isAddMarkerMode: !this.state.isAddMarkerMode
    })
  }

  addMarkerToCache = (newMarker) => {
    this.setState({
      markers: [...this.state.markers, newMarker],
    })
  }

  cancelAddProyectMarker = () => {
    this.handleModalClose();
    let { markers } = this.state;
    var lastAddedMarker = markers.pop();
    this.setState({
      markers: this.state.markers.filter(markerOnMap => markerOnMap !== lastAddedMarker)
    });
    lastAddedMarker.setMap(null);
  }

  handleModalClose = () => {
    this.setState({ showMarkerForm: false });
  }

  handleModalShow = () => {
    this.setState({ showMarkerForm: true });
  }

  //TODO CHANGE TO MODAL INFO WINDOW
  createMarkerInfoWindow(e, map, title) {
    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div id="infoWindow" />',
      position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    })
    infoWindow.addListener('domready', e => {
      render(<InfoWindow title={title} />, document.getElementById('infoWindow'))
    })
    infoWindow.open(map)

  }

  showProyectInfoForm = (inputLatLng) => {
    this.handleModalShow();
    this.changeAddMarkerMode();
    this.setState({
      formMarkerControls: {
        ...this.state.formMarkerControls,
        lat: inputLatLng.lat,
        lng: inputLatLng.lng
      }
    });
  }

  /*---------------------------------
    Basically, we want the React state component to be the source of truth, so we're going
    to take advantage of the state by saving the values of the form to the marker
  */
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    /* usamos un campo calculado para guardar el valor del campo correspondiente, ademas de desempaquetar el estado actual de formMarkerControls. 
       - si no desempaquetamos el estado actual, borraremos los datos anteriores y solo se guardara el campo calculado.
       - si solo desempaquetamos y no guardamos el dato del campo, el usuario no podra
         hacer un cambio cada vez que se invoque esta funcion, ya que se guardara lo que se inicializo    */
    this.setState({
      formMarkerControls: {
        ...this.state.formMarkerControls,
        [name]: value
      }
    });
  }

  //TODO: ADD form validation
  handleSubmit = (event) => {
    console.log("submit info from Form:");
    event.preventDefault();
    //we'll add timtestamp for recording reasons.
    let infoToAdd = { ...this.state.formMarkerControls, timestamp: Date.now() };
    console.log(infoToAdd);
    this.insertProyectInfoToDatabase('marker', infoToAdd);
  }

  //insert marker 
  insertProyectInfoToDatabase(collectionToAdd, newMarker) {
    firestoreDb.collection(collectionToAdd).add(newMarker)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        this.handleModalClose();
        this.setState({
          formMarkerControls: {
            proyectName: "",
            proyectDescription: "",
            lat: 0.0,
            lng: 0.0
          }
        })
      }).catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <div className="App">
        <MapHeader
          onAddMarker={this.changeAddMarkerMode}
          addMarkerModeFlag={this.state.isAddMarkerMode} />

        <Map
          id="myMap"
          options={{
            center: { lat: 13.7265, lng: -88.8653 },
            zoom: 9
          }}
          onMapLoad={map => {
            //primero extraemos los datos de los marcadores  
            firestoreDb.collection("marker").get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  let markerToAdd = new window.google.maps.Marker({
                    position: { lat: doc.data().lat, lng: doc.data().lng },
                    map: map,
                    animation: window.google.maps.Animation.DROP,
                    title: doc.data().proyectName
                  });

                  markerToAdd.addListener('click', e => {
                    this.createMarkerInfoWindow(e, map, doc.data().proyectName)
                  });

                  this.addMarkerToCache(markerToAdd);
                });
              })
              .catch(error => {
                console.log("Error getting documents: ", error);
              })
          }}
          onMarkerClick={this.createMarkerInfoWindow}
          onShowInfoForm={this.showProyectInfoForm}
          onMarkerAdded={this.addMarkerToCache}
          addMarkerModeFlag={this.state.isAddMarkerMode}
          cancelLastAddedMarkerFlag={this.state.cancelLastAddedMarker}
        />

        <Modal show={this.state.showMarkerForm} onHide={this.cancelAddProyectMarker}>
          <Modal.Header closeButton>
            <Modal.Title>Agrega la informacion del Proyecto</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="formMarkerLat">
                  <Form.Label>Latitud</Form.Label>
                  <Form.Control
                    type="text"
                    name="lat"
                    placeholder="Latitud"
                    value={this.state.formMarkerControls.lat}
                    onChange={this.handleInputChange}
                    disabled />
                </Form.Group>

                <Form.Group as={Col} controlId="formMarkerLng">
                  <Form.Label>Longitud</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Longitud"
                    value={this.state.formMarkerControls.lng}
                    onChange={this.handleInputChange}
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Group>
                <Form.Label>Nombre del Proyecto</Form.Label>
                <Form.Control
                  type="text"
                  name="proyectName"
                  placeholder="Latitud"
                  value={this.state.formMarkerControls.proyectName}
                  onChange={this.handleInputChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Acerca del Proyecto</Form.Label>
                <Form.Control
                  type="text"
                  name="proyectDescription"
                  placeholder="Longitud"
                  value={this.state.formMarkerControls.proyectDescription}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <div className="marker-form-footer">
                <Button variant="primary" type="submit">Submit</Button>
                <Button variant="secondary" onClick={this.cancelAddProyectMarker}>Cancel</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default App;
