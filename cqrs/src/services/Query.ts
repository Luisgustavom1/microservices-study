import { Collection, InsertOneResult, WithId } from "mongodb";

export interface Query<T = Collection> {
  save(values: unknown): Promise<InsertOneResult<T> | undefined>;
  list(value: unknown): Promise<WithId<T>[] | undefined>;
}