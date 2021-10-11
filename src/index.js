import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.Fragment>
    <ColorModeProvider options={{ useSystemColorMode: false }}>
      <ColorModeScript initialColorMode="light" />
      <App />
    </ColorModeProvider>
  </React.Fragment>,
  document.getElementById("root")
);
