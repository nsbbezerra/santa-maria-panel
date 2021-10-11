import React, { useState, useEffect } from "react";
import {
  Center,
  Text,
  Grid,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import {
  AiFillSave,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineCheck,
} from "react-icons/ai";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";

import { route, api } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";

registerLocale("pt_br", pt_br);

export default function Publications() {
  const toast = useToast();
  const { data, error } = useFetch("/publications");
  const [showPdf, setShowPdf] = useState(false);
  const [initDate, setInitDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [pdf, setPdf] = useState("");
  const [title, setTitle] = useState("");
  const [archive, setArchive] = useState("");

  const [publications, setPublications] = useState([]);

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" isReadOnly />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function clear() {
    setPdf("");
    setInitDate(new Date());
    setTitle("");
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

  useEffect(() => {
    if (data) {
      setPublications(data.publication);
    }
  }, [data]);

  if (error) {
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

  const save = async () => {
    if (title === "") {
      showToast("Insira um título", "warning", "Atenção");
      return false;
    }
    if (pdf === "") {
      showToast("Insira um link para arquivo PDF", "warning", "Atenção");
      return false;
    }
    setLoading(true);

    try {
      const response = await api.post("/publications", {
        title,
        date: initDate,
        file: pdf,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      clear();
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

  const handleArchive = async (id) => {
    const result = await data.publication.find((obj) => obj._id === id);
    setArchive(result.file);
    setShowPdf(true);
  };

  const removePublication = async (id) => {
    setLoadingDel(true);

    try {
      const response = await api.delete(`/publications/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      setLoadingDel(false);
      const updated = await data.publication.filter((obj) => obj._id !== id);
      setPublications(updated);
    } catch (error) {
      setLoadingDel(false);
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

  async function search() {
    let publis = [];
    await data.publication.map((publi) => {
      const publiDate = new Date(publi.date);
      if (
        publiDate.getDate() === date.getDate() &&
        publiDate.getMonth() === date.getMonth() &&
        publiDate.getFullYear() === date.getFullYear()
      ) {
        publis.push(publi);
      }
    });
    setPublications(publis);
  }

  return (
    <>
      <Center rounded="md" bg="green.500" p={1}>
        <Text color="white" fontWeight="bold" fontSize="lg">
          PUBLICAÇÕES DIÁRIO OFICIAL
        </Text>
      </Center>

      <Grid templateColumns="330px 1fr" gap={7} mt={10}>
        <Box
          borderWidth="2px"
          rounded="md"
          p={3}
          borderColor="blue.500"
          shadow="md"
        >
          <FormControl isRequired>
            <FormLabel>Título</FormLabel>
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={3}>
            <FormLabel>Data da Publicação</FormLabel>
            <DatePicker
              selected={initDate}
              onChange={(date) => setInitDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
              calendarClassName="calendar"
              showPopperArrow={false}
            />
          </FormControl>
          <FormControl isRequired mt={3}>
            <FormLabel>Link para o Arquivo PDF</FormLabel>
            <Input
              placeholder="Link para o arquivo"
              value={pdf}
              onChange={(e) => setPdf(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            leftIcon={<AiFillSave />}
            isFullWidth
            mt={3}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            size="lg"
            isLoading={loading}
            onClick={() => save()}
          >
            Salvar
          </Button>
        </Box>
        <Box>
          <Flex justify="flex-end">
            <HStack>
              <Text w="230px" fontSize="sm" noOfLines={1}>
                BUSCAR POR DATA:
              </Text>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
                calendarClassName="calendar"
                showPopperArrow={false}
              />
              <Button
                leftIcon={<AiOutlineSearch />}
                colorScheme="blue"
                w="150px"
                onClick={() => search()}
              >
                Buscar
              </Button>
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                variant="outline"
                w="150px"
                onClick={() => setPublications(data.publication)}
              >
                Limpar
              </Button>
            </HStack>
          </Flex>
          <Divider mt={5} mb={5} />
          <Grid templateColumns="repeat(3, 1fr)" gap={5}>
            {publications.map((pub) => (
              <Box
                borderWidth="1px"
                rounded="md"
                overflow="hidden"
                p={2}
                key={pub._id}
                h="min-content"
              >
                <Flex align="center" justify="center">
                  <Text mb={2} textAlign="center" fontWeight="semibold">
                    {pub.title}
                  </Text>
                </Flex>
                <Text textAlign="center" fontWeight="light" fontSize="sm">
                  {format(new Date(pub.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: pt_br,
                  })}
                </Text>

                <Divider mt={3} mb={3} />
                <HStack>
                  <Button
                    isFullWidth
                    leftIcon={<AiOutlineSearch />}
                    colorScheme="green"
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(1)" }}
                    onClick={() => handleArchive(pub._id)}
                    size="xs"
                  >
                    Visualizar
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        colorScheme="red"
                        leftIcon={<AiOutlineClose />}
                        isFullWidth
                        _hover={{ transform: "scale(1.02)" }}
                        _active={{ transform: "scale(1)" }}
                        size="xs"
                      >
                        Excluir Publicação
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent _focus={{ outline: "none" }} shadow="lg">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmação!</PopoverHeader>
                      <PopoverBody>Deseja excluir esta publicação?</PopoverBody>
                      <PopoverFooter d="flex" justifyContent="flex-end">
                        <Button
                          colorScheme="green"
                          leftIcon={<AiOutlineCheck />}
                          size="sm"
                          isLoading={loadingDel}
                          onClick={() => removePublication(pub._id)}
                        >
                          Sim
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>

      <Modal
        isOpen={showPdf}
        onClose={() => setShowPdf(false)}
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
              <embed src={archive} style={{ width: "100%", height: "100%" }} />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
