/**
 * Registers custom A-Frame components used by the AR scene.
 * Call once, after A-Frame + MindAR are loaded (see useMindAR).
 *
 * `ar-model-control` on an <a-gltf-model>:
 *   - On load: replaces materials with a solid, reliably-rendered color
 *     (some PBR textures render as magenta in this three build).
 *   - Applies a fixed base scale + base orientation (kept simple/robust — no
 *     bounding-box recentering, which previously flung the model off-screen).
 *   - Touch: one finger rotates, two fingers pinch to scale.
 *   - Mouse (desktop): drag to rotate, wheel to scale.
 *   - resetTransform(): back to the default pose.
 */
export function registerARComponents() {
  const AFRAME = typeof window !== 'undefined' ? window.AFRAME : null;
  if (!AFRAME || AFRAME.components['ar-model-control']) return;
  const THREE = AFRAME.THREE;

  AFRAME.registerComponent('ar-model-control', {
    schema: {
      scale: { default: 0.3 }, // fixed base scale (uniform)
      color: { type: 'color', default: '#c9a66b' },
      orient: { type: 'vec3', default: { x: 0, y: 0, z: 90 } },
      minScale: { default: 0.03 },
      maxScale: { default: 10 },
    },

    init() {
      this.base = this.data.scale;
      this.factor = 1;
      this.rotX = 0;
      this.rotY = 0;
      this.lastX = 0;
      this.lastY = 0;
      this.startDist = 0;
      this.startFactor = 1;
      this.dragging = false;
      this._retries = 0;

      this._onLoaded = () => this._onModel();
      this.el.addEventListener('model-loaded', this._onLoaded);
      this._bind();
      if (this.el.getObject3D('mesh')) this._onModel();
    },

    _onModel() {
      const mesh = this.el.getObject3D('mesh');
      if (!mesh) {
        if (this._retries++ < 15) setTimeout(() => this._onModel(), 150);
        return;
      }
      // Solid material avoids magenta PBR texture issues in this three build.
      const solid = new THREE.MeshStandardMaterial({
        color: new THREE.Color(this.data.color),
        roughness: 0.8,
        metalness: 0.0,
      });
      mesh.traverse((o) => {
        if (o.isMesh) o.material = solid;
      });
      this._apply();
    },

    _apply() {
      const obj = this.el.object3D;
      obj.position.set(0, 0, 0.1);
      const s = this.base * this.factor;
      obj.scale.set(s, s, s);

      const d2r = THREE.MathUtils.degToRad;
      const o = this.data.orient;
      const base = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(d2r(o.x), d2r(o.y), d2r(o.z))
      );
      const gesture = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(d2r(this.rotX), d2r(this.rotY), 0)
      );
      obj.quaternion.copy(base).multiply(gesture);
    },

    resetTransform() {
      this.factor = 1;
      this.rotX = 0;
      this.rotY = 0;
      this._apply();
    },

    _clampFactor(f) {
      return Math.max(this.data.minScale, Math.min(this.data.maxScale, f));
    },

    _dist(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    },

    _bind() {
      const canvas =
        this.el.sceneEl.canvas || this.el.sceneEl.renderer?.domElement;
      if (!canvas) return;
      this.canvas = canvas;

      this.onTouchStart = (e) => {
        if (e.touches.length === 1) {
          this.lastX = e.touches[0].clientX;
          this.lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          this.startDist = this._dist(e.touches);
          this.startFactor = this.factor;
        }
      };
      this.onTouchMove = (e) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          this.rotY += (t.clientX - this.lastX) * 0.5;
          this.rotX += (t.clientY - this.lastY) * 0.5;
          this.rotX = Math.max(-90, Math.min(90, this.rotX));
          this.lastX = t.clientX;
          this.lastY = t.clientY;
          this._apply();
        } else if (e.touches.length === 2 && this.startDist) {
          const d = this._dist(e.touches);
          this.factor = this._clampFactor(this.startFactor * (d / this.startDist));
          this._apply();
        }
      };
      this.onMouseDown = (e) => {
        this.dragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      };
      this.onMouseMove = (e) => {
        if (!this.dragging) return;
        this.rotY += (e.clientX - this.lastX) * 0.5;
        this.rotX += (e.clientY - this.lastY) * 0.5;
        this.rotX = Math.max(-90, Math.min(90, this.rotX));
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this._apply();
      };
      this.onMouseUp = () => {
        this.dragging = false;
      };
      this.onWheel = (e) => {
        e.preventDefault();
        this.factor = this._clampFactor(this.factor * (e.deltaY < 0 ? 1.1 : 0.9));
        this._apply();
      };

      canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
      canvas.addEventListener('touchmove', this.onTouchMove, { passive: true });
      canvas.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
      canvas.addEventListener('wheel', this.onWheel, { passive: false });
    },

    remove() {
      this.el.removeEventListener('model-loaded', this._onLoaded);
      const c = this.canvas;
      if (!c) return;
      c.removeEventListener('touchstart', this.onTouchStart);
      c.removeEventListener('touchmove', this.onTouchMove);
      c.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      c.removeEventListener('wheel', this.onWheel);
    },
  });
}
