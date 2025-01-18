import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInputMask } from "react-native-masked-text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Text,
  Spinner,
  Heading,
  useToast,
} from "native-base";
import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  username: z
    .string({ required_error: "Esse campo é obrigatório" })
    .min(1, "Nome de usuário é obrigatório"),
  nome: z
    .string({ required_error: "Esse campo é obrigatório" })
    .min(1, "Nome é obrigatório"),
  sobrenome: z
    .string({ required_error: "Esse campo é obrigatório" })
    .min(1, "Sobrenome é obrigatório"),
  email: z
    .string({ required_error: "Esse campo é obrigatório" })
    .email("Email inválido"),
  celular: z
    .string()
    .optional()
    .refine(
      (value) =>  value!.replace(/\D/g, '').length === 11,
      "Esse celular não é valido"
    ),
  dataNascimento: z
    .string({ required_error: "Esse campo é obrigatório" })
    .optional()
    .refine(
      (value) => !value || /^\d{2}\/\d{2}\/\d{4}$/.test(value),
      "Data de nascimento deve estar no formato DD/MM/YYYY"
    )
    .refine((value) => {
      if (!value) return true;
      const [day, month, year] = value.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }, "Data de nascimento inválida"),
});

type FormData = {
  username: string;
  nome: string;
  sobrenome: string;
  email: string;
  celular: string;
  dataNascimento: string;
};

type TransformedData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  cellphone: string | null;
  birth_date: string | null;
};

export default function AccountScreen() {
  const [loading, setLoading] = useState(false);
  const [dadosToken, setDadosToken] = useState<null | JWT>(null);

  const { sendGetRetrieve, sendPatch } = useApi("usuarios");

  const { validarCadastroEmail, validarCadastroUsername } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      nome: "",
      sobrenome: "",
      email: "",
      celular: "",
      dataNascimento: "",
    },
  });

  const { data, isLoading, error } = useQuery<Usuario>({
    queryKey: ["usuarios", dadosToken?.sub],
    queryFn: () => sendGetRetrieve(dadosToken!.sub),
    enabled: !!dadosToken?.sub,
  });

  const toast = useToast();

  function transformValues(data: FormData): TransformedData {
    return {
      username: data.username,
      email: data.email,
      first_name: data.nome,
      last_name: data.sobrenome,
      cellphone: data.celular === "" ? null : data.celular.replace(/\D/g, ""),
      birth_date: data.dataNascimento.split("/").reverse().join("-"),
    };
  }

  async function validarEmaiJaCadastrado(email: string, id: number) {
    const emailJaCadastrado = await validarCadastroEmail(email, id);
    return emailJaCadastrado;
  }

  async function validarUsernameJaCadastrado(username: string, id: number) {
    const usernameJaCadastrado = await validarCadastroUsername(username, id);
    return usernameJaCadastrado;
  }

  async function onSubmit(data: FormData) {
    const apiData = transformValues(data);
    const id = dadosToken?.sub;

    const emailValido = await validarEmaiJaCadastrado(apiData.email, id!);
    if (emailValido) {
      setError("email", {
        type: "custom",
        message: "Esse email já foi utilizado",
      });
    }

    const usernamelValido = await validarUsernameJaCadastrado(
      apiData.username,
      id!
    );
    if (usernamelValido) {
      setError("username", {
        type: "custom",
        message: "Esse username já foi utilizado",
      });
    }

    setLoading(true);
    sendPatch(id!, apiData)
      .then(() => {
        toast.show({
          title: "Sucesso",
          description: "Seus dados foram salvos com sucesso",
          duration: 2000,
          placement: "top",
        });
        router.replace("/(tabs)");
      })
      .catch((err) => {
        console.log(err.response);

        Alert.alert(
          "Erro",
          "Não foi possível salvar seus dados. Tente novamente mais tarde."
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("jwt");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setDadosToken(decodedToken);
        return;
      }

      router.replace("/");
    })();
  }, [data]);

  useEffect(() => {
    if (data) {
      setValue("username", data.username);
      setValue("nome", data.first_name);
      setValue("sobrenome", data.last_name);
      setValue("email", data.email);
      setValue("celular", data.cellphone);
      setValue(
        "dataNascimento",
        data.birth_date ? data.birth_date.split("-").reverse().join("/") : ""
      );
    }
  }, [data, setValue]);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text color="red.500">Erro ao carregar dados</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} safeArea>
      <Heading size="lg" textAlign="center" mb={4}>
        Minha Conta
      </Heading>

      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={1}
        keyboardOpeningTime={0}
      >
        <VStack space={4} flex={1} mt="2">
          <FormControl isInvalid={!!errors.username}>
            <FormControl.Label>Nome de usuário</FormControl.Label>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  isDisabled
                  readOnly
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite seu nome de usuário"
                />
              )}
            />
            {errors.username && (
              <Text color="red.500">{errors.username.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  isDisabled
                  readOnly
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite seu email"
                />
              )}
            />
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.nome}>
            <FormControl.Label>Nome</FormControl.Label>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  // returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite seu nome"
                />
              )}
            />
            {errors.nome && <Text color="red.500">{errors.nome.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.sobrenome}>
            <FormControl.Label>Sobrenome</FormControl.Label>
            <Controller
              control={control}
              name="sobrenome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  // returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite seu sobrenome"
                />
              )}
            />
            {errors.sobrenome && (
              <Text color="red.500">{errors.sobrenome.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.celular}>
            <FormControl.Label>Celular</FormControl.Label>
            <Controller
              control={control}
              name="celular"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputMask
                  customTextInput={Input}
                  value={value}
                  type="cel-phone"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  // returnKeyType="next"
                  placeholder="Digite seu celular"
                />
              )}
            />
            {errors.celular && (
              <Text color="red.500">{errors.celular.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.dataNascimento}>
            <FormControl.Label>Data de Nascimento</FormControl.Label>
            <Controller
              control={control}
              name="dataNascimento"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputMask
                  customTextInput={Input}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  type="datetime"
                  // returnKeyType="next"
                  options={{ format: "DD/MM/YYYY" }}
                  placeholder="Digite sua data de nascimento"
                />
              )}
            />
            {errors.dataNascimento && (
              <Text color="red.500">{errors.dataNascimento.message}</Text>
            )}
          </FormControl>
        </VStack>
      </KeyboardAwareScrollView>

      <Box position="absolute" bottom={10} left={0} right={0} p={4}>
        <Button
          borderRadius="3xl"
          onPress={handleSubmit(onSubmit)}
          isLoading={loading}
        >
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );
}
