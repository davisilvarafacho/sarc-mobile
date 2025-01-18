import { useState } from "react";
import {
  Heading,
  HStack,
  VStack,
  Spinner,
  Flex,
  FormControl,
  Input,
  Text,
  Button,
  Icon,
  Divider,
  useToast,
  Box,
  Image,
  Badge,
} from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";

import { useApi } from "@/hooks/useApi";

export default function EventsScreen() {
  const [carregando, setCarregando] = useState(false);

  const { sendGetRetrieve, sendPost } = useApi("eventos");

  const { idEvento } = useLocalSearchParams();

  const queryClient = useQueryClient();

  const {
    data: evento,
    isLoading: carregandoEvento,
    isSuccess: carregouSucesso,
  } = useQuery({
    queryKey: ["eventos", idEvento],
    queryFn: () => sendGetRetrieve<Evento>(+idEvento!),
  });

  const { data: inscricoesEvento } = useQuery({
    enabled: carregouSucesso,
    queryKey: ["inscricoes_evento", `evento=${evento?.id}`],
    queryFn: () =>
      sendGetRetrieve<ListBackendResponse<InscricaoEvento>>(evento!.id, {
        endpoint: "eventos",
        actionEndpoint: "inscricoes",
      }),
  });

  const schema = z.object({
    usuario: z.string({ required_error: "Esse campo é obrigatório" }),
  });

  type FormData = z.infer<typeof schema>;

  const toast = useToast();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function handleConvidarAmigo(data: FormData) {
    setCarregando(true);
    sendPost(data, {
      actionEndpoint: "convidar",
      endpoint: `eventos/${idEvento}`,
    })
      .then((dados) => {
        toast.show({
          title: `Convite enviado com sucesso para o usuário ${data.usuario}`,
          placement: "top",
        });

        reset();

        queryClient.invalidateQueries({
          queryKey: ["inscricoes_evento", `evento=${evento?.id}`],
        });
      })
      .catch((err) => {
        setError("usuario", {
          message: err?.usuario || "Ocorreu um erro inesperado",
        });
      })
      .finally(() => setCarregando(false));
  }

  if (carregandoEvento) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" />
      </HStack>
    );
  }

  return (
    <VStack bg="white" h="full" pt="6" px="2" safeArea>
      <Heading textAlign="center" size="lg">
        Convidar Para o Evento
      </Heading>

      <HStack
        space={5}
        alignItems="center"
        justifyContent="center"
        px="16"
        mt="4"
      >
        <FormControl isInvalid={!!errors.usuario} mb="4">
          <FormControl.Label>Usuário</FormControl.Label>
          <Controller
            control={control}
            name="usuario"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Digite o username de quem você que convidar"
              />
            )}
          />
          {errors.usuario && (
            <Text color="red.500">{errors.usuario.message}</Text>
          )}
        </FormControl>

        <Button
          mt="2"
          size="sm"
          leftIcon={<Icon as={FontAwesome} name="plus" />}
          onPress={handleSubmit(handleConvidarAmigo)}
        >
          Adicionar
        </Button>
      </HStack>

      {inscricoesEvento?.resultados.length === 0 && (
        <Text textAlign="center" mt="6" color="gray.400">
          Sem inscrições ainda...
        </Text>
      )}

      <VStack mt="6" px="3" space="4">
        {inscricoesEvento?.resultados.map((inscricao) => (
          <HStack
            key={inscricao.id}
            bg="#cde0db"
            space="4"
            padding="2"
            alignItems="center"
            borderColor="#03624C"
            borderStyle="solid"
            borderWidth="1"
            borderRadius="3xl"
          >
            <Box size={16} rounded="full" overflow="hidden">
              <Image
                source={{
                  uri:
                    inscricao.usuario.avatar ||
                    "https://randomuser.me/api/portraits/men/15.jpg",
                }}
                alt="Foto do perfil"
                size="full"
              />
            </Box>
            <VStack>
              <Text opacity="0.6" fontSize="lg">
                {inscricao.usuario.username}{" "}
                {inscricao.criador_evento && <Badge>Organizador</Badge>}
              </Text>

              <Text fontSize="lg">
                {inscricao.usuario.first_name} {inscricao.usuario.last_name}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      <Box w="70%" left={65} position="absolute" bottom="10">
        <Button
          leftIcon={<Icon as={FontAwesome} name="check" size="sm" />}
          onPress={() => {
            router.replace("/(tabs)");
          }}
        >
          Finalizar
        </Button>
      </Box>

      {/* <Divider my="7" /> */}
    </VStack>
  );
}
