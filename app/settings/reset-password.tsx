import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import { router } from "expo-router";
import { Alert } from "react-native";
import { auth } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    senhaAtual: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(6, "Senha atual deve ter no mínimo 6 caracteres"),
    novaSenha: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(8, "Nova senha deve ter no mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
      ),
    confirmarNovaSenha: z
      .string({ required_error: "Esse campo é obrigatório" })
      .min(8, "Confirmação de senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarNovaSenha"],
  });

export default function ResetPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [dadosToken, setDadosToken] = useState<null | JWT>(null);

  const { trocarSenha } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    trocarSenha(dadosToken!.user_email, data.senhaAtual, data.novaSenha)
      .then(() => {
        toast.show({
          title: "Sucesso",
          description: "Sua senha foi redefinida com sucesso",
          duration: 2000,
          placement: "top",
        });
        router.replace("/(tabs)");
      })
      .catch((err) => {
        Alert.alert(
          "Erro",
          "Não foi possível salvar seus dados. Tente novamente mais tarde."
        );
      })

      .finally(() => setLoading(false));
  };

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
  }, []);

  return (
    <Box flex="1" p="4" safeArea>
      <Heading size="lg" textAlign="center" mb={4}>
        Redefinir Senha
      </Heading>

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={5}
        enableOnAndroid
        keyboardOpeningTime={0}
      >
        <VStack space={4} flex={1} mt="2">
          <FormControl isInvalid={!!errors.senhaAtual}>
            <FormControl.Label>Senha Atual</FormControl.Label>
            <Controller
              control={control}
              name="senhaAtual"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite sua senha atual"
                  secureTextEntry
                />
              )}
            />
            {errors.senhaAtual && (
              <Text color="red.500">{errors.senhaAtual.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.novaSenha}>
            <FormControl.Label>Nova Senha</FormControl.Label>
            <Controller
              control={control}
              name="novaSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite sua nova senha"
                  secureTextEntry
                />
              )}
            />
            {errors.novaSenha && (
              <Text color="red.500">{errors.novaSenha.message}</Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.confirmarNovaSenha}>
            <FormControl.Label>Confirmar Nova Senha</FormControl.Label>
            <Controller
              control={control}
              name="confirmarNovaSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Confirme sua nova senha"
                  secureTextEntry
                />
              )}
            />
            {errors.confirmarNovaSenha && (
              <Text color="red.500">{errors.confirmarNovaSenha.message}</Text>
            )}
          </FormControl>
        </VStack>
      </KeyboardAwareScrollView>

      <Box position="absolute" bottom={10} left={0} right={0} p={4}>
        <Button borderRadius="3xl" onPress={handleSubmit(onSubmit)} isLoading={loading}>
          Redefinir Senha
        </Button>
      </Box>
    </Box>
  );
}
