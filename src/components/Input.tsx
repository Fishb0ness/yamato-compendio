import React from 'react';

interface InputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ value, onChange, onSubmit, disabled }) => (
  <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Escribe tu pregunta..."
    />
    <button type="submit" disabled={disabled}>
      Consultar
    </button>
  </form>
);

export default Input;
