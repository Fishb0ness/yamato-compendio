import React from 'react';
import type { Role } from '../providers/IAProvider';

type RoleSelectorProps = {
  onSelect: (role: Role) => void;
};

export default function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <section className="role-selector" aria-label="Selector de rol">
      <h2 className="role-selector-title">Selecciona tu rol</h2>
      <p className="role-selector-subtitle">Elige desde qué perspectiva quieres consultar el manual.</p>

      <div className="role-selector-actions">
        <button className="role-selector-button" type="button" onClick={() => onSelect('custodio')}>
          Custodio
        </button>
        <button className="role-selector-button" type="button" onClick={() => onSelect('pretor')}>
          Pretor
        </button>
      </div>
    </section>
  );
}
