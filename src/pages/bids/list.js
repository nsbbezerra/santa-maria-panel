import React, { useEffect, useState } from "react";
import {
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Stack,
  Flex,
  Box,
  Button,
  Divider,
  Icon,
  Heading,
  Text,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  HStack,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaFolder,
  FaFilePdf,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { route, api } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";
import { AiOutlineCheck, AiOutlineSearch } from "react-icons/ai";

registerLocale("pt_br", pt_br);

export default function ListBids() {
  const toast = useToast();
  const { data, error } = useFetch("/bids");
  const [initDate, setInitDate] = useState(new Date());
  const [modalPdf, setModalPdf] = useState(false);
  const [bids, setBids] = useState([]);
  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) {
      setBids(data.bid);
    }
  }, [data]);

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

  async function finderClientsBySource(text) {
    setSearch(text);
    if (text === "") {
      await setBids(data.bid);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.bid.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.title.includes(termoBuscado);
        }, true);
      });
      await setBids(frasesFiltradas);
    }
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function handleShow(pdf) {
    setPdf(pdf);
    setModalPdf(true);
  }

  const removePublication = async (id) => {
    setLoading(true);

    try {
      const response = await api.delete(`/bids/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      const updated = await data.bid.filter((obj) => obj._id !== id);
      setBids(updated);
    } catch (error) {
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

  function clearSearch() {
    setSearch("");
    setBids(data.bid);
  }

  async function searchByDate() {
    let publis = [];
    await data.bid.map((publi) => {
      const publiDate = new Date(publi.date);
      if (
        publiDate.getDate() === initDate.getDate() &&
        publiDate.getMonth() === initDate.getMonth() &&
        publiDate.getFullYear() === initDate.getFullYear()
      ) {
        publis.push(publi);
      }
    });
    setBids(publis);
  }

  return (
    <>
      <Grid templateColumns="1fr 1fr" gap={5} mt={10}>
        <FormControl>
          <FormLabel>Buscar por Título</FormLabel>
          <Input
            placeholder="Digite para buscar"
            value={search}
            onChange={(e) => finderClientsBySource(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Buscar por Data de Publicação</FormLabel>
          <HStack>
            <DatePicker
              selected={initDate}
              onChange={(date) => setInitDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              showPopperArrow={false}
              dateFormat="dd/MM/yyyy"
            />
            <Button
              leftIcon={<AiOutlineSearch />}
              colorScheme="blue"
              onClick={() => searchByDate()}
              w="200px"
            >
              Buscar
            </Button>
            <Button
              leftIcon={<FaTrash />}
              colorScheme="red"
              variant="outline"
              onClick={() => clearSearch()}
              w="200px"
            >
              Limpar
            </Button>
          </HStack>
        </FormControl>
      </Grid>

      <Divider mt={5} mb={5} />

      <Stack spacing={5}>
        {bids.map((bid) => (
          <Box borderWidth="1px" rounded="md" p={3} key={bid._id}>
            <Flex align="center">
              <Icon as={FaFolder} color="green.500" fontSize="3xl" />
              <Box ml={5}>
                <Heading fontSize="lg">{bid.title}</Heading>
                <Text fontSize="xs">
                  {format(new Date(bid.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: pt_br,
                  })}
                </Text>
              </Box>
            </Flex>
            <Divider mt={3} />
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Arquivo</Th>
                  <Th w="10%">Opções</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bid.file.map((file) => (
                  <Tr key={file._id}>
                    <Td>
                      <Icon as={FaFilePdf} /> {file.file}
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        leftIcon={<FaSearch />}
                        colorScheme="blue"
                        isFullWidth
                        onClick={() => handleShow(file.file)}
                        _hover={{ transform: "scale(1.05)" }}
                        _active={{ transform: "scale(1)" }}
                      >
                        Visualizar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Popover placement="right-end">
              <PopoverTrigger>
                <Button
                  mt={3}
                  colorScheme="red"
                  leftIcon={<FaTrash />}
                  _hover={{ transform: "scale(1.05)" }}
                  _active={{ transform: "scale(1)" }}
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
                    isLoading={loading}
                    onClick={() => removePublication(bid._id)}
                  >
                    Sim
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>
        ))}
      </Stack>

      <Modal
        isOpen={modalPdf}
        onClose={() => setModalPdf(false)}
        size="6xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent overflow="hidden" h="84vh">
          <ModalHeader>Visualizar Documento</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <embed
              src={`${route}/docs/${pdf}`}
              width="100%"
              height="100%"
              type="application/pdf"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
