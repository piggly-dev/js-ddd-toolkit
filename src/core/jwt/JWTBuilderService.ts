import * as jose from 'jose';

import {
	JWTBuilderServiceSettingsSchema,
	JWTBuilderServiceSettings,
	JWTBuilderServiceEntry,
} from '@/core/jwt/schemas/index.js';
import { IJWTBuilderService, JWTPayload } from '@/core/jwt/types/index.js';
import { ApplicationService } from '@/core/ApplicationService.js';
import { ServiceProvider } from '@/core/ServiceProvider.js';

/**
 * @file JWT builder service.
 * @copyright Piggly Lab 2025
 */
export class JWTBuilderService
	extends ApplicationService
	implements IJWTBuilderService
{
	/**
	 * Settings.
	 *
	 * @type {JWTBuilderServiceSettings}
	 * @protected
	 * @memberof JWTBuilderService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: JWTBuilderServiceSettings;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof JWTBuilderService
	 * @throws {ZodError} If settings are invalid.
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: JWTBuilderServiceEntry) {
		super();

		this._settings = JWTBuilderServiceSettingsSchema.parse(settings);
	}

	/**
	 * Get the name of the service.
	 *
	 * @returns {string}
	 * @public
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @override
	 */
	public static get name(): string {
		return 'JWTBuilderService';
	}

	/**
	 * Issue a token from payload.
	 *
	 * - For EdDSA and RS256, the private key will be used to sign the token;
	 * - For HS256, the private key will be a symmetric key.
	 *
	 * @requires jose
	 * @param {string} jti
	 * @param {string} sub
	 * @param {number} ttl
	 * @param {object} payload
	 * @param {string} audience If not provided, the audience set in settings will be used.
	 * @returns {Promise<string>}
	 * @throws {Error} If the token cannot be issued or audience is not set on param and settings.
	 * @public
	 * @async
	 * @memberof JWTBuilderService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async issue<Payload extends JWTPayload>(
		jti: string,
		sub: string,
		ttl: number,
		payload: Payload,
		audience?: string,
	): Promise<string> {
		const timestamp = Math.floor(new Date().getTime() / 1000);

		if (!audience && !this._settings.audience) {
			throw new Error(
				'Audience is required. You must set audience in settings or pass it to the issue method.',
			);
		}

		return new jose.SignJWT(payload)
			.setProtectedHeader({ alg: this._settings.algorithm })
			.setJti(jti)
			.setIssuer(this._settings.issuer)
			.setSubject(sub)
			.setAudience(audience ?? this._settings.audience ?? 'none')
			.setIssuedAt(timestamp)
			.setNotBefore(timestamp)
			.setExpirationTime(timestamp + ttl)
			.sign(await this._getPrivateKey());
	}

	/**
	 * Read a token and return the payload.
	 *
	 * - For EdDSA and RS256, the private key will be used to sign the token;
	 * - For HS256, the private key will be a symmetric key.
	 *
	 * @param {string} token
	 * @param {string[]} required_claims
	 * @param {string} audience If not provided, the audience set in settings will be used.
	 * @returns {Promise<Payload>}
	 * @throws {Error} If the token is invalid or audience is not set on param and settings.
	 * @public
	 * @async
	 * @memberof JWTBuilderService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async read<Payload extends JWTPayload>(
		token: string,
		required_claims: string[],
		audience?: string,
	): Promise<Payload> {
		if (!audience && !this._settings.audience) {
			throw new Error(
				'Audience is required. You must set audience in settings or pass it to the read method.',
			);
		}

		const { payload } = await jose.jwtVerify(token, await this._getPublicKey(), {
			algorithms: [this._settings.algorithm],
			audience: audience ?? this._settings.audience ?? 'none',
			issuer: this._settings.issuer,
			requiredClaims: ['jti', 'iss', 'aud', 'nbf', 'exp', ...required_claims],
		});

		return payload as Payload;
	}

	/**
	 * Get the private key based on the algorithm.
	 * For HS256, public key and private key will be the same.
	 *
	 * @returns {Uint8Array | CryptoKey}
	 * @protected
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @throws {Error} If the algorithm is invalid.
	 */
	protected async _getPrivateKey(): Promise<jose.CryptoKey | Uint8Array> {
		switch (this._settings.algorithm) {
			case 'EdDSA':
				return await jose.importPKCS8(this._settings.private_key, 'EdDSA');
			case 'HS256':
				return new TextEncoder().encode(this._settings.private_key);
			case 'RS256':
				return await jose.importPKCS8(this._settings.private_key, 'RS256');
		}

		throw new Error(`Invalid algorithm: ${this._settings.algorithm}`);
	}

	/**
	 * Get the public key based on the algorithm.
	 * For HS256, public key and private key will be the same.
	 *
	 * @returns {string}
	 * @protected
	 * @memberof JWTBuilderService
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @throws {Error} If the algorithm is invalid.
	 */
	protected async _getPublicKey(): Promise<jose.CryptoKey | Uint8Array> {
		switch (this._settings.algorithm) {
			case 'EdDSA':
				return await jose.importSPKI(this._settings.public_key, 'EdDSA');
			case 'HS256':
				return new TextEncoder().encode(this._settings.private_key);
			case 'RS256':
				return await jose.importSPKI(this._settings.public_key, 'RS256');
		}

		throw new Error(`Invalid algorithm: ${this._settings.algorithm}`);
	}

	/**
	 * Register application service.
	 *
	 * @param {JWTBuilderService} service
	 * @public
	 * @static
	 * @memberof JWTBuilderService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: JWTBuilderService): void {
		ServiceProvider.register(JWTBuilderService.name, service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {JWTBuilderService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof JWTBuilderService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): JWTBuilderService {
		return ServiceProvider.resolve(JWTBuilderService.name);
	}
}
