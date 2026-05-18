import { describe, it, expect } from 'vitest';
import { getRarityConfig } from './rarityConfig';

describe('rarityConfig Utility', () => {
  it('should return correct styles for "Legendario" (Spanish)', () => {
    const config = getRarityConfig('Legendario');
    expect(config.text).toBe('text-orange-400');
    expect(config.border).toBe('border-orange-500/50');
  });

  it('should return correct styles for "Common" (English)', () => {
    const config = getRarityConfig('Common');
    expect(config.text).toBe('text-slate-100');
    expect(config.border).toBe('border-slate-200/50');
  });

  it('should return correct styles for "Poco Común"', () => {
    const config = getRarityConfig('Poco Común');
    expect(config.text).toBe('text-green-400');
    expect(config.border).toBe('border-green-500/50');
  });

  it('should return default config for an unknown rarity', () => {
    const config = getRarityConfig('UnknownRarity');
    expect(config.text).toBe('text-slate-400');
    expect(config.border).toBe('border-slate-700');
    expect(config.hover).toBe('hover:border-blue-500');
  });

  it('should return default config if rarity is null or undefined', () => {
    expect(getRarityConfig(null).text).toBe('text-slate-400');
    expect(getRarityConfig(undefined).text).toBe('text-slate-400');
  });
});
