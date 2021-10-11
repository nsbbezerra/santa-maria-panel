import React, { useState, useEffect, useMemo } from "react";
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Image,
  Text,
  Center,
  Box,
  Grid,
  Button,
  Heading,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { IoIosImages } from "react-icons/io";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import { api, route } from "../../configs/axios";
import { File, InputFile } from "../../styles/uploader";

export default function ListSecretary() {
  const toast = useToast();
  const { data, error } = useFetch("/secretaries");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secretaries, setSecretaries] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  useEffect(() => {
    if (data) {
      setSecretaries(data);
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

  const handleEdit = async (id) => {
    const result = await data.find((obj) => obj._id === id);
    setName(result.title);
    setOwner(result.name);
    setAddress(result.address);
    setEmail(result.email);
    setPhone(result.phone);
    setSchedule(result.schedule);
    setId(result._id);
    setModalEdit(true);
  };

  const saveInfo = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/updateSecretaryInfo/${id}`, {
        title: name,
        name: owner,
        address: address,
        phone: phone,
        email: email,
        schedule: schedule,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalEdit(false);
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

  async function handleImageEdit(id) {
    const result = await data.find((obj) => obj._id === id);
    setId(result._id);
    setImage(result.thumbnail);
    setModalImage(true);
  }

  async function finderClientsBySource(text) {
    setSearch(text);
    if (text === "") {
      await setSecretaries(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.title.includes(termoBuscado);
        }, true);
      });
      await setSecretaries(frasesFiltradas);
    }
  }

  const updateImage = async () => {
    if (!thumbnail) {
      showToast("Insira uma imagem", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    let imageDate = new FormData();
    imageDate.append("thumbnail", thumbnail);

    try {
      const response = await api.put(`/updateSecretaryImage/${id}`, imageDate);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalImage(false);
      setThumbnail(null);
      removeThumbnail();
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
      <FormControl mt={10}>
        <FormLabel>Pesquisar por Nome da Secretaria</FormLabel>
        <Input
          placeholder="Digite para buscar"
          value={search}
          onChange={(e) => finderClientsBySource(e.target.value.toUpperCase())}
        />
      </FormControl>

      <Divider mt={5} mb={5} />

      <Stack spacing={5}>
        {secretaries.map((sec) => (
          <Box rounded="md" borderWidth="1px" p={5} key={sec._id}>
            <Center
              p={2}
              bg="green.500"
              color="white"
              fontWeight="bold"
              rounded="md"
            >
              {sec.title}
            </Center>

            <Grid templateColumns="280px 1fr" gap={6} mt={3}>
              <Box>
                <Image
                  src={`${route}/img/${sec.thumbnail}`}
                  w="280px"
                  h="280px"
                  objectFit="cover"
                  rounded="md"
                />
                <Button
                  leftIcon={<IoIosImages />}
                  colorScheme="blue"
                  isFullWidth
                  mt={3}
                  _hover={{ transform: "scale(1.05)" }}
                  _active={{ transform: "scale(1)" }}
                  onClick={() => handleImageEdit(sec._id)}
                >
                  Alterar Imagem
                </Button>
              </Box>

              <Box>
                <Center>
                  <Text>DADOS DA SECRETARIA</Text>
                </Center>

                <Heading fontSize="2xl" mt={5}>
                  {sec.name}
                </Heading>
                <Text mt={3}>
                  <strong>ENDEREÇO:</strong> {sec.address}
                </Text>
                <Text mt={3}>
                  <strong>TELEFONE:</strong> {sec.phone}
                </Text>
                <Text mt={3}>
                  <strong>EMAIL:</strong> {sec.email}
                </Text>
                <Text mt={3}>
                  <strong>ATENDIMENTO:</strong> {sec.schedule}
                </Text>

                <Divider mt={3} mb={3} />
                <Flex justify="flex-end">
                  <Button
                    leftIcon={<AiFillEdit />}
                    colorScheme="blue"
                    mt={3}
                    _hover={{ transform: "scale(1.05)" }}
                    _active={{ transform: "scale(1)" }}
                    onClick={() => handleEdit(sec._id)}
                  >
                    Editar Informações
                  </Button>
                </Flex>
              </Box>
            </Grid>
          </Box>
        ))}
      </Stack>

      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        scrollBehavior="outside"
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nome da Secretaria</FormLabel>
              <Input
                placeholder="Nome da Secretaria"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<AiFillSave />}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              isLoading={loading}
              onClick={() => saveInfo()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalImage}
        onClose={() => setModalImage(false)}
        scrollBehavior="outside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Imagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="280px 280px" gap={5} justifyContent="center">
              <FormControl>
                <FormLabel>Imagem Atual</FormLabel>
                <Image
                  rounded="md"
                  src={`${route}/img/${image}`}
                  w="280px"
                  h="280px"
                  objectFit="cover"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Nova Imagem</FormLabel>
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
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<AiFillSave />}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              isLoading={loading}
              onClick={() => updateImage()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
