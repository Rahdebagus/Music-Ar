import { assetUrl } from '@/utils/media.js';

/**
 * A single interactive hotspot rendered inside the A-Frame scene (Mode 1).
 * A pulsing dot marks an instrument part; the clickable dot carries data-*
 * attributes so ARScene can open the matching part popup on tap.
 *
 * NB: this returns A-Frame custom elements (not DOM). It is rendered once and
 * never re-rendered reactively, so React never fights A-Frame over the scene.
 */
export function Hotspot({ instrumentId, part }) {
  const { x = 0, y = 0, z = 0.02 } = part.position || {};
  return (
    <a-entity position={`${x} ${y} ${z}`}>
      {/* Pulsing outer ring (visual only) */}
      <a-ring
        color="#f59e0b"
        radius-inner="0.028"
        radius-outer="0.042"
        opacity="0.85"
        material="shader: flat; transparent: true"
        animation="property: scale; from: 1 1 1; to: 1.8 1.8 1.8; dir: alternate; dur: 900; loop: true; easing: easeInOutSine"
      ></a-ring>
      {/* Clickable dot */}
      <a-circle
        class="ar-hotspot"
        data-part-id={part.id}
        data-instrument-id={instrumentId}
        color="#f59e0b"
        radius="0.022"
        material="shader: flat"
      ></a-circle>
      {/* Small label */}
      <a-entity position="0 0.07 0">
        <a-plane
          width={Math.min(0.5, 0.06 + part.name.length * 0.028)}
          height="0.06"
          color="#1c1917"
          opacity="0.72"
          material="shader: flat; transparent: true"
        ></a-plane>
        <a-text
          value={part.name}
          align="center"
          width="1.4"
          color="#ffffff"
          position="0 0 0.001"
        ></a-text>
      </a-entity>
    </a-entity>
  );
}

/** Mode 1 — full instrument overview.
 *  If a 3D model (GLB) is available it is shown and slowly rotates; otherwise
 *  a transparent image plane with tappable part hotspots is used.
 *  NB: scale/position for the GLB are sensible defaults — adjust to your
 *  model's real size if it appears too big/small on the target. */
export function InstrumentOverlay({ instrument }) {
  const hasModel = Boolean(instrument.model);
  return (
    <a-entity>
      {hasModel ? (
        <a-gltf-model
          src={assetUrl(instrument.model)}
          position="0 0 0.15"
          rotation="0 0 0"
          scale="0.25 0.25 0.25"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 9000; easing: linear"
        ></a-gltf-model>
      ) : (
        <>
          <a-image
            src={assetUrl(instrument.image)}
            position="0 0 0"
            width="1"
            height="1"
            material="transparent: true; shader: flat"
            animation="property: position; from: 0 0.02 0; to: 0 -0.02 0; dir: alternate; dur: 2200; loop: true; easing: easeInOutSine"
          ></a-image>
          {(instrument.parts || []).map((p) => (
            <Hotspot key={p.id} instrumentId={instrument.id} part={p} />
          ))}
        </>
      )}

      {/* Name banner above the target */}
      <a-entity position="0 0.62 0">
        <a-plane width="1.1" height="0.16" color="#0f766e" opacity="0.9" material="shader: flat"></a-plane>
        <a-text
          value={instrument.name}
          align="center"
          width="2"
          color="#ffffff"
          position="0 0 0.01"
        ></a-text>
      </a-entity>
    </a-entity>
  );
}
