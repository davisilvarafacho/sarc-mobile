import { Pressable } from "react-native";
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
} from "native-base";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  id: number;
  urlImagem: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  autor: string;
  tempoLeitura: number;
};

export default function BlogCard({
  id,
  urlImagem,
  slug,
  titulo,
  subtitulo,
  autor,
  tempoLeitura,
}: Props) {
  return (
    <Pressable
      style={{
        padding: 3,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
      }}
      onPress={() => {
        router.push({
          pathname: "/posts/[id]",
          params: {
            id: id,
            title: slug,
          },
        });
      }}
    >
      <Box
        overflow="hidden"
        shadow={2}
        p={4}
        bg="white"
      >
        <Text fontSize="lg" fontWeight="bold" textAlign="center" isTruncated>
          {titulo}
        </Text>
        <VStack space={2} mt={3} alignItems="center">
          <Image
            source={{ uri: urlImagem }}
            alt="Banner"
            height={150}
            width="100%"
            // h="87"
            resizeMode="contain"
            rounded="2xl"
          />

          <Text fontSize="md" color="gray.500" textAlign="center">
            {subtitulo}
          </Text>

          <HStack space={2} alignItems="start" mt={2}>
            <Text fontSize="sm" color="gray.600">
              {autor}
            </Text>

            <Text fontSize="sm" color="gray.600">
              •
            </Text>

            <Text fontSize="sm" color="gray.600">
              {tempoLeitura} minuto(s)
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}
