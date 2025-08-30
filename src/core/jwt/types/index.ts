/**
 * JWT Payload.
 *
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type JWTPayload = {
	aud?: string[] | string;
	exp?: number;
	iat?: number;
	iss?: string;
	jti?: string;
	nbf?: number;
	sub?: string;
	/** Any other JWT Claim Set member. */
	[propName: string]: unknown;
};

/**
 * JWT Builder Service.
 *
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface IJWTBuilderService {
	issue<Payload extends JWTPayload>(
		jti: string,
		sub: string,
		ttl: number,
		payload: Payload,
		audience?: string,
	): Promise<string>;
	read<Payload extends JWTPayload>(
		token: string,
		required_claims: string[],
		audience?: string,
	): Promise<Payload>;
}
