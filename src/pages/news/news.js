import React, { useState, useMemo } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Grid,
  Text,
  Divider,
  Container,
  Button,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Heading,
  Box,
  Icon,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { FaCalendarAlt, FaImages, FaTrash, FaEraser } from "react-icons/fa";
import { AiFillSave, AiOutlineZoomIn } from "react-icons/ai";
import { File, InputFileFull } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import RichTextEditor from "react-rte";
import Parse from "html-react-parser";
import { api } from "../../configs/axios";
import { format } from "date-fns";

registerLocale("pt_br", pt_br);

export default function News() {
  const toast = useToast();

  const [initDate, setInitDate] = useState(new Date());

  const [text, setText] = useState(RichTextEditor.createEmptyValue());

  const [preview, setPreview] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [tag, setTag] = useState("");
  const [author, setAuthor] = useState("");
  const [copy, setCopy] = useState("");
  const [galery, setGalery] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGalery, setLoadingGalery] = useState(false);
  const [activeGalery, setActiveGalery] = useState(false);

  function clear() {
    setThumbnail(null);
    removeThumbnail();
    setTitle("");
    setResume("");
    setTag("");
    setAuthor("");
    setCopy("");
    setText(RichTextEditor.createEmptyValue());
    setInitDate(new Date());
  }

  function clearGalery() {
    clear();
    removeGalery();
    setActiveGalery(false);
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

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" isReadOnly />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function handleFile(file) {
    if (file) {
      const filter = galery.find((obj) => obj.name === file.name);
      if (filter) {
        showToast("Este arquivo já foi adicionado", "warning", "Atenção");
      } else {
        setGalery([...galery, file]);
      }
    }
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  const previewGalery = useMemo(() => {
    return galery.map((gal) => {
      return gal ? URL.createObjectURL(gal) : null;
    });
  }, [galery]);

  async function removeGalery() {
    await galery.map((gal) => {
      URL.revokeObjectURL(gal);
    });
    setGalery([]);
  }

  const save = async () => {
    if (title === "") {
      showToast("Insira um título", "warning", "Atenção");
      return false;
    }
    if (resume === "") {
      showToast("Insira um resumo", "warning", "Atenção");
      return false;
    }
    if (tag === "") {
      showToast("Insira uma tag", "warning", "Atenção");
      return false;
    }
    if (author === "") {
      showToast("Insira um autor", "warning", "Atenção");
      return false;
    }
    if (!thumbnail) {
      showToast("Insira uma imagem para a matéria", "warning", "Atenção");
      return false;
    }
    if (copy === "") {
      showToast("Insira uma Copy para a imagem", "warning", "Atenção");
      return false;
    }
    setLoading(true);

    let data = new FormData();
    data.append("title", title);
    data.append("resume", resume);
    data.append("author", author);
    data.append("date", initDate);
    data.append("imageCopy", copy);
    data.append("text", text.toString("html"));
    data.append("tag", tag);
    data.append("month", initDate.toLocaleString("pt-br", { month: "long" }));
    data.append("year", initDate.getFullYear());
    data.append("image", thumbnail);

    try {
      const response = await api.post("/news", data);
      setId(response.data.id);
      showToast(response.data.message, "success", "Sucesso");
      setActiveGalery(true);
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

  const saveGalery = async () => {
    if (galery.length === 0) {
      showToast("Insira imagens na galeria", "warning", "Atenção");
      return false;
    }
    if (galery.length > 12) {
      showToast(
        "Limite de imagens excedido, o limite é de 12 imagens",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoadingGalery(true);
    let data = new FormData();
    await Object.keys(galery).forEach((key) => {
      data.append("galery", galery[key]);
    });

    try {
      const response = await api.put(`/newsGalery/${id}`, data);
      showToast(response.data.message, "success", "Sucesso");
      clearGalery();
      setLoadingGalery(false);
    } catch (error) {
      setLoadingGalery(false);
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
      <Button
        position="fixed"
        bottom={10}
        right={10}
        leftIcon={<AiOutlineZoomIn />}
        _hover={{ transform: "scale(1.05)" }}
        _active={{ transform: "scale(1)" }}
        colorScheme="blue"
        onClick={() => setPreview(true)}
        zIndex={1000}
        size="lg"
      >
        Prévia
      </Button>
      <Container maxW="5xl">
        <FormControl mt={10} isRequired>
          <FormLabel>Título da Notícia</FormLabel>
          <Textarea
            rows={3}
            resize="none"
            placeholder="Título da Notícia"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl mt={3} isRequired>
          <FormLabel>Resumo da Notícia</FormLabel>
          <Textarea
            rows={2}
            resize="none"
            placeholder="Resumo da Notícia"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </FormControl>
        <Grid mt={3} templateColumns="1fr 1fr 1fr" gap={5}>
          <FormControl isRequired>
            <FormLabel>Tag da Notícia</FormLabel>
            <Input
              placeholder="Tag da Notícia"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Autor da Notícia</FormLabel>
            <Input
              placeholder="Autor da Notícia"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data da Publicação</FormLabel>
            <DatePicker
              selected={initDate}
              onChange={(date) => setInitDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
              calendarClassName="calendar"
              showPopperArrow={false}
            />
          </FormControl>
        </Grid>

        <Divider mt={5} mb={5} />

        <FormControl isRequired>
          <FormLabel>Imagem Principal</FormLabel>
          {thumbnail ? (
            <Flex direction="column" align="center">
              <Image
                src={previewThumbnail}
                h="400px"
                w="100%"
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

        <FormControl mt={3} isRequired>
          <FormLabel>Copy da Imagem</FormLabel>
          <Input
            placeholder="Copy da Imagem"
            value={copy}
            onChange={(e) => setCopy(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired mt={5}>
          <FormLabel>Texto Principal</FormLabel>

          <RichTextEditor
            value={text}
            onChange={onChange}
            rootStyle={{
              minHeight: "188px",
            }}
            placeholder="Insira seu texto aqui"
          />
        </FormControl>

        <FormControl mt={5}>
          <FormLabel>
            Galeria de Imagens (É preciso salvar a notícia primeiro para inserir
            as imagens na galeria)
          </FormLabel>
          <Grid templateColumns="repeat(4, 1fr)" gap={5}>
            {!previewGalery.length
              ? ""
              : previewGalery.map((gal) => (
                  <Image
                    src={gal}
                    w="100%"
                    h="130px"
                    objectFit="cover"
                    rounded="md"
                  />
                ))}

            <InputFileFull alt={130} border={"#3d5794"}>
              <File
                type="file"
                onChange={(event) => handleFile(event.target.files[0])}
              />
              <IoIosImages style={{ fontSize: 50, marginBottom: 15 }} />
              <Text>Insira uma imagem</Text>
            </InputFileFull>
          </Grid>
          <Button
            onClick={() => removeGalery()}
            mt={3}
            size="sm"
            leftIcon={<FaTrash />}
            colorScheme="red"
          >
            Limpar Galeria
          </Button>
        </FormControl>

        <Divider mt={5} mb={5} />

        <HStack spacing={5}>
          <Button
            size="lg"
            colorScheme="blue"
            leftIcon={<AiFillSave />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isLoading={loading}
            onClick={() => save()}
          >
            Salvar
          </Button>
          <Button
            size="lg"
            colorScheme="blue"
            leftIcon={<AiFillSave />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            variant="outline"
            isDisabled={!activeGalery}
            isLoading={loadingGalery}
            onClick={() => saveGalery()}
          >
            Salvar Galeria
          </Button>

          <Button
            size="lg"
            colorScheme="green"
            leftIcon={<FaEraser />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            onClick={() => clearGalery()}
          >
            Limpar Tudo
          </Button>
        </HStack>
      </Container>

      <Modal isOpen={preview} onClose={() => setPreview(false)} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt={6} pb={5}>
            <Heading fontSize="4xl" textAlign="justify">
              {title}
            </Heading>
            <Text mt={3} textAlign="justify">
              {resume}
            </Text>
            <Text fontSize="sm" mt={3} fontWeight="bold">
              {author}
            </Text>
            <Text fontStyle="italic" fontSize="sm" fontWeight="light">
              {format(new Date(initDate), "dd 'de' MMMM 'de' yyyy", {
                locale: pt_br,
              })}
            </Text>

            <Box rounded="md" overflow="hidden" mt={3}>
              {thumbnail && (
                <Image
                  src={previewThumbnail}
                  h="400px"
                  w="100%"
                  objectFit="cover"
                  alt="Prefeitura de Santa Maria"
                />
              )}
            </Box>
            <Text fontStyle="italic" fontSize="xs" fontWeight="light">
              {copy}
            </Text>

            <div id="news-container">{Parse(text.toString("html"))}</div>

            {galery.length !== 0 && (
              <Flex align="center" mt={10}>
                <Icon as={FaImages} fontSize="xl" />
                <Heading fontSize="lg" ml={2}>
                  Galeria de Fotos
                </Heading>
              </Flex>
            )}

            <Grid templateColumns="repeat(4, 1fr)" gap={5} mt={5}>
              {!previewGalery.length
                ? ""
                : previewGalery.map((gal) => (
                    <Image
                      src={gal}
                      w="100%"
                      h="130px"
                      objectFit="cover"
                      rounded="md"
                    />
                  ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
