import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "./styles/theme";
import { MemoryRouter as Router } from "react-router-dom";
import Layout from "./layout";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/calendar.css";

function App() {
  return (
    <Router>
      <ChakraProvider theme={customTheme} resetCSS>
        <Layout />
      </ChakraProvider>
    </Router>
  );
}

export default App;
