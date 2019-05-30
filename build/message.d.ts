import { AccountMessage, Message } from "./types/message";
import { Rabbit } from "./types";
export declare function start(rabbit: Rabbit, { initialMessages, initialAccountMessages }: {
    initialMessages: Message[];
    initialAccountMessages: AccountMessage[];
}): Promise<void>;
export declare function stop(): Promise<void>;
//# sourceMappingURL=message.d.ts.map