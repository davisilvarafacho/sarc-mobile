import { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// remove import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// remove import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {
  Box,
  Center,
  FormControl,
  VStack,
  Input,
  Button,
  HStack,
  Text,
  Heading,
  Flex,
  Icon,
} from "native-base";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingToken, setLoadingToken] = useState(true);

  const schema = z.object({
    email: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(1, "Esse campo é obrigatório")
      .email("Esse email não é válido"),
    senha: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(1, "Esse campo é obrigatório"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { login } = useAuth();

  async function onSubmit(data: FormData) {
    setLoading(true);
    login(data.email, data.senha)
      .then(async (token) => {
        if (!token) throw new Error();
        router.replace("/(tabs)");
      })
      .catch((err) => {
        console.log("erro!", err);
        setLoading(false);
        Alert.alert("Aviso", "Email ou senha inválidos");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token) {
          router.replace("/(tabs)");
        }
      } catch (e) {
        console.log("Erro ao buscar o token", e);
      } finally {
        setLoadingToken(false);
      }
    };

    checkToken();
  }, []);

  if (loadingToken) {
    return (
      <Center w="100%" h="100%">
        <ActivityIndicator size="large" color="#03624C" />
      </Center>
    );
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={1}
      keyboardOpeningTime={0}
    >
      <Flex w="100%" h="100%" justify="center" px="12" bg="#FFFFFF" safeArea>
        <VStack>
          <Heading size="2xl" textAlign="center">
            sarc
          </Heading>

          <Text textAlign="center" mt="3" mb="1">
            login
          </Text>

          <FormControl isInvalid={!!errors.email} mb="4">
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text color="red.500">{errors.email.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.senha} mb="4">
            <FormControl.Label>Senha</FormControl.Label>
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  type="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.senha && (
              <Text color="red.500">{errors.senha.message}</Text>
            )}
          </FormControl>

          <Link href="/reset-password">Esqueci minha senha</Link>

          <Button
            w="full"
            rounded="full"
            mt="7"
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Login
          </Button>
        </VStack>
      </Flex>
    </KeyboardAwareScrollView>
  );
}
