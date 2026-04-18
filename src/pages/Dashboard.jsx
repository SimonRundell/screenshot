import ScreenCaptureButton from '../components/capture/ScreenCaptureButton';
import EyeDropperButton from '../components/capture/EyeDropperButton';
import ColourHistory from '../components/colours/ColourHistory';

/**
 * Dashboard page with capture actions and session history.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  return (
    <section className="page-grid two-col">
      <div className="panel-card">
        <h2>Capture Workspace</h2>
        <p>Grab your screen and jump straight into pixel-level colour picking.</p>
        <ScreenCaptureButton />
        <EyeDropperButton />
      </div>
      <ColourHistory />
    </section>
  );
}
