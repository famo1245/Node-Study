import { Controller, Post } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import * as console from "console";

@Controller("batches")
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {}

  @Post("/start-sample")
  start() {
    const job = this.scheduler.getCronJob("cronSample");

    job.start();
    console.log("start!! ", job.lastDate());
  }

  @Post("/stop-sample")
  stop() {
    const job = this.scheduler.getCronJob("cronSample");

    job.stop();
    console.log("stopped!! ", job.lastDate());
  }
}
