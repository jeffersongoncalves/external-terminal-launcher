import * as assert from 'assert';
import { WarpProvider } from '../../src/terminal/providers/warpProvider';
import { OperatingSystem } from '../../src/os/operatingSystem';

suite('WarpProvider', () => {
  const provider = new WarpProvider();

  test('windows uses warp:// deep link with encoded path', () => {
    const spec = provider.launchSpec(OperatingSystem.WINDOWS, 'C:\\Warp\\warp.exe', 'C:\\repo dir', true);
    assert.strictEqual(spec?.executable, 'C:\\Warp\\warp.exe');
    assert.strictEqual(spec?.args[0], `warp://action/new_tab?path=${encodeURIComponent('C:\\repo dir')}`);
  });

  test('mac uses open -a Warp', () => {
    const spec = provider.launchSpec(OperatingSystem.MAC, undefined, '/repo', false);
    assert.deepStrictEqual(spec, { executable: 'open', args: ['-a', 'Warp', '/repo'] });
  });

  test('linux uses warp-terminal --working-directory', () => {
    const spec = provider.launchSpec(OperatingSystem.LINUX, undefined, '/repo', false);
    assert.deepStrictEqual(spec, { executable: 'warp-terminal', args: ['--working-directory', '/repo'] });
  });

  test('unknown os is unsupported', () => {
    assert.strictEqual(provider.launchSpec(OperatingSystem.UNKNOWN, undefined, '/repo', false), null);
  });
});
