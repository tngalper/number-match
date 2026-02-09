
import { SOUNDS } from '../constants';

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  init() {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  playEffect(key: string) {
    const sound = this.sounds.get(key);
    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5;
      clone.play().catch(() => {});
    }
  }
}

export const audioManager = new AudioManager();
