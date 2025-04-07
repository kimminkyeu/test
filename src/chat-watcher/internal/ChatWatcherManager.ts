type LiveUrl = string;
type Watcher = any;

class ChatWatcherManager {
  private chatWatchers: Map<LiveUrl, Watcher> = new Map();

  constructor() {}

  startWatching(broadcaster_name: any) {
    throw new Error('Method not implemented.');
  }

  stopWatching(name: string) {
    throw new Error('Method not implemented.');
  }

  isWatching(broadcaster_name: any): boolean {
    throw new Error('Method not implemented.');
  }
}

export { ChatWatcherManager };
