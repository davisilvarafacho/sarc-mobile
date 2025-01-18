import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

import BlogCard from "@/components/BlogCard";
import { useApi } from "@/hooks/useApi";

export default function TabTwoScreen() {
  const { sendGetList } = useApi("postagens");

  const { data: postagens, isLoading: carregandoPostagens } = useQuery({
    refetchOnMount: true,
    queryKey: ["postagens"],
    queryFn: () => sendGetList<Postagem>({ index__isnull: true }),
  });

  const { data: postagensFixadas, isLoading: carregandoPostagensFixadas } =
    useQuery({
      refetchOnMount: true,
      queryKey: ["postagens", "fixadas=true"],
      queryFn: () => sendGetList<Postagem>({ index__isnull: false, ordering: "index" }),
    });

  if (carregandoPostagens || carregandoPostagensFixadas) {
    return (
      <HStack safeArea h="100%" justifyItems="center" justifyContent="center">
        <Spinner size="lg" />
      </HStack>
    );
  }

  return (
    <Box bg="white" h="full" px="2" pt="6" safeArea>
      <Heading size="lg" paddingLeft="5" mb="4">
        Dicas e newsletters
      </Heading>

      {/* <HStack paddingLeft="5" size="md" mb="1" mt="5">
        <Icon as={FontAwesome5} name="thumbtack" mt="1.5" size={18} />
        <Text fontSize="xl" color="gray.400">
          Fixados
        </Text>
      </HStack> */}

      <Box px="4" mt="4">
        {postagensFixadas?.resultados.length === 0 && (
          <Flex justifyContent="center" alignItems="center" h="12">
            <Heading size="sm" color="gray.400">
              Nenhuma postagem fixada
            </Heading>
          </Flex>
        )}

        {postagensFixadas?.resultados.length !== 0 && (
          <Box mb="300">
            <Carousel
              loop
              width={350}
              height={320}
              autoPlay={true}
              data={postagensFixadas?.resultados || []}
              scrollAnimationDuration={1000}
              renderItem={({ index, item }) => (
                <BlogCard
                  key={item.id}
                  id={item.id}
                  urlImagem={item.banner}
                  slug={item.slug}
                  titulo={item.titulo}
                  subtitulo={item.subtitulo}
                  autor={item.autor.full_name}
                  tempoLeitura={item.tempo_leitura}
                />
              )}
            />
          </Box>
        )}

      </Box>

      <Divider my="6" />

      <Box px="4">
        <ScrollView>
          <VStack space="4">
            {postagens?.resultados.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                urlImagem={post.banner}
                slug={post.slug}
                titulo={post.titulo}
                subtitulo={post.subtitulo}
                autor={post.autor.full_name}
                tempoLeitura={post.tempo_leitura}
              />
            ))}
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}
