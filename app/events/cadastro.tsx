import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Select,
  Text,
  VStack,
} from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useApi } from "@/hooks/useApi";
import { timeMask, dateMask } from "@/utils/masks";

function TopBanner({
  titulo,
  subtitulo,
}: {
  titulo: string;
  subtitulo: string;
}) {
  return (
    <Box bg="#03624C" pt="2" pb="3">
      <Heading size="xl" color="white" textAlign="center">
        {titulo}
      </Heading>

      <Heading size="md" color="white" textAlign="center" mt="2">
        {subtitulo}
      </Heading>
    </Box>
  );
}

export default function CriarEvento() {
  const { sendPost } = useApi("eventos");

  const { idLugar } = useLocalSearchParams();

  const schema = z.object({
    privacidade: z
      .string({ required_error: "Esse campo é obrigatório" })
      .default(() => "true"),
    nome: z.string({ required_error: "Esse campo é obrigatório" }),
    descricao: z
      .string({ required_error: "Esse campo é obrigatório" })
      .optional(),
    data: z
      .string({ required_error: "Esse campo é obrigatório" })
      .refine(
        (date) =>
          !isNaN(new Date(date.split("/").reverse().join("-")).getTime()),
        "A data do evento deve ser válida."
      ),
    hora: z
      .string({ required_error: "Esse campo é obrigatório" })
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "A hora do evento deve estar no formato HH:mm."
      ),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { privacidade: "true" },
  });

  async function onSubmit(data: FormData) {
    const dados = {
      nome: data.nome,
      descricao: data.descricao,
      publico: data.privacidade === "true",
      lugar: idLugar,
      data: data.data.split("/").reverse().join("-"),
      hora_inicio: data.hora + ":00",
    };

    // trocar o push por um replace e mudar o voltar para o visualização desse evento
    sendPost<Evento>(dados).then((dados) => router.push(`/events/invte-people-event?idEvento=${dados.id}`));
    // .catch((err) => console.log(err));
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={1}
      keyboardOpeningTime={0}
    >
      <Box h="100%" safeArea>
        <TopBanner titulo="Agendar Evento" subtitulo="Lagoa da Pampulha" />

        <Text fontSize="xl" textAlign="center" mt="3"></Text>

        <VStack
          justifyItems="start"
          justifyContent="start"
          alignItems="start"
          px="8"
          pt="2"
        >
          <FormControl isInvalid={!!errors.privacidade} mb="4">
            <FormControl.Label>Privacidade</FormControl.Label>
            <Controller
              control={control}
              name="privacidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  minWidth="200"
                  mt="1"
                  onValueChange={onChange}
                  selectedValue={value}
                >
                  <Select.Item label="Público" value="true" />
                  <Select.Item label="Privado" value="false" />
                </Select>
              )}
            />
            {errors.privacidade && (
              <Text color="red.500">{errors.privacidade.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.nome} mb="4">
            <FormControl.Label>Nome</FormControl.Label>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input value={value} onChangeText={onChange} onBlur={onBlur} />
              )}
            />
            {errors.nome && <Text color="red.500">{errors.nome.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.data} mb="4">
            <FormControl.Label>Data</FormControl.Label>
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={(text) => onChange(dateMask(text))}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.data && <Text color="red.500">{errors.data.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.hora} mb="4">
            <FormControl.Label>Hora Início</FormControl.Label>
            <Controller
              control={control}
              name="hora"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={(text) => onChange(timeMask(text))}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.hora && <Text color="red.500">{errors.hora.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.descricao} mb="4">
            <FormControl.Label>Descrição</FormControl.Label>
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input value={value} onChangeText={onChange} onBlur={onBlur} />
              )}
            />
            {errors.descricao && (
              <Text color="red.500">{errors.descricao.message}</Text>
            )}
          </FormControl>
        </VStack>

        <Box px="12" position="absolute" bottom="12" left="2">
          <Button
            w="72"
            borderRadius="2xl"
            onPress={handleSubmit(onSubmit)}
            // leftIcon={<></>}
          >
            Criar evento
          </Button>
        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
}
