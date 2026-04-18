import { useState } from 'react';
import api from '../../api/axiosInstance';
import ColourSwatch from '../capture/ColourSwatch';

/**
 * Shows detail and inline label editing for selected colour.
 * @param {{ colour: Record<string, any> | null, onUpdated: () => void }} props
 * @returns {JSX.Element}
 */
export default function ColourDetail({ colour, onUpdated }) {
  const [status, setStatus] = useState('');

  /**
   * Saves colour label through API.
   * @param {string} label
   * @returns {Promise<void>}
   */
  const updateLabel = async (label) => {
    if (!colour) return;
    await api.post('/colours/label.php', { id: colour.id, label });
    setStatus('Saved');
    onUpdated();
  };

  if (!colour) {
    return <div className="panel-card"><p>Select a saved colour to view details.</p></div>;
  }

  return (
    <div className="panel-card">
      <ColourSwatch colour={colour} editableLabel onLabelChange={updateLabel} />
      {status ? <p className="success-text">{status}</p> : null}
    </div>
  );
}
