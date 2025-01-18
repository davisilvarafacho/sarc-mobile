import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Platform,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import {
  Box,
  Divider,
  FlatList,
  Input,
  Text,
  VStack,
  Spinner,
  Center,
  HStack,
  Image,
  Button,
  Heading,
} from "native-base";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import { useApi } from "@/hooks/useApi";

type PlaceCardProps = {
  imageUrl: string;
  title: string;
  description: string;
};

const PlaceCard: React.FC<PlaceCardProps> = ({
  imageUrl,
  title,
  description,
}) => (
  <Box
    borderWidth={1}
    borderRadius="lg"
    overflow="hidden"
    shadow={2}
    width="100%"
    maxW="400px"
    margin="auto"
    mb="3"
  >
    <Image source={{ uri: imageUrl }} alt={title} width="100%" height={200} />
    <VStack p={4} space={2}>
      <Heading size="md">{title}</Heading>
      <Text color="gray.500">{description}</Text>

      {/* <Text noOfLines={3}>
        
      </Text> */}
    </VStack>
  </Box>
);

export default function TodosOsResultadosLugares() {
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { search } = useLocalSearchParams<{ search: string }>();

  const { sendGetList } = useApi("lugares");

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["lugares", `search=${search}`],
    queryFn: () => sendGetList<Lugar>({ search }).then((dados) => dados),
  });

  const handleEndReached = () => {
    if (!isLoading && hasMore) {
    }
  };

  const renderRecommendedPlace = ({ item }: { item: Lugar }) => (
    <PlaceCard
      imageUrl={item.imagem!}
      title={item.nome}
      description={item.descricao}
    />
  );

  return (
    <Box safeArea pb="20" px="5" pt="2">
      <Heading size="xl" textAlign="center">
        Todos os resultados
      </Heading>

      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {isSuccess && (
        <Box px="2" mt="5">
          <FlatList
            data={data?.resultados || []}
            renderItem={renderRecommendedPlace}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading ? <Spinner /> : null}
          />
        </Box>
      )}
    </Box>
  );
}
