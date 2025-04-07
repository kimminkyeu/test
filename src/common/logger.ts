class Logger {
  private readonly logger: (message: string, ...rest: any[]) => void;

  constructor(logger: (message: string, ...rest: any[]) => void) {
    this.logger = logger;
  }

  public info(message: string, ...rest: any[]): void {
    this.logWithMetadata('INFO', Color.Green, message, ...rest);
  }

  public warn(message: string, ...rest: any[]): void {
    this.logWithMetadata('WARN', Color.Yellow, message, ...rest);
  }

  public error(message: string, ...rest: any[]): void {
    this.logWithMetadata('ERROR', Color.Red, message, ...rest);
  }

  public debug(message: string, ...rest: any[]): void {
    this.logWithMetadata('DEBUG', Color.Cyan, message, ...rest);
  }

  public trace(message: string, ...rest: any[]): void {
    this.logWithMetadata('TRACE', Color.Blue, message, ...rest);
  }

  // for Hono logger middleware
  public printFn(message: string, ...rest: any[]): void {
    this.logWithMetadata('HONO', Color.Reset, message, ...rest);
  }

  // Internal Helper ------------------------------
  private logWithMetadata(level: string, color: Color, message: string, ...rest: any[]): void {
    // Bun 런타임은 worker를 지원하며, workerId를 통해 스레드 이름을 구분할 수 있습니다.
    // 하지만 Bun 자체는 스레드 ID를 직접 제공하지 않으므로, workerId를 활용하거나
    // 별도의 스레드 관리 로직을 구현해야 합니다.
    const timestamp = new Date().toISOString();
    this.logger(
      `${Color.Gray}[${timestamp}]${Color.Reset} ${color}${level}${Color.Reset} ${message}`,
      ...rest
    );
  }
}

// Logger의 단일 인스턴스를 생성하고 export
// 파일로 남기는 등의 Log4J와 같은 기능 추가 예정
const log = new Logger((message: string, ...rest: any[]) => {
  console.log(message, ...rest);
});

enum Color {
  // ANSI escape codes for colors
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Blue = '\x1b[34m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  Gray = '\x1b[37m',
  Reset = '\x1b[0m',
}

export { log };
