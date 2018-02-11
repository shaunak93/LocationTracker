import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import updationDashboard from './updationDashboard/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";

//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();



const BasicExample = () => (
  <Router>
      <div>
          <Route exact path="/" component={App} />
          <Route path="/updationDashboard" component={updationDashboard} />


    </div>
  </Router>
);

ReactDOM.render(<BasicExample />, document.getElementById('root'));
registerServiceWorker();

//export default BasicExample;