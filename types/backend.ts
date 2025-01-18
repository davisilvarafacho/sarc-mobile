type BackendEndpoint =
  | "usuarios"
  | "usuarios/total_pedidos_amizade"
  | "amizades_usuarios"
  | "inscricoes_evento"
  | "lugares"
  | "eventos"
  | "categorias_lugar"
  | "avaliacoes_lugar"
  | "postagens";

type ListBackendResponse<T> = {
  total: number;
  proxima: null | string;
  anterior: null | string;
  resultados: T[];
};

type Registro = {
  id: number;
  ativo: boolean;
  criado_em: string;
  ultima_alteracao_em: string;
};

type Endereco = {
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  pais: string;
  endereco_completo: string;
};

type CategoriaLugar = {
  nome: string;
} & Registro;

type Lugar = {
  nome: string;
  descricao: string;
  bio: string;
  gratuito: boolean;
  categoria: CategoriaLugar;

  latitude: string;
  longitude: string;

  funciona_domingo: boolean;
  hora_inicio_funcionamento_domingo: string;
  hora_fim_funcionamento_domingo: string;

  funciona_segunda: boolean;
  hora_inicio_funcionamento_segunda: string;
  hora_fim_funcionamento_segunda: string;

  funciona_terca: boolean;
  hora_inicio_funcionamento_terca: string;
  hora_fim_funcionamento_terca: string;

  funciona_quarta: boolean;
  hora_inicio_funcionamento_quarta: string;
  hora_fim_funcionamento_quarta: string;

  funciona_quinta: boolean;
  hora_inicio_funcionamento_quinta: string;
  hora_fim_funcionamento_quinta: string;

  funciona_sexta: boolean;
  hora_inicio_funcionamento_sexta: string;
  hora_fim_funcionamento_sexta: string;

  funciona_sabado: boolean;
  hora_inicio_funcionamento_sabado: string;
  hora_fim_funcionamento_sabado: string;

  valor_minimo: number;
  valor_maximo: number;

  telefone: string;
  email: string;
  whatsapp: string;

  observacao: string;

  imagem: string | null;
} & Endereco &
  Registro;

type Usuario = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  cellphone: string;
  email: string;
  birth_date: string;
  avatar: string | null;
};

type AmizadeUsuario = {
  usuario: Usuario;
  amigo: Usuario;
  ativo: boolean;
} & Registro;

type Postagem = {
  tipo: string;
  status: string;
  titulo: string;
  subtitulo: string;
  slug: string;
  corpo: string;
  publicado_em: string;
  autor: Usuario;
  tempo_leitura: number;
  banner: string;
} & Registro;

type Evento = {
  nome: string;
  descricao: string;
  publico: boolean;
  lugar: Lugar;
  data: string;
  link_google_maps: string;
  hora_inicio: string;
  hora_fim: string;
} & Registro;

type InscricaoEvento = {
  evento: Evento;
  publico: boolean;
  criador_evento: boolean;
  usuario: Usuario;
} & Registro;

type JWT = {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  sub: number;
  user_username: string;
  user_email: string;
  user_name: string;
  user_last_name: string;
  user_full_name: string;
  aud: "sarc-mobile";
  iss: "sarc-api";
};
