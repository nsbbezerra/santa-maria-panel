import React, { useState, useEffect } from "react";
import {
  Center,
  Text,
  Button,
  Divider,
  Input,
  AspectRatio,
  Grid,
  Box,
  FormControl,
  FormLabel,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
} from "@chakra-ui/react";
import {
  AiFillSave,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineCheck,
} from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import { api } from "../../configs/axios";

export default function Videos() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const { data, error } = useFetch(`/videos/${page}`);

  const [videos, setVideos] = useState([]);

  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setVideos(data.video);
      handlePagination(data.count);
    }
  }, [data]);

  function handlePagination(num) {
    const divisor = parseFloat(num) / 12;
    if (divisor > parseInt(divisor) && divisor < parseInt(divisor) + 1) {
      setPages(parseInt(divisor) + 1);
    } else {
      setPages(parseInt(divisor));
    }
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
    if (url.includes("watch?v=")) {
      const newUrl = url.replace("watch?v=", "embed/");
      setUrl(newUrl);
    }
  }, [url]);

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
    if (url === "") {
      showToast("Insira uma URL de um vídeo do Youtube", "warning", "Atenção");
      return false;
    }

    setLoading(true);

    try {
      const response = await api.post("/videos", { video: url });
      showToast(response.data.message, "success", "Suceso");
      setLoading(false);
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
  };

  const del = async (id) => {
    setDelLoading(true);
    try {
      const response = await api.delete(`/videos/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      setDelLoading(false);
      const updated = await data.video.filter((obj) => obj._id !== id);
      setVideos(updated);
    } catch (error) {
      setDelLoading(false);
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
          VIDEOS
        </Text>
      </Center>

      <Grid templateColumns="3fr 1fr" gap={5} mt={10}>
        <Box>
          <FormControl>
            <FormLabel>URL do Vídeo</FormLabel>
            <Input
              placeholder="URL do Vídeo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </FormControl>

          <Button
            leftIcon={<AiFillSave />}
            colorScheme="blue"
            mt={5}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            size="lg"
            isLoading={loading}
            onClick={() => save()}
          >
            Salvar
          </Button>
        </Box>

        <FormControl>
          <FormLabel>Preview</FormLabel>
          <AspectRatio
            maxW="100%"
            ratio={16 / 9}
            rounded="md"
            overflow="hidden"
          >
            <iframe title="naruto" src={url} allowFullScreen />
          </AspectRatio>
        </FormControl>
      </Grid>

      <Divider mt={5} mb={5} />

      <Grid templateColumns="repeat(4, 1fr)" gap={5}>
        {videos.map((vid) => (
          <Box key={vid._id}>
            <AspectRatio
              maxW="100%"
              ratio={16 / 9}
              rounded="md"
              overflow="hidden"
            >
              <iframe title="naruto" src={vid.video} allowFullScreen />
            </AspectRatio>
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  isFullWidth
                  colorScheme="red"
                  size="sm"
                  mt={3}
                  leftIcon={<FaTrash />}
                >
                  Excluir Vídeo
                </Button>
              </PopoverTrigger>
              <PopoverContent _focus={{ outline: "none", shadow: "lg" }}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmação!</PopoverHeader>
                <PopoverBody>Deseja excluir este vídeo?</PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                  <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<AiOutlineCheck />}
                    isLoading={delLoading}
                    onClick={() => del(vid._id)}
                  >
                    Sim
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>
        ))}
      </Grid>

      {videos.length !== 0 && (
        <Flex align="center" justify="center" mt={10}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<AiOutlineArrowLeft />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isDisabled={page <= page}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <Input
            size="sm"
            value={page}
            w="50px"
            rounded="md"
            isReadOnly
            mr={2}
            ml={2}
          />
          <Text fontSize="sm">de</Text>
          <Input
            size="sm"
            value={pages}
            w="50px"
            rounded="md"
            isReadOnly
            ml={2}
            mr={2}
          />
          <Button
            size="sm"
            colorScheme="blue"
            rightIcon={<AiOutlineArrowRight />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isDisabled={page >= pages}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </Button>
        </Flex>
      )}
    </>
  );
}
