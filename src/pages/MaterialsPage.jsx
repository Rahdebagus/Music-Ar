import { useState } from 'react';
import { getAllMaterials } from '@/features/materials/materialService.js';
import { cn } from '@/utils/cn.js';

export function MaterialsPage() {
  const materials = getAllMaterials();
  const [activeId, setActiveId] = useState(materials[0]?.id);
  const active = materials.find((m) => m.id === activeId) || materials[0];

  return (
    <div className="container-page py-4">
      <div className="grid gap-5 lg:grid-cols-4">
        {/* Topic selector */}
        <aside className="lg:col-span-1">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {materials.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveId(m.id)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors lg:w-full',
                  m.id === active.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-wood-800 ring-1 ring-black/5 hover:bg-wood-50'
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {m.icon}
                </span>
                <span>
                  <span className="block text-xs font-semibold opacity-80">
                    Materi {m.code}
                  </span>
                  <span className="block font-medium">{m.title}</span>
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="card-surface p-6 lg:col-span-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">
              {active.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Materi {active.code}
              </p>
              <h2 className="text-xl font-bold text-wood-900">{active.title}</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-wood-600">{active.summary}</p>

          <div className="mt-6 space-y-5">
            {active.sections.map((s, i) => (
              <section key={i}>
                <h3 className="font-semibold text-wood-900">{s.heading}</h3>
                <p className="mt-1 text-sm leading-relaxed text-wood-700">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
