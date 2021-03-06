import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  Image,
  Flex,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tag,
  InputRightElement,
  InputGroup,
  useToast,
  IconButton,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  AiFillSave,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineTool,
} from "react-icons/ai";
import { File, InputFileFull } from "../../styles/uploader";
import { IoIosImages } from "react-icons/io";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { FaCalendarAlt, FaTrash, FaImages } from "react-icons/fa";
import RichTextEditor from "react-rte";
import { api, route } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";
import Parse from "html-react-parser";

registerLocale("pt_br", pt_br);

export default function ListNews() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const { data, error } = useFetch(`/news/${page}`);
  const [modalGalery, setModalGalery] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [removeNews, setRemoveNews] = useState(false);

  const [initDate, setInitDate] = useState(new Date());
  const [text, setText] = useState(RichTextEditor.createEmptyValue());
  const [news, setNews] = useState([]);
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
  const [showNews, setShowNews] = useState({});

  useEffect(() => {
    if (data) {
      setNews(data.noticias);
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

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" isReadOnly />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

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

  const onChange = (value) => {
    setText(value);
  };

  if (error) {
    if (error.message === "Network Error") {
      return false;
    }
    const typeError =
      error.response.data.message || "Ocorreu um erro ao salvar";
    const message = error.response.data.errorMessage;
    showToast(message, "error", typeError);
  }

  const handleNews = async (id) => {
    const result = await data.noticias.find((obj) => obj._id === id);
    setId(result._id);
    setTitle(result.title);
    setResume(result.resume);
    setTag(result.tag);
    setAuthor(result.author);
    setInitDate(new Date(result.date));
    setCopy(result.imageCopy);
    setText(RichTextEditor.createValueFromString(result.text, "html"));
    setModalInfo(true);
  };

  const handlePreview = async (id) => {
    const result = await data.noticias.find((obj) => obj._id === id);
    setShowNews(result);
    setPreview(true);
  };

  const updateInfo = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/news/${id}`, {
        title: title,
        resume: resume,
        author: author,
        date: initDate,
        imageCopy: copy,
        text: text.toString("html"),
        month: initDate.toLocaleString("pt-br", { month: "long" }),
        year: initDate.getFullYear(),
        tag: tag,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalInfo(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  };

  const handleImage = async (id) => {
    const result = await data.noticias.find((obj) => obj._id === id);
    setCopy(result.imageCopy);
    setId(result._id);
    setModalImage(true);
  };

  const updateImage = async () => {
    if (!thumbnail) {
      showToast("Insira uma imagem", "warning", "Aten????o");
      return false;
    }
    setLoading(true);
    let dataImage = new FormData();
    dataImage.append("image", thumbnail);
    dataImage.append("imageCopy", copy);

    try {
      const response = await api.put(`/updateNewsImage/${id}`, dataImage);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalImage(false);
      setThumbnail(null);
      removeThumbnail();
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  };

  function handleFile(file) {
    if (file) {
      const filter = galery.find((obj) => obj.name === file.name);
      if (filter) {
        showToast("Este arquivo j?? foi adicionado", "warning", "Aten????o");
      } else {
        setGalery([...galery, file]);
      }
    }
  }

  function handleGalery(id) {
    setId(id);
    setModalGalery(true);
  }

  const updateGalery = async () => {
    if (galery.length === 0) {
      showToast("Insira imagens na galeria", "warning", "Aten????o");
      return false;
    }
    if (galery.length > 12) {
      showToast(
        "Limite de imagens excedido, o limite ?? de 12 imagens",
        "warning",
        "Aten????o"
      );
      return false;
    }
    setLoading(true);
    let dataImage = new FormData();
    await Object.keys(galery).forEach((key) => {
      dataImage.append("galery", galery[key]);
    });

    try {
      const response = await api.put(`/updateNewsGalery/${id}`, dataImage);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalGalery(false);
      removeGalery();
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
        );
        return false;
      }
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const message = error.response.data.errorMessage;
      showToast(message, "error", typeError);
    }
  };

  function handleRemoveNews(id) {
    setId(id);
    setRemoveNews(true);
  }

  const RemoveNew = async () => {
    setLoading(true);

    try {
      const response = await api.delete(`/news/${id}`);
      showToast(response.data.message, "success", "Sucesso");
      const updated = await data.noticias.filter((obj) => obj._id !== id);
      setNews(updated);
      setLoading(false);
      setRemoveNews(false);
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conex??o com o servidor, verifique sua conex??o com a internet."
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
      <Grid
        templateColumns="repeat(5, 1fr)"
        gap={5}
        justifyContent="center"
        mt={10}
      >
        {news.map((not) => (
          <Box key={not._id}>
            <Box rounded="md" overflow="hidden" borderWidth="1px">
              <Image
                src={`${route}/img/${not.image}`}
                layout="responsive"
                h="160px"
                w="100%"
                alt="Prefeitura de Santa Maria"
                objectFit="cover"
              />
              <Flex align="center">
                <Box p={3}>
                  {!not.tag ? (
                    ""
                  ) : (
                    <>
                      {!not.tag.includes(",") ? (
                        <Tag colorScheme="blue" mb={1} size="sm">
                          {not.tag}
                        </Tag>
                      ) : (
                        <Wrap mb={1} spacing={1}>
                          {not.tag.split(",").map((not) => (
                            <WrapItem key={not}>
                              <Tag colorScheme="blue" mb={1} size="sm">
                                {not}
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      )}
                    </>
                  )}
                  <Heading
                    fontSize={["md", "lg", "lg", "lg", "lg"]}
                    noOfLines={4}
                  >
                    {not.title}
                  </Heading>
                  <Text
                    fontSize={["sm", "md", "md", "md", "md"]}
                    mt={2}
                    noOfLines={3}
                  >
                    {not.resume}
                  </Text>

                  <Text
                    fontSize={["xs", "sm", "sm", "sm", "sm"]}
                    mt={2}
                    fontWeight="light"
                    noOfLines={1}
                  >
                    {format(new Date(not.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: pt_br,
                    })}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Menu placement="top">
              <MenuButton
                as={Button}
                rightIcon={<AiOutlineTool />}
                isFullWidth
                mt={3}
                colorScheme="blue"
                _hover={{ transform: "scale(1.05)" }}
                _active={{ transform: "scale(1)" }}
                size="sm"
              >
                Op????es
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handlePreview(not._id)}>
                  Visualizar Mat??ria
                </MenuItem>
                <MenuItem onClick={() => handleGalery(not._id)}>
                  Alterar Galeria
                </MenuItem>
                <MenuItem onClick={() => handleImage(not._id)}>
                  Alterar Imagem
                </MenuItem>
                <MenuItem onClick={() => handleNews(not._id)}>
                  Alterar Textos
                </MenuItem>
                <MenuItem onClick={() => handleRemoveNews(not._id)}>
                  Remover Mat??ria
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ))}
      </Grid>

      {news.length !== 0 && (
        <Flex align="center" justify="center" mt={10}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<AiOutlineArrowLeft />}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isDisabled={page <= 1}
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
            Pr??xima
          </Button>
        </Flex>
      )}

      <Modal
        isOpen={modalGalery}
        onClose={() => setModalGalery(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Galeria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              leftIcon={<FaTrash />}
              onClick={() => removeGalery()}
            >
              Limpar Galeria
            </Button>
            <Button
              colorScheme="blue"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              leftIcon={<AiFillSave />}
              isLoading={loading}
              onClick={() => updateGalery()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalImage}
        onClose={() => setModalImage(false)}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Imagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Insira uma Nova Imagem</FormLabel>
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              leftIcon={<AiFillSave />}
              isLoading={loading}
              onClick={() => updateImage()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalInfo} onClose={() => setModalInfo(false)} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Textos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr 1fr" gap={5}>
              <FormControl isRequired>
                <FormLabel>Tag da Not??cia</FormLabel>
                <Input
                  placeholder="Tag da Not??cia"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Autor da Not??cia</FormLabel>
                <Input
                  placeholder="Autor da Not??cia"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Data da Publica????o</FormLabel>
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
            <FormControl isRequired mt={3}>
              <FormLabel>T??tulo da Not??cia</FormLabel>
              <Textarea
                rows={3}
                resize="none"
                placeholder="T??tulo da Not??cia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl mt={3} isRequired>
              <FormLabel>Resumo da Not??cia</FormLabel>
              <Textarea
                rows={2}
                resize="none"
                placeholder="Resumo da Not??cia"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
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
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              leftIcon={<AiFillSave />}
              isLoading={loading}
              onClick={() => updateInfo()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={preview} onClose={() => setPreview(false)} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody mt={6} pb={5}>
            {JSON.stringify(showNews) !== "{}" && (
              <>
                <Heading fontSize="4xl" textAlign="justify">
                  {showNews.title}
                </Heading>
                <Text mt={3} textAlign="justify">
                  {showNews.resume}
                </Text>
                <Text fontSize="sm" mt={3} fontWeight="bold">
                  {showNews.author}
                </Text>
                <Text fontStyle="italic" fontSize="sm" fontWeight="light">
                  {format(new Date(showNews.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: pt_br,
                  })}
                </Text>

                <Box rounded="md" overflow="hidden" mt={3}>
                  <Image
                    src={`${route}/img/${showNews.image}`}
                    h="400px"
                    w="100%"
                    objectFit="cover"
                    alt="Prefeitura de Santa Maria"
                  />
                </Box>
                <Text fontStyle="italic" fontSize="xs" fontWeight="light">
                  {showNews.imageCopy}
                </Text>

                <div id="news-container">{Parse(showNews.text)}</div>

                {!showNews.galery.length || showNews.galery.length === 0 ? (
                  ""
                ) : (
                  <Flex align="center" mt={10}>
                    <Icon as={FaImages} fontSize="xl" />
                    <Heading fontSize="lg" ml={2}>
                      Galeria de Fotos
                    </Heading>
                  </Flex>
                )}

                <Grid templateColumns="repeat(4, 1fr)" gap={5} mt={5}>
                  {!showNews.galery.length || showNews.galery.length === 0 ? (
                    ""
                  ) : (
                    <>
                      {showNews.galery.map((gal) => (
                        <Image
                          src={`${route}/img/${gal.image}`}
                          w="100%"
                          h="130px"
                          objectFit="cover"
                          rounded="md"
                          key={gal._id}
                        />
                      ))}
                    </>
                  )}
                </Grid>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={removeNews} onClose={() => setRemoveNews(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remover Mat??ria
            </AlertDialogHeader>

            <AlertDialogBody>Deseja remover esta mat??ria?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => setRemoveNews(false)}
                variant="outline"
              >
                N??o
              </Button>
              <Button
                onClick={() => RemoveNew()}
                ml={3}
                colorScheme="blue"
                isLoading={loading}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
