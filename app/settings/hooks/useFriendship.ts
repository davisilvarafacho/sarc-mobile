import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export function useFriendship() {
  const { sendPut } = useApi("amizades_usuarios");

  const queryClient = useQueryClient();

  async function sendFriendRequest(idUsuario: number) {}
  async function acceptFriendRequest(idRequest: number) {
    return sendPut(idRequest, {}, { actionEndpoint: "aceitar" }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["amizades_usuarios"],
      });
    });
  }
  async function declineFriendRequest(idRequest: number) {
    return sendPut(idRequest, {}, { actionEndpoint: "recusar" }).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["amizades_usuarios"],
        });
      });
  }

  return {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
  };
}
