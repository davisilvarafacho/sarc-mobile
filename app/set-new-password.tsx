import { useState } from "react";
import { Platform } from "react-native";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
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
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "native-base";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    senha: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/\d/, "A senha deve conter pelo menos um número")
      .regex(
        /[@$!%*?&#]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    // confirmarSenha: z.string({ required_error: "Esse campo é obrigatório" }),
  });
  /* .refine((data) => data.senha === data.confirmarSenha, {
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    }); */

  type FormData = z.infer<typeof schema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { redefinirSenha, login } = useAuth();

  async function onSubmit(data: FormData) {
    setLoading(true);

    const email = (await AsyncStorage.getItem(
      "redefine_password_email"
    )) as string;

    redefinirSenha(email, data.senha)
      .then(() => {
        login(email, data.senha).then(() => {
          router.replace("/(tabs)");
          AsyncStorage.removeItem("redefine_password_email");
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Center w="100%" h="100%" bg="#FFFFFF">
      <Box safeArea py="8" w="90%" maxW="300">
        <Heading size="2xl" textAlign="center">
          sarc
        </Heading>

        <Text textAlign="center" mt="3" mb="1">
          definir nova senha
        </Text>

        <VStack space={3} mt="5">
          <Controller
            name="senha"
            control={control}
            rules={{
              required: true,
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl>
                <FormControl.Label>Nova Senha</FormControl.Label>
                <Input
                  type="password"
                  size="2xl"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <Text mt="0.5" color="red.500">
                  {errors?.senha?.message}
                </Text>
              </FormControl>
            )}
          />

          <Button
            mt="2"
            borderRadius="full"
            colorScheme="indigo"
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Redefinir Senha
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
