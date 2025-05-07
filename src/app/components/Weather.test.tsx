import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Weather from './Weather'

describe('Weather Component', () => {
    beforeEach(() => {
        render(<Weather />);
    });

    it('Muestra el título correctamente', () => {
        expect(screen.getByText(/Clima en/i)).toBeInTheDocument();
    });

    it('Muestra temperatura correctamente', () => {
        expect(screen.getByText(/Temperatura/i)).toBeInTheDocument();
    });

    it('Muestra humedad correctamente', () => {
        expect(screen.getByText(/Humedad/i)).toBeInTheDocument();
    });
    it('Muestra descripción correctamente', () => {
        expect(screen.getByText(/Descripción/i)).toBeInTheDocument();
    });
    it('Muestra botón correctamente', () => {
        expect(screen.getByText(/Nueva búsqueda/i)).toBeInTheDocument();
    });

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true, 
            json: () => Promise.resolve({
                current: {
                    temp_c: 21.4,
                    humidity: 49,
                    condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
                },
            }),
        } as Response) 
    );    
    
    it('Carga los datos de la API sin problemas', async () => {
        await screen.findByText(/Sunny/i);
        await screen.findByText(/.*21.4*/i);     
        await screen.findByText(/.*49.*/i);
    });

    it('Prueba valor de ciudad inválido', async () => {
        const input = screen.getByPlaceholderText('Ciudad') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /Nueva búsqueda/i });

        await userEvent.clear(input);  // Usuario borra ciudad por defecto
        await userEvent.type(input, 'asdef1234');
        await userEvent.click(button);
        await waitFor(() => {
            screen.findByText((content) => content.includes('Sin datos disponibles. Intente con nueva ciudad'));
        });
    });

    it('Valida campo de entrada y botón de búsqueda ', async () => {
        const input = screen.getByPlaceholderText('Ciudad') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /Nueva búsqueda/i });

        await userEvent.clear(input);  // Usuario borra ciudad por defecto
        await userEvent.type(input, 'London');
        await userEvent.click(button);
        await waitFor(() => {
            expect(input.value).toBe('London');
        });
    });
    
});
