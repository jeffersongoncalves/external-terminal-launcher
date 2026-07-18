import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { OperatingSystem, currentOS } from './os/operatingSystem';
import { TerminalProvider } from './terminal/types';
import { byIdOrDefault } from './terminal/terminalRegistry';
import { isInstalled } from './terminal/executableResolver';
import { getSelectedTerminalId, getReuseTab, getExecutablePath } from './settings';

const osName: Record<OperatingSystem, string> = {
  [OperatingSystem.WINDOWS]: 'windows',
  [OperatingSystem.MAC]: 'mac',
  [OperatingSystem.LINUX]: 'linux',
  [OperatingSystem.UNKNOWN]: 'unknown'
};

/** Resolves the configured terminal and spawns it at the workspace root. */
export async function launch(): Promise<void> {
  const workingDir = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workingDir) {
    vscode.window.showWarningMessage('External Terminal: no folder open.');
    return;
  }

  const provider = byIdOrDefault(getSelectedTerminalId());
  const os = currentOS();

  const spec = provider.launchSpec(os, getExecutablePath(provider.id), workingDir, getReuseTab());
  if (!spec) {
    vscode.window.showWarningMessage(`${provider.displayName} is not supported on ${osName[os]}.`);
    return;
  }

  if (!isAvailable(provider, os)) {
    vscode.window.showWarningMessage(
      `${provider.displayName} was not found. Set its executable path in Settings → External Terminal Launcher.`
    );
    return;
  }

  try {
    spawn(spec.executable, spec.args, { cwd: workingDir, detached: true, stdio: 'ignore' }).unref();
  } catch (err: any) {
    vscode.window.showErrorMessage(`Failed to open ${provider.displayName}: ${err.message}`);
  }
}

/** A user-set executable path is trusted; otherwise probe the provider's detection candidates. */
function isAvailable(provider: TerminalProvider, os: OperatingSystem): boolean {
  if (getExecutablePath(provider.id)) return true;
  return isInstalled(provider.detectionCandidates(os), os);
}
