import cron from 'node-cron';

interface Schedule {
  name: string;
  cronExpr: string;
  task: Runnable;
}

interface Runnable {
  run(): void;
}

class Schedular {
  private readonly schedules: Schedule[] = [];

  public register(task: Schedule): Schedular {
    this.schedules.push(task);
    return this;
  }

  public startSchedule() {
    this.schedules.forEach(schedule => {
      cron.schedule(schedule.cronExpr, () => {
        schedule.task.run();
      });
    });
  }
}

export { Schedular, Runnable };
