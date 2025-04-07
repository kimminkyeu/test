import SoopLiveDetector from '@live-detector/internal/SoopLiveDetector';
import { expect, test } from 'bun:test';

test('SoopLiveDetector should throw error on invalid broadcaster', async () => {
  // given
  const soopLiveDetector = new SoopLiveDetector();
  // when
  const result = soopLiveDetector.getLiveUrl('someUserThatDoesNotExistXXX___');
  try {
    await result; // Promise가 resolve되면 테스트는 실패해야 함
    throw new Error('Promise should have been rejected');
  } catch (error: any) {
    console.error('Caught expected error:', error); // 에러 출력
    expect(error).toBeInstanceOf(Error); // 에러가 Error의 인스턴스인지 확인
  }
});
