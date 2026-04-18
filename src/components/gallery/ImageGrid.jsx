import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import ImageCard from './ImageCard';
import getApiError from '../../utils/getApiError';

/**
 * Fetches and renders image cards in a responsive grid.
 * @returns {JSX.Element}
 */
export default function ImageGrid() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Loads images from API.
   * @returns {Promise<void>}
   */
  const loadImages = async () => {
    try {
      const response = await api.get('/images/list.php');
      setImages(response.data?.images || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  /**
   * Deletes selected image and refreshes list.
   * @param {number} id
   * @returns {Promise<void>}
   */
  const deleteImage = async (id) => {
    try {
      await api.post('/images/delete.php', { id });
      await loadImages();
      toast.success('Image deleted');
    } catch (error) {
      toast.error(getApiError(error, 'Unable to delete image'));
    }
  };

  /**
   * Updates selected image label and refreshes list.
   * @param {number} id
   * @param {string} label
   * @returns {Promise<void>}
   */
  const relabelImage = async (id, label) => {
    try {
      await api.post('/images/label.php', { id, label });
      await loadImages();
      toast.success('Image label updated');
    } catch (error) {
      toast.error(getApiError(error, 'Unable to update image label'));
    }
  };

  if (loading) return <p>Loading images...</p>;
  return (
    <section className="image-grid">
      {images.length === 0 ? <p>No screenshots saved yet.</p> : null}
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onDelete={deleteImage} onRelabel={relabelImage} />
      ))}
    </section>
  );
}
