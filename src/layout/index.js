import React from "react";
import { Grid, Box } from "@chakra-ui/react";
import MenuApp from "../components/Menu";
import Routes from "../routes/index";

export default function Layout() {
  return (
    <>
      <Grid templateRows="75px 1fr" w="100vw" h="100vh">
        <MenuApp />

        <Box h="100%" overflow="auto" maxH="100%" p={6}>
          <Routes />
        </Box>
      </Grid>
    </>
  );
}
