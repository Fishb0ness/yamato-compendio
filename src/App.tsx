import React, { useEffect, useState } from 'react';
import Menu from './components/Menu';
import Input from './components/Input';
import Result from './components/Result';
import ErrorBoundary from './components/ErrorBoundary';
import {
  createProvider,
  getFallbackProviderKinds,
  type ProviderKind,
} from './providers/providerFactory';

interface Doctrina {
  id: string;
  tema: string;
  texto: string;
  acciones: string[];
}

const App: React.FC = () => {
  const [doctrinas, setDoctrinas] = useState<Doctrina[]>([]);
  const [selectedTema, setSelectedTema] = useState<string>('');
  const [pregunta, setPregunta] = useState('');
  const [resultado, setResultado] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [providerKind, setProviderKind] = useState<ProviderKind>('hf');
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const loadDoctrinas = async () => {
      try {
        const response = await fetch('/data/doctrinas.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar doctrinas');
        }

        const data = (await response.json()) as Doctrina[];
        setDoctrinas(data);
        setSelectedTema((previous) => previous || data[0]?.tema || '');
      } catch {
        setError('No se pudieron cargar las doctrinas.');
      }
    };

    loadDoctrinas();
  }, []);

  useEffect(() => {
    setResultado(null);
    setPregunta('');
    setError(null);
  }, [selectedTema]);

  const handleConsulta = async () => {
    setLoading(true);
    setError(null);
    const prompt = `Tema: ${selectedTema}. Pregunta: ${pregunta}`;
    try {
      const res = await createProvider(providerKind).generateResponse(prompt);
      setResultado(res);
    } catch {
      let resolved = false;
      for (const fallbackKind of getFallbackProviderKinds(providerKind)) {
        try {
          const fallbackRes = await createProvider(fallbackKind).generateResponse(prompt);
          setResultado(`${fallbackRes} (fallback:${fallbackKind})`);
          resolved = true;
          break;
        } catch {
          // intentar siguiente fallback
        }
      }

      if (!resolved) {
        setError('No se pudo obtener respuesta de los proveedores de IA. Puedes consultar manualmente las acciones recomendadas.');
        setResultado(null);
      }
    }
    setLoading(false);
  };

  const temaActual = doctrinas.find(d => d.tema === selectedTema);

  return (
    <ErrorBoundary>
      <div style={{padding:20}}>
        <h1>SGO Custodio</h1>
        <label>
          Proveedor IA:
          <select value={providerKind} onChange={e => setProviderKind(e.target.value as ProviderKind)}>
            <option value="hf">HuggingFace</option>
            <option value="local">Transformers.js local</option>
            <option value="mock">Mock</option>
          </select>
        </label>
        <Menu items={doctrinas.map(d => d.tema)} onSelect={setSelectedTema} selectedId={selectedTema} />
        <section>
          <h2>Doctrina seleccionada</h2>
          <div><b>{temaActual?.tema}</b></div>
          <div>{temaActual?.texto ?? <em>No se encontró el tema.</em>}</div>
          <h3>Acciones posibles</h3>
          <ul>{temaActual?.acciones.map(a => (<li key={a}>{a}</li>))}</ul>
        </section>
        <Input value={pregunta} onChange={setPregunta} onSubmit={handleConsulta} disabled={loading} />
        {error && <div style={{color:'red'}}>{error}</div>}
        <Result resultado={resultado} />
        <nav>
          <h4>Navegación manual</h4>
          <button onClick={() => setSelectedTema(doctrinas[0]?.tema || '')}>Inicio</button>
          <button onClick={() => setSelectedTema(doctrinas[doctrinas.length-1]?.tema || '')}>Última doctrina</button>
        </nav>
      </div>
    </ErrorBoundary>
  );
};

export default App;
