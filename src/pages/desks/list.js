import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Image,
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Select,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import RichTextEditor from "react-rte";
import { File, InputFile } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import useFetch from "../../hooks/useFetch";
import { api, route } from "../../configs/axios";
import Parse from "html-react-parser";

export default function ListDesk() {
  const [edit, setEdit] = useState(false);
  const toast = useToast();
  const { data, error } = useFetch("/desk");
  const [text, setText] = useState(RichTextEditor.createEmptyValue());
  const [editImage, setEditImage] = useState(false);
  const [desks, setDesks] = useState([]);
  const [image, setImage] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [id, setId] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [name, setName] = useState("");

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  const onChange = (value) => {
    setText(value);
  };

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
      setDesks(data.desk);
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

  const handleImage = (id) => {
    const result = desks.find((obj) => obj._id === id);
    setImage(result.thumbnail);
    setId(result._id);
    setEditImage(true);
  };

  const changeImageDesk = async () => {
    if (!thumbnail) {
      showToast("Insira uma imagem", "warning", "Atenção");
      return false;
    }
    setLoadingImage(true);
    let dataImage = new FormData();
    dataImage.append("thumbnail", thumbnail);

    try {
      const response = await api.put(`/changeImageDesk/${id}`, dataImage);

      setThumbnail(null);
      removeThumbnail();
      setEditImage(false);
      showToast(
        `${response.data.message}. Aguarde 5 segundos para a atualização acontecer`,
        "success",
        "Sucesso"
      );

      setLoadingImage(false);
    } catch (error) {
      setLoadingImage(false);
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

  async function findInfo(id) {
    const result = await desks.find((obj) => obj._id === id);
    setId(result._id);
    setName(result.name);
    setText(RichTextEditor.createValueFromString(result.text, "html"));
    setEdit(true);
  }

  const saveInfo = async () => {
    if (name === "") {
      showToast("Insira um nome", "warning", "Atenção");
      return false;
    }
    setLoadingInfo(true);

    try {
      const response = await api.put(`/desk/${id}`, {
        text: text.toString("html"),
        name,
      });
      showToast(
        `${response.data.message}. Aguarde 5 segundos para a atualização acontecer`,
        "success",
        "Sucesso"
      );
      setLoadingInfo(false);
      setEdit(false);
      setText(RichTextEditor.createEmptyValue());
      setName("");
    } catch (error) {
      setLoadingInfo(false);
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
      <Tabs variant="solid-rounded" mt={7} size="sm">
        <TabList>
          <Tab _focus={{ outline: "none" }}>PREFEITO</Tab>
          <Tab _focus={{ outline: "none" }}>VICE-PREFEITO</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {desks
              .filter((obj) => obj.type === "major")
              .map((maj) => (
                <Grid templateColumns="280px 1fr" gap={5} key={maj._id}>
                  <Box w="280px">
                    <Image
                      rounded="md"
                      src={`${route}/img/${maj.thumbnail}`}
                      w="280px"
                      h="280px"
                      objectFit="cover"
                    />
                    <Button
                      leftIcon={<AiFillEdit />}
                      isFullWidth
                      mt={3}
                      colorScheme="blue"
                      _hover={{ transform: "scale(1.05)" }}
                      _active={{ transform: "scale(1)" }}
                      size="lg"
                      onClick={() => handleImage(maj._id)}
                    >
                      Alterar Imagem
                    </Button>
                  </Box>
                  <Flex align="flex-start" direction="column">
                    <Heading mb={3}>{maj.name}</Heading>

                    <div id="news-container">{Parse(maj.text)}</div>

                    <Divider mt={5} mb={5} />

                    <Flex justify="flex-end" w="100%">
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<AiFillEdit />}
                        _hover={{ transform: "scale(1.05)" }}
                        _active={{ transform: "scale(1)" }}
                        onClick={() => findInfo(maj._id)}
                      >
                        Alterar Informações
                      </Button>
                    </Flex>
                  </Flex>
                </Grid>
              ))}
          </TabPanel>
          <TabPanel>
            {desks
              .filter((obj) => obj.type === "vice-major")
              .map((maj) => (
                <Grid templateColumns="280px 1fr" gap={5} key={maj._id}>
                  <Box w="280px">
                    <Image
                      rounded="md"
                      src={`${route}/img/${maj.thumbnail}`}
                      w="280px"
                      h="280px"
                      objectFit="cover"
                    />
                    <Button
                      leftIcon={<AiFillEdit />}
                      isFullWidth
                      mt={3}
                      colorScheme="blue"
                      _hover={{ transform: "scale(1.05)" }}
                      _active={{ transform: "scale(1)" }}
                      size="lg"
                      onClick={() => handleImage(maj._id)}
                    >
                      Alterar Imagem
                    </Button>
                  </Box>
                  <Flex align="flex-start" direction="column">
                    <Heading mb={3}>{maj.name}</Heading>

                    <div id="news-container">{Parse(maj.text)}</div>

                    <Divider mt={5} mb={5} />

                    <Flex justify="flex-end" w="100%">
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<AiFillEdit />}
                        _hover={{ transform: "scale(1.05)" }}
                        _active={{ transform: "scale(1)" }}
                        onClick={() => findInfo(maj._id)}
                      >
                        Alterar Informações
                      </Button>
                    </Flex>
                  </Flex>
                </Grid>
              ))}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        isOpen={edit}
        onClose={() => setEdit(false)}
        scrollBehavior="outside"
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr" gap={5}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Grid>
            <FormControl isRequired mt={5}>
              <FormLabel>Descrição</FormLabel>
              <RichTextEditor
                value={text}
                onChange={onChange}
                rootStyle={{
                  minHeight: "188px",
                }}
                placeholder="Insira um novo texto aqui"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<AiFillSave />}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              isLoading={loadingInfo}
              onClick={() => saveInfo()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={editImage}
        onClose={() => setEditImage(false)}
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
              isLoading={loadingImage}
              onClick={() => changeImageDesk()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
