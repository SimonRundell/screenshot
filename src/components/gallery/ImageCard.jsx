import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

/**
 * Renders one image card item with actions.
 * @param {{ image: Record<string, any>, onDelete: (id: number) => void, onRelabel: (id: number, label: string) => void }} props
 * @returns {JSX.Element}
 */
export default function ImageCard({ image, onDelete, onRelabel }) {
  const remainingDays = Math.max(0, Math.ceil((new Date(image.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  /**
   * Prompts for label update and applies it.
   * @returns {void}
   */
  const handleLabel = () => {
    const next = window.prompt('Image label', image.label || '');
    if (next !== null) {
      onRelabel(image.id, next);
    }
  };

  return (
    <article className="image-card">
      <img src={`/api/images/serve.php?id=${image.id}`} alt={image.label || 'Screenshot'} />
      <div className="image-card-meta">
        <h4>{image.label || 'Untitled Capture'}</h4>
        <p>Captured: {formatDate(image.captured_at)}</p>
        <p className={remainingDays < 3 ? 'expiry-danger' : ''}>Expires in {remainingDays} days</p>
      </div>
      <div className="image-card-actions">
        <Link to={`/image/${image.id}`}>Open</Link>
        <button type="button" onClick={handleLabel}>Edit Label</button>
        <button type="button" className="danger" onClick={() => onDelete(image.id)}>Delete</button>
      </div>
    </article>
  );
}
