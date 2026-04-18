import { useState } from 'react';
import PaletteEditor from '../components/palettes/PaletteEditor';
import PaletteList from '../components/palettes/PaletteList';

/**
 * Palette management page.
 * @returns {JSX.Element}
 */
export default function Palettes() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="page-grid two-col">
      <div>
        <h2>Palettes</h2>
        <PaletteList onPick={setSelected} />
      </div>
      <PaletteEditor palette={selected} />
    </section>
  );
}
