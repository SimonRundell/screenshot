import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

/**
 * Displays persisted colours with selection.
 * @param {{ onSelect: (colour: Record<string, any> | null) => void }} props
 * @returns {JSX.Element}
 */
export default function ColourList({ onSelect }) {
  const [items, setItems] = useState([]);

  /**
   * Loads colours from API.
   * @returns {Promise<void>}
   */
  const load = async () => {
    const response = await api.get('/colours/list.php');
    setItems(response.data?.colours || []);
  };

  useEffect(() => {
    load();
  }, []);

  /**
   * Deletes selected colour and refreshes list.
   * @param {number} id
   * @returns {Promise<void>}
   */
  const deleteItem = async (id) => {
    await api.post('/colours/delete.php', { id });
    onSelect(null);
    await load();
  };

  return (
    <div className="colour-list">
      {items.map((colour) => (
        <article key={colour.id}>
          <button type="button" onClick={() => onSelect(colour)} className="colour-list-item">
            <span className="history-chip" style={{ backgroundColor: colour.hex }} />
            <span className="code-font">{colour.hex}</span>
            <span>{colour.label || 'Unlabelled'}</span>
          </button>
          <button type="button" className="danger" onClick={() => deleteItem(colour.id)}>Delete</button>
        </article>
      ))}
    </div>
  );
}
