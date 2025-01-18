import React from "react";
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
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { FriendRequestItem } from "./components/FriendRequest";

export default function FriendsScreen() {
  const { sendGetList } = useApi("amizades_usuarios");

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["amizades_usuarios", "ativo=false"],
    queryFn: () => sendGetList<AmizadeUsuario>({ ativo: false }),
  });

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
        Meus amigos
      </Heading>

      {isSuccess && (
        <>
          {data?.resultados.length === 0 && (
            <Text textAlign="center" color="gray.500" mt="2.5">
              Nenhum pedido de amizade pendente
            </Text>
          )}

          {data?.resultados.map((amizade) => (
            <FriendRequestItem
              key={amizade.id}
              id={amizade.id}
              imageUrl={amizade.amigo.avatar}
              nomeCompletoUsuario={`${amizade.amigo.first_name} ${amizade.amigo.last_name}`}
              username={amizade.amigo.username}
            />
          ))}
        </>
      )}
    </Box>
  );
}
