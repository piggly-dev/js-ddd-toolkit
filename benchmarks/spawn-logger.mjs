import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const process1 = spawn('node', [path.join(__dirname, 'logger.mjs')]);
const process2 = spawn('node', [path.join(__dirname, 'logger.mjs')]);

process1.stdout.on('data', data => {
	console.log(`[logger/1] ${data.toString()}`);
});

process2.stdout.on('data', data => {
	console.log(`[logger/2] ${data.toString()}`);
});

process1.on('exit', code => {
	console.log(`[logger/1] ended with code ${code}`);
});

process2.on('exit', code => {
	console.log(`[logger/2] ended with code ${code}`);
});
