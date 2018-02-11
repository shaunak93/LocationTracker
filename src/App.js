import React, { Component } from 'react';
import Websocket from 'react-websocket';
//import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionList from 'material-ui/svg-icons/action/list';
import DeviceDrawer from './components/DeviceDrawer'

class App extends Component {
    
  constructor(props){
      super(props);
      this.state = {
          isDrawerOpen: false,
          deviceList:[{deviceName:"Device1",deviceId:1,deviceLocation:'12.924025, 77.672938',deviceLocationHistory:['12.924025, 77.674','12.924025, 77.673'],isOnline:false}
                        ,{deviceName:"Device2",deviceId:2,deviceLocation:'12.924025, 77.672938',deviceLocationHistory:['12.924025, 77.674','12.924025, 77.673'],isOnline:true}],
          //deviceList:[],
          selectedId: null
          
      }
  }
  
  componentDidMount = () => {
        window.initMap = this.initMap;
        this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD7BzO-CIAeVpISd5cv3ZoOnb7YnZ9iHXs&callback=initMap')
    }
    
    // load maps javascript
    loadJS = (src) => {
        var ref = window.document.getElementsByTagName("script")[0];
        var script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }
    
    //init map 
    initMap = function(){
    
        window.directionsService = new window.google.maps.DirectionsService;
        window.directionsDisplay = new window.google.maps.DirectionsRenderer
        var bengaluru = {lat:12.924025, lng:77.672938};
        window.map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: bengaluru
        });
        window.directionsDisplay.setMap(window.map);
    
    
    }

    // handler for floating button to open drawer
  toggleDrawer = () => {
      this.setState({isDrawerOpen:true});
  }
  
  //handler for menuitem click in side drawer
  itemClicked = (id) => {
      this.setState({selectedId:id,isDrawerOpen:false});
      this.updateMap(id);
      
  }
  
  //handler for incoming data on websocket
  incomingData = (data) =>{
      let result = JSON.parse(data);
      this.setState({deviceList:result});
      if(this.state.selectedId){
          this.updateMap(this.state.selectedId)
      }
  }
  
  
  // update map with location of passed device (id)
  updateMap = (id) => {
      if(window.marker){
          window.marker.setMap(null);
      }
      if(window.directionsDisplay){
          window.directionsDisplay.setDirections(null);
          window.directionsDisplay.setMap(null);
      }
      if(this.state.deviceList[id-1].isOnline && this.state.deviceList[id-1].deviceLocationHistory.length > 0 ){
          this.setMapsRoute(id);
      }
      else{
          this.setMapsMarkers(id);
      }
  }
  
  // set marker on map if device is offline or fixed at a location
  setMapsMarkers = (id) =>{
      if(this.state.deviceList.length === 0 || window.map == null)return;
      let location = this.state.deviceList[id-1].deviceLocation.split(',');
      window.marker = new window.google.maps.Marker({
        position: {lat:Number(location[0]),lng:Number(location[1])},
        map: window.map
      });
      
  }
  
  // set route on map if device is online and is moving
  setMapsRoute = (id) => {
      if(this.state.deviceList[id-1].deviceLocationHistory.length === 0)return;
      
          let destination = this.state.deviceList[id-1].deviceLocation;
          let deviceLocationHistory = this.state.deviceList[id-1].deviceLocationHistory;
          let waypts = [];
        for (var i = 1; i < deviceLocationHistory.length; i++) {
            waypts.push({
              location: deviceLocationHistory[i],
              stopover: true
            });
      
        }
        window.directionsDisplay.setMap(window.map);
        window.directionsService.route({
          origin: deviceLocationHistory[0],
          destination: destination,
          waypoints: waypts,
          optimizeWaypoints: false,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            window.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      
  }
  
      
  render() {
    return (
        <MuiThemeProvider>
            <div className="App">
                <DeviceDrawer open={this.state.isDrawerOpen}
                    toggleDrawer={this.toggleDrawer} 
                    deviceList={this.state.deviceList} 
                    selectedId={this.state.selectedId} 
                    itemClicked={this.itemClicked}/>
                <FloatingActionButton className= "openDrawerButton" onClick={this.toggleDrawer}>
                    <ActionList />
                </FloatingActionButton>
                {(this.state.selectedId)?
                    <div className="deviceInfoBox">
                        <span className="deviceInfoSpan">{(this.state.selectedId)?this.state.deviceList[this.state.selectedId-1].deviceName:"None"}</span>
                    </div>
                :null
                }
                <div className="map" ref="map" id="map"></div>
                {/* <script async defer
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7BzO-CIAeVpISd5cv3ZoOnb7YnZ9iHXs&callback=initMap">
                </script> */}
                <Websocket url='ws://localhost:40511'
                    onMessage={this.incomingData.bind(this)}/>
            </div>

        </MuiThemeProvider>
    );
  }
}

export default App;
