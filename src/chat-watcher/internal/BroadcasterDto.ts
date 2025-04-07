class BroadcasterDto {
  readonly name: string;
  readonly liveUrl?: string;

  public constructor(name: string, liveUrl?: string) {
    this.name = name;
    this.liveUrl = liveUrl;
  }

  public isLive(): boolean {
    return this.liveUrl !== undefined && this.liveUrl !== null;
  }
}
