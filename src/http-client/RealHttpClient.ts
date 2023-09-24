import { HttpClient } from 'src/http-client/HttpClient';

export class RealHttpClient implements HttpClient {
    fetchText(url: string) {
        return fetch(url).then(res => res.text());
    }
}
