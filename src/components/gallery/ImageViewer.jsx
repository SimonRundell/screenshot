import { useEffect, useRef, useState } from 'react';
import api from '../../api/axiosInstance';
import { rgbToHex, rgbToHsl } from '../../utils/colourConvert';
import ColourSwatch from '../capture/ColourSwatch';
import { useColourHistory } from '../../context/ColourHistoryContext';

/**
 * Canvas-based image viewer for pixel colour picking.
 * @param {{ imageId: string|number }} props
 * @returns {JSX.Element}
 */
export default function ImageViewer({ imageId }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const { addToHistory } = useColourHistory();
  const [pickedColour, setPickedColour] = useState(null);
  const [saveLabel, setSaveLabel] = useState('');

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    /**
     * Draws loaded image into canvas.
     * @returns {void}
     */
    const onLoad = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
    };

    image.addEventListener('load', onLoad);
    return () => image.removeEventListener('load', onLoad);
  }, [imageId]);

  /**
   * Reads selected pixel from canvas.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {void}
   */
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);

    const context = canvas.getContext('2d');
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);
    const colour = {
      hex,
      rgb_r: pixel[0],
      rgb_g: pixel[1],
      rgb_b: pixel[2],
      hsl_h: hsl.h,
      hsl_s: hsl.s,
      hsl_l: hsl.l
    };

    setPickedColour(colour);
    addToHistory(colour);
  };

  /**
   * Persists the currently selected colour to database.
   * @returns {Promise<void>}
   */
  const savePickedColour = async () => {
    if (!pickedColour) return;
    await api.post('/colours/save.php', {
      ...pickedColour,
      image_id: Number(imageId),
      label: saveLabel || null
    });
    setSaveLabel('');
  };

  return (
    <section className="image-viewer">
      <img ref={imageRef} src={`/api/images/serve.php?id=${imageId}`} alt="Captured screenshot" hidden />
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="capture-canvas" />
      {pickedColour ? (
        <div className="picked-colour-panel">
          <ColourSwatch colour={pickedColour} />
          <input
            placeholder="Optional label"
            value={saveLabel}
            onChange={(event) => setSaveLabel(event.target.value)}
          />
          <button type="button" onClick={savePickedColour}>Save Colour</button>
        </div>
      ) : (
        <p>Click any pixel on the image to inspect and save a colour.</p>
      )}
    </section>
  );
}
