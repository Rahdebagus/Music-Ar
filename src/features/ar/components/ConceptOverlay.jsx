import { assetUrl } from '@/utils/media.js';

/**
 * Mode 2 — sound/wave concept, rendered inside the A-Frame scene.
 * Shows the instrument, a marked vibration source, concept labels, and
 * light animated "sound wave" rings emanating outward (the low-cost
 * "Pilihan A" visualization). Audio + the Web-Audio waveform live in the
 * HTML overlay (ConceptHud) so text stays sharp and controls stay reliable.
 *
 * `lowPerf` reduces the number of animated rings on weaker devices.
 */
export function ConceptOverlay({ instrument, lowPerf = false }) {
  const wc = instrument.waveConcept || {};
  const ringCount = lowPerf ? 2 : 3;
  const rings = Array.from({ length: ringCount });

  return (
    <a-entity>
      {/* Instrument image, a little smaller, nudged up */}
      <a-image
        src={assetUrl(instrument.image)}
        position="0 0.18 0"
        width="0.8"
        height="0.8"
        material="transparent: true; shader: flat"
      ></a-image>

      {/* Vibration-source marker + emanating wave rings */}
      <a-entity position="0 -0.05 0.01">
        <a-circle color="#ef4444" radius="0.03" material="shader: flat"></a-circle>
        {rings.map((_, i) => (
          <a-ring
            key={i}
            color="#2dd4bf"
            radius-inner="0.05"
            radius-outer="0.07"
            opacity="0"
            material="shader: flat; transparent: true"
            animation={`property: scale; from: 0.3 0.3 0.3; to: 3.2 3.2 3.2; dur: 1800; loop: true; easing: easeOutQuad; delay: ${i * 600}`}
            animation__fade={`property: material.opacity; from: 0.6; to: 0; dur: 1800; loop: true; easing: easeOutQuad; delay: ${i * 600}`}
          ></a-ring>
        ))}
      </a-entity>

      {/* Concept labels */}
      <ConceptLabel text={`Sumber: ${wc.sourceOfVibration || '—'}`} position="0 0.66 0" color="#ef4444" />
      <ConceptLabel text={`Resonator: ${wc.resonator || '—'}`} position="-0.02 -0.52 0" color="#0f766e" />
      <ConceptLabel text={wc.waveType || 'Gelombang bunyi'} position="0 -0.68 0" color="#115e59" />
    </a-entity>
  );
}

function ConceptLabel({ text, position, color = '#0f766e' }) {
  const width = Math.min(1.3, 0.14 + String(text).length * 0.024);
  return (
    <a-entity position={position}>
      <a-plane width={width} height="0.13" color={color} opacity="0.9" material="shader: flat"></a-plane>
      <a-text value={text} align="center" width="1.9" color="#ffffff" position="0 0 0.01"></a-text>
    </a-entity>
  );
}
