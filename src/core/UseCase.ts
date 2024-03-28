export default abstract class UseCase<Input, Output> {
	public abstract execute(input: Input): Promise<Output>;
}
