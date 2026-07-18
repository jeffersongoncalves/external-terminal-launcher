import * as vscode from 'vscode';
import { launch } from '../terminalLauncher';
import { byIdOrDefault } from '../terminal/terminalRegistry';
import { getSelectedTerminalId } from '../settings';

export function registerOpenCommand(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'externalTerminal.open';
  updateStatusBar(statusBarItem);

  context.subscriptions.push(
    statusBarItem,
    vscode.commands.registerCommand('externalTerminal.open', () => launch()),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('externalTerminal.selectedTerminalId')) {
        updateStatusBar(statusBarItem);
      }
    })
  );

  statusBarItem.show();
}

function updateStatusBar(item: vscode.StatusBarItem) {
  const provider = byIdOrDefault(getSelectedTerminalId());
  item.text = `$(terminal) ${provider.displayName}`;
  item.tooltip = `Open ${provider.displayName} at the workspace root`;
}
