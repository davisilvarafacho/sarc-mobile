import { Linking } from "react-native";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/useApi";

export default function Evento() {
  const { id } = useLocalSearchParams();

  const { sendGetRetrieve, sendGetList } = useApi("eventos");

  const {
    data: evento,
    isSuccess: carregouEvento,
    isLoading: carregandoEvento,
  } = useQuery({
    queryKey: ["eventos", id],
    queryFn: async () => sendGetRetrieve<Evento>(+id),
  });

  const { data: inscricoesEvento, isLoading: carregandoInscricoes } = useQuery({
    enabled: carregouEvento,
    refetchOnMount: true,
    queryKey: ["eventos", `evento=${evento?.id}`],
    queryFn: () =>
      sendGetRetrieve<ListBackendResponse<InscricaoEvento>>(evento!.id, {
        endpoint: "eventos",
        actionEndpoint: "inscricoes",
      }),
  });

  if (carregandoEvento) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" />
      </HStack>
    );
  }

  if (evento)
    return (
      <Box pt="6" safeArea h="100%">
        <Box>
          <Heading size="md" textAlign="center" mt="2">
            {evento?.nome}
          </Heading>

          <Center mt="6">
            <Text>Público</Text>
          </Center>

          <Flex direction="row" w="full" justify="space-around" mt="9">
            <Text ml="4">Data</Text>
            <Text mr="-3">Horário</Text>
          </Flex>

          <Flex direction="row" w="full" justify="space-around" mt="5">
            <Box bg="gray.100" p="3" shadow={9} borderRadius="2xl">
              <Flex direction="row">
                <Heading size="sm" mr="2">
                  {evento?.data.split("-").reverse().join("/")}
                </Heading>
                <Icon as={FontAwesome} name="calendar" size="sm" />
              </Flex>
            </Box>

            <Box bg="gray.100" p="3" shadow={9} borderRadius="2xl">
              <Flex direction="row">
                <Heading size="sm" mr="2">
                  {evento?.hora_inicio}
                </Heading>
                <Icon as={FontAwesome} name="clock-o" size="sm" />
              </Flex>
            </Box>
          </Flex>

          <Flex direction="row" justify="center" mt="12">
            <Icon mt="0.5" as={FontAwesome} name="map-marker" size="sm" />
            <Text
              ml="2"
              onPress={() => {
                Linking.openURL(evento.link_google_maps);
              }}
            >
              Localização
            </Text>
          </Flex>

          <Flex mt="8">
            <Flex direction="row" justifyContent="space-between" px="5">
              <Heading size="md" mb="2">
                Inscritos
              </Heading>

              <Button size="xs" onPress={() => router.push(`/events/invte-people-event?idEvento=${id}`)}>Convidar</Button>
            </Flex>

            {carregandoInscricoes && <Spinner />}
            {inscricoesEvento?.resultados.length === 0 && (
              <Text textAlign="center" mt="6">
                Nenhum inscrito até o momento
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
                      {inscricao.usuario.username}
                    </Text>

                    <Text fontSize="lg">
                      {inscricao.usuario.first_name}{" "}
                      {inscricao.usuario.last_name}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Flex>
        </Box>
      </Box>
    );
}
