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
import Bids from "./bids";
import List from "./list";

export default function BidsIndex() {
  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          LICITAÇÕES E EDITAIS
        </Text>
      </Center>

      <Tabs mt={5} variant="enclosed-colored">
        <TabList>
          <Tab _focus={{ outline: "none" }}>LISTAGEM</Tab>
          <Tab _focus={{ outline: "none" }}>CADASTRO</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <List />
          </TabPanel>
          <TabPanel p={0}>
            <Bids />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
