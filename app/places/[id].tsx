import { useWindowDimensions } from "react-native";
import {
  Text,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spinner,
  VStack,
  Button,
  Image,
} from "native-base";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Stars from "react-native-stars";

import { useApi } from "@/hooks/useApi";
import { realMask, whatsappMask } from "@/utils/masks";

function TopBanner({ titulo }: { titulo: string }) {
  return (
    <Box bg="#03624C" py="4">
      <Heading size="lg" color="white" textAlign="center">
        {titulo}
      </Heading>
    </Box>
  );
}

export default function Lugar() {
  const { width } = useWindowDimensions();

  const { id } = useLocalSearchParams();

  const { sendGetRetrieve } = useApi("lugares");

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["lugares", id],
    queryFn: async () => sendGetRetrieve<Lugar>(+id),
  });

  if (isLoading) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" mr="1" />
      </HStack>
    );
  }

  return (
    <Box h="100%" safeArea>
      <Image
        width="full"
        height="30%"
        source={{ uri: data?.imagem || "https://placehold.co/600x400" }}
        alt="imagem do lugar"
      />

      <TopBanner titulo={data?.nome || ""} />

      <VStack alignItems="center" space="lg" mt="6" px="12">
        <Flex direction="row">
          <Icon color="#03624C" as={FontAwesome} name="map-marker" size="lg" />
          <Text textAlign="center">
            <Text>{data?.endereco_completo}</Text>
          </Text>
        </Flex>

        <Flex direction="row">
          <Icon
            color="#03624C"
            as={FontAwesome}
            name="money"
            size="lg"
            mr="1"
          />
          <Text textAlign="center">
            {realMask(data!.valor_minimo)} - {realMask(data!.valor_maximo)}
          </Text>
        </Flex>

        <Flex direction="row">
          <Icon
            color="#03624C"
            as={FontAwesome}
            name="building"
            size="lg"
            mr="1"
          />
          <Text textAlign="center">{data?.categoria.nome}</Text>
        </Flex>

        <Flex direction="row">
          <Icon
            color="#03624C"
            as={FontAwesome}
            name="whatsapp"
            size="lg"
            mr="1"
          />
          <Text textAlign="center">{whatsappMask(data?.whatsapp)}</Text>
        </Flex>

        <Flex direction="row">
          <Icon color="#03624C" as={FontAwesome} name="exclamation" size="lg" />
          <Text textAlign="center">
            {data?.observacao || "Sem observações"}
          </Text>
        </Flex>

        <Box mt="6">
          <Stars
            half={true}
            disabled
            default={0}
            // update={(val) => {}}
            spacing={4}
            starSize={40}
            count={5}
            fullStar={
              <Icon as={FontAwesome} name="star" color="#03624C" size="2xl" />
            }
            emptyStar={
              <Icon as={FontAwesome} name="star-o" color="#03624C" size="2xl" />
            }
            halfStar={
              <Icon
                as={FontAwesome}
                name="star-half-o"
                color="#03624C"
                size="2xl"
              />
            }
          />
        </Box>
      </VStack>

      <Box px="12" position="absolute" bottom="12" left="2">
        <Button
          w="72"
          borderRadius="2xl"
          leftIcon={
            <Icon color="white" as={FontAwesome} name="calendar" size="sm" />
          }
          onPress={() => router.push(`/events/cadastro?idLugar=${id}`)}
        >
          Agendar Evento
        </Button>
      </Box>
    </Box>
  );
}
