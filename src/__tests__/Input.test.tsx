import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Input from '../components/Input';

afterEach(() => {
  cleanup();
});

describe('Input', () => {
  it('muestra el texto escrito y limpia el campo al enviar', () => {
    const submittedValues: string[] = [];

    const Harness = () => {
      const [value, setValue] = React.useState('');
      return (
        <>
          <Input
            value={value}
            onChange={setValue}
            onSubmit={() => {
              submittedValues.push(value);
              setValue('');
            }}
          />
          <p>Último envío: {submittedValues.at(-1) ?? 'ninguno'}</p>
        </>
      );
    };

    const { getByPlaceholderText, getByText } = render(<Harness />);
    const input = getByPlaceholderText('Escribe tu pregunta...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'salvar vida' } });
    expect(input.value).toBe('salvar vida');

    fireEvent.click(getByText('Consultar'));

    expect(getByText('Último envío: salvar vida')).toBeTruthy();
    expect(input.value).toBe('');
  });

  it('deshabilita input y botón cuando disabled=true', () => {
    const { getByPlaceholderText, getByText } = render(
      <Input value="bloqueado" onChange={() => {}} onSubmit={() => {}} disabled />
    );

    expect((getByPlaceholderText('Escribe tu pregunta...') as HTMLInputElement).disabled).toBe(true);
    expect((getByText('Consultar') as HTMLButtonElement).disabled).toBe(true);
  });
});
