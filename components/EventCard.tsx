import { Pressable, Linking } from "react-native";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Flex,
  Heading,
  IconButton,
  Icon,
  Button,
} from "native-base";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  id: number;
  titulo: string;
  descricao: string;
  linkGoogleMaps: string;
  data: string;
  hora: string;
};

export default function EventCard({
  id,
  titulo,
  descricao: categoria,
  linkGoogleMaps,
  data,
  hora,
}: Props) {
  return (
    <Box
      style={{
        padding: 3,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
      }}
    >
      <Box overflow="hidden" shadow={2} p={4} bg="white">
        <Heading fontSize="lg" fontWeight="bold" textAlign="center">
          {titulo}
        </Heading>

        <Heading fontSize="sm" opacity="0.5" textAlign="center" mt="3">
          {categoria}
        </Heading>

        <Flex direction="row" w="full" justify="space-around" mt="5">
          <Text ml="4">Data</Text>
          <Text mr="-3">Horário</Text>
        </Flex>

        <Flex direction="row" w="full" justify="space-around" mt="5">
          <Box bg="gray.100" p="2" shadow="9" borderRadius="2xl">
            <Flex direction="row">
              <Text mr="2">{data}</Text>
              <Icon mt="0.5" as={FontAwesome} name="calendar" size="sm" />
            </Flex>
          </Box>

          <Box bg="gray.100" p="2" shadow="9" borderRadius="2xl">
            <Flex direction="row">
              <Text mr="2">{hora}</Text>
              <Icon mt="0.5" as={FontAwesome} name="clock-o" size="sm" />
            </Flex>
          </Box>
        </Flex>

        <Flex direction="row" justify="center" mt="8">
          <Icon mt="0.5" as={FontAwesome} name="map-marker" size="sm" />
          <Text
            ml="2"
            onPress={() => {
              Linking.openURL(linkGoogleMaps);
            }}
          >
            Localização
          </Text>
        </Flex>

        {/*
          * TODO convidar pessoas + 5 fotos das pessoas que foram convidadas
          * TODO ver seria essa tela com a SARC

          <Flex direction="row" justify="center" mt="8">
            <Icon mt="0.5" as={FontAwesome} name="search" size="sm" />
            <Text ml="2">Convidar pessoas</Text>
          </Flex>
        */}

        <Button
          mt="6"
          borderRadius="3xl"
          onPress={() => {
            router.push(`/events/${id}`);
          }}
        >
          Acessar
        </Button>
      </Box>
    </Box>
  );
}
