import { OperatingSystem } from '../os/operatingSystem';

/** A resolved command ready to be spawned: an executable plus its argument list. */
export interface LaunchSpec {
  executable: string;
  args: string[];
}

/**
 * A supported external terminal emulator.
 *
 * Implementations are pure: given an OS, an optional user-configured executable path,
 * a working directory and the reuse-tab preference, they return a LaunchSpec — or
 * null when the terminal does not run on that OS. This keeps command construction
 * fully unit-testable without spawning real processes.
 */
export interface TerminalProvider {
  /** Stable id persisted in settings, e.g. "warp", "windows-terminal". */
  readonly id: string;

  /** Human-readable name shown in the settings dropdown / status bar. */
  readonly displayName: string;

  /**
   * Build the launch command, or return null if this terminal is not supported on os.
   *
   * @param executablePath user override from settings; when undefined the provider uses its default.
   * @param workingDir absolute path the terminal should open in.
   * @param reuseTab when true, prefer opening a tab in an existing window over a new instance
   *                 (best-effort — not every terminal can do it).
   */
  launchSpec(os: OperatingSystem, executablePath: string | undefined, workingDir: string, reuseTab: boolean): LaunchSpec | null;

  /**
   * Candidate absolute paths and/or bare command names that, if any resolves to an
   * existing file or a PATH entry, mean this terminal is installed on os.
   */
  detectionCandidates(os: OperatingSystem): string[];
}
