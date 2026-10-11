/**
 * WaveCanvas — draws an animated sound wave onto a 2D canvas.
 *
 * Two data sources:
 *   - setAnalyser(analyser): draw the real waveform from a Web Audio
 *     AnalyserNode (Mode 2 "Pilihan B").
 *   - no analyser: draw a lightweight synthetic travelling sine wave
 *     ("Pilihan A", used as a fallback / on low-end devices).
 *
 * It exposes setActive(true/false): when inactive it eases to a calm idle
 * line instead of a moving wave.
 */
export class WaveCanvas {
  constructor(canvas, { color = '#0d9488', lowPerf = false } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.color = color;
    this.lowPerf = lowPerf;
    this.analyser = null;
    this.buffer = null;
    this.active = false;
    this.amp = 0; // eased amplitude 0..1
    this.phase = 0;
    this.raf = null;
    this._loop = this._loop.bind(this);
  }

  setAnalyser(analyser) {
    this.analyser = analyser || null;
    this.buffer = analyser ? new Uint8Array(analyser.fftSize) : null;
  }

  setActive(active) {
    this.active = active;
  }

  start() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(this._loop);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  _resize() {
    const { canvas } = this;
    const dpr = this.lowPerf ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 80;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { w, h };
  }

  _loop() {
    const { ctx } = this;
    const { w, h } = this._resize();
    // Ease amplitude toward target so transitions are smooth.
    const target = this.active ? 1 : 0.05;
    this.amp += (target - this.amp) * 0.08;
    this.phase += this.active ? (this.lowPerf ? 0.12 : 0.2) : 0.02;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    const mid = h / 2;
    if (this.analyser && this.active) {
      // Real waveform from the audio.
      this.analyser.getByteTimeDomainData(this.buffer);
      const n = this.buffer.length;
      const step = Math.max(1, Math.floor(n / w));
      for (let x = 0, i = 0; x < w; x++, i += step) {
        const v = (this.buffer[i] - 128) / 128; // -1..1
        const y = mid + v * mid * 0.9 * this.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
    } else {
      // Synthetic travelling wave.
      const cycles = this.lowPerf ? 2 : 3;
      for (let x = 0; x <= w; x++) {
        const t = (x / w) * Math.PI * 2 * cycles + this.phase;
        const envelope = Math.sin((x / w) * Math.PI); // fade at edges
        const y = mid + Math.sin(t) * mid * 0.7 * this.amp * envelope;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    this.raf = requestAnimationFrame(this._loop);
  }
}
