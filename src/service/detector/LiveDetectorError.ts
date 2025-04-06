/**
 */
class DetectionFailureError extends Error {
  constructor(url: string) {
    super(`Detection failed - ${url}`);
    this.name = 'DetectionFailureError';
  }
}

export default DetectionFailureError;
