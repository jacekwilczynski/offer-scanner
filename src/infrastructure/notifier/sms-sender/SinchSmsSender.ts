import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class SinchSmsSender implements SmsSender {
    constructor(
        private readonly apiUrl: string,
        private readonly jwt: string,
    ) {
    }

    async send({ body, from, to }: Sms) {
        const response = await fetch(
            this.apiUrl,
            {
                body: JSON.stringify({ body, from, to: [to] }),
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
    }
}
