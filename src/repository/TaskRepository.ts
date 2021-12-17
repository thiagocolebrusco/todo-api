import { getConnection, Repository } from "typeorm";
import { Task } from "../data/entity/Task";
import { ITask } from "../interfaces";

interface TaskFilter {
  search?: string;
  status?: string;
}

export default class TaskRepository {
  private _repository!: Repository<Task>;

  get repository() {
    if (!this._repository) {
      const connection = getConnection();
      if (!!connection) this._repository = connection.getRepository(Task);
    }
    return this._repository;
  }

  async getAll(userId: number, filter: TaskFilter) {
    const queryBuilder = this.repository
      .createQueryBuilder("task")
      .select(["task", "user.id", "user.name"])
      .innerJoin("task.user", "user")
      .where("user.id = :userId", { userId });

    if (filter.status)
      queryBuilder.andWhere("status = :status", { status: filter.status });
    if (filter.search)
      queryBuilder.andWhere(
        "(title ILIKE :search OR description ILIKE :search)",
        {
          search: `%${filter.search}%`,
        }
      );

    const tasks = queryBuilder.getMany();
    return tasks;
  }

  async getById(userId: number, id: number) {
    return this.repository.findOne({ where: { id, user: userId } });
  }

  async create(userId: number, payload: ITask) {
    const task = await this.repository.create({
      ...payload,
      user: { id: userId },
    });
    const result = await this.repository.save(task);
    return result;
  }

  async update(userId: number, payload: ITask, id: number) {
    const task = await this.getById(userId, id);
    if (!task) throw new Error("Could not find task");

    this.repository.merge(task, payload);
    const result = await this.repository.save(task);
    return result;
  }

  async changeStatus(userId: number, id: number, status: string) {
    let task = await this.getById(userId, id);
    if (!task) throw new Error("Could not find task");
    task.status = status;

    const result = await this.repository.save(task);
    return result;
  }

  async delete(userId: number, id: number) {
    const task = await this.getById(userId, id);
    if (!task) throw new Error("Could not find task");

    return this.repository.remove(task);
  }
}
