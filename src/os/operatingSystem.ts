export enum OperatingSystem {
  WINDOWS,
  MAC,
  LINUX,
  UNKNOWN
}

export function fromPlatform(platform: string): OperatingSystem {
  switch (platform) {
    case 'win32':
      return OperatingSystem.WINDOWS;
    case 'darwin':
      return OperatingSystem.MAC;
    case 'linux':
    case 'aix':
    case 'freebsd':
    case 'openbsd':
    case 'sunos':
      return OperatingSystem.LINUX;
    default:
      return OperatingSystem.UNKNOWN;
  }
}

export function currentOS(): OperatingSystem {
  return fromPlatform(process.platform);
}
