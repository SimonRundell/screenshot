import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EyeDropperButton from '../components/capture/EyeDropperButton';
import ColourSwatch from '../components/capture/ColourSwatch';
import ImageViewer from '../components/gallery/ImageViewer';

/**
 * Image detail page with canvas picker and optional eyedropper.
 * @returns {JSX.Element}
 */
export default function ImageView() {
  const { id } = useParams();
  const [eyedropperColour, setEyedropperColour] = useState(null);

  return (
    <section>
      <h2>Image Viewer</h2>
      <p>Image ID: {id}</p>
      <EyeDropperButton onPick={setEyedropperColour} />
      {eyedropperColour ? <ColourSwatch colour={eyedropperColour} /> : null}
      <ImageViewer imageId={id} />
    </section>
  );
}
