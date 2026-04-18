import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import getApiError from '../../utils/getApiError';

/**
 * Captures desktop screenshot using getDisplayMedia + ImageCapture.
 * @returns {JSX.Element}
 */
export default function ScreenCaptureButton() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Captures one frame and uploads it as PNG.
   * @returns {Promise<void>}
   */
  const handleCapture = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia || typeof window.ImageCapture === 'undefined') {
      const message = 'Screen capture requires modern Chromium-based browser support.';
      setError(message);
      toast.error(message);
      return;
    }

    setError('');
    setLoading(true);
    let stream;

    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context.drawImage(bitmap, 0, 0);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) {
        throw new Error('Unable to build PNG blob');
      }

      const formData = new FormData();
      formData.append('screenshot', blob, 'capture.png');
      const response = await api.post('/images/upload.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Screenshot uploaded. Opening image viewer...');
      navigate(`/image/${response.data?.image?.id}`);
    } catch (captureError) {
      const message = getApiError(captureError, 'Capture failed');
      setError(message);
      toast.error(message);
    } finally {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setLoading(false);
    }
  };

  return (
    <div className="capture-panel">
      <button type="button" onClick={handleCapture} disabled={loading}>
        {loading ? 'Capturing...' : 'Capture Screen'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
