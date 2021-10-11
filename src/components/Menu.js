import React, { useState, useEffect } from "react";
import {
  HStack,
  Icon,
  Button,
  Flex,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  AiFillHome,
  AiOutlineSave,
  AiOutlineVideoCamera,
  AiOutlineCloudServer,
} from "react-icons/ai";
import { GiDesk } from "react-icons/gi";
import { IoNewspaper, IoCalendarSharp } from "react-icons/io5";
import { IoIosImages, IoIosArrowDown } from "react-icons/io";
import { RiMailSendFill, RiPagesFill } from "react-icons/ri";
import { ImOffice } from "react-icons/im";
import { useHistory } from "react-router-dom";

export default function MenuApp() {
  const toast = useToast();
  const { push } = useHistory();
  const [route, setRoute] = useState("");

  function goTo(rt) {
    push(rt);
  }

  async function findRoute() {
    const route = await localStorage.getItem("route");
    if (route) {
      setRoute(route);
    } else {
      setRoute("");
    }
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
      isClosable: true,
    });
  }

  async function saveRoute() {
    await localStorage.setItem("route", route);
    showToast(
      "Rota salva com sucesso, para que as configurações tenham efeito reinicie o sistema",
      "success",
      "Sucesso"
    );
  }

  useEffect(() => {
    findRoute();
  }, []);

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
        </HStack>

        <Flex justify="center" direction="column" h="100%" w="18%">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                leftIcon={<AiOutlineCloudServer />}
                colorScheme="green"
                _hover={{ transform: "scale(1.05)" }}
                _active={{ transform: "scale(1)" }}
              >
                Conexão com Servidor
              </Button>
            </PopoverTrigger>
            <PopoverContent _focus={{ outline: "none", shadow: "lg" }}>
              <PopoverHeader fontWeight="semibold">
                Rota de Conexão
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Input
                  size="sm"
                  rounded="md"
                  bg="whiteAlpha.900"
                  focusBorderColor="green.500"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                />
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button
                    colorScheme="green"
                    size="sm"
                    leftIcon={<AiOutlineSave />}
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(1)" }}
                    onClick={() => saveRoute()}
                    w="100px"
                  >
                    Salvar
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
    </>
  );
}
