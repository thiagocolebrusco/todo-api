import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { UserSeed } from "../../seeds/user.seed";

export class seedUsers1639750234729 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    await getRepository("user").save(UserSeed);
  }

  public async down(_: QueryRunner): Promise<void> {}
}
