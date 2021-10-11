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
import News from "./news";
import ListNews from "./list";

export default function NewsIndex() {
  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          NOTÍCIAS
        </Text>
      </Center>

      <Tabs mt={5} variant="enclosed-colored">
        <TabList>
          <Tab _focus={{ outline: "none" }}>LISTAGEM</Tab>
          <Tab _focus={{ outline: "none" }}>CADASTRO</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <ListNews />
          </TabPanel>
          <TabPanel p={0}>
            <News />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
