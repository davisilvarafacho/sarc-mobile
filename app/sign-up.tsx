import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Center,
  Heading,
  Icon,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";
import { FontAwesome } from "@expo/vector-icons";

export default function CadastroScreen() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const schema = z.object({
    username: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(2, "Esse campo deve ter no mínimo 2 caracteres"),
    nome: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(2, "Esse campo deve ter no mínimo 2 caracteres"),
    sobrenome: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(2, "Esse campo deve ter no mínimo 2 caracteres"),
    email: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(5, "Esse campo deve ter no mínimo 5 caracteres")
      .email("Esse email não é válido"),
    /* celular: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(11, "Esse campo deve ter 11 caracteres"), */
    senha: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/\d/, "A senha deve conter pelo menos um número")
      .regex(
        /[@$!%*?&#]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { cadastro, login, validarCadastroEmail, validarCadastroUsername } =
    useAuth();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const emailValido = await validarCadastroEmail(data.email);
    if (emailValido) {
      setError("email", {
        type: "custom",
        message: "Esse email já foi utilizado",
      });
      setLoading(false);
      return;
    }

    const usernameValido = await validarCadastroUsername(data.username);

    if (usernameValido) {
      setError("username", {
        type: "custom",
        message: "Esse username já foi utilizado",
      });
      setLoading(false);
      return;
    }

    cadastro(data.username, data.nome, data.sobrenome, data.email, data.senha)
      .then((dados) => {
        if (!dados) return;
        login(data.email, data.senha).then((token) => {
          AsyncStorage.setItem("jwt", token);
          router.navigate("/(tabs)");
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={1}
      keyboardOpeningTime={0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center w="100%" h="100%" bg="#FFFFFF">
          <Box safeArea py="8" w="90%" maxW="290">
            <Heading size="2xl" textAlign="center">
              sarc
            </Heading>

            <Text textAlign="center" mt="3" mb="1">
              cadastro
            </Text>

            <FormControl isInvalid={!!errors.username} mb="4">
              <FormControl.Label>Username</FormControl.Label>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.username && (
                <Text color="red.500">{errors.username.message}</Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.nome} mb="4">
              <FormControl.Label>Nome</FormControl.Label>
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.nome && (
                <Text color="red.500">{errors.nome.message}</Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.sobrenome} mb="4">
              <FormControl.Label>Sobrenome</FormControl.Label>
              <Controller
                control={control}
                name="sobrenome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.sobrenome && (
                <Text color="red.500">{errors.sobrenome.message}</Text>
              )}
            </FormControl>

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

            {/* <FormControl isInvalid={!!errors.celular} mb="4">
              <FormControl.Label>Celular</FormControl.Label>
              <Controller
                control={control}
                name="celular"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    keyboardType="number-pad"
                    maxLength={11}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.celular && (
                <Text color="red.500">{errors.celular.message}</Text>
              )}
            </FormControl> */}

            <FormControl isInvalid={!!errors.senha} mb="4">
              <FormControl.Label>Senha</FormControl.Label>
              <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    type={show ? "text" : "password"}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    InputRightElement={
                      <Pressable onPress={() => setShow(!show)}>
                        {show ? (
                          <Icon
                            as={FontAwesome}
                            name="eye"
                            size="lg"
                            mr="2"
                            color="muted.400"
                          />
                        ) : (
                          <Icon
                            as={FontAwesome}
                            name="eye-slash"
                            size="lg"
                            mr="2"
                            color="muted.400"
                          />
                        )}
                      </Pressable>
                    }
                  />
                )}
              />
              {errors.senha && (
                <Text color="red.500">{errors.senha.message}</Text>
              )}
            </FormControl>

            {/* <Controller
              name="senha"
              control={control}
              rules={{
                required: true,
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormControl mt="2" isInvalid={!!errors.senha}>
                  <FormControl.Label>Senha</FormControl.Label>
                  <Input
                    type="password"
                    maxLength={30}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.senha && (
                    <Text mt="0.5" color="red.500">
                      {errors.senha.message}
                    </Text>
                  )}
                </FormControl>
              )}
            /> */}

            <Button
              mt="5"
              rounded="full"
              isLoading={loading}
              onPress={handleSubmit(onSubmit)}
            >
              Cadastrar
            </Button>

            {/* <Link
              style={{
                fontWeight: 800,
                marginVertical: 8,
                alignSelf: "center",
              }}
              href="/"
            >
              Voltar para o login
            </Link> */}
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
