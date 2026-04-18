import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import ColourSwatch from '../capture/ColourSwatch';
import getApiError from '../../utils/getApiError';

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
    try {
      await api.post('/colours/label.php', { id: colour.id, label });
      setStatus('Saved');
      toast.success('Colour label updated');
      onUpdated();
    } catch (error) {
      toast.error(getApiError(error, 'Unable to save colour label'));
    }
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
