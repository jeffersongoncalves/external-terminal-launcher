import { OperatingSystem } from '../../os/operatingSystem';
import { LaunchSpec, TerminalProvider } from '../types';
import { resolve } from '../executableResolver';

const WINDOWS_DEFAULT = 'C:\\Program Files\\Warp\\warp.exe';

/**
 * Warp terminal (https://www.warp.dev).
 *
 * Tab-vs-instance note: on macOS/Linux Warp's warp:// URI scheme cannot carry a working
 * directory, so to honour workingDir we invoke the binary with the directory as a
 * positional argument. On Windows the binary instead parses its first argument as a URI, so
 * a bare path like C:\foo is rejected ("unexpected scheme: c"); there we pass Warp's
 * documented warp://action/new_tab?path= deep link. When Warp is already running it reuses
 * the existing window as a new tab on its own — there is no explicit flag for it — so
 * reuseTab does not change the command.
 */
export class WarpProvider implements TerminalProvider {
  readonly id = 'warp';
  readonly displayName = 'Warp';

  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, _reuseTab: boolean): LaunchSpec | null {
    switch (os) {
      case OperatingSystem.WINDOWS:
        return { executable: executablePath ?? this.resolveWindowsExecutable(), args: [this.windowsLaunchUri(workingDir)] };
      case OperatingSystem.MAC:
        // `open -a Warp <dir>` activates Warp and opens the folder.
        return { executable: executablePath ?? 'open', args: ['-a', 'Warp', workingDir] };
      case OperatingSystem.LINUX:
        return { executable: executablePath ?? 'warp-terminal', args: ['--working-directory', workingDir] };
      default:
        return null;
    }
  }

  detectionCandidates(os: OperatingSystem): string[] {
    switch (os) {
      case OperatingSystem.WINDOWS:
        return this.windowsCandidates();
      case OperatingSystem.MAC:
        return ['/Applications/Warp.app'];
      case OperatingSystem.LINUX:
        return ['warp-terminal'];
      default:
        return [];
    }
  }

  /**
   * Windows install locations, in priority order: the per-machine Program Files path and the
   * per-user %LOCALAPPDATA%\Programs\Warp path (Warp's default — it installs per-user), then
   * the bare command names for a PATH lookup.
   */
  private windowsCandidates(): string[] {
    const candidates = [WINDOWS_DEFAULT];
    const localAppDataDefault = this.windowsLocalAppDataDefault();
    if (localAppDataDefault) candidates.push(localAppDataDefault);
    candidates.push('warp.exe', 'warp');
    return candidates;
  }

  private windowsLocalAppDataDefault(): string | null {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData?.trim()) return null;
    return `${localAppData.replace(/\\+$/, '')}\\Programs\\Warp\\warp.exe`;
  }

  /**
   * The executable to spawn when the user has not set an override: the first detection candidate
   * that actually resolves on this host, falling back to WINDOWS_DEFAULT when none do.
   */
  private resolveWindowsExecutable(): string {
    for (const candidate of this.windowsCandidates()) {
      const resolved = resolve(candidate, OperatingSystem.WINDOWS);
      if (resolved) return resolved;
    }
    return WINDOWS_DEFAULT;
  }

  /**
   * Warp on Windows parses its first argument as a URI. Use the documented deep link and
   * URL-encode the path so backslashes and spaces survive the round trip.
   */
  private windowsLaunchUri(workingDir: string): string {
    return `warp://action/new_tab?path=${encodeURIComponent(workingDir)}`;
  }
}
