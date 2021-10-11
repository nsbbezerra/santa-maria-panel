import React, { useState, useMemo } from "react";
import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  Divider,
  IconButton,
  Flex,
  Image,
  useToast,
} from "@chakra-ui/react";
import { File, InputFile } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import { AiFillSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { api } from "../../configs/axios";

export default function Secretary() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
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

  function clear() {
    setName("");
    setOwner("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSchedule("");
    setThumbnail(null);
    removeThumbnail();
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  const save = async () => {
    if (!thumbnail) {
      showToast("Insira uma foto", "warning", "Atenção");
      return false;
    }
    if (name === "") {
      showToast("Insira um nome", "warning", "Atenção");
      return false;
    }
    if (owner === "") {
      showToast("Insira um nome para o(a) Secretário(a)", "warning", "Atenção");
      return false;
    }
    if (phone === "") {
      showToast("Insira um telefone", "warning", "Atenção");
      return false;
    }
    if (address === "") {
      showToast("Insira um endereço", "warning", "Atenção");
      return false;
    }
    if (schedule === "") {
      showToast("Insira um horário de atendimento", "warning", "Atenção");
      return false;
    }
    setLoading(true);

    let data = new FormData();
    data.append("title", name);
    data.append("name", owner);
    data.append("address", address);
    data.append("phone", phone);
    data.append("email", email);
    data.append("schedule", schedule);
    data.append("thumbnail", thumbnail);

    try {
      const response = await api.post("/secretaries", data);
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

  return (
    <>
      <Grid templateColumns="280px 1fr" gap={7} mt={10}>
        <Box>
          <FormControl isRequired>
            <FormLabel>Foto do(a) Secretário(a)</FormLabel>
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
        </Box>
        <Box>
          <FormControl isRequired>
            <FormLabel>Nome da Secretaria</FormLabel>
            <Input
              placeholder="Nome da Secretaria"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
            />
          </FormControl>
          <Grid templateColumns="1fr 1fr 1fr" gap={5} mt={3}>
            <FormControl isRequired>
              <FormLabel>Nome do(a) Secretário(a)</FormLabel>
              <Input
                placeholder="Nome do(a) Secretário(a)"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Telefone do(a) Secretário(a)</FormLabel>
              <Input
                placeholder="Telefone do(a) Secretário(a)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email do(a) Secretário(a)</FormLabel>
              <Input
                placeholder="Email do(a) Secretário(a)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Grid>
          <FormControl mt={3} isRequired>
            <FormLabel>Endereço da Secretaria</FormLabel>
            <Input
              placeholder="Endereço da Secretaria"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
          <FormControl mt={3} isRequired>
            <FormLabel>Horário de Atendimento</FormLabel>
            <Input
              placeholder="Horário de Atendimento"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </FormControl>
        </Box>
      </Grid>

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
