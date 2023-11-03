import { ConsoleLogger } from "@nestjs/common";

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    // 로깅 관련 부가 로직 추가
    // ex. DB에 저장
  }
}
