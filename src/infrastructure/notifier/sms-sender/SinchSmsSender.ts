import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class SinchSmsSender implements SmsSender {
    constructor(
        private readonly apiUrl: string,
        private readonly jwt: string,
    ) {
    }

    async send(sms: Sms) {
        const response = await fetch(
            this.apiUrl,
            {
                headers: {
                    'Authorization': `Bearer ${this.jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sms),
            },
        );

        if (!response.ok) {
            throw new Error()
        }
    }
}
