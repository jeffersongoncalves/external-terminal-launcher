import { OperatingSystem, currentOS } from '../os/operatingSystem';
import { TerminalProvider } from './types';
import { isInstalled } from './executableResolver';
import { WarpProvider } from './providers/warpProvider';
import { WindowsTerminalProvider } from './providers/windowsTerminalProvider';
import { WezTermProvider } from './providers/wezTermProvider';
import { AlacrittyProvider } from './providers/alacrittyProvider';
import { KittyProvider } from './providers/kittyProvider';

/** Central catalogue of supported terminals. Order here is the order shown in settings. */
export const providers: TerminalProvider[] = [
  new WarpProvider(),
  new WindowsTerminalProvider(),
  new WezTermProvider(),
  new AlacrittyProvider(),
  new KittyProvider()
];

export const defaultProviderId: string = providers[0].id;

export function byId(id: string | undefined): TerminalProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function byIdOrDefault(id: string | undefined): TerminalProvider {
  return byId(id) ?? byId(defaultProviderId) ?? providers[0];
}

/**
 * Providers whose binary is detected on os via executableResolver. Registry order is
 * preserved. Terminals unsupported on the OS report no detection candidates, so they are
 * naturally excluded.
 */
export function installedProviders(os: OperatingSystem = currentOS()): TerminalProvider[] {
  return providers.filter((p) => isInstalled(p.detectionCandidates(os), os));
}
