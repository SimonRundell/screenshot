import { useState } from 'react';

/**
 * Displays colour values and copy actions.
 * @param {{ colour: Record<string, any>, editableLabel?: boolean, onLabelChange?: (label: string) => void }} props
 * @returns {JSX.Element|null}
 */
export default function ColourSwatch({ colour, editableLabel = false, onLabelChange }) {
  const [label, setLabel] = useState(colour?.label || '');
  if (!colour) return null;

  /**
   * Copies text value to the clipboard.
   * @param {string} value
   * @returns {Promise<void>}
   */
  const copyValue = async (value) => {
    await navigator.clipboard.writeText(value);
  };

  const rgbText = `${colour.rgb_r}, ${colour.rgb_g}, ${colour.rgb_b}`;
  const hslText = `${colour.hsl_h}, ${colour.hsl_s}%, ${colour.hsl_l}%`;

  return (
    <div className="swatch-card">
      <div className="swatch-chip" style={{ backgroundColor: colour.hex }} />
      <div className="swatch-meta">
        <p><strong>HEX:</strong> <span className="code-font">{colour.hex}</span></p>
        <p><strong>RGB:</strong> <span className="code-font">{rgbText}</span></p>
        <p><strong>HSL:</strong> <span className="code-font">{hslText}</span></p>
      </div>
      <div className="swatch-actions">
        <button type="button" onClick={() => copyValue(colour.hex)}>Copy HEX</button>
        <button type="button" onClick={() => copyValue(`rgb(${rgbText})`)}>Copy RGB</button>
        <button type="button" onClick={() => copyValue(`hsl(${hslText})`)}>Copy HSL</button>
      </div>
      {editableLabel ? (
        <div className="swatch-label-editor">
          <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Colour label" />
          <button type="button" onClick={() => onLabelChange?.(label)}>Save Label</button>
        </div>
      ) : (
        colour.label ? <p className="swatch-label">{colour.label}</p> : null
      )}
    </div>
  );
}
