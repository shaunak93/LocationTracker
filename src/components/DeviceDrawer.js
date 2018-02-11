import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
export default class DeviceDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        open: false,
        deviceList:props.deviceList
    }
  }
  
  componentWillReceiveProps(nextProps){
  }
  
  onMenuItemClick = (id) =>{
      this.props.itemClicked(id)
  }

  render() {
      //let deviceList = this.state.deviceList || [];
      var MenuItemStyle = {
            "WebkitBoxSizing": "content-box",
            "MozBoxSizing": "content-box",
            "boxSizing": "content-box",
            "width": "-webkit-fill-available",
            "height": "50",
            "border": "none",
            //"WebkitBorderRadius": "5px",
            "borderRadius": "5px",
            "font": "normal 16px/1 \"Times New Roman\", Times, serif",
            "textAlign": "center",
            "OTextOverflow": "ellipsis",
            "textOverflow": "ellipsis",
            "margin": "3px 3px"
          }
          
       var ItemOnlineStyle = {
           "color": "#E0F2F1",
           "backgroundColor":"#009688"
       }
       
       var ItemOfflineStyle = {
           "color": "#607D8B",
           "backgroundColor":"#ECEFF1"
       }
       
       var selected = {
           "WebkitBoxShadow": "0 1px 18px 3px rgba(0,0,0,0.91) inset",
           "boxShadow": "0 1px 18px 3px rgba(0,0,0,0.91) inset"
       } 
       
       
       return (
          <div>
              <Drawer containerStyle={{"backgroundColor":"#BBDEFB","opacity":"0.9"}}open={this.props.open}>
                  {this.props.deviceList.map((device) => {
                      return <MenuItem key={device.deviceId} style={{...MenuItemStyle,...(device.isOnline)?ItemOnlineStyle:ItemOfflineStyle,...(device.deviceId === this.props.selectedId)?selected:{}}} innerDivStyle={{padding:'16px'}} onClick={this.onMenuItemClick.bind(this,device.deviceId)}>{device.deviceName}</MenuItem>
                  })}
              </Drawer>
          </div>
    );
  }
}