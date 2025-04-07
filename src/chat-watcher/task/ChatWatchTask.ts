import { chromium } from 'playwright';
import { log } from '@common/logger';
import { $ } from 'bun';
import {
  spawn,
  ChildProcess,
  ChildProcessWithoutNullStreams,
  ChildProcessByStdio,
} from 'child_process';
import Stream from 'stream';

interface StoppableTask {
  start(): Promise<void>;
  stop(): void;
}

// test
const controller = new AbortController();
const { signal } = controller;

class SoopChatWatcher implements StoppableTask {
  private readonly bjName: string;
  private readonly liveUrl: string;
  private readonly chatHandler?: (chat: string) => void;
  private childProcess: ChildProcessByStdio<null, Stream.Readable, Stream.Readable> | null = null;

  public constructor(bjName: string, liveUrl: string, chatHandler?: (chat: string) => void) {
    this.bjName = bjName;
    this.liveUrl = liveUrl;
    this.chatHandler = chatHandler;
  }

  /**
   * 온갖 똥꼬쇼 끝에 Bun이 제공하는 spawn은 자식 process kill이 되지 않는 문제 발견...
   * 그래서 Bun 안쓰고 Node.js꺼 사용.
   * 아직 이 부분은 어려움...
   */
  public async start() {
    const proc = spawn('sh', ['run.sh', this.liveUrl], {
      cwd: './chat-crawler-python',
      stdio: ['ignore', 'pipe', 'pipe'], // 부모 프로세스와 연결된 stdout, stderr
      detached: true,
    });
    this.childProcess = proc;

    proc.stdout.on('data', (data: Buffer) => {
      this.chatHandler?.call(this, data.toString().trim());
    });

    // pipe 에러 메시지
    proc.stderr.on('data', (data: Buffer) => {
      log.error(`[${this.bjName}] Error: ${data.toString().trim()}`);
    });

    // 에러 처리
    proc.on('uncaughtException', (err, origin) => {
      log.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}\n`);
    });

    log.debug(`[${this.bjName}] Process started with PID: ${proc.pid}`);
  }

  public stop(): void {
    if (this.childProcess && this.childProcess.pid) {
      try {
        process.kill(this.childProcess.pid, 0); // check if process exists
      } catch (e) {
        log.warn(`[${this.bjName}] Process with PID: ${this.childProcess.pid} is not running.`);
        return;
      }
      log.debug(`[${this.bjName}] Stopping process with PID: ${this.childProcess.pid}`);
      process.kill(this.childProcess.pid, 'SIGINT'); // SIGINT 신호로 프로세스 종료
      this.childProcess = null;
    } else {
      log.warn(`[${this.bjName}] No process to stop.`);
    }
  }
}

interface SoopChatWatcherProvider {
  createWatcher(bjName: string, liveUrl: string): StoppableTask;
  createWatcher(
    bjName: string,
    liveUrl: string,
    chatHandler?: (chat: string) => void
  ): StoppableTask;
}

class DefaultSoopChatWatcherProvider implements SoopChatWatcherProvider {
  createWatcher(
    bjName: string,
    liveUrl: string,
    chatHandler?: (chat: string) => void
  ): StoppableTask {
    return new SoopChatWatcher(bjName, liveUrl, chatHandler);
  }
}

export { DefaultSoopChatWatcherProvider, SoopChatWatcherProvider, StoppableTask };
