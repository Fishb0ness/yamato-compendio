import React from 'react';

interface ResultProps {
  resultado: string | null;
}

const Result: React.FC<ResultProps> = ({ resultado }) => (
  <div className="resultado">
    {resultado ? <p>{resultado}</p> : <em>No hay resultado aún.</em>}
  </div>
);

export default Result;
