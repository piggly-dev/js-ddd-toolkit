import crypto from 'node:crypto';

/**
 * @file Crypto service.
 * @copyright Piggly Lab 2025
 */
export class CryptoService {
	/**
	 * Random generates a client key with uuid.
	 *
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateClientKey(): string {
		return CryptoService.generateUUID();
	}

	/**
	 * Random generates a client secret.
	 *
	 * @param {number} [size=36]
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateClientSecret(size = 36): string {
		const buffer = crypto.randomBytes(size);

		return buffer
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
			.replace(/=/g, '');
	}

	/**
	 * Generate an Ed25519 key pair.
	 *
	 * @returns {crypto.KeyPairSyncResult<string, string>}
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateKeyPair(): crypto.KeyPairSyncResult<string, string> {
		return crypto.generateKeyPairSync('ed25519', {
			privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
			publicKeyEncoding: { format: 'pem', type: 'spki' },
		});
	}

	/**
	 * Generate a SHA256 safe hash from a seed.
	 * If no seed is provided, a random one will be generated.
	 *
	 * @param {Buffer} [seed]
	 * @returns {Buffer}
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateSecret(seed?: Buffer): Buffer {
		return crypto
			.createHash('sha256')
			.update(seed ?? crypto.randomBytes(32))
			.digest();
	}

	/**
	 * Random generates a uuid.
	 *
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generateUUID(): string {
		return crypto.randomUUID();
	}

	/**
	 * Hash a string with a specific algorithm.
	 *
	 * @param {string} data
	 * @param {string} [algorithm='sha256']
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static hash(data: string, algorithm = 'sha256'): string {
		return crypto.createHash(algorithm).update(data).digest('hex');
	}

	/**
	 * Compare a password with bcrypt hash.
	 *
	 * @requires bcrypt
	 * @returns {Promise<boolean>}
	 * @public
	 * @static
	 * @async
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async passwordCompare(
		password: string,
		hash: string,
	): Promise<boolean> {
		const bcrypt = await import('bcrypt');

		return new Promise<boolean>((resolve, reject) => {
			bcrypt.compare(password, hash, (err, result) => {
				if (err) {
					return reject(err);
				}

				return resolve(result);
			});
		});
	}

	/**
	 * Hash a password with bcrypt hash.
	 *
	 * @requires bcrypt
	 * @returns {Promise<string>}
	 * @public
	 * @static
	 * @async
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async passwordHash(password: string, salt = 12): Promise<string> {
		const bcrypt = await import('bcrypt');

		return new Promise<string>((resolve, reject) => {
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					return reject(err);
				}

				return resolve(hash);
			});
		});
	}

	/**
	 * Sign a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static sign(data: string, key: string): string {
		return crypto.createHmac('sha256', key).update(data).digest('hex');
	}

	/**
	 * Verify a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @param {string} signature
	 * @public
	 * @static
	 * @memberof CryptoService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static verify(
		data: string,
		signature: string,
		key: string,
		onError?: (err: any) => void,
	): boolean {
		try {
			const generatedSignature = CryptoService.sign(data, key);

			return crypto.timingSafeEqual(
				Buffer.from(generatedSignature, 'hex'),
				Buffer.from(signature, 'hex'),
			);
		} catch (err) {
			if (onError) {
				onError(err);
			}

			return false;
		}
	}
}
