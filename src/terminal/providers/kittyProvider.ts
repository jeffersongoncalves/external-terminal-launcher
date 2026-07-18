import { OperatingSystem } from '../../os/operatingSystem';
import { LaunchSpec, TerminalProvider } from '../types';

/**
 * kitty (https://sw.kovidgoyal.net/kitty). macOS and Linux only (no native Windows build).
 *
 * - reuseTab = true  -> `kitty @ launch --type=tab --cwd <dir>` : new tab via remote
 *   control (requires allow_remote_control enabled in kitty.conf).
 * - reuseTab = false -> `kitty --directory <dir>`               : new OS window.
 */
export class KittyProvider implements TerminalProvider {
  readonly id = 'kitty';
  readonly displayName = 'kitty';

  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, reuseTab: boolean): LaunchSpec | null {
    if (os !== OperatingSystem.MAC && os !== OperatingSystem.LINUX) return null;
    const args = reuseTab ? ['@', 'launch', '--type=tab', '--cwd', workingDir] : ['--directory', workingDir];
    return { executable: executablePath ?? 'kitty', args };
  }

  detectionCandidates(os: OperatingSystem): string[] {
    switch (os) {
      case OperatingSystem.MAC:
        return ['/Applications/kitty.app', 'kitty'];
      case OperatingSystem.LINUX:
        return ['kitty'];
      default:
        return [];
    }
  }
}
