import { OperatingSystem } from '../../os/operatingSystem';
import { LaunchSpec, TerminalProvider } from '../types';

/**
 * WezTerm (https://wezterm.org). Cross-platform.
 *
 * - reuseTab = true  -> `wezterm cli spawn --cwd <dir>` : new tab in the running GUI
 *   (requires an existing WezTerm window / mux server).
 * - reuseTab = false -> `wezterm start --cwd <dir>`     : new window.
 */
export class WezTermProvider implements TerminalProvider {
  readonly id = 'wezterm';
  readonly displayName = 'WezTerm';

  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, reuseTab: boolean): LaunchSpec | null {
    if (os === OperatingSystem.UNKNOWN) return null;
    const args = reuseTab ? ['cli', 'spawn', '--cwd', workingDir] : ['start', '--cwd', workingDir];
    return { executable: executablePath ?? this.defaultExecutable(os), args };
  }

  private defaultExecutable(os: OperatingSystem): string {
    return os === OperatingSystem.WINDOWS ? 'wezterm.exe' : 'wezterm';
  }

  detectionCandidates(os: OperatingSystem): string[] {
    switch (os) {
      case OperatingSystem.WINDOWS:
        return ['wezterm.exe', 'wezterm'];
      case OperatingSystem.MAC:
        return ['/Applications/WezTerm.app', 'wezterm'];
      case OperatingSystem.LINUX:
        return ['wezterm'];
      default:
        return [];
    }
  }
}
