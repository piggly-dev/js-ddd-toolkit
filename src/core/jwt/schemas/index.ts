import z from 'zod';

/**
 * JWT builder service settings.
 *
 * - audience: The audience of the JWT.s
 * - issuer: The issuer of the JWT.
 * - private_key: The private key of the JWT.
 * - public_key: The public key of the JWT.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const JWTBuilderServiceSettingsSchema = z.object({
	algorithm: z.enum(['EdDSA', 'HS256', 'RS256']),
	audience: z.string().optional(),
	issuer: z.string(),
	private_key: z.string(),
	public_key: z.string(),
});

export type JWTBuilderServiceSettings = z.infer<
	typeof JWTBuilderServiceSettingsSchema
>;

// entry
export type JWTBuilderServiceEntry = JWTBuilderServiceSettings;
