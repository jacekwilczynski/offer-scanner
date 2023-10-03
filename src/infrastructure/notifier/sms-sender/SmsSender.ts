export interface SmsSender {
    send(sms: Sms): Promise<void>;
}

export type PhoneNumber = string;

export type Sms = {
    from: PhoneNumber;
    to: PhoneNumber;
    body: string;
}
