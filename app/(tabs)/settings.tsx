import { useState, useEffect } from "react";
import {
  VStack,
  Box,
  HStack,
  Avatar,
  Text,
  Button,
  Heading,
  Icon,
  Badge,
} from "native-base";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { useApi } from "@/hooks/useApi";

export default function SettingsScreen() {
  const [idUsuario, setIdUsuario] = useState<null | number>(null);
  const [totalPedidos, setTotalPedidos] = useState(0);

  const { sendGetRetrieve } = useApi("usuarios");

  const { data } = useQuery<Usuario>({
    queryKey: ["usuarios", idUsuario],
    queryFn: () => sendGetRetrieve(idUsuario!),
    enabled: !!idUsuario,
  });

  useEffect(() => {
    (async () => {
      const id = (await AsyncStorage.getItem("userId")) as string;
      console.log({ id });

      setIdUsuario(+id);
    })();
  }, [data]);

  return (
    <VStack flex={1} bg="white" padding={4} space={4} safeArea>
      <HStack alignItems="center" space={4} pt="4" pl="1" mb="4">
        <Avatar
          size="lg"
          bg="#00DF82"
          source={{ uri: data?.avatar ?? undefined }}
        >
          {!data?.avatar && (
            <Heading color="white" pt="0.5">
              {data?.username.charAt(0).toUpperCase()}
            </Heading>
          )}
        </Avatar>

        <Text fontSize="lg" fontWeight="bold">
          {data?.username}
        </Text>
      </HStack>

      <Box flex={1} mt="4">
        <VStack alignItems="start" space={3}>
          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            onPress={() => router.push("/settings/friend-requests")}
            startIcon={<FontAwesome5 name="user-friends" size={20} />}
            endIcon={
              totalPedidos > 0 ? (
                <Badge
                  colorScheme="red"
                  rounded="full"
                  variant="solid"
                  _text={{
                    fontSize: "xs",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {totalPedidos}
                </Badge>
              ) : undefined
            }
          >
            <Text fontSize="md">Pedidos de amizade</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            onPress={() => router.push("/settings/account")}
            startIcon={
              <MaterialCommunityIcons name="circle-edit-outline" size={20} />
            }
            // startIcon={<Icon as={FontAwesome5} name="user-edit" size={20} />}
          >
            <Text fontSize="md">Alterar dados da conta</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            onPress={() => router.push("/settings/reset-password")}
            startIcon={<Feather name="lock" size={20} />}
          >
            <Text fontSize="md">Senha e segurança</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            startIcon={<Feather name="bell" size={20} />}
          >
            <Text fontSize="md">Preferência e Notificações</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            onPress={() => {
              router.replace("/login");
              router.dismissAll();
              AsyncStorage.clear();
            }}
            startIcon={<AntDesign name="logout" size={20} color="black" />}
          >
            <Text fontSize="md">Sair</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            startIcon={<Feather name="info" size={20} />}
          >
            <Text fontSize="md">Sobre Nós</Text>
          </Button>

          <Button
            justifyContent="flex-start"
            variant="ghost"
            bg="transparent"
            _pressed={{
              bg: "transparent",
            }}
            startIcon={<MaterialIcons name="privacy-tip" size={20} />}
          >
            <Text fontSize="md">Política de Privacidade</Text>
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
}
