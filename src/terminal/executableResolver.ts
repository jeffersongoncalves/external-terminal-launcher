import * as fs from 'fs';
import * as path from 'path';
import { OperatingSystem, currentOS } from '../os/operatingSystem';

/**
 * Resolves whether a terminal's detection candidate exists on the host.
 *
 * A candidate resolves when it is either an existing absolute path (file or directory —
 * macOS .app bundles are directories) or a bare command found on PATH. The PATH lookup
 * and filesystem access are injected so the logic can be unit-tested deterministically.
 */
export function isInstalled(candidates: string[], os: OperatingSystem = currentOS()): boolean {
  return candidates.some((c) => resolve(c, os) !== null);
}

/** Returns the resolved absolute path for candidate, or null if it cannot be found. */
export function resolve(
  candidate: string,
  os: OperatingSystem = currentOS(),
  pathDirs: string[] = systemPathDirs(),
  exists: (p: string) => boolean = (p) => fs.existsSync(p)
): string | null {
  if (!candidate.trim()) return null;

  // Absolute / explicit path — accept as-is when it exists.
  if (looksLikePath(candidate)) {
    return exists(candidate) ? candidate : null;
  }

  // Bare command — probe each PATH dir, trying Windows executable extensions.
  const sep = os === OperatingSystem.WINDOWS ? '\\' : '/';
  const names = os === OperatingSystem.WINDOWS ? windowsNames(candidate) : [candidate];
  for (const dir of pathDirs) {
    for (const name of names) {
      const full = dir.replace(/[/\\]+$/, '') + sep + name;
      if (exists(full)) return full;
    }
  }
  return null;
}

function looksLikePath(candidate: string): boolean {
  return candidate.includes('/') || candidate.includes('\\') || (candidate.length > 1 && candidate[1] === ':');
}

function windowsNames(command: string): string[] {
  const hasExt = command.includes('.') && command.substring(command.lastIndexOf('.') + 1).length > 0;
  if (hasExt) return [command];
  return [`${command}.exe`, `${command}.cmd`, `${command}.bat`, command];
}

function systemPathDirs(): string[] {
  const envPath = process.env.PATH ?? process.env.Path ?? '';
  return envPath.split(path.delimiter).filter((p) => p.trim().length > 0);
}
