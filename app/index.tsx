import { router } from "expo-router";
import {
  Box,
  Center,
  FormControl,
  VStack,
  Input,
  Button,
  HStack,
  Text,
  Image,
  Heading,
  Flex,
} from "native-base";

export default function LoginScreen() {
  return (
    <Flex
      flex={1}
      direction="column"
      justify="space-between"
      alignItems="center"
      safeArea
    >
      <Image
        width="full"
        height="40%"
        alt="Banner"
        source={require("../assets/images/start-banner.png")}
      />

      <Box>
        <Heading textAlign="center">sarc</Heading>

        <Text fontSize="lg" textAlign="center">
          tudo em um só lugar.
        </Text>
      </Box>

      <Box>
        <Button
          w={150}
          borderRadius="2xl"
          onPress={() => {
            router.push("/sign-up");
          }}
        >
          Criar Conta
        </Button>

        <Button
          variant="link"
          _text={{ color: "black", fontSize: "md" }}
          mt="12"
          w={150}
          borderRadius="2xl"
          onPress={() => {
            router.push("/login");
          }}
        >
          Fazer Login
        </Button>

        {/* <Text
          fontSize="lg"
          textAlign="center"
          mt="12"
          onPress={() => {
            router.push("/login");
          }}
        >
          Fazer Login
        </Text> */}
      </Box>

      <Box></Box>
    </Flex>
  );
}
