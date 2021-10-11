import React, { useState, useEffect } from "react";
import {
  Grid,
  Text,
  Center,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Flex,
  Icon,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
  Select,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import {
  AiFillSave,
  AiOutlineCalendar,
  AiOutlineInsertRowBelow,
} from "react-icons/ai";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { api } from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import { format } from "date-fns";

registerLocale("pt_br", pt_br);

export default function Schedule() {
  const toast = useToast();
  const [initDate, setInitDate] = useState(new Date());
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [modalInsert, setModalInsert] = useState(false);
  const [month, setMonth] = useState(
    initDate.toLocaleString("pt-br", { month: "long" })
  );
  const [year, setYear] = useState(initDate.getFullYear());
  const { data, error } = useFetch(`/schedule/${month}/${year.toString()}`);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [id, setId] = useState("");

  function handleDate(date) {
    const horario = format(new Date(date), "HH:mm", { locale: pt_br });
    setSchedule(horario);
    setScheduleDate(date);
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
    if (data) {
      setSchedules(data);
    }
  }, [data]);

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input value={value} onClick={onClick} w="100%" isReadOnly />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

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
    setLoading(true);

    try {
      const response = await api.post("/schedule", {
        month: initDate.toLocaleString("pt-br", { month: "long" }),
        year: initDate.getFullYear(),
        date: initDate,
      });
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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

  function handleSchedule(id) {
    setId(id);
    setModalInsert(true);
  }

  const createEvent = async () => {
    if (description === "") {
      showToast("Insira uma descrição", "warning", "Atenção");
      return false;
    }

    setLoadingInsert(true);

    try {
      const response = await api.put(`/schedule/${id}`, {
        schedule: schedule,
        description: description,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingInsert(false);
      setModalInsert(false);
      setDescription("");
    } catch (error) {
      setLoadingInsert(false);
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

  const handleDelEvent = async (id) => {
    const result = await data.map((ev) => {
      if (ev.events.find((obj) => obj._id === id)) {
        return ev._id;
      }
    });
    const schedule_id = await result.find((obj) => obj !== undefined);
    const schedule_act = await data.find((obj) => obj._id === schedule_id);
    const updated_events = await schedule_act.events.filter(
      (obj) => obj._id !== id
    );

    try {
      const response = await api.put(`/scheduleDel/${schedule_id}`, {
        events: updated_events,
      });
      showToast(response.data.message, "success", "Sucesso");
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
  };

  return (
    <>
      <Center rounded="md" bg="green.500" p={1} shadow="md">
        <Text color="white" fontWeight="bold" fontSize="lg">
          AGENDA
        </Text>
      </Center>

      <Grid mt={10} templateColumns="280px 1fr" gap={6}>
        <Box
          rounded="md"
          borderWidth="2px"
          borderColor="blue.500"
          p={4}
          h="min-content"
        >
          <DatePicker
            selected={initDate}
            onChange={(date) => setInitDate(date)}
            customInput={<CustomInputPicker />}
            locale="pt_br"
            dateFormat="dd/MM/yyyy"
            calendarClassName="calendar"
            showPopperArrow={false}
          />
          <Button
            leftIcon={<AiFillSave />}
            colorScheme="blue"
            size="lg"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1)" }}
            isFullWidth
            mt={5}
            isLoading={loading}
            onClick={() => save()}
          >
            Salvar Data
          </Button>
        </Box>

        <Box>
          <Grid templateColumns="250px 250px" gap={5}>
            <FormControl>
              <FormLabel>Selecione o Mês</FormLabel>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="janeiro">Janeiro</option>
                <option value="fevereiro">Fevereiro</option>
                <option value="março">Março</option>
                <option value="abril">Abril</option>
                <option value="maio">Maio</option>
                <option value="junho">Junho</option>
                <option value="julho">Julho</option>
                <option value="agosto">Agosto</option>
                <option value="setembro">Setembro</option>
                <option value="outubro">Outubro</option>
                <option value="novembro">Novembro</option>
                <option value="dezembro">Dezembro</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Selecione o Ano</FormLabel>
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                <option>{initDate.getFullYear() - 1}</option>
                <option>{initDate.getFullYear()}</option>
                <option>{initDate.getFullYear() + 1}</option>
              </Select>
            </FormControl>
          </Grid>

          <Divider mt={5} mb={5} />

          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={5}
            justifyContent="center"
          >
            {schedules.map((sch) => (
              <Box
                borderWidth="1px"
                rounded="md"
                overflow="hidden"
                h="min-content"
              >
                <Flex justify="center" align="center" bg="blue.500" p={2}>
                  <Icon as={AiOutlineCalendar} fontSize="3xl" color="white" />
                  <Heading fontSize="md" ml={3} color="white">
                    {format(new Date(sch.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: pt_br,
                    })}
                  </Heading>
                </Flex>
                <Stack p={2}>
                  {!sch.events.length || !sch.events ? (
                    ""
                  ) : (
                    <>
                      {sch.events
                        .sort(function (a, b) {
                          if (a.schedule < b.schedule) {
                            return -1;
                          }
                          if (a.schedule > b.schedule) {
                            return 1;
                          }
                        })
                        .map((ev) => (
                          <Flex
                            bg={"blackAlpha.100"}
                            rounded="md"
                            align="center"
                            p={1}
                            key={ev._id}
                          >
                            <Text fontWeight="bold" ml={1}>
                              {ev.schedule}
                            </Text>
                            <Box ml={3}>
                              <Text noOfLines={4} fontSize="sm">
                                {ev.description}
                              </Text>
                            </Box>
                            <Tooltip label="Excluir Evento" hasArrow>
                              <IconButton
                                icon={<FaTrash />}
                                size="sm"
                                variant="link"
                                colorScheme="red"
                                onClick={() => handleDelEvent(ev._id)}
                              />
                            </Tooltip>
                          </Flex>
                        ))}
                    </>
                  )}

                  <Button
                    leftIcon={<AiOutlineInsertRowBelow />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleSchedule(sch._id)}
                    _hover={{ transform: "scale(1.02)" }}
                    _active={{ transform: "scale(1)" }}
                  >
                    Inserir Evento
                  </Button>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Box>
      </Grid>

      <Modal
        isOpen={modalInsert}
        onClose={() => setModalInsert(false)}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inserir Evento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Horário</FormLabel>
              <DatePicker
                selected={scheduleDate}
                onChange={(date) => handleDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
                calendarClassName="calendar"
                showPopperArrow={false}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Horário"
                dateFormat="h:mm aa"
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Informações do Evento</FormLabel>
              <Textarea
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<AiFillSave />}
              _hover={{ transform: "scale(1.05)" }}
              _active={{ transform: "scale(1)" }}
              isLoading={loadingInsert}
              onClick={() => createEvent()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
