import { Heading, HStack, VStack, Spinner, Flex, Button } from "native-base";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/useApi";
import EventCard from "@/components/EventCard";

export default function EventsScreen() {
  const { sendGetList } = useApi("eventos");

  const {
    data: evento,
    isLoading: carregandoEvento,
    isSuccess: carregouSucesso,
  } = useQuery({
    refetchInterval: 15000,
    refetchOnMount: true,
    queryKey: ["eventos"],
    queryFn: () =>
      sendGetList<Evento>({
        data__gte: new Date().toISOString().split("T")[0],
      }),
  });

  if (carregandoEvento) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" />
      </HStack>
    );
  }

  return (
    <VStack bg="white" h="full" pt="6" px="6" safeArea>
      <Flex direction="row" justify="space-between">
        <Heading size="lg">Minha agenda</Heading>
      </Flex>

      {carregandoEvento && <Spinner size="lg" mt="20" />}

      {carregouSucesso && evento?.resultados.length === 0 && (
        <Flex justifyContent="center" alignItems="center" h="full">
          <Heading size="sm" color="gray.400">
            Nenhum evento agendado
          </Heading>
        </Flex>
      )}

      <VStack mt="6" space="4">
        {evento?.resultados.map((evento) => (
          <EventCard
            key={evento.id}
            id={evento.id}
            titulo={evento.nome}
            linkGoogleMaps={evento.link_google_maps}
            descricao={evento.descricao}
            data={evento.data.split("-").reverse().join("/")}
            hora={evento.hora_inicio}
          />
        ))}
      </VStack>
    </VStack>
  );
}
