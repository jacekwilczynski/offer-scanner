import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';
import { Twilio } from 'twilio';

export class TwilioSmsSender implements SmsSender {
    constructor(
        private readonly client: Twilio,
    ) {
    }

    async send(sms: Sms) {
        console.debug('Sending SMS via Twilio.', sms);
        const message = await this.client.messages.create(sms);
        console.debug('SMS sent via Twilio.', message);
    }
}
