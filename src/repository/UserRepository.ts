import { getConnection, ILike, Repository } from "typeorm";
import { User } from "../data/entity/User";
import { IUser } from "../interfaces";

interface UserFilter {
  search?: string;
}

export default class UserRepository {
  private _repository!: Repository<User>;

  get repository() {
    if (!this._repository) {
      const connection = getConnection();
      if (!!connection) this._repository = connection.getRepository(User);
    }
    return this._repository;
  }

  async login(email: string, password: string) {
    return this.repository.findOne({ email, password });
  }

  async getAll(filter: UserFilter) {
    let where: any = [];
    if (filter.search)
      where = [
        { name: ILike(`%${filter.search}%`) },
        { email: ILike(`%${filter.search}%`) },
      ];

    const users = this.repository.find({ where });
    return users;
  }

  async getById(id: number) {
    return this.repository.findOne(id);
  }

  async create(payload: IUser) {
    const user = await this.repository.create(payload);
    const result = await this.repository.save(user);
    return result;
  }

  async update(payload: IUser, id: number) {
    const user = await this.repository.findOne(id);
    if (!user) throw new Error("Could not find user");

    this.repository.merge(user, payload);
    const result = await this.repository.save(user);
    return result;
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
