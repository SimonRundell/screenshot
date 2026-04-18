import { useState } from 'react';
import ColourDetail from '../components/colours/ColourDetail';
import ColourList from '../components/colours/ColourList';

/**
 * Saved colours management page.
 * @returns {JSX.Element}
 */
export default function Colours() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="page-grid two-col">
      <div>
        <h2>Saved Colours</h2>
        <ColourList onSelect={setSelected} />
      </div>
      <ColourDetail colour={selected} onUpdated={() => {}} />
    </section>
  );
}
