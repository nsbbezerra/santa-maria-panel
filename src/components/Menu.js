import React from "react";
import {
  HStack,
  Icon,
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AiFillHome, AiOutlineVideoCamera } from "react-icons/ai";
import { GiDesk } from "react-icons/gi";
import {
  IoNewspaper,
  IoCalendarSharp,
  IoDesktopOutline,
} from "react-icons/io5";
import { IoIosImages, IoIosArrowDown } from "react-icons/io";
import { RiMailSendFill, RiPagesFill } from "react-icons/ri";
import { ImOffice } from "react-icons/im";
import { useHistory } from "react-router-dom";

export default function MenuApp() {
  const { push } = useHistory();

  function goTo(rt) {
    push(rt);
  }

  return (
    <>
      <Flex
        align="center"
        shadow="lg"
        bg="blue.500"
        pr={3}
        pl={3}
        justify="space-between"
      >
        <HStack spacing={3}>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={AiFillHome} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                INÍCIO
              </Text>
            </Flex>
          </Button>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/desks")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={GiDesk} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                GABINETES
              </Text>
            </Flex>
          </Button>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/news")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={IoNewspaper} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                NOTÍCIAS
              </Text>
            </Flex>
          </Button>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/informatives")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={IoIosImages} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                INFORMATIVOS
              </Text>
            </Flex>
          </Button>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/bids")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={RiPagesFill} fontSize="2xl" />
              <Text
                mt={2}
                fontSize="x-small"
                textAlign="center"
                w="85px"
                wordBreak="break-word"
              >
                LICITAÇÕES
              </Text>
            </Flex>
          </Button>

          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/schedule")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={IoCalendarSharp} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                AGENDA
              </Text>
            </Flex>
          </Button>
          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/secretary")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={ImOffice} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                SECRETARIAS
              </Text>
            </Flex>
          </Button>

          <Button
            h="55px"
            colorScheme="gray"
            variant="solid"
            w="85px"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => goTo("/videos")}
          >
            <Flex justify="center" align="center" direction="column">
              <Icon as={AiOutlineVideoCamera} fontSize="2xl" />
              <Text mt={2} fontSize="x-small">
                VÍDEOS
              </Text>
            </Flex>
          </Button>

          <Menu>
            <MenuButton
              as={Button}
              h="55px"
              colorScheme="gray"
              variant="solid"
              w="85px"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
            >
              <Flex justify="center" align="center" direction="column">
                <Icon as={RiMailSendFill} fontSize="2xl" />
                <Text mt={2} fontSize="x-small">
                  PUBLICAÇÕES <Icon as={IoIosArrowDown} fontSize="xx-small" />
                </Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => goTo("/publications")}>
                DIÁRIO OFICIAL
              </MenuItem>
              <MenuItem onClick={() => goTo("/ordinances")}>PORTARIAS</MenuItem>
              <MenuItem onClick={() => goTo("/decrees")}>DECRETOS</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              h="55px"
              colorScheme="gray"
              variant="solid"
              w="85px"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
            >
              <Flex justify="center" align="center" direction="column">
                <Icon as={IoDesktopOutline} fontSize="2xl" />
                <Text mt={2} fontSize="x-small">
                  SITE <Icon as={IoIosArrowDown} fontSize="xx-small" />
                </Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => goTo("/banner")}>SALVAR BANNER</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </>
  );
}
