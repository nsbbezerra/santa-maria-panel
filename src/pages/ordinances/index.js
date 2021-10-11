import React from "react";
import {
  Center,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Store from "./ordinances";
import ListOrdinances from "./list";

export default function OrdinancesIndex() {
  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          PORTARIAS
        </Text>
      </Center>

      <Tabs mt={5} variant="enclosed-colored">
        <TabList>
          <Tab _focus={{ outline: "none" }}>LISTAGEM</Tab>
          <Tab _focus={{ outline: "none" }}>CADASTRO</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <ListOrdinances />
          </TabPanel>
          <TabPanel p={0}>
            <Store />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
