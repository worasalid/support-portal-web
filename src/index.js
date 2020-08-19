import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Test from './Page/test';




ReactDOM.render(
  <React.StrictMode>
    {/* <div>
      <b>Components and Props</b>
      <div>
        <Test.default />
      </div>

    </div>
    <div>
      <b>Handling Events</b>&nbsp;&nbsp;&nbsp;
      <Test.ActionLink /> &nbsp;&nbsp;&nbsp;
      <Test.Toggle /> &nbsp;&nbsp;&nbsp;
      <Test.LoggingButton />
    </div>
    <div style={{ marginTop: 50 }}>
      <b>Conditional Rendering</b>
      <Test.Greeting isLoggedIn={true} />
      <Test.LoginControl />
    </div>
    <div style={{ marginTop: 50 }}>
      <b>Lists and Keys</b>
      <ul><Test.ListItem /></ul>
    </div> */}
<App/>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
