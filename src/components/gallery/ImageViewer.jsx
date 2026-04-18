import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import { hexToColourObject, rgbToHex, rgbToHsl } from '../../utils/colourConvert';
import ColourSwatch from '../capture/ColourSwatch';
import { useColourHistory } from '../../context/ColourHistoryContext';
import getApiError from '../../utils/getApiError';

/**
 * Canvas-based image viewer for pixel colour picking.
 * @param {{ imageId: string|number }} props
 * @returns {JSX.Element}
 */
export default function ImageViewer({ imageId, onPickColour = null }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const { addToHistory } = useColourHistory();
  const [pickedColour, setPickedColour] = useState(null);
  const [saveLabel, setSaveLabel] = useState('');
  const [activeTool, setActiveTool] = useState('pick');
  const [dragStart, setDragStart] = useState(null);
  const [previewRect, setPreviewRect] = useState(null);
  const [pendingCrop, setPendingCrop] = useState(null);
  const [blurStrength, setBlurStrength] = useState(10);
  const [textValue, setTextValue] = useState('Note');
  const [textSize, setTextSize] = useState(28);
  const [textColour, setTextColour] = useState('#ffffff');
  const [textBg, setTextBg] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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
      const snapshot = canvas.toDataURL('image/png');
      setHistory([snapshot]);
      setHistoryIndex(0);
      setPendingCrop(null);
      setPreviewRect(null);
    };

    image.addEventListener('load', onLoad);
    if (image.complete) onLoad();
    return () => image.removeEventListener('load', onLoad);
  }, [imageId]);

  /**
   * Converts pointer coordinates into native canvas coordinates.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {{ x: number, y: number }}
   */
  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor((event.clientX - rect.left) * scaleX)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor((event.clientY - rect.top) * scaleY)));
    return { x, y };
  };

  /**
   * Creates a normalized rectangle between 2 points.
   * @param {{ x: number, y: number }} start
   * @param {{ x: number, y: number }} end
   * @returns {{ x: number, y: number, width: number, height: number }}
   */
  const getNormalizedRect = (start, end) => {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    return { x, y, width, height };
  };

  /**
   * Stores current canvas image into undo history.
   * @returns {void}
   */
  const pushSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL('image/png');
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const next = [...trimmed, snapshot];
      setHistoryIndex(next.length - 1);
      return next;
    });
  };

  /**
   * Restores canvas from a data URL snapshot.
   * @param {string} snapshot
   * @returns {Promise<void>}
   */
  const restoreSnapshot = async (snapshot) => {
    const canvas = canvasRef.current;
    if (!canvas || !snapshot) return;

    await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        resolve();
      };
      image.onerror = reject;
      image.src = snapshot;
    });
  };

  /**
   * Applies blur in a rectangular region.
   * @param {{ x: number, y: number, width: number, height: number }} rect
   * @returns {void}
   */
  const applyBlur = (rect) => {
    const canvas = canvasRef.current;
    if (!canvas || rect.width < 2 || rect.height < 2) return;
    const context = canvas.getContext('2d');
    const temp = document.createElement('canvas');
    temp.width = rect.width;
    temp.height = rect.height;
    const tempContext = temp.getContext('2d');
    tempContext.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    context.save();
    context.filter = `blur(${blurStrength}px)`;
    context.drawImage(temp, rect.x, rect.y, rect.width, rect.height);
    context.restore();
  };

  /**
   * Applies selected crop area.
   * @returns {void}
   */
  const applyCrop = () => {
    if (!pendingCrop || pendingCrop.width < 2 || pendingCrop.height < 2) {
      toast.error('Choose a crop area first');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const temp = document.createElement('canvas');
    temp.width = pendingCrop.width;
    temp.height = pendingCrop.height;
    const tempContext = temp.getContext('2d');
    tempContext.drawImage(
      canvas,
      pendingCrop.x,
      pendingCrop.y,
      pendingCrop.width,
      pendingCrop.height,
      0,
      0,
      pendingCrop.width,
      pendingCrop.height
    );

    canvas.width = pendingCrop.width;
    canvas.height = pendingCrop.height;
    context.drawImage(temp, 0, 0);
    setPendingCrop(null);
    pushSnapshot();
    toast.success('Crop applied');
  };

  /**
   * Draws text onto the canvas at chosen point.
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  const placeText = (x, y) => {
    if (!textValue.trim()) {
      toast.error('Enter text first');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.save();
    context.font = `${textSize}px "Trebuchet MS", sans-serif`;
    if (textBg) {
      const metrics = context.measureText(textValue);
      const pad = Math.round(textSize * 0.2);
      context.fillStyle = textBg;
      context.fillRect(x - pad, y - textSize, metrics.width + pad * 2, textSize + pad);
    }
    context.fillStyle = textColour;
    if (!textBg) {
      context.strokeStyle = 'rgba(0, 0, 0, 0.55)';
      context.lineWidth = Math.max(2, Math.round(textSize / 12));
      context.strokeText(textValue, x, y);
    }
    context.fillText(textValue, x, y);
    context.restore();
    pushSnapshot();
    toast.success('Text added');
  };

  /**
   * Reads selected pixel from canvas.
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  const pickColourAt = (x, y) => {
    const canvas = canvasRef.current;
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
    if (onPickColour) onPickColour(colour);
  };

  /**
   * Opens system eye dropper and captures a colour.
   * @returns {Promise<void>}
   */
  const useSystemEyedropper = async () => {
    if (!window.EyeDropper) {
      toast.error('EyeDropper is only available in Chrome or Edge');
      return;
    }

    try {
      const picker = new window.EyeDropper();
      const result = await picker.open();
      const colour = hexToColourObject(result.sRGBHex);
      setPickedColour(colour);
      addToHistory(colour);
      if (onPickColour) onPickColour(colour);
      toast.success(`Picked ${colour.hex}`);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        toast.error('Unable to pick colour');
      }
    }
  };

  /**
   * Restores previous edit snapshot.
   * @returns {Promise<void>}
   */
  const undo = async () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    await restoreSnapshot(history[nextIndex]);
    setHistoryIndex(nextIndex);
    setPendingCrop(null);
  };

  /**
   * Restores next edit snapshot.
   * @returns {Promise<void>}
   */
  const redo = async () => {
    if (historyIndex < 0 || historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    await restoreSnapshot(history[nextIndex]);
    setHistoryIndex(nextIndex);
    setPendingCrop(null);
  };

  /**
   * Downloads current edited canvas as PNG.
   * @returns {void}
   */
  const downloadEdited = () => {
    const canvas = canvasRef.current;
    const href = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = href;
    link.download = `capture-${imageId}-edited.png`;
    link.click();
    toast.success('Image download started');
  };

  /**
   * Saves current edited canvas as a new image upload.
   * @returns {Promise<void>}
   */
  const saveEditedCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to encode edited image');
      const formData = new FormData();
      formData.append('screenshot', blob, `capture-${imageId}-edited.png`);
      const response = await api.post('/images/upload.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const nextId = response.data?.image?.id;
      toast.success('Edited image saved as a new capture');
      if (nextId) navigate(`/image/${nextId}`);
    } catch (error) {
      toast.error(getApiError(error, 'Unable to save edited image'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  /**
   * Handles click interactions for pick/text tools.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {void}
   */
  const handleCanvasClick = (event) => {
    const point = getCanvasPoint(event);
    if (activeTool === 'pick') {
      pickColourAt(point.x, point.y);
    } else if (activeTool === 'text') {
      placeText(point.x, point.y);
    }
  };

  /**
   * Starts drag for crop/blur tools.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {void}
   */
  const handleMouseDown = (event) => {
    if (activeTool !== 'crop' && activeTool !== 'blur') return;
    const point = getCanvasPoint(event);
    setDragStart(point);
    setPreviewRect({ x: point.x, y: point.y, width: 1, height: 1 });
  };

  /**
   * Updates drag rectangle for crop/blur tools.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {void}
   */
  const handleMouseMove = (event) => {
    if (!dragStart) return;
    const point = getCanvasPoint(event);
    setPreviewRect(getNormalizedRect(dragStart, point));
  };

  /**
   * Finalizes drag rectangle and applies pending operation.
   * @param {import('react').MouseEvent<HTMLCanvasElement>} event
   * @returns {void}
   */
  const handleMouseUp = (event) => {
    if (!dragStart) return;
    const point = getCanvasPoint(event);
    const rect = getNormalizedRect(dragStart, point);
    setDragStart(null);
    setPreviewRect(null);

    if (rect.width < 3 || rect.height < 3) return;

    if (activeTool === 'crop') {
      setPendingCrop(rect);
      toast.success('Crop area selected. Click Apply Crop to commit.');
      return;
    }

    if (activeTool === 'blur') {
      applyBlur(rect);
      pushSnapshot();
      toast.success('Blur applied');
    }
  };

  /**
   * Converts canvas rect into CSS overlay style.
   * @param {{ x: number, y: number, width: number, height: number } | null} rect
   * @returns {Record<string, string> | null}
   */
  const getOverlayStyle = (rect) => {
    const canvas = canvasRef.current;
    if (!canvas || !rect) return null;
    const xPct = (rect.x / canvas.width) * 100;
    const yPct = (rect.y / canvas.height) * 100;
    const wPct = (rect.width / canvas.width) * 100;
    const hPct = (rect.height / canvas.height) * 100;

    return {
      left: `${xPct}%`,
      top: `${yPct}%`,
      width: `${wPct}%`,
      height: `${hPct}%`
    };
  };

  /**
   * Persists the currently selected colour to database.
   * @returns {Promise<void>}
   */
  const savePickedColour = async () => {
    if (!pickedColour) return;
    try {
      await api.post('/colours/save.php', {
        ...pickedColour,
        image_id: Number(imageId),
        label: saveLabel || null
      });
      setSaveLabel('');
      toast.success(`Saved ${pickedColour.hex}`);
    } catch (error) {
      toast.error(getApiError(error, 'Unable to save picked colour'));
    }
  };

  return (
    <section className="image-viewer">
      <img ref={imageRef} src={`/api/images/serve.php?id=${imageId}`} alt="Captured screenshot" hidden />

      <div className="image-editor-toolbar">
        <div className="toolbar-group">
          <button type="button" title="Pick colour from canvas" className={activeTool === 'pick' ? '' : 'secondary'} onClick={() => setActiveTool('pick')}><i className="fa-solid fa-eye-dropper" /></button>
          <button type="button" title="Crop image" className={activeTool === 'crop' ? '' : 'secondary'} onClick={() => setActiveTool('crop')}><i className="fa-solid fa-crop-simple" /></button>
          <button type="button" title="Blur a region" className={activeTool === 'blur' ? '' : 'secondary'} onClick={() => setActiveTool('blur')}><i className="fa-solid fa-circle-notch" /></button>
          <button type="button" title="Add text" className={activeTool === 'text' ? '' : 'secondary'} onClick={() => setActiveTool('text')}><i className="fa-solid fa-font" /></button>
        </div>

        {activeTool === 'blur' ? (
          <div className="toolbar-group">
            <label className="toolbar-inline-field" htmlFor="blur-strength">
              <i className="fa-solid fa-sliders" title="Blur strength" />
              <input id="blur-strength" type="range" min="2" max="24" value={blurStrength} onChange={(event) => setBlurStrength(Number(event.target.value))} />
            </label>
          </div>
        ) : null}

        {activeTool === 'text' ? (
          <div className="toolbar-group">
            <input className="toolbar-text-input" value={textValue} onChange={(event) => setTextValue(event.target.value)} placeholder="Text to place" />
            <label className="toolbar-inline-field" htmlFor="text-size">Sz <input id="text-size" type="number" min="12" max="96" value={textSize} onChange={(event) => setTextSize(Number(event.target.value) || 12)} /></label>
            <label className="toolbar-inline-field" htmlFor="text-colour"><i className="fa-solid fa-palette" title="Text colour" /> <input id="text-colour" type="color" value={textColour} onChange={(event) => setTextColour(event.target.value)} /></label>
            <label className="toolbar-inline-field" htmlFor="text-bg-toggle">
              <input id="text-bg-toggle" type="checkbox" checked={!!textBg} onChange={(event) => setTextBg(event.target.checked ? '#000000' : '')} /> Bg
            </label>
            {textBg ? (
              <label className="toolbar-inline-field" htmlFor="text-bg"><input id="text-bg" type="color" value={textBg} onChange={(event) => setTextBg(event.target.value)} /></label>
            ) : null}
          </div>
        ) : null}

        {activeTool === 'crop' && pendingCrop ? (
          <div className="toolbar-group">
            <button type="button" onClick={applyCrop}><i className="fa-solid fa-check" /> Apply</button>
            <button type="button" className="secondary" onClick={() => setPendingCrop(null)}><i className="fa-solid fa-xmark" /> Cancel</button>
          </div>
        ) : null}

        <span className="toolbar-spacer" />

        <div className="toolbar-group">
          <button type="button" title="Undo" className="secondary" onClick={undo} disabled={historyIndex <= 0}><i className="fa-solid fa-rotate-left" /></button>
          <button type="button" title="Redo" className="secondary" onClick={redo} disabled={historyIndex >= history.length - 1}><i className="fa-solid fa-rotate-right" /></button>
          <button type="button" title="System eyedropper" className="secondary" onClick={useSystemEyedropper}><i className="fa-solid fa-eye-dropper" /></button>
          <button type="button" title="Download edited image" className="secondary" onClick={downloadEdited}><i className="fa-solid fa-download" /></button>
          <button type="button" onClick={saveEditedCopy} disabled={isSavingEdit}><i className="fa-solid fa-floppy-disk" /> {isSavingEdit ? 'Saving...' : 'Save Copy'}</button>
        </div>
      </div>

      <div className="canvas-stage">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`capture-canvas capture-canvas-${activeTool}`}
        />
        {previewRect ? <span className="canvas-overlay-box preview" style={getOverlayStyle(previewRect)} /> : null}
        {pendingCrop ? <span className="canvas-overlay-box crop" style={getOverlayStyle(pendingCrop)} /> : null}
      </div>

      {pickedColour ? (
        <div className="compact-colour-save">
          <input placeholder="Optional label" value={saveLabel} onChange={(event) => setSaveLabel(event.target.value)} />
          <button type="button" onClick={savePickedColour}><i className="fa-solid fa-bookmark" /> Save Colour</button>
        </div>
      ) : null}
    </section>
  );
}
