/**
 *
 */
interface Crawler<K> {
  /**
   *
   */
  afterBrowserLoad<V>(crawlingAction: (page: K) => V): Promise<V>;
}
