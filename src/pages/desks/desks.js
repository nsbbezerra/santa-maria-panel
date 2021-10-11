import React, { useState, useMemo } from "react";
import {
  Grid,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
  Box,
  Button,
  Image,
  IconButton,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { File, InputFile } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import RichTextEditor from "react-rte";
import { AiFillSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { api } from "../../configs/axios";

export default function Desks() {
  const toast = useToast();
  const [text, setText] = useState(RichTextEditor.createEmptyValue());
  const [thumbnail, setThumbnail] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  function clear() {
    setText(RichTextEditor.createEmptyValue());
    setThumbnail(null);
    setName("");
    setType("");
    removeThumbnail();
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

  const onChange = (value) => {
    setText(value);
  };

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  const save = async () => {
    if (thumbnail === null) {
      showToast("Insira uma foto", "warning", "Atenção");
      return false;
    }
    if (name === "") {
      showToast("Insira um nome", "warning", "Atenção");
      return false;
    }
    if (type === "") {
      showToast("Insira um cargo", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    let saveInfo = new FormData();
    saveInfo.append("thumbnail", thumbnail);
    saveInfo.append("name", name);
    saveInfo.append("type", type);
    saveInfo.append("text", text.toString("html"));
    try {
      const { data } = await api.post("/desk", saveInfo);

      showToast(data.message, "success", "Sucesso");
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
      <Grid templateColumns="280px 1fr" gap={7} mt={7}>
        <FormControl isRequired>
          <FormLabel>Foto</FormLabel>
          {thumbnail ? (
            <Flex direction="column" align="center">
              <Image
                src={previewThumbnail}
                h="280px"
                w="280px"
                rounded="md"
                objectFit="cover"
              />
              <IconButton
                icon={<FaTrash />}
                rounded="full"
                colorScheme="red"
                onClick={() => removeThumbnail()}
                w="min-content"
                mt={-12}
              />
            </Flex>
          ) : (
            <InputFile alt={280} lar={280} border={"#3d5794"}>
              <File
                type="file"
                onChange={(event) => setThumbnail(event.target.files[0])}
              />
              <IoIosImages style={{ fontSize: 50, marginBottom: 20 }} />
              <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
            </InputFile>
          )}
        </FormControl>

        <Box>
          <Grid templateColumns="2fr 1fr" gap={5}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Cargo</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="major">Prefeito</option>
                <option value="vice-major">Vice-Prefeito</option>
              </Select>
            </FormControl>
          </Grid>

          <FormControl mt={5} isRequired>
            <FormLabel>Descrição</FormLabel>
            <Box>
              <RichTextEditor
                value={text}
                onChange={onChange}
                rootStyle={{
                  minHeight: "188px",
                }}
              />
            </Box>
          </FormControl>
        </Box>
      </Grid>

      <Divider mt={5} mb={5} />

      <Button
        leftIcon={<AiFillSave />}
        colorScheme="blue"
        size="lg"
        _hover={{ transform: "scale(1.05)" }}
        _active={{ transform: "scale(1)" }}
        onClick={save}
        isLoading={loading}
      >
        Salvar
      </Button>
    </>
  );
}
