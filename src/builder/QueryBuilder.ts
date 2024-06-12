import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public query: Record<string, unknown>;
  public queryModel: Query<T[], T>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.queryModel = queryModel;
  }

  search(searchFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      const searchQuery = {
        $or: searchFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            } as FilterQuery<T>)
        ),
      };

      this.queryModel = this.queryModel.find(searchQuery);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFileds: string[] = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
    ];

    excludeFileds.forEach((el) => delete queryObj[el]);

    this.queryModel = this.queryModel.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortItem = this?.query?.sort || '-createdAt';
    this.queryModel = this.queryModel.sort(sortItem as string);

    return this;
  }

  fields() {
    const fields = this?.query?.fields || '-__v';
    const selectFields = (fields as string).replace(',', ' ');

    this.queryModel = this.queryModel.select(selectFields);

    return this;
  }

  pagination() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.queryModel = this.queryModel.skip(skip).limit(limit);

    return this;
  }
}

export default QueryBuilder;
