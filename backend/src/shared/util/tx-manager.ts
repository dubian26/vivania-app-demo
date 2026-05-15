export abstract class TxManager {
  abstract run<T>(work: () => Promise<T>): Promise<T>
}
