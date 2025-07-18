import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Component } from "react";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return <>
  <Provider store={store}>
 
  <Component {...pageProps} />;
  
  
  </Provider>
  </>
  
}

