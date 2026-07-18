import * as assert from 'assert';
import { resolve } from '../../src/terminal/executableResolver';
import { OperatingSystem, fromPlatform } from '../../src/os/operatingSystem';

suite('executableResolver', () => {
  test('absolute path resolves when it exists', () => {
    const path = 'C:\\Program Files\\Warp\\warp.exe';
    const resolved = resolve(path, OperatingSystem.WINDOWS, [], (p) => p === path);
    assert.strictEqual(resolved, path);
  });

  test('absolute path returns null when missing', () => {
    const resolved = resolve('/opt/missing/warp', OperatingSystem.LINUX, [], () => false);
    assert.strictEqual(resolved, null);
  });

  test('bare command found on PATH with windows exe extension', () => {
    const resolved = resolve('wt', OperatingSystem.WINDOWS, ['C:\\bin'], (p) => p === 'C:\\bin\\wt.exe');
    assert.strictEqual(resolved, 'C:\\bin\\wt.exe');
  });

  test('bare command found on PATH on linux', () => {
    const resolved = resolve(
      'wezterm',
      OperatingSystem.LINUX,
      ['/usr/bin', '/usr/local/bin'],
      (p) => p === '/usr/local/bin/wezterm'
    );
    assert.strictEqual(resolved, '/usr/local/bin/wezterm');
  });

  test('blank candidate never resolves', () => {
    assert.strictEqual(resolve('', OperatingSystem.LINUX, [], () => true), null);
  });

  test('isInstalled true when any candidate resolves', () => {
    const installed = ['/missing', '/usr/bin/kitty'].some(
      (c) => resolve(c, OperatingSystem.LINUX, [], (p) => p === '/usr/bin/kitty') !== null
    );
    assert.ok(installed);
  });

  test('os detection maps platform names', () => {
    assert.strictEqual(fromPlatform('win32'), OperatingSystem.WINDOWS);
    assert.strictEqual(fromPlatform('darwin'), OperatingSystem.MAC);
    assert.strictEqual(fromPlatform('linux'), OperatingSystem.LINUX);
    assert.strictEqual(fromPlatform('sunos'), OperatingSystem.LINUX);
    assert.strictEqual(fromPlatform('haiku'), OperatingSystem.UNKNOWN);
  });
});
