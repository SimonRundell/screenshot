import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { useColourHistory } from '../../context/ColourHistoryContext';
import formatDate from '../../utils/formatDate';
import getApiError from '../../utils/getApiError';

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
    try {
      await api.post('/colours/save.php', {
        ...colour,
        image_id: null,
        label: colour.label || null
      });
      toast.success(`Saved ${colour.hex}`);
    } catch (error) {
      toast.error(getApiError(error, 'Could not save colour'));
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    toast.success('Session history cleared');
  };

  return (
    <aside className="history-panel">
      <div className="history-header">
        <h3>Session Colour History</h3>
        <button type="button" onClick={handleClearHistory}>Clear history</button>
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
