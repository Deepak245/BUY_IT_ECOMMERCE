import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// to link our react with redux provider is needed.
// now to link our store we should import store
import { Provider } from "react-redux";
import store from "./store";

// for alerting system
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
// for more details plese refer to the documentation.
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

// here we are wrapping entire app with Alert Provider.
ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById("root")
);

// rc-slider is the package that helps to get values of the fields
