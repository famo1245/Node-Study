import { UserFactory } from "./user.factory";
import { Test } from "@nestjs/testing";
import { EventBus } from "@nestjs/cqrs";
import { User } from "./user";

describe("UserFactory", () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>; // Jest의 Mocked 객체로 선언

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [UserFactory, { provide: EventBus, useValue: { publish: jest.fn() } }], // jest.fn() 아무 동작도 하지 않는 함수
    }).compile();

    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe("create", () => {
    it("should create user", () => {
      // Given
      // When
      const user = userFactory.create("user-id", "name", "email@email.com", "tokennnnnn", "1234");

      // Then
      const expected = new User("user-id", "name", "email@email.com", "tokennnnnn", "1234");
      expect(expected).toEqual(user);
      expect(eventBus.publish).toBeCalledTimes(1);
    });
  });

  describe("reconstitute", () => {
    it("should reconstitute user", () => {
      // Given
      // When
      const user = userFactory.reconstitute("user-id", "name", "email@email.com", "tokennnnnn", "1234");

      // Then
      const expected = new User("user-id", "name", "email@email.com", "1234", "tokennnnnn");
      expect(expected).toEqual(user);
    });
  });
});
