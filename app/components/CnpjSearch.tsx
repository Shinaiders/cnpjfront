'use client';

import { useState } from 'react';
import { CnpjData } from '../types/CnpjTypes';
import axios from 'axios';
import './CnpjSearch.css';

const CnpjSearch = () => {
  const [cnpj, setCnpj] = useState('');
  const [data, setData] = useState<CnpjData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCnpj = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (ddd: string, phone: string) => {
    if (!ddd || !phone) return 'Não informado';
    const phoneNumber = phone.padStart(9, '9');
    return `(${ddd}) ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
  };

  const formatDate = (date: string) => {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value);
    setCnpj(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const cleanCnpj = cnpj.replace(/\D/g, '');
      
      if (cleanCnpj.length !== 14) {
        throw new Error('CNPJ inválido. O CNPJ deve conter 14 dígitos.');
      }

      const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      });

      if (response.data) {
        setData(response.data);
      } else {
        throw new Error('Nenhum dado encontrado para este CNPJ.');
      }
    } catch (err: any) {
      if (err.response) {
        // Erro da API
        if (err.response.status === 404) {
          setError('CNPJ não encontrado.');
        } else if (err.response.status === 429) {
          setError('Limite de requisições excedido. Por favor, tente novamente mais tarde.');
        } else {
          setError(`Erro ao buscar dados do CNPJ: ${err.response.status}`);
        }
      } else if (err.request) {
        // Erro de rede
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        // Outros erros
        setError(err.message || 'Erro ao buscar dados do CNPJ.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cnpj-search-container">
      <h1>Consulta de CNPJ</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            value={cnpj}
            onChange={handleCnpjChange}
            placeholder="Digite o CNPJ"
            maxLength={18}
            className="cnpj-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {data && (
        <div className="result-container">
          <div className="company-header">
            <h2>{data.razao_social}</h2>
            <span className="cnpj-display">CNPJ: {cnpj}</span>
          </div>

          <div className="info-section">
            <h3>Informações Básicas</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nome Fantasia:</label>
                <span>{data.estabelecimento?.nome_fantasia || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Situação:</label>
                <span className={`status ${data.estabelecimento?.situacao_cadastral?.toLowerCase() || ''}`}>
                  {data.estabelecimento?.situacao_cadastral || 'Não informado'}
                </span>
              </div>
              <div className="info-item">
                <label>Data de Abertura:</label>
                <span>{formatDate(data.estabelecimento?.data_inicio_atividade)}</span>
              </div>
              <div className="info-item">
                <label>Última Atualização:</label>
                <span>{formatDate(data.estabelecimento?.atualizado_em)}</span>
              </div>
              <div className="info-item">
                <label>Porte:</label>
                <span>{data.porte?.descricao || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Natureza Jurídica:</label>
                <span>{data.natureza_juridica?.descricao || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Capital Social:</label>
                <span>R$ {data.capital_social ? parseFloat(data.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</span>
              </div>
              <div className="info-item">
                <label>Regime Tributário:</label>
                <span>
                  {data.simples?.simples === 'Sim' ? 'Simples Nacional' : 'Não Optante pelo Simples'}
                  {data.simples?.mei === 'Sim' ? ' - MEI' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Endereço</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Logradouro:</label>
                <span>
                  {data.estabelecimento?.tipo_logradouro} {data.estabelecimento?.logradouro}, {data.estabelecimento?.numero}
                  {data.estabelecimento?.complemento ? ` - ${data.estabelecimento.complemento}` : ''}
                </span>
              </div>
              <div className="info-item">
                <label>Bairro:</label>
                <span>{data.estabelecimento?.bairro || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>CEP:</label>
                <span>{data.estabelecimento?.cep ? data.estabelecimento.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2') : 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Cidade/UF:</label>
                <span>{data.estabelecimento?.cidade?.nome}/{data.estabelecimento?.estado?.sigla}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Contato</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Telefone Principal:</label>
                <span>
                  {formatPhone(data.estabelecimento?.ddd1 || '', data.estabelecimento?.telefone1 || '')}
                </span>
              </div>
              {data.estabelecimento?.ddd2 && data.estabelecimento?.telefone2 && (
                <div className="info-item">
                  <label>Telefone Secundário:</label>
                  <span>
                    {formatPhone(data.estabelecimento.ddd2, data.estabelecimento.telefone2)}
                  </span>
                </div>
              )}
              <div className="info-item">
                <label>Email:</label>
                <span>{data.estabelecimento?.email || 'Não informado'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Atividade Principal</h3>
            <div className="activity-description">
              <div className="info-item">
                <label>CNAE:</label>
                <span>{data.estabelecimento?.atividade_principal?.id || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Descrição:</label>
                <span>{data.estabelecimento?.atividade_principal?.descricao || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {data.estabelecimento?.atividades_secundarias?.length > 0 && (
            <div className="info-section">
              <h3>Atividades Secundárias</h3>
              <ul className="activities-list">
                {data.estabelecimento.atividades_secundarias.map((atividade, index) => (
                  <li key={index}>
                    <strong>CNAE: {atividade.id}</strong> - {atividade.descricao}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.socios?.length > 0 && (
            <div className="info-section">
              <h3>Sócios</h3>
              <div className="partners-list">
                {data.socios.map((socio, index) => (
                  <div key={index} className="partner-item">
                    <h4>{socio.nome}</h4>
                    <p>Qualificação: {socio.qualificacao_socio?.descricao || 'Não informado'}</p>
                    <p>Data de Entrada: {formatDate(socio.data_entrada)}</p>
                    <p>Faixa Etária: {socio.faixa_etaria || 'Não informado'}</p>
                    <p>País de Origem: {socio.pais?.nome || 'Não informado'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.estabelecimento?.inscricoes_estaduais?.length > 0 && (
            <div className="info-section">
              <h3>Inscrições Estaduais</h3>
              <div className="info-grid">
                {data.estabelecimento.inscricoes_estaduais.map((inscricao, index) => (
                  <div key={index} className="info-item">
                    <label>IE - {inscricao.estado?.sigla}:</label>
                    <span>
                      {inscricao.inscricao_estadual} 
                      <span className={`status ${inscricao.ativo ? 'ativa' : 'inativa'}`}>
                        ({inscricao.ativo ? 'Ativa' : 'Inativa'})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CnpjSearch; 