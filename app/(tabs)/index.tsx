import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Platform,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, type Region } from "react-native-maps";
import {
  Box,
  Divider,
  Input,
  Text,
  VStack,
  Spinner,
  Center,
  HStack,
  Image,
  Button,
  Heading,
  Flex,
  Switch,
} from "native-base";
import { useQuery } from "@tanstack/react-query";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

import { useApi } from "@/hooks/useApi";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

export default function Index() {
  const [opened, setOpened] = useState<boolean>(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // categorias
  const [totalCategorias, setTotalCategorias] = useState<number>(3);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);

  const { sendGetList } = useApi("lugares");

  const {
    value: search,
    setValue: setSearch,
    debouncedValue: debouncedSearch,
  } = useDebouncedSearch();

  const {
    data: lugares,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: [
      "lugares",
      `categoria__in=${categoriasSelecionadas.join(",")}`,
      `search=${debouncedSearch}`,
    ],
    queryFn: () =>
      sendGetList<Lugar>({
        search: debouncedSearch,
        categoria__in: categoriasSelecionadas.join(","),
      }).then((dados) => {
        setSearchResults(dados.resultados);
        return dados.resultados;
      }),
  });

  console.log(lugares?.length);

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: () =>
      sendGetList<CategoriaLugar>({}, { endpoint: "categorias_lugar" }),
  });

  useEffect(() => {
    if (!lugares) return;

    const processamento = lugares.map((lugar) => ({
      id: lugar.id,
      coordinate: {
        latitudeDelta: 0.0922,
        latitude: +lugar.latitude,
        longitudeDelta: 0.0421,
        longitude: +lugar.longitude,
      },
      title: lugar.nome,
      description: lugar.descricao,
    }));

    setMarkers(processamento);

    // sendGetList<Lugar>().then((dados) => {
    //   const processamento = dados.resultados.map((lugar) => ({
    //     id: lugar.id,
    //     coordinate: {
    //       latitudeDelta: 0.0922,
    //       latitude: +lugar.latitude,
    //       longitudeDelta: 0.0421,
    //       longitude: +lugar.longitude,
    //     },
    //     title: lugar.nome,
    //     description: lugar.descricao,
    //   }));

    //   setMarkers(processamento);
    // });
  }, [lugares]);

  async function getCurrentLocation() {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return;

    let location = (await Location.getLastKnownPositionAsync(
      {}
    )) as Location.LocationObject;
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MapView
        provider={Platform.OS === "android" ? "google" : undefined}
        style={styles.map}
        cameraZoomRange={{
          minCenterCoordinateDistance: 600,
          maxCenterCoordinateDistance: 100000,
          animated: true,
        }}
        region={region!}
        showsUserLocation={true}
        loadingEnabled={true}
        onMarkerSelect={(p) => {}}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => {
              router.push(`places/${marker.id}`);
            }}
          />
        ))}
      </MapView>

      <Box safeArea top={2} w="full" position="absolute" px="4">
        <Input
          w="full"
          size="2xl"
          bg="white"
          borderRadius="2xl"
          placeholder="Pesquisar endereço"
          leftElement={
            <FontAwesomeIcon
              style={{ marginLeft: 12 }}
              icon={faMagnifyingGlass}
            />
          }
          value={search}
          onChangeText={setSearch}
          onTouchStart={() => setOpened(true)}
          onBlur={() => setOpened(false)}
        />

        {!opened ? (
          <Box bg="#F8F9FA" pt="3" pb="3" px="4" mt="2" rounded="xl">
            <Heading size="sm">FILTRAR CATEGORIA</Heading>

            <Divider my="3" />

            <VStack>
              {isLoadingCategorias && (
                <ActivityIndicator
                  style={{ marginTop: 10, marginBottom: 10 }}
                />
              )}

              {categorias?.resultados
                .slice(0, totalCategorias)
                .map((categoria) => (
                  <Flex
                    key={categoria.id}
                    direction="row"
                    w="full"
                    justifyContent="space-between"
                  >
                    <Text fontSize="md">{categoria.nome}</Text>
                    <Switch
                      size="sm"
                      isChecked={categoriasSelecionadas.includes(categoria.id)}
                      onValueChange={(checked) => {
                        setCategoriasSelecionadas((c) =>
                          checked
                            ? [...c, categoria.id]
                            : c.filter((id) => id !== categoria.id)
                        );

                        // console.log(categoriasSelecionadas.includes(categoria.id)
                        // ? [...categoriasSelecionadas, categoria.id]
                        // : categoriasSelecionadas.filter((id) => id !== categoria.id));

                        // setCategoriasSelecionadas([]);
                      }}
                    />
                  </Flex>
                ))}

              <Flex w="full" direction="row" justifyContent="center">
                <Button
                  variant="ghost"
                  bg="transparent"
                  size="xs"
                  w="40"
                  onPress={() =>
                    setTotalCategorias((c) =>
                      c === 3 ? categorias!.length : 3
                    )
                  }
                >
                  <Text color="#03624C">
                    {totalCategorias === 3 ? "Mostrar tudo" : "Mostrar menos"}
                  </Text>
                </Button>
              </Flex>
            </VStack>

            {/* <VStack>
              <Flex direction="row" w="full" justifyContent="space-between">
                <Text fontSize="md">Academia</Text>
                <Switch size="sm" />
              </Flex>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                mt="1"
              >
                <Text fontSize="md">Beach Tênis</Text>
                <Switch size="sm" />
              </Flex>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                mt="1"
              >
                <Text fontSize="md">Corrida</Text>
                <Switch size="sm" />
              </Flex>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                mt="1"
              >
                <Text fontSize="md">Futebol</Text>
                <Switch size="sm" />
              </Flex>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                mt="1"
              >
                <Text fontSize="md">Tênis</Text>
                <Switch size="sm" />
              </Flex>
            </VStack> */}
          </Box>
        ) : null}
      </Box>

      <Box safeArea top={2} w="full" position="absolute" px="4">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Input
            w="full"
            size="2xl"
            bg="white"
            borderRadius="2xl"
            placeholder="Pesquise aqui..."
            leftElement={
              <FontAwesomeIcon
                style={{ marginLeft: 12 }}
                icon={faMagnifyingGlass}
              />
            }
            value={search}
            onChangeText={setSearch}
            onTouchStart={() => setOpened(true)}
            onBlur={() => setOpened(false)}
          />
        </TouchableWithoutFeedback>

        {opened ? (
          <Box bg="white" rounded="md" shadow={2} mt={2} px={4} py={2} pb={4}>
            {isError ? (
              <Center>Ocorreu um erro ao carregar os dados...</Center>
            ) : null}

            {isLoading && search ? <Spinner /> : null}

            {isSuccess ? (
              <Box>
                {isSuccess
                  ? lugares.map((lugar) => (
                      <TouchableOpacity
                        key={lugar.id}
                        onPress={() => router.push(`places/${lugar.id}`)}
                      >
                        <HStack pr={50} py={2} space={4} alignItems="center">
                          <Image
                            source={{ uri: lugar.imagem! }}
                            alt={lugar.nome}
                            size="xs"
                            borderRadius={150}
                          />
                          <VStack space={2}>
                            <Text fontWeight="bold">{lugar.nome}</Text>
                            <Text>{lugar.descricao}</Text>
                          </VStack>
                        </HStack>
                      </TouchableOpacity>
                    ))
                  : null}

                {searchResults.length !== 0 ? (
                  <Button
                    mt={3}
                    bgColor="transparent"
                    variant="ghost"
                    onPress={() => {
                      router.push(`lugares/?search=${search}`);
                    }}
                  >
                    <Text color="#03624C">Ver todos os resultados</Text>
                  </Button>
                ) : null}
              </Box>
            ) : null}

            {isSuccess && searchResults.length === 0 ? (
              <Text mt={3} textAlign="center" color="gray.400">
                Nenhum resultado encontrado
              </Text>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  recenterButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#03624C",
    borderRadius: 50,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
});
