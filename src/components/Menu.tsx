import React from 'react';

interface MenuProps {
  items: string[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

const Menu: React.FC<MenuProps> = ({ items, onSelect, selectedId }) => (
  <nav>
    <ul>
      {items.map((item) => (
        <li key={item}>
          <button
            style={{ fontWeight: item === selectedId ? 'bold' : 'normal' }}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

export default Menu;
