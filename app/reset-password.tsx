import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  Center,
  Flex,
  Heading,
  FormControl,
  VStack,
  Input,
  Button,
  HStack,
  Text,
} from "native-base";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    email: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(5, "Esse campo deve ter no mínimo 5 caracteres")
      .email("Esse email não é válido"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // email: "davi.s.rafacho@gmail.com",
    },
  });

  const { enviarEmailRedefinicaoSenha } = useAuth();

  async function onSubmit(data: FormData) {
    setLoading(true);
    enviarEmailRedefinicaoSenha(data.email)
      .then(async () => {
        await AsyncStorage.setItem("redefine_password_email", data.email);
        router.push("/reset-password-code");
      })
      .catch((err) => {})
      .finally(() => setLoading(false));
  }

  return (
    <Center bg="#FFFFFF" w="100%" h="100%">
      <Box safeArea py="8" w="90%" maxW="300">
        <Heading size="2xl" textAlign="center">
          sarc
        </Heading>

        <Text textAlign="center" mt="3" mb="1">
          redefinir senha
        </Text>

        <VStack space={3} mt="5">
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <Text mt="0.5" color="red.500">
                  {errors?.email?.message}
                </Text>
              </FormControl>
            )}
          />

          <Button
            mt="2"
            rounded="full"
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Enviar Email
          </Button>

          {/*  <Link
            style={{
              fontWeight: 800,
              marginVertical: 8,
              alignSelf: "center",
            }}
            href="/"
          >
            Voltar para o login
          </Link> */}
        </VStack>
      </Box>
    </Center>
  );
}
