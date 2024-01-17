import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import "animate.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
export const urlRoot = process.env.REACT_APP_URL_API_ROOT;
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
