import React, { useState } from 'react';
import { CnpjData } from '../types/CnpjTypes';
import axios from 'axios';
import './CnpjSearch.css';

const CnpjSearch: React.FC = () => {
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
      const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao buscar dados do CNPJ. Verifique se o CNPJ é válido.');
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
                <span>{data.estabelecimento.nome_fantasia || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <label>Situação:</label>
                <span>{data.estabelecimento.situacao_cadastral}</span>
              </div>
              <div className="info-item">
                <label>Porte:</label>
                <span>{data.porte.descricao}</span>
              </div>
              <div className="info-item">
                <label>Capital Social:</label>
                <span>R$ {parseFloat(data.capital_social).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Endereço</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Logradouro:</label>
                <span>
                  {data.estabelecimento.tipo_logradouro} {data.estabelecimento.logradouro}, {data.estabelecimento.numero}
                </span>
              </div>
              <div className="info-item">
                <label>Bairro:</label>
                <span>{data.estabelecimento.bairro}</span>
              </div>
              <div className="info-item">
                <label>CEP:</label>
                <span>{data.estabelecimento.cep}</span>
              </div>
              <div className="info-item">
                <label>Cidade/UF:</label>
                <span>{data.estabelecimento.cidade.nome}/{data.estabelecimento.estado.sigla}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Contato</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Telefone:</label>
                <span>
                  {data.estabelecimento.ddd1 && data.estabelecimento.telefone1
                    ? `(${data.estabelecimento.ddd1}) ${data.estabelecimento.telefone1}`
                    : 'Não informado'}
                </span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{data.estabelecimento.email || 'Não informado'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Atividade Principal</h3>
            <div className="activity-description">
              {data.estabelecimento.atividade_principal.descricao}
            </div>
          </div>

          {data.estabelecimento.atividades_secundarias.length > 0 && (
            <div className="info-section">
              <h3>Atividades Secundárias</h3>
              <ul className="activities-list">
                {data.estabelecimento.atividades_secundarias.map((atividade, index) => (
                  <li key={index}>{atividade.descricao}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="info-section">
            <h3>Sócios</h3>
            <div className="partners-list">
              {data.socios.map((socio, index) => (
                <div key={index} className="partner-item">
                  <h4>{socio.nome}</h4>
                  <p>Qualificação: {socio.qualificacao_socio.descricao}</p>
                  <p>Data de Entrada: {new Date(socio.data_entrada).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CnpjSearch; 