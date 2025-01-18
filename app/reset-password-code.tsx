import { useState } from "react";
import { Alert } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Center,
  Flex,
  Heading,
  FormControl,
  VStack,
  Input,
  Button,
  Text,
} from "native-base";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";

export default function ResetPassowrdCodeScreen() {
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    codigo: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(8, "O código de redefinição de senha tem 8 caracteres"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { confirmarCodigoRedefinicaoSenha } = useAuth();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const email = (await AsyncStorage.getItem(
      "redefine_password_email"
    )) as string;
    confirmarCodigoRedefinicaoSenha(email, data.codigo)
      .then(({ ok, reason }) => {
        if (ok) {
          router.push("/set-new-password");
        } else if (reason === "server_off") {
          Alert.alert(
            "Erro",
            "Nesse momento os nossos servidores estão fora do ar"
          );
        } else if (reason === "invalid_code") {
          Alert.alert(
            "Erro",
            "Nesse momento os nossos servidores estão fora do ar"
          );
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <Center bg="#FFFFFF"  w="100%" h="100%">
      <Box safeArea py="8" w="90%" maxW="300">
        <Heading size="2xl" textAlign="center">
          sarc
        </Heading>

        <Text textAlign="center" mt="3" mb="1">
          código de confirmação
        </Text>

        <Flex direction="row" justify="center" align="center" mt="8">
          <Text textAlign="center">
            Enviamos um código de confirmação para o seu email, copie e cole ele
            abaixo
          </Text>
        </Flex>

        <VStack space={3} mt="5">
          <Controller
            name="codigo"
            control={control}
            rules={{
              required: true,
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl>
                <FormControl.Label>Código de confirmação</FormControl.Label>
                <Input
                  maxLength={8}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <Text mt="0.5" color="red.500">
                  {errors?.codigo?.message}
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
            Confirmar Código
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
        </VStack>
      </Box>
    </Center>
  );
}
