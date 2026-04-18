/**
 * Renders one palette summary card.
 * @param {{ palette: Record<string, any>, onOpen: (palette: Record<string, any>) => void, onDelete: (id: number) => void }} props
 * @returns {JSX.Element}
 */
export default function PaletteCard({ palette, onOpen, onDelete }) {
  return (
    <article className="palette-card">
      <h4>{palette.name}</h4>
      <p>{palette.colours?.length || 0} colours</p>
      <div className="palette-strip">
        {(palette.colours || []).slice(0, 8).map((colour) => (
          <span key={`${palette.id}-${colour.id}`} style={{ backgroundColor: colour.hex }} />
        ))}
      </div>
      <div className="palette-actions">
        <button type="button" onClick={() => onOpen(palette)}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(palette.id)}>Delete</button>
      </div>
    </article>
  );
}
