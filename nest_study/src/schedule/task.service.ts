import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  // @Cron("* * * * * *", { name: "cronTask" })
  // @Cron(new Date(Date.now() + 3 * 1000))  // App이 bootstrap 후 3초뒤 수행
  // @Interval("intervalTask", 3000) // timeout(ms) 동안 반복 수행
  // @Timeout("timeoutTask", 5000) // 앱이 실행된 후 한 번만 수행
  handleCron() {
    this.logger.log("Task Called");
  }

  private addCronJob() {
    const name = "cronSample";
    const job = new CronJob("* * * * * *", () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    this.logger.warn(`job ${name} added!`);
  }
}
