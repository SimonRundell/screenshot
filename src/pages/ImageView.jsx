import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageViewer from '../components/gallery/ImageViewer';

/**
 * Image detail page with canvas picker and optional eyedropper.
 * @returns {JSX.Element}
 */
export default function ImageView() {
  const { id } = useParams();
  const [pickedColour, setPickedColour] = useState(null);

  return (
    <section>
      <div className="image-view-header">
        <div>
          <h2>Image Viewer</h2>
          <p className="image-id-label">ID: {id}</p>
        </div>
        {pickedColour ? (
          <div className="picked-colour-strip">
            <span className="picked-colour-chip" style={{ background: pickedColour.hex }} />
            <div className="picked-colour-values">
              <span className="code-font">{pickedColour.hex}</span>
              <span className="code-font">rgb({pickedColour.rgb_r}, {pickedColour.rgb_g}, {pickedColour.rgb_b})</span>
              <span className="code-font">hsl({pickedColour.hsl_h}°, {pickedColour.hsl_s}%, {pickedColour.hsl_l}%)</span>
            </div>
          </div>
        ) : null}
      </div>
      <ImageViewer imageId={id} onPickColour={setPickedColour} />
    </section>
  );
}
