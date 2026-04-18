import { useState } from 'react';
import { hexToColourObject } from '../../utils/colourConvert';
import { useColourHistory } from '../../context/ColourHistoryContext';

/**
 * Uses EyeDropper API for system-wide colour picking.
 * @param {{ onPick?: (colour: Record<string, any>) => void }} props
 * @returns {JSX.Element}
 */
export default function EyeDropperButton({ onPick }) {
  const { addToHistory } = useColourHistory();
  const [error, setError] = useState('');

  /**
   * Opens native eye dropper and emits selected colour.
   * @returns {Promise<void>}
   */
  const handlePick = async () => {
    if (!window.EyeDropper) {
      setError('EyeDropper is only available in Chrome or Edge');
      return;
    }

    setError('');
    try {
      const picker = new window.EyeDropper();
      const result = await picker.open();
      const colour = hexToColourObject(result.sRGBHex);
      addToHistory(colour);
      if (onPick) onPick(colour);
    } catch (pickError) {
      if (pickError?.name !== 'AbortError') {
        setError('Unable to pick colour');
      }
    }
  };

  return (
    <div className="capture-panel">
      <button type="button" onClick={handlePick}>Use Eyedropper</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
