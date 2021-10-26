import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Image } from "@chakra-ui/image";
import { Input } from "@chakra-ui/input";
import { Box, Center, Divider, Flex, Grid, Text } from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useToast } from "@chakra-ui/toast";
import React, { useMemo, useState, useEffect } from "react";
import { AiFillSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { InputFileFull, File } from "../../styles/uploader";
import { api, route } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";

export default function StoreBanner() {
  const toast = useToast();
  const { data, error } = useFetch("/banner");
  const [thumbnail, setThumbnail] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  useEffect(() => {
    if (data) {
      setBanners(data);
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

  async function Save() {
    if (!thumbnail) {
      showToast("Insira uma imagem para salvar", "warning", "Atenção");
      return false;
    }

    setLoading(true);

    let dataImage = new FormData();
    dataImage.append("banner", thumbnail);
    dataImage.append("url", url === "" ? "none" : url);

    try {
      const response = await api.post("/banner", dataImage);
      showToast(response.data.message, "success", "Atenção");
      setLoading(false);
      removeThumbnail();
      setUrl("");
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
  }

  async function RemoveBanner(id) {
    setLoading(true);

    try {
      const response = await api.delete(`/banner/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      const updated = await data.filter((obj) => obj._id !== id);
      setBanners(updated);
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
  }

  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          VIDEOS
        </Text>
      </Center>

      <Tabs mt={10} variant="enclosed-colored">
        <TabList>
          <Tab _focus={{ outline: "none" }}>LISTAGEM</Tab>
          <Tab _focus={{ outline: "none" }}>CADASTRO</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Grid templateColumns="repeat(3, 1fr)" gap={5} mt={5}>
              {banners.map((ban) => (
                <Box key={ban._id}>
                  <Image
                    src={`${route}/img/${ban.banner}`}
                    w="100%"
                    rounded="md"
                  />

                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        isFullWidth
                        colorScheme="red"
                        mt={3}
                        leftIcon={<FaTrash />}
                      >
                        Remover Banner
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent _focus={{ outline: "none" }} shadow="lg">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmação!</PopoverHeader>
                      <PopoverBody>Deseja remover este banner?</PopoverBody>
                      <PopoverFooter d="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="green"
                            isLoading={loading}
                            onClick={() => RemoveBanner(ban._id)}
                          >
                            Sim
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </Box>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel p={0}>
            <FormControl mt={5}>
              <FormLabel>Banner</FormLabel>
              {thumbnail ? (
                <Flex justify="center" align="center" direction="column">
                  <Image
                    src={previewThumbnail}
                    w="100%"
                    h="400px"
                    objectFit="cover"
                    rounded="md"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    mt={-20}
                    onClick={() => removeThumbnail()}
                    rounded="full"
                    mb={10}
                  />
                </Flex>
              ) : (
                <InputFileFull alt={400} border={"#3d5794"}>
                  <File
                    type="file"
                    onChange={(event) => setThumbnail(event.target.files[0])}
                  />
                  <IoIosImages style={{ fontSize: 50, marginBottom: 20 }} />
                  <Text>Insira uma imagem</Text>
                </InputFileFull>
              )}
            </FormControl>

            <FormControl mt={5}>
              <FormLabel>URL</FormLabel>
              <Input
                placeholder="Insira uma url para a imagem"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </FormControl>

            <Divider mt={5} mb={5} />

            <Button
              size="lg"
              colorScheme="blue"
              leftIcon={<AiFillSave />}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              isLoading={loading}
              onClick={() => Save()}
            >
              Salvar
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
