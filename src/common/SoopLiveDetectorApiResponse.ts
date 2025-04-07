class SoopLiveDetectorApiDto {
  public readonly name: string;
  public readonly liveUrl: string | null;

  public constructor(name: string, liveUrl: string | null) {
    this.name = name;
    this.liveUrl = liveUrl;
  }

  public isLive(): boolean {
    return this.liveUrl !== undefined && this.liveUrl !== null;
  }
}

export { SoopLiveDetectorApiDto };
