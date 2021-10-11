import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  useToast,
  Icon,
  HStack,
  Heading,
  Divider,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { api, route } from "../../configs/axios";
import Parse from "html-react-parser";
import { FaFilePdf, FaTrash } from "react-icons/fa";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineCheck,
  AiOutlineSearch,
} from "react-icons/ai";
import useFetch from "../../hooks/useFetch";

export default function ListOrdinances() {
  const toast = useToast();
  const [secretary_id, setSecretary_id] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const { data, error } = useFetch(
    `/ordinances/${secretary_id === "" ? "all" : secretary_id}/${page}`
  );

  const [secretaries, setSecretaries] = useState([]);

  const [modalView, setModalView] = useState(false);

  const [ordinances, setOrdinances] = useState([]);

  const [pdf, setPdf] = useState("");

  const [loading, setLoading] = useState(false);

  async function findSecretary() {
    try {
      const response = await api.get("/secretaries");
      if (response.data.length) {
        setSecretary_id(response.data[0]._id);
        setSecretaries(response.data);
      }
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  }

  useEffect(() => {
    findSecretary();
  }, []);

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

  useEffect(() => {
    if (data) {
      setOrdinances(data.ordinance);
      handlePagination(data.count);
    }
  }, [data]);

  function handlePagination(num) {
    const divisor = parseFloat(num) / 12;
    if (divisor > parseInt(divisor) && divisor < parseInt(divisor) + 1) {
      setPages(parseInt(divisor) + 1);
    } else {
      setPages(parseInt(divisor));
    }
  }

  if (error) {
    if (secretary_id !== "") {
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  }

  function handlePdf(id) {
    const result = ordinances.find((obj) => obj._id === id);
    setPdf(result.file);
    setModalView(true);
  }

  const del = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/ordinances/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      const updated = await data.ordinance.filter((obj) => obj._id !== id);
      setOrdinances(updated);
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  };

  return (
    <>
      <Grid templateColumns="280px 1fr" gap={5} mt={10}>
        <Box borderRightWidth="1px" pr={3}>
          <FormControl>
            <FormLabel>Selecione uma Secretaria</FormLabel>
            <RadioGroup
              colorScheme="blue"
              pl={5}
              value={secretary_id}
              onChange={(e) => setSecretary_id(e)}
            >
              <Stack>
                {secretaries.map((sec) => (
                  <Radio key={sec._id} value={sec._id}>
                    {sec.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>

        <Box>
          <Grid templateColumns="1fr" gap={5}>
            {ordinances.map((ord) => (
              <Box borderWidth="1px" p={5} rounded="md" key={ord._id}>
                <HStack spacing={10} align="flex-start">
                  <Icon as={FaFilePdf} fontSize="5xl" />
                  <Box>
                    <Heading fontSize="3xl">{ord.title}</Heading>
                    <div id="news-container">{Parse(ord.description)}</div>
                    <Divider mt={5} mb={5} />
                    <ButtonGroup spacing={5}>
                      <Button
                        leftIcon={<AiOutlineSearch />}
                        colorScheme="blue"
                        onClick={() => handlePdf(ord._id)}
                      >
                        Visualizar
                      </Button>
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Button
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="outline"
                          >
                            Excluir
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          _focus={{ outline: "none", shadow: "lg" }}
                        >
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Confirmação!</PopoverHeader>
                          <PopoverBody>
                            Deseja excluir esta publicação?
                          </PopoverBody>
                          <PopoverFooter d="flex" justifyContent="flex-end">
                            <Button
                              size="sm"
                              colorScheme="green"
                              leftIcon={<AiOutlineCheck />}
                              isLoading={loading}
                              onClick={() => del(ord._id)}
                            >
                              Sim
                            </Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </ButtonGroup>
                  </Box>
                </HStack>
              </Box>
            ))}
          </Grid>
          {ordinances.length !== 0 && (
            <Flex align="center" justify="center" mt={10}>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<AiOutlineArrowLeft />}
                _hover={{ transform: "scale(1.05)" }}
                _active={{ transform: "scale(1)" }}
                isDisabled={page <= page}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Input
                size="sm"
                value={page}
                w="50px"
                rounded="md"
                isReadOnly
                mr={2}
                ml={2}
              />
              <Text fontSize="sm">de</Text>
              <Input
                size="sm"
                value={pages}
                w="50px"
                rounded="md"
                isReadOnly
                ml={2}
                mr={2}
              />
              <Button
                size="sm"
                colorScheme="blue"
                rightIcon={<AiOutlineArrowRight />}
                _hover={{ transform: "scale(1.05)" }}
                _active={{ transform: "scale(1)" }}
                isDisabled={page >= pages}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </Button>
            </Flex>
          )}
        </Box>
      </Grid>

      <Modal
        isOpen={modalView}
        onClose={() => setModalView(false)}
        scrollBehavior="inside"
        size="6xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent h="89vh">
          <ModalHeader>Visualizar PDF</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} h="100%">
            <Box roundedBottom="md" overflow="hidden" h="100%">
              <embed
                src={`${route}/docs/${pdf}`}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
