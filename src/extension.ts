import * as vscode from 'vscode';
import { registerOpenCommand } from './commands/openTerminal';

export function activate(context: vscode.ExtensionContext) {
  registerOpenCommand(context);
}

export function deactivate() {}
