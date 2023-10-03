import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class StdoutFakeSmsSender implements SmsSender {
    async send(sms: Sms): Promise<void> {
        console.log(`SMS would be sent:\n\n${sms.body}\n`);
    }
}
