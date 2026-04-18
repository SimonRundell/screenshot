import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import ImageViewer from '../components/gallery/ImageViewer';
import getApiError from '../utils/getApiError';

/**
 * Image detail page with canvas picker and optional eyedropper.
 * @returns {JSX.Element}
 */
export default function ImageView() {
  const { id } = useParams();
  const [pickedColour, setPickedColour] = useState(null);
  const [saveLabel, setSaveLabel] = useState('');

  const savePickedColour = async () => {
    if (!pickedColour) return;
    try {
      await api.post('/colours/save.php', {
        ...pickedColour,
        image_id: Number(id),
        label: saveLabel || null
      });
      setSaveLabel('');
      toast.success(`Saved ${pickedColour.hex}`);
    } catch (error) {
      toast.error(getApiError(error, 'Unable to save picked colour'));
    }
  };

  return (
    <section>
      <div className="image-view-header">
        <div>
          <h2>Image Viewer</h2>
          <p className="image-id-label">ID: {id}</p>
        </div>
        {pickedColour ? (
          <div className="compact-colour-save">
            <span className="picked-colour-chip" style={{ background: pickedColour.hex }} />
            <button type="button" className="secondary" onClick={() => { navigator.clipboard.writeText(pickedColour.hex); toast.success('Copied HEX'); }}><i className="fa-solid fa-copy" /> {pickedColour.hex}</button>
            <button type="button" className="secondary" onClick={() => { navigator.clipboard.writeText(`rgb(${pickedColour.rgb_r}, ${pickedColour.rgb_g}, ${pickedColour.rgb_b})`); toast.success('Copied RGB'); }}><i className="fa-solid fa-copy" /> RGB</button>
            <button type="button" className="secondary" onClick={() => { navigator.clipboard.writeText(`hsl(${pickedColour.hsl_h}, ${pickedColour.hsl_s}%, ${pickedColour.hsl_l}%)`); toast.success('Copied HSL'); }}><i className="fa-solid fa-copy" /> HSL</button>
            <input placeholder="Optional label" value={saveLabel} onChange={(event) => setSaveLabel(event.target.value)} />
            <button type="button" onClick={savePickedColour}><i className="fa-solid fa-bookmark" /> Save Colour</button>
          </div>
        ) : null}
      </div>
      <ImageViewer imageId={id} onPickColour={setPickedColour} />
    </section>
  );
}
