import api from '../../api/axiosInstance';
import { useColourHistory } from '../../context/ColourHistoryContext';
import formatDate from '../../utils/formatDate';

/**
 * Session-only colour history panel.
 * @returns {JSX.Element}
 */
export default function ColourHistory() {
  const { history, clearHistory } = useColourHistory();

  /**
   * Persists a history colour to the database.
   * @param {Record<string, any>} colour
   * @returns {Promise<void>}
   */
  const saveColour = async (colour) => {
    await api.post('/colours/save.php', {
      ...colour,
      image_id: null,
      label: colour.label || null
    });
  };

  return (
    <aside className="history-panel">
      <div className="history-header">
        <h3>Session Colour History</h3>
        <button type="button" onClick={clearHistory}>Clear history</button>
      </div>
      <ul>
        {history.map((colour, index) => (
          <li key={`${colour.hex}-${index}`}>
            <span className="history-chip" style={{ backgroundColor: colour.hex }} />
            <div>
              <strong className="code-font">{colour.hex}</strong>
              <small><span className="gap-left">{formatDate(colour.pickedAt)}</span></small>
            </div>
            <button type="button" onClick={() => saveColour(colour)}>Save</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
