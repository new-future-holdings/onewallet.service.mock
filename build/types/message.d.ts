import { Language, Pagination } from '../types';
export declare type Type = 'Message' | 'Messages' | 'AccountMessages' | 'CreateMessage' | 'MarkAsRead';
export declare type MessageQueryInput = {
    readonly admin: string;
    readonly id: string;
};
export declare type MessagesQueryInput = Pagination<{
    readonly admin: string;
}>;
export declare type AccountMessagesQueryInput = Pagination<{
    readonly account: string;
    readonly admin: string;
}>;
export declare type CreateMessageCommandInput = {
    readonly admin: string;
    readonly creator?: string;
    readonly body: {
        [language in Language]?: {
            title: string;
            content: string;
        };
    };
    readonly targetAccounts: string[];
    readonly targetMemberLevels?: string[];
};
export declare type MarkAsReadCommandInput = {
    readonly admin: string;
    readonly account: string;
    readonly id: string;
};
export declare type DataInput = MessageQueryInput | MessagesQueryInput | AccountMessagesQueryInput | CreateMessageCommandInput | MarkAsReadCommandInput;
export declare type TypeAndDataInput = {
    type: Type;
    data: DataInput;
};
export declare type Message = {
    id: string;
    admin: string;
    creator?: string;
    body: any;
    targetAccounts: string[];
    targetMemberLevels?: string[];
    dateTimeCreated: Date;
};
export declare type AccountMessage = {
    id: string;
    admin: string;
    account: string;
    message: string;
    dateTimeCreated: Date;
    isRead: boolean;
    cursor?: string;
};
//# sourceMappingURL=message.d.ts.map