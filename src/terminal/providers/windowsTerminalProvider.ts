import { OperatingSystem } from '../../os/operatingSystem';
import { LaunchSpec, TerminalProvider } from '../types';

/**
 * Windows Terminal (wt.exe). Windows-only.
 *
 * - reuseTab = true  -> `wt -w 0 nt -d <dir>` : new tab in the most-recent window (id 0).
 * - reuseTab = false -> `wt -d <dir>`         : brand-new window.
 */
export class WindowsTerminalProvider implements TerminalProvider {
  readonly id = 'windows-terminal';
  readonly displayName = 'Windows Terminal';

  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, reuseTab: boolean): LaunchSpec | null {
    if (os !== OperatingSystem.WINDOWS) return null;
    const args = reuseTab ? ['-w', '0', 'nt', '-d', workingDir] : ['-d', workingDir];
    return { executable: executablePath ?? 'wt.exe', args };
  }

  detectionCandidates(os: OperatingSystem): string[] {
    return os === OperatingSystem.WINDOWS ? ['wt.exe', 'wt'] : [];
  }
}
