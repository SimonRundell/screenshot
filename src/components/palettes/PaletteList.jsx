import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import PaletteCard from './PaletteCard';

/**
 * Lists palettes and supports creation/removal.
 * @param {{ onPick: (palette: Record<string, any> | null) => void }} props
 * @returns {JSX.Element}
 */
export default function PaletteList({ onPick }) {
  const [palettes, setPalettes] = useState([]);
  const [name, setName] = useState('');

  /**
   * Loads palettes from API.
   * @returns {Promise<void>}
   */
  const load = async () => {
    const response = await api.get('/palettes/list.php');
    setPalettes(response.data?.palettes || []);
  };

  useEffect(() => {
    load();
  }, []);

  /**
   * Creates a new palette.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const createPalette = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    await api.post('/palettes/create.php', { name });
    setName('');
    await load();
  };

  /**
   * Deletes a palette and refreshes list.
   * @param {number} id
   * @returns {Promise<void>}
   */
  const deletePalette = async (id) => {
    await api.post('/palettes/delete.php', { id });
    onPick(null);
    await load();
  };

  return (
    <section className="palette-list">
      <form onSubmit={createPalette} className="inline-form">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New palette name" />
        <button type="submit">Create</button>
      </form>
      <div className="palette-grid">
        {palettes.map((palette) => (
          <PaletteCard key={palette.id} palette={palette} onOpen={onPick} onDelete={deletePalette} />
        ))}
      </div>
    </section>
  );
}
