import * as vscode from 'vscode';
import { defaultProviderId } from './terminal/terminalRegistry';

function config(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('externalTerminal');
}

export function getSelectedTerminalId(): string {
  return config().get<string>('selectedTerminalId', defaultProviderId);
}

export function getReuseTab(): boolean {
  return config().get<boolean>('reuseTab', true);
}

/** Custom executable path for terminalId, or undefined when using the provider default. */
export function getExecutablePath(terminalId: string): string | undefined {
  const overrides = config().get<Record<string, string>>('executablePaths', {});
  const path = overrides[terminalId];
  return path?.trim() ? path.trim() : undefined;
}
