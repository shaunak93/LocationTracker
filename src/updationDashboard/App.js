import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import 'whatwg-fetch';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            deviceList : []
        }
        this.fetchData();
        
    }
    
    fetchData = () => {
        fetch("http://localhost:3000/get")
            .then((resp) => resp.json())
            .then(data => this.setState({deviceList:data.deviceList}))
            .catch(err => {})
    }
    
    
    handleLocationChange = (id,e) =>{
        // console.log(e.target.value);
        let dl = this.state.deviceList;
        dl[id-1].deviceLocation = e.target.value;
        this.setState({deviceList : dl});
    }
    handleStatusChange = (id) => {
        let dl = this.state.deviceList;
        dl[id-1].isOnline = !dl[id-1].isOnline;
        console.log(dl[id-1]);
        this.setState({deviceList : dl});
    }
    
    onSubmit = (id) =>{
        console.log(id);
        fetch("http://localhost:3000/updateDevice",{
                method : 'post',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify(this.state.deviceList[id-1])
            })
            .then(function (response) {
                this.setState({deviceList:response.json()})
            })
            .catch(err => {
        
            })
    }
    
  render() {
    return (
        <MuiThemeProvider>

            <div className="App">

                <div style={{margin:"50px"}}>
                    <Divider  />
                    {this.state.deviceList.map(device => {
                        return <div>
                            <form style={{margin:'10px'}} >
                                ID: {device.deviceId}
                                <br/>
                                Name: {device.deviceName}
                                <br/>
                                <label>
                                    Location:
                                    <textarea defaultValue={device.deviceLocation} onChange={this.handleLocationChange.bind(this,device.deviceId)} />
                                </label>
                                <br/>
                                <select value={device.isOnline} onChange={this.handleStatusChange.bind(this,device.deviceId)}>
                                    <option value={true}>Online</option>
                                    <option value={false}>Offline</option>
                                </select>
                                <br/>
                            </form>
                            <button  onClick={this.onSubmit.bind(this,device.deviceId)}>Update</button>

                            <Divider  />
                        </div>
                    })}
                </div>
            </div>
        </MuiThemeProvider>
                );
  }
}

export default App;
