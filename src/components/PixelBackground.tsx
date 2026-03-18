/**
 * Global 8-bit pixel art animated background.
 * Pure CSS layers — no images, no JS animation loops.
 * Renders a retro RPG starfield with parallax depth.
 */
const PixelBackground = () => (
  <div className="pixel-bg" aria-hidden="true">
    <div className="pixel-layer-back" />
    <div className="pixel-layer-mid" />
    <div className="pixel-layer-front" />
  </div>
);

export default PixelBackground;
