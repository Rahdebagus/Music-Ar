import videos from '@/data/videos.json';

export function getAllVideos() {
  return videos;
}

export function getVideoById(id) {
  return videos.find((v) => v.id === id) || null;
}

export function getVideosByInstrument(instrumentId) {
  return videos.filter((v) => v.instrumentId === instrumentId);
}

export function getVideoTypes() {
  return Array.from(new Set(videos.map((v) => v.type).filter(Boolean)));
}
