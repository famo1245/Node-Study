import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../event/user-created.event";
import { TestEvent } from "../event/test.event";
import { EmailService } from "../../email/email.service";

@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent | TestEvent> {
  constructor(private emailService: EmailService) {}

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log("UserCreatedEvent");
        //@ts-ignore
        const { email, signupVerifyToken } = event;
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
        break;
      }

      case TestEvent.name: {
        console.log("Test event");
        break;
      }

      default:
        break;
    }
  }
}
