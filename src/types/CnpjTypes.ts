export interface Porte {
  id: string;
  descricao: string;
}

export interface NaturezaJuridica {
  id: string;
  descricao: string;
}

export interface QualificacaoResponsavel {
  id: number;
  descricao: string;
}

export interface Pais {
  id: string;
  iso2: string;
  iso3: string;
  nome: string;
  comex_id: string;
}

export interface QualificacaoSocio {
  id: number;
  descricao: string;
}

export interface Socio {
  cpf_cnpj_socio: string;
  nome: string;
  tipo: string;
  data_entrada: string;
  cpf_representante_legal: string;
  nome_representante: string | null;
  faixa_etaria: string;
  atualizado_em: string;
  pais_id: string;
  qualificacao_socio: QualificacaoSocio;
  qualificacao_representante: any;
  pais: Pais;
}

export interface Simples {
  simples: string;
  data_opcao_simples: string;
  data_exclusao_simples: null;
  mei: string;
  data_opcao_mei: null;
  data_exclusao_mei: null;
  atualizado_em: string;
}

export interface AtividadeSecundaria {
  id: string;
  secao: string;
  divisao: string;
  grupo: string;
  classe: string;
  subclasse: string;
  descricao: string;
}

export interface Estado {
  id: number;
  nome: string;
  sigla: string;
  ibge_id: number;
}

export interface Cidade {
  id: number;
  nome: string;
  ibge_id: number;
  siafi_id: string;
}

export interface InscricaoEstadual {
  inscricao_estadual: string;
  ativo: boolean;
  atualizado_em: string;
  estado: Estado;
}

export interface Estabelecimento {
  cnpj: string;
  atividades_secundarias: AtividadeSecundaria[];
  cnpj_raiz: string;
  cnpj_ordem: string;
  cnpj_digito_verificador: string;
  tipo: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  nome_cidade_exterior: null;
  tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: null;
  bairro: string;
  cep: string;
  ddd1: string;
  telefone1: string;
  ddd2: null;
  telefone2: null;
  ddd_fax: null;
  fax: null;
  email: string;
  situacao_especial: null;
  data_situacao_especial: null;
  atualizado_em: string;
  atividade_principal: AtividadeSecundaria;
  pais: Pais;
  estado: Estado;
  cidade: Cidade;
  motivo_situacao_cadastral: null;
  inscricoes_estaduais: InscricaoEstadual[];
}

export interface CnpjData {
  cnpj_raiz: string;
  razao_social: string;
  capital_social: string;
  responsavel_federativo: string;
  atualizado_em: string;
  porte: Porte;
  natureza_juridica: NaturezaJuridica;
  qualificacao_do_responsavel: QualificacaoResponsavel;
  socios: Socio[];
  simples: Simples;
  estabelecimento: Estabelecimento;
} 