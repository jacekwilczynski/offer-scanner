export interface HttpClient {
    fetchText(url: string): Promise<string>;
}
