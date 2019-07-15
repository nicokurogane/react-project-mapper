import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/margins.css';

export default class MapHeader extends Component {

    render() {
        return (
            <>
                <Navbar className="navbar-style">
                    <Navbar.Brand href="#home">Project Mapper</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <ButtonToolbar>
                            <Button className={this.props.addMarkerModeFlag? "":"btn-primary"} 
                                variant={this.props.addMarkerModeFlag ? "danger" : "primary"}
                                onClick={this.props.onAddMarker}>
                                {!this.props.addMarkerModeFlag ? "Add marker" : "Cancel"}
                            </Button>
                        </ButtonToolbar>
                    </Navbar.Collapse>
                </Navbar>
                <div className={`slider center ${this.props.addMarkerModeFlag ? "" : "closed"}`}>
                    <span>
                        Muestranos donde quieres agregar el proyecto.
                    </span>
                </div>
            </>
        );
    }
}