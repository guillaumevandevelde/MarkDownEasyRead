import * as path from 'path';
import Mocha from 'mocha';
import { globSync } from 'glob';

export function run(): Promise<void> {
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		try {
			const files = globSync('**/*.test.js', { cwd: testsRoot });

			if (!files || files.length === 0) {
				return e(new Error('No test files found'));
			}

			files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

			mocha.run((failures: number) => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}