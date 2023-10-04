import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';
import fetch from 'cross-fetch';

export class SinchSmsSender implements SmsSender {
    constructor(
        private readonly apiUrl: string,
        private readonly jwt: string,
    ) {
    }

    async send({ body, from, to }: Sms) {
        const requestData = { body, from, to: [to] };

        console.debug('Sending SMS via sinch.', requestData);

        const response = await fetch(
            this.apiUrl,
            {
                body: JSON.stringify(requestData),
                headers: {
                    'Authorization': `Bearer ${this.jwt}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            },
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        console.debug('SMS sent via Sinch.', await response.json());
    }
}
