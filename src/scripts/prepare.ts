import log from '@/lib/logger';

/**
 * @note
 * package.json에서 prepare.ts를 실행하는 task가 정의되어 있습니다.
 *    - ex. 서버 실행시 최초 ddl 설정
 */

async function main() {
  await runScript('./database/initDatabase.ts');
}

async function runScript(filePath: string): Promise<void> {
  log.info(`Running: ${filePath}`);
  const module = await import(`${filePath}`); // 상대 경로에 맞춰 수정
  if (typeof module.default === 'function') {
    await module.default();
    return;
  }
  if (module.main) {
    module.main();
    return;
  }
  log.error(
    `Run failed.\n\tCause: ${filePath} does not have a default export or a 'main' function.`
  );
}

main().catch(error => {
  log.error('Stopping script due to error:', error);
  process.exit(1); // 오류 발생 시 프로세스 종료 (서버 실행 방지)
});
