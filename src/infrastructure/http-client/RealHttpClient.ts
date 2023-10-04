import { HttpClient } from 'src/application/interfaces/HttpClient';
import fetch from 'cross-fetch';

export class RealHttpClient implements HttpClient {
    fetchText(url: string) {
        return fetch(url).then(res => res.text());
    }
}
