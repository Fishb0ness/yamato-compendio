import React from 'react';
import { useState } from 'react';
import { getProvider } from './providers/providerFactory';
import type { Role } from './providers/IAProvider';
import RoleSelector from './components/RoleSelector';
import './App.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role | null>(null);

  const devOverride = (globalThis as { importMetaEnv?: { DEV?: unknown } }).importMetaEnv;
  const isDevEnvironment =
    typeof devOverride?.DEV === 'boolean' ? devOverride.DEV : import.meta.env.DEV;
  const isUsingMockProvider = isDevEnvironment;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      if (!role) return;
      const provider = getProvider();
      const response = await provider.query(query, role);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <h1 className="app-title">SGO - Compendio-AI</h1>

      {!role ? (
        <RoleSelector onSelect={setRole} />
      ) : (
        <>
          {isUsingMockProvider && (
            <p className="app-notice" role="status">
              Modo simulación activo: no hay clave de Gemini configurada.
            </p>
          )}

          <form className="app-form" onSubmit={handleSubmit}>
            <textarea
              className="app-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={role === 'pretor' ? '¿Qué quieres hacer como Pretor?' : '¿Qué quieres hacer como Custodio?'}
              rows={4}
              disabled={loading}
            />
            <button className="app-button" type="submit" disabled={loading || !query.trim()}>
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </form>

          {loading && (
            <p className="app-loading" aria-live="polite">
              Consultando el manual SGO...
            </p>
          )}
          {error && (
            <p className="app-error" role="alert">
              {error}
            </p>
          )}
          {result && (
            <div className="app-result" aria-live="polite">
              <h2>Respuesta</h2>
              <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
