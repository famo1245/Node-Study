import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../../domain/iuser.repository";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { UserFactory } from "../../../domain/user.factory";
import { User } from "../../../domain/user";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    if (!userEntity) {
      return null;
    }

    const { id, name, signupVerifyToken, password } = userEntity;
    return this.userFactory.reconstitute(id, name, email, signupVerifyToken, password);
  }
  async save(id: string, name: string, email: string, password: string, signupVerifyToken: string): Promise<void> {
    //   await this.conn.transaction(async manager => {
    //     const user = new UserEntity();
    //     user.id = id;
    //     user.name = name;
    //     user.email = email;
    //     user.password = password;
    //     user.signupVerifyToken = signupVerifyToken;
    //
    //     await manager.save(user);
    //   })
    const user = this.userRepository.create({
      id: id,
      name: name,
      email: email,
      password: password,
      signupVerifyToken: signupVerifyToken,
    });

    await this.userRepository.save(user);
  }
}
