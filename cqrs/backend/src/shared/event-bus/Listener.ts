export interface Listener {
  execute(message: unknown): Promise<void>;
}