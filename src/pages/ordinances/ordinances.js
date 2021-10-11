import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Input,
  Select,
  FormLabel,
  FormControl,
  Divider,
  Text,
  Icon,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AiFillSave } from "react-icons/ai";
import RichTextEditor from "react-rte";
import { File, InputFileFull } from "../../styles/uploader";
import { FaFilePdf, FaTrash } from "react-icons/fa";
import { api } from "../../configs/axios";

export default function StoreOrdinances() {
  const toast = useToast();
  const [text, setText] = useState(RichTextEditor.createEmptyValue());
  const [pdf, setPdf] = useState(null);
  const [secretaries, setSecretaries] = useState([]);
  const [secretary_id, setSecretary_id] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  function clear() {
    setText(RichTextEditor.createEmptyValue());
    setPdf(null);
    setSecretary_id("");
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

  async function findSecretary() {
    try {
      const response = await api.get("/secretaries");
      setSecretaries(response.data);
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
  }

  useEffect(() => {
    findSecretary();
  }, []);

  const onChange = (value) => {
    setText(value);
  };

  const save = async () => {
    if (pdf === null) {
      showToast("Insira um arquivo", "warning", "Atenção");
      return false;
    }
    if (secretary_id === "") {
      showToast("Selecione uma Secretaria", "warning", "Atenção");
      return false;
    }
    if (title === "") {
      showToast("Insira um título", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    let data = new FormData();
    data.append("pdf", pdf);
    data.append("title", title);
    data.append("description", text.toString("html"));
    data.append("secretary_id", secretary_id);
    try {
      const response = await api.post("/ordinances", data);
      showToast(response.data.message, "success", "Sucesso");
      clear();
      setLoading(false);
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
      <FormControl isRequired mt={10}>
        <FormLabel>Arquivo PDF</FormLabel>
        {pdf ? (
          <Flex
            direction="column"
            justify="center"
            align="center"
            h="80px"
            borderWidth="1px"
            rounded="md"
          >
            <Icon as={FaFilePdf} fontSize="2xl" />
            <Text fontSize="sm" mt={1}>
              {pdf.name}{" "}
              <IconButton
                icon={<FaTrash />}
                colorScheme="red"
                size="xs"
                rounded="full"
                mt={1}
                onClick={() => setPdf(null)}
                variant="link"
              />
            </Text>
          </Flex>
        ) : (
          <InputFileFull alt={80} border={"#3d5794"}>
            <File
              type="file"
              onChange={(event) => setPdf(event.target.files[0])}
            />
            <Icon as={FaFilePdf} fontSize="2xl" />
            <Text fontSize="sm" mt={1}>
              Insira o arquivo PDF
            </Text>
          </InputFileFull>
        )}
      </FormControl>
      <Grid templateColumns="1fr 3fr" gap={5} mt={5}>
        <FormControl isRequired>
          <FormLabel>Selecione uma Secretaria</FormLabel>
          <Select
            placeholder="Selecione uma Secretaria"
            value={secretary_id}
            onChange={(e) => setSecretary_id(e.target.value)}
          >
            {secretaries.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Título</FormLabel>
          <Input
            placeholder="Insira um título"
            value={title}
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
          />
        </FormControl>
      </Grid>
      <FormControl mt={5}>
        <FormLabel>Descrição</FormLabel>
        <RichTextEditor
          value={text}
          onChange={onChange}
          rootStyle={{
            minHeight: "188px",
          }}
          placeholder="Insira seu texto aqui"
        />
      </FormControl>
      <Divider mt={5} mb={5} />

      <Button
        size="lg"
        leftIcon={<AiFillSave />}
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
