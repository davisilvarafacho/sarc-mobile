import { Avatar, HStack, Heading, Text } from "native-base";

type Props = {
  username: string;
  avatar: string | null;
  size?: string;
};

export function UserImg({ username, avatar, size = "md" }: Props) {
  return (
    <Avatar size={size} bg="green.500" source={{ uri: avatar ?? undefined }}>
      {!avatar && (
        <Heading color="white" pt="0.5">
          {username?.charAt(0).toUpperCase()}
        </Heading>
      )}
    </Avatar>
  );
}
