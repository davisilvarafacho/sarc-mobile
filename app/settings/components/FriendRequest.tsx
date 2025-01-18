import React from "react";
import {
  Box,
  HStack,
  Avatar,
  Text,
  Button,
  Icon,
  VStack,
  IconButton,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useFriendship } from "../hooks/useFriendship";
import { UserImg } from "@/components/UserImg";

interface FriendRequestItemProps {
  id: number;
  imageUrl: string | null;
  nomeCompletoUsuario: string;
  username: string;
}

export function FriendRequestItem({
  id,
  imageUrl,
  nomeCompletoUsuario,
  username,
}: FriendRequestItemProps) {
  const { acceptFriendRequest, declineFriendRequest } = useFriendship();
  return (
    <Box
      padding={4}
      backgroundColor="white"
      borderRadius="md"
      shadow={1}
      marginBottom={4}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <HStack space={3} alignItems="center">
          {/* <Avatar size="md" source={{ uri: imageUrl }} /> */}
          <UserImg username={username} avatar={imageUrl} />
          <VStack>
            <Text fontWeight="bold" fontSize="md">
              {username}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {nomeCompletoUsuario}
            </Text>
          </VStack>
        </HStack>

        <HStack space={2}>
          <IconButton
            onPress={() => acceptFriendRequest(id)}
            variant="ghost"
            colorScheme="green"
            size="sm"
            borderRadius="full"
          >
            <Icon as={FontAwesome} name="check" size="sm" color="green.400" />
          </IconButton>

          <IconButton
            onPress={() => declineFriendRequest(id)}
            variant="ghost"
            colorScheme="red"
            size="sm"
            borderRadius="full"
          >
            <Icon as={FontAwesome} name="times" size="sm" color="red.500" />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
