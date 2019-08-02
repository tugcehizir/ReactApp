import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import Page from "./Page";

import "./styles.css";
import "./reset.css";

const App = () => (
  <Provider store={store}>
    <Page />
  </Provider>
);

render(<App />, document.getElementById("root"));
