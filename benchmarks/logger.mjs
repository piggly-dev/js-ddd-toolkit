/* eslint-disable no-console */
import { fileURLToPath } from 'url';
import path from 'path';

import { LoggerService } from '../dist/esm/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const simulateCallback = async () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, 100);
	});
};

const logger = new LoggerService({
	alwaysOnConsole: false,
	callbacks: {
		onDebug: simulateCallback,
		onError: simulateCallback,
		onFatal: simulateCallback,
		onInfo: simulateCallback,
		onWarn: simulateCallback,
	},
	file: {
		abspath: path.join(__dirname, 'logs'),
		killOnLimit: true,
		levels: ['debug', 'info', 'warn', 'error', 'fatal'],
		streamLimit: 50000,
	},
	ignoreLevels: [],
	ignoreUnset: true,
	onError: error => {
		console.error(error);
	},
	onFlush: async () => {
		await simulateCallback();
	},
	promises: {
		killOnLimit: true,
		limit: 50000,
		track: ['onError', 'onFatal'],
	},
});

process.on('SIGTERM', async () => {
	console.log('SIGTERM received');
	await logger.cleanup();
	process.exit(0);
});

process.on('SIGINT', async () => {
	await logger.cleanup();
	process.exit(0);
});

const runLoadTest = async (logs, concurrent) => {
	const start_time = performance.now();
	const levels = ['debug', 'info', 'warn', 'error', 'fatal'];

	for (let i = 0; i < logs; i++) {
		const level = levels[i % levels.length];

		switch (level) {
			case 'debug':
				logger.debug(`debug number #${i}`, { extra: `data #${i}` });
				break;
			case 'error':
				logger.error(`error number #${i}`, { extra: `data #${i}` });
				break;
			case 'fatal':
				logger.fatal(`fatal number #${i}`, { extra: `data #${i}` });
				break;
			case 'info':
				logger.info(`info number #${i}`, { extra: `data #${i}` });
				break;
			case 'warn':
				logger.warn(`warn number #${i}`, { extra: `data #${i}` });
				break;
		}

		if (i % concurrent === 0) {
			await logger.wait(5);
		}
	}

	const end_time = performance.now();
	console.log(`test completed in ${(end_time - start_time).toFixed(2)}ms`);

	await logger.cleanup();
};

runLoadTest(10000, 100);
