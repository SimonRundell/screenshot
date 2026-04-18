import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosInstance';

/**
 * Edits selected palette including rename, remove, and export.
 * @param {{ palette: Record<string, any> | null }} props
 * @returns {JSX.Element}
 */
export default function PaletteEditor({ palette }) {
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [allColours, setAllColours] = useState([]);
  const [dragIndex, setDragIndex] = useState(-1);

  useEffect(() => {
    setName(palette?.name || '');
    setItems(palette?.colours || []);
  }, [palette]);

  useEffect(() => {
    /**
     * Loads saved colours to allow adding into this palette.
     * @returns {Promise<void>}
     */
    async function loadColours() {
      const response = await api.get('/colours/list.php');
      setAllColours(response.data?.colours || []);
    }
    loadColours();
  }, []);

  const exportJson = useMemo(() => JSON.stringify(items.map((item) => ({ hex: item.hex, label: item.label || null })), null, 2), [items]);
  const exportCss = useMemo(() => items.map((item, index) => `--palette-${index + 1}: ${item.hex};`).join('\n'), [items]);

  /**
   * Persists palette rename.
   * @returns {Promise<void>}
   */
  const rename = async () => {
    if (!palette) return;
    await api.post('/palettes/rename.php', { id: palette.id, name });
  };

  /**
   * Removes colour from palette.
   * @param {number} colourId
   * @returns {Promise<void>}
   */
  const removeColour = async (colourId) => {
    if (!palette) return;
    await api.post('/palettes/remove-colour.php', { palette_id: palette.id, colour_id: colourId });
    setItems((prev) => prev.filter((item) => item.id !== colourId));
  };

  /**
   * Adds selected colour into palette.
   * @param {number} colourId
   * @returns {Promise<void>}
   */
  const addColour = async (colourId) => {
    if (!palette) return;
    await api.post('/palettes/add-colour.php', { palette_id: palette.id, colour_id: colourId });
    const selected = allColours.find((item) => item.id === Number(colourId));
    if (selected) setItems((prev) => [...prev, selected]);
  };

  /**
   * Handles drag-start for reorder.
   * @param {number} index
   * @returns {void}
   */
  const onDragStart = (index) => setDragIndex(index);

  /**
   * Handles drop reorder in local UI list.
   * @param {number} dropIndex
   * @returns {void}
   */
  const onDrop = (dropIndex) => {
    if (dragIndex < 0 || dragIndex === dropIndex) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(dropIndex, 0, moved);
      return copy;
    });
    setDragIndex(-1);
  };

  /**
   * Copies text export to clipboard.
   * @param {string} text
   * @returns {Promise<void>}
   */
  const copyText = async (text) => navigator.clipboard.writeText(text);

  if (!palette) {
    return <div className="panel-card"><p>Select a palette to edit.</p></div>;
  }

  return (
    <section className="panel-card">
      <h3>Palette Editor</h3>
      <div className="inline-form">
        <input value={name} onChange={(event) => setName(event.target.value)} />
        <button type="button" onClick={rename}>Rename</button>
      </div>

      <div className="inline-form">
        <select defaultValue="" onChange={(event) => addColour(Number(event.target.value))}>
          <option value="" disabled>Add saved colour</option>
          {allColours.map((colour) => <option key={colour.id} value={colour.id}>{colour.hex} {colour.label || ''}</option>)}
        </select>
      </div>

      <ul className="palette-editor-list">
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(index)}
          >
            <span className="history-chip" style={{ backgroundColor: item.hex }} />
            <span className="code-font">{item.hex}</span>
            <span>{item.label || 'Unlabelled'}</span>
            <button type="button" className="danger" onClick={() => removeColour(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="export-grid">
        <button type="button" onClick={() => copyText(exportCss)}>Copy CSS Variables</button>
        <button type="button" onClick={() => copyText(exportJson)}>Copy JSON</button>
        <button type="button" onClick={() => copyText(items.map((item) => item.hex).join('\n'))}>Copy Text List</button>
      </div>
    </section>
  );
}
