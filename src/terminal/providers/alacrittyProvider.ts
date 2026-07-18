import { OperatingSystem } from '../../os/operatingSystem';
import { LaunchSpec, TerminalProvider } from '../types';

/**
 * Alacritty (https://alacritty.org). Cross-platform.
 *
 * Alacritty has no tabs, so reuseTab is ignored — every launch is a new window
 * opened at the working directory via `alacritty --working-directory <dir>`.
 */
export class AlacrittyProvider implements TerminalProvider {
  readonly id = 'alacritty';
  readonly displayName = 'Alacritty';

  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, _reuseTab: boolean): LaunchSpec | null {
    if (os === OperatingSystem.UNKNOWN) return null;
    return {
      executable: executablePath ?? (os === OperatingSystem.WINDOWS ? 'alacritty.exe' : 'alacritty'),
      args: ['--working-directory', workingDir]
    };
  }

  detectionCandidates(os: OperatingSystem): string[] {
    switch (os) {
      case OperatingSystem.WINDOWS:
        return ['alacritty.exe', 'alacritty'];
      case OperatingSystem.MAC:
        return ['/Applications/Alacritty.app', 'alacritty'];
      case OperatingSystem.LINUX:
        return ['alacritty'];
      default:
        return [];
    }
  }
}
