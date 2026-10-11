/**
 * Registers custom A-Frame components used by the AR scene.
 * Call once, after A-Frame + MindAR are loaded (see useMindAR).
 *
 * `ar-model-control`:
 *   - On model-loaded: recenters the mesh to the entity origin and scales it
 *     to a consistent size (so any GLB appears centered on the target).
 *   - Touch: one finger drags to rotate, two fingers pinch to scale.
 *   - Mouse (desktop webcam testing): drag to rotate, wheel to scale.
 *   - resetTransform(): back to the fitted, upright default.
 */
export function registerARComponents() {
  const AFRAME = typeof window !== 'undefined' ? window.AFRAME : null;
  if (!AFRAME || AFRAME.components['ar-model-control']) return;
  const THREE = AFRAME.THREE;

  AFRAME.registerComponent('ar-model-control', {
    schema: {
      fit: { default: 0.9 }, // target size (scene units) of the largest dim
      minScale: { default: 0.05 },
      maxScale: { default: 6 },
    },

    init() {
      // Safe default scale so the model is visible even before (or without) a
      // successful fit — matches the fallback `scale` attribute.
      this.base = 0.2;
      this.factor = 1;
      this.rotX = 0;
      this.rotY = 0;
      this.lastX = 0;
      this.lastY = 0;
      this.startDist = 0;
      this.startFactor = 1;
      this.dragging = false;
      this._retries = 0;

      this._onLoaded = () => this._fit();
      this.el.addEventListener('model-loaded', this._onLoaded);
      this._bind();
      // In case the model was already loaded before this component initialized.
      if (this.el.getObject3D('mesh')) this._fit();
    },

    _fit() {
      const mesh = this.el.getObject3D('mesh');
      if (!mesh) {
        if (this._retries++ < 10) setTimeout(() => this._fit(), 150);
        return;
      }
      const obj = this.el.object3D;
      // Measure at scale 1 so maxDim is in the model's own units.
      obj.scale.set(1, 1, 1);
      obj.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(mesh);
      if (box.isEmpty()) {
        this._apply();
        return;
      }
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // Recenter geometry to the entity origin (world center → local).
      mesh.position.sub(obj.worldToLocal(center.clone()));
      const maxDim = Math.max(size.x, size.y, size.z);
      if (isFinite(maxDim) && maxDim > 0) this.base = this.data.fit / maxDim;
      this._apply();
    },

    _apply() {
      const s = this.base * this.factor;
      this.el.object3D.scale.set(s, s, s);
      this.el.object3D.rotation.set(
        THREE.MathUtils.degToRad(this.rotX),
        THREE.MathUtils.degToRad(this.rotY),
        0
      );
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
