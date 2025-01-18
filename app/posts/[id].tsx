import { useWindowDimensions } from "react-native";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Spinner,
  VStack,
} from "native-base";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import RenderHtml from "react-native-render-html";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/useApi";

function TopBanner({ titulo }) {
  return (
    <Box bg="#03624C" py="4" px="12">
      <HStack>
        <Heading size="lg" color="white" textAlign="center">
          {titulo}
        </Heading>
      </HStack>
      <IconButton
        size="md"
        position="absolute"
        right={1.5}
        top={3}
        bg="#00DF82"
        borderRadius="full"
        pb="3"
        pt="1.5"
        onPress={() => router.back()}
      >
        <Icon color="white" as={FontAwesome} name="times" size="lg" />
      </IconButton>
    </Box>
  );
}

export default function Postagem() {
  const { width } = useWindowDimensions();

  const { id } = useLocalSearchParams();

  const { sendGetRetrieve } = useApi("postagens");

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["postagens", id],
    queryFn: async () => sendGetRetrieve<Postagem>(+id),
  });

  if (isLoading) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" />
      </HStack>
    );
  }

  const source = {
    html: `
  ${data?.corpo}
    `,
  };

  return (
    <Box pt="6" safeArea h="100%">
      <TopBanner titulo={data?.titulo} />

      <ScrollView>
        <Box px="8" mt="6">
          <RenderHtml contentWidth={width} source={source} />
        </Box>
      </ScrollView>

      <Box
        position="absolute"
        bottom="8"
        left="20%"
        bg="#042222"
        w="240"
        h="12"
        pt="1"
        borderRadius="2xl"
      >
        <Flex direction="row" justify="space-evenly">
          <IconButton size="md" onPress={() => router.back()}>
            <Icon color="white" as={FontAwesome} name="heart" size="md" />
          </IconButton>

          <IconButton size="md" onPress={() => router.back()}>
            <Icon color="white" as={FontAwesome} name="comment" size="md" />
          </IconButton>

          <IconButton size="md" onPress={() => router.back()}>
            <Icon color="white" as={FontAwesome} name="bookmark" size="md" />
          </IconButton>
        </Flex>
      </Box>
    </Box>
  );
}
