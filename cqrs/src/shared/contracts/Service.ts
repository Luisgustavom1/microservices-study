export interface Service<Save, List = void> {
  save(values: unknown): Promise<Save | undefined>;
  list(where: unknown): Promise<List | undefined>;
}