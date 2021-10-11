import React from "react";
import { Flex, Image } from "@chakra-ui/react";

import Logo from "../assets/logo.svg";

export default function IndexPage() {
  return (
    <>
      <Flex h="100%" justify="center" align="center">
        <Image src={Logo} w="50%" userSelect="none" draggable={false} />
      </Flex>
    </>
  );
}
