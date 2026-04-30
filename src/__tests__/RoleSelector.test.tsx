import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import RoleSelector from '../components/RoleSelector';

afterEach(() => {
  cleanup();
});

describe('RoleSelector', () => {
  it('renders Custodio and Pretor buttons', () => {
    const { getByRole } = render(<RoleSelector onSelect={vi.fn()} />);

    expect(getByRole('button', { name: 'Custodio' })).toBeTruthy();
    expect(getByRole('button', { name: 'Pretor' })).toBeTruthy();
  });

  it('calls onSelect with custodio and pretor', () => {
    const onSelect = vi.fn();
    const { getByRole } = render(<RoleSelector onSelect={onSelect} />);

    fireEvent.click(getByRole('button', { name: 'Custodio' }));
    fireEvent.click(getByRole('button', { name: 'Pretor' }));

    expect(onSelect).toHaveBeenNthCalledWith(1, 'custodio');
    expect(onSelect).toHaveBeenNthCalledWith(2, 'pretor');
  });
});
