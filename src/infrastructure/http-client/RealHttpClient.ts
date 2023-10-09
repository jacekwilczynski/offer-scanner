import { HttpClient } from 'src/application/interfaces/HttpClient';

export class RealHttpClient implements HttpClient {
    fetchText(url: string) {
        return fetch(url).then(res => res.text());
    }
}
