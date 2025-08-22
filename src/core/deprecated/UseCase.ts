/**
 * @deprecated Use any other class instead.
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 * @since 5.0.0
 * @version 5.0.0
 */
export abstract class UseCase<Input, Output> {
	public abstract execute(input: Input): Promise<Output>;
}
