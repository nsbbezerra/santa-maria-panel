import React, { useState, useMemo, useEffect } from "react";
import {
  Center,
  Text,
  Grid,
  Box,
  Image,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { File, InputFile } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import { AiFillSave, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { api, route } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";

export default function Informatives() {
  const toast = useToast();
  const { data, error } = useFetch("/informatives");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [informatives, setInformatives] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (data) {
      setInformatives(data.informative);
    }
  }, [data]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

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

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
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

  const saveImage = async () => {
    if (!thumbnail) {
      showToast("Insira uma imagem", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    let dataImage = new FormData();
    dataImage.append("image", thumbnail);
    try {
      const response = await api.post("/informatives", dataImage);

      showToast(response.data.message, "success", "Sucesso");
      setThumbnail(null);
      removeThumbnail();
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

  const removeImage = async (id) => {
    setLoadingImage(true);
    try {
      const response = await api.delete(`/informatives/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      const updated = await informatives.filter((obj) => obj._id !== id);
      setInformatives(updated);
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

  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          INFORMATIVOS
        </Text>
      </Center>
      <Grid
        mt={10}
        templateColumns="repeat(auto-fit, minmax(280px, 280px))"
        gap={7}
        justifyContent="center"
      >
        <Box>
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
          <Button
            leftIcon={<AiFillSave />}
            isFullWidth
            colorScheme="blue"
            mt={3}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isLoading={loading}
            onClick={() => saveImage()}
          >
            Salvar Imagem
          </Button>
        </Box>
        {informatives.map((info) => (
          <Box w="280px" key={info._id}>
            <Image
              rounded="md"
              src={`${route}/img/${info.image}`}
              w="280px"
              h="280px"
              objectFit="cover"
            />
            <Popover>
              <PopoverTrigger>
                <Button
                  leftIcon={<AiOutlineClose />}
                  isFullWidth
                  colorScheme="red"
                  mt={3}
                  _hover={{ transform: "scale(1.05)" }}
                  _active={{ transform: "scale(1)" }}
                >
                  Excluir Imagem
                </Button>
              </PopoverTrigger>
              <PopoverContent _focus={{ outline: "none" }} shadow="lg">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmação!</PopoverHeader>
                <PopoverBody>Deseja excluir esta imagem?</PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                  <Button
                    colorScheme="green"
                    leftIcon={<AiOutlineCheck />}
                    size="sm"
                    isLoading={loadingImage}
                    onClick={() => removeImage(info._id)}
                  >
                    Sim
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>
        ))}
      </Grid>
    </>
  );
}
