import React, { useEffect, useState } from "react";
import {
  Input,
  Grid,
  Icon,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { File, InputFile } from "../../styles/uploader";
import { FaFilePdf, FaCalendarAlt, FaTrash } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { AiFillSave } from "react-icons/ai";
import { api } from "../../configs/axios";

registerLocale("pt_br", pt_br);

export default function Bids() {
  const toast = useToast();
  const [initDate, setInitDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" isReadOnly />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function handleFile(file) {
    if (file) {
      const filter = files.find((obj) => obj.name === file.name);
      if (filter) {
        showToast("Este arquivo já foi adicionado", "warning", "Atenção");
      } else {
        setFiles([...files, file]);
      }
    }
  }

  function handleDelFile(id) {
    const result = files.filter((obj) => obj.lastModified !== id);
    setFiles(result);
  }

  const save = async () => {
    if (title === "") {
      showToast("Insira um título", "warning", "Atenção");
      return false;
    }
    if (files.length === 0) {
      showToast("Insira alguns arquivos", "warning", "Atenção");
      return false;
    }
    if (files.length > 15) {
      showToast(
        "Limite de arquivos excedido, o limite é de 15 arquivos",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoading(true);
    let data = new FormData();
    data.append("title", title);
    data.append("date", initDate);
    await Object.keys(files).forEach((key) => {
      data.append("pdf", files[key]);
    });
    try {
      const response = await api.post("/bids", data);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setFiles([]);
      setTitle("");
      setInitDate(new Date());
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
      <Grid templateColumns="3fr 1fr" gap={5} mt={10}>
        <FormControl isRequired>
          <FormLabel>Título</FormLabel>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Data de Publicação</FormLabel>
          <DatePicker
            selected={initDate}
            onChange={(date) => setInitDate(date)}
            customInput={<CustomInputPicker />}
            locale="pt_br"
            dateFormat="dd/MM/yyyy"
          />
        </FormControl>
      </Grid>
      <FormControl mt={5} isRequired>
        <FormLabel>Arquivos</FormLabel>
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 250px))" gap={5}>
          {files.map((file) => (
            <Flex
              borderWidth="1px"
              rounded="md"
              direction="column"
              justify="center"
              align="center"
              key={file.lastModified}
            >
              <Text fontSize="xs" mt={1} noOfLines={1}>
                <Icon as={FaFilePdf} fontSize="xl" /> {file.name}
              </Text>
              <Tooltip label="Excluir Arquivo" hasArrow>
                <IconButton
                  icon={<FaTrash />}
                  size="xs"
                  rounded="full"
                  colorScheme="red"
                  mt={1}
                  variant="ghost"
                  onClick={() => handleDelFile(file.lastModified)}
                />
              </Tooltip>
            </Flex>
          ))}
          <InputFile alt={80} lar={250} border={"#3d5794"}>
            <File
              type="file"
              onChange={(event) => handleFile(event.target.files[0])}
            />
            <Icon as={FaFilePdf} fontSize="2xl" />
            <Text fontSize="sm" mt={1}>
              Insira o arquivo PDF
            </Text>
          </InputFile>
        </Grid>
      </FormControl>

      <Divider mt={5} mb={5} />

      <Button
        leftIcon={<AiFillSave />}
        size="lg"
        colorScheme="blue"
        _hover={{ transform: "scale(1.05)" }}
        _active={{ transform: "scale(1)" }}
        isLoading={loading}
        onClick={() => save()}
      >
        Salvar
      </Button>
    </>
  );
}
