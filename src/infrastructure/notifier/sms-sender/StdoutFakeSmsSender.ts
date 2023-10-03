import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class StdoutFakeSmsSender implements SmsSender {
    async send(sms: Sms): Promise<void> {
        console.log(sms);
    }
}
