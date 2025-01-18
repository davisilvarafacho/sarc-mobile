import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  HStack,
  IconButton,
  Icon,
  Divider,
} from "native-base";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { FontAwesome } from "@expo/vector-icons";
import { FriendRequestItem } from "./components/FriendRequest";

export default function FriendsRequestScreen() {
  const [idUsuario, setIdUsuario] = useState<null | number>(null);
  const [username, setUsername] = useState("");

  const { sendGetList, sendGetRetrieveByFilters, sendPost } = useApi("amizades_usuarios");

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["amizades_usuarios", "ativo=false"],
    queryFn: () =>
      sendGetList<AmizadeUsuario>({ amigo: idUsuario, ativo: false }),
    enabled: !!idUsuario,
  });
  const toast = useToast();

  async function handleAdicionarAmigo() {
    const amigo = await sendGetList<Usuario>(
      { username: username.trim() },
      { endpoint: "usuarios", actionEndpoint: "get_usuario_por_username" }
    )
      .then((usuario) => usuario)
      .catch((err) => err);
      
    if (amigo.$ok) {
      await sendPost<AmizadeUsuario>({ amigo: amigo.id })
        .then(() => {
          toast.show({ title: "Pedido de amizade enviado", placement: "top" });
          setUsername("")
        })
        .catch((err) => {
          toast.show({
            title: "Jà existe uma solicitação para esse usuário",
            placement: "top",
          });
        });

      return;
    }

    toast.show({ title: amigo.erro.mensagem });
  }

  useEffect(() => {
    (async () => {
      const token = (await AsyncStorage.getItem("jwt")) as string;
      const decodedToken: JWT = JSON.parse(atob(token.split(".")[1]));
      setIdUsuario(decodedToken.sub);
    })();
  }, []);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box flex={1} p={4} safeArea>
      <Heading size="lg" textAlign="center" mb={4}>
        Pedidos de amizade
      </Heading>

      <HStack
        space={5}
        alignItems="center"
        justifyContent="center"
        px="16"
        mt="4"
      >
        <FormControl>
          <FormControl.Label>Adicionar usuário</FormControl.Label>
          <Input
            placeholder="Digite o username do usuário"
            value={username}
            onChangeText={setUsername}
          />
        </FormControl>

        <Button
          size="sm"
          mt="7"
          leftIcon={<Icon as={FontAwesome} name="plus" />}
          onPress={handleAdicionarAmigo}
        >
          Adicionar
        </Button>
      </HStack>

      <Divider mt="7" />

      {isSuccess && (
        <Box mt="8">
          {data?.resultados.length === 0 && (
            <Text textAlign="center" color="gray.500">
              Nenhum pedido de amizade pendente
            </Text>
          )}

          {data?.resultados.map((amizade) => (
            <FriendRequestItem
              key={amizade.id}
              id={amizade.id}
              imageUrl={amizade.usuario.avatar}
              nomeCompletoUsuario={`${amizade.usuario.first_name} ${amizade.usuario.last_name}`}
              username={amizade.usuario.username}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
