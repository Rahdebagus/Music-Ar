/**
 * Mode 3 — performance video, rendered inside the A-Frame scene.
 * The a-video plane uses a hidden <video> element (rendered by ARScene and
 * referenced by id) so playback stays lazy (preload="none") and controllable
 * from the HTML toolbar. No autoplay with sound — the user presses play.
 */
export function VideoOverlay({ index }) {
  return (
    <a-entity>
      <a-video
        src={`#ar-video-${index}`}
        width="1"
        height="0.5625"
        position="0 0 0.01"
        material="shader: flat"
      ></a-video>
      {/* Play hint banner */}
      <a-entity position="0 0.42 0.02">
        <a-plane width="0.9" height="0.12" color="#1c1917" opacity="0.7" material="shader: flat"></a-plane>
        <a-text
          value="Tekan tombol Video untuk memutar"
          align="center"
          width="1.7"
          color="#ffffff"
          position="0 0 0.01"
        ></a-text>
      </a-entity>
    </a-entity>
  );
}
