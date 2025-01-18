import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "services/auth";

export function useAuth() {
  async function login(email: string, password: string) {
    const response = await auth
      .post("token/obtain/", { email, password })
      .then(async (res) => {
        const token = res.data.access;
        const dadosUsuario = res.data.user;

        await AsyncStorage.setItem("jwt", token);
        await AsyncStorage.setItem("userId", String(dadosUsuario.id));
        await AsyncStorage.setItem("userEmail", dadosUsuario.email);

        return token;
      })
      .catch((err) => {
        const NETWORK_ERROR = "AxiosError: Network Error";
        const ehErroConexao = String(err) === NETWORK_ERROR;

        let message;
        if (ehErroConexao)
          message =
            "Neste momento nossos servidores estão fora do ar. Tente novamente mais tarde";
        else message = err.response.data.mensagem;

        return null;
      });

    return response;
  }

  async function validarCadastroEmail(email: string, id: string = "") {
    const emailJaCadastrado = await auth
      .get(`validar_cadastro_email/?email=${email}&id=${id}`)
      .then((res) => res.data.cadastrado)
      .catch(() => true);

    return emailJaCadastrado;
  }

  async function validarCadastroUsername(username: string, id: string = "") {
    const emailJaCadastrado = await auth
      .get(`validar_cadastro_username/?username=${username}&id=${id}`)
      .then((res) => res.data.cadastrado)
      .catch(() => true);

    return emailJaCadastrado;
  }

  async function cadastro(
    username: string,
    nome: string,
    sobrenome: string,
    email: string,
    password: string
  ) {
    const response = await auth
      .post("cadastro/", {
        username,
        first_name: nome,
        last_name: sobrenome,
        email,
        password,
      })
      .then(() => login(email, password))
      .catch((err) => {});

    return response;
  }

  async function enviarEmailRedefinicaoSenha(email: string) {
    const response = await auth
      .post("enviar_email_redefinicao_senha/", {
        usuario: email,
      })
      .then(() => {})
      .catch((err) => {
        const NETWORK_ERROR = "AxiosError: Network Error";
        const ehErroConexao = String(err) === NETWORK_ERROR;
      });

    return response;
  }

  async function confirmarCodigoRedefinicaoSenha(
    email: string,
    codigo: string
  ): Promise<{
    ok: boolean;
    reason: "server_off" | "invalid_code";
  }> {
    const response = await auth
      .post("confirmar_codigo_redefinir_senha/", { usuario: email, codigo })
      .then(() => ({ ok: true, reason: "valid" }))
      .catch((err) => {
        const NETWORK_ERROR = "AxiosError: Network Error";
        const ehErroConexao = String(err) === NETWORK_ERROR;

        if (ehErroConexao) return { ok: false, reason: "server_off" };
        else return { ok: false, reason: "invalid_code" };
      });

    return response;
  }

  async function redefinirSenha(email: string, novaSenha: string) {
    const response = await auth
      .post("redefinir_senha/", {
        usuario: email,
        nova_senha: novaSenha,
      })
      .then(() => login(email, novaSenha))
      .catch((err) => {
        const NETWORK_ERROR = "AxiosError: Network Error";
      });

    return response;
  }

  async function trocarSenha(
    email: string,
    senhaAtual: string,
    novaSenha: string
  ) {
    return await auth.post("trocar_senha/", {
      usuario: email,
      senha_atual: senhaAtual,
      nova_senha: novaSenha,
    });
  }

  return {
    login,
    validarCadastroEmail,
    validarCadastroUsername,
    cadastro,
    enviarEmailRedefinicaoSenha,
    confirmarCodigoRedefinicaoSenha,
    redefinirSenha,
    trocarSenha,
  };
}
