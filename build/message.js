"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highoutput_utilities_1 = require("highoutput-utilities");
const ramda_1 = __importDefault(require("ramda"));
const util_1 = require("./util");
let workers;
let messages;
let accountMessages;
async function start(rabbit, { initialMessages, initialAccountMessages }) {
    messages = ramda_1.default.clone(initialMessages);
    accountMessages = ramda_1.default.clone(initialAccountMessages);
    workers = await Promise.all([
        rabbit.createWorker("Message", async ({ type, data }) => {
            if (type === "CreateMessage") {
                const id = util_1.generateId("msg");
                messages.push(Object.assign({}, data, { dateTimeCreated: new Date(), id }));
                return id;
            }
            if (type === "MarkAsRead") {
                accountMessages.map(accountMessage => {
                    const { admin, account, id } = data;
                    if (accountMessage.account !== account &&
                        accountMessage.admin !== admin &&
                        accountMessage.id !== id) {
                        return accountMessage;
                    }
                    return Object.assign({}, accountMessage, { isRead: true });
                });
                return true;
            }
            if (type === "Message") {
                return ramda_1.default.find(ramda_1.default.propEq("id", data.id))(messages);
            }
            if (type === "Messages") {
                const filteredMessages = messages.filter(message => message.admin === data.filter.admin);
                const edges = filteredMessages.map(message => {
                    const cursor = `${message.dateTimeCreated
                        .getTime()
                        .toString(36)
                        .padStart(8, "0")}${highoutput_utilities_1.hash(message.id)
                        .toString("hex")
                        .substr(0, 16)}}`;
                    return {
                        node: message,
                        cursor: Buffer.from(cursor, "utf8").toString("base64")
                    };
                });
                const endCursor = edges.length > 0
                    ? ramda_1.default.prop("cursor")(ramda_1.default.last(edges))
                    : null;
                let hasNextPage = false;
                return {
                    totalCount: filteredMessages.length,
                    edges,
                    pageInfo: {
                        endCursor,
                        hasNextPage
                    }
                };
            }
            if (type === "AccountMessages") {
                const filteredAccountMessages = accountMessages.filter(({ account, admin }) => {
                    const { filter } = data;
                    return account === filter.account && admin === filter.admin;
                });
                const edges = filteredAccountMessages.map(accountMessage => {
                    const cursor = `${accountMessage.dateTimeCreated
                        .getTime()
                        .toString(36)
                        .padStart(8, "0")}${highoutput_utilities_1.hash(accountMessage.id)
                        .toString("hex")
                        .substr(0, 16)}}`;
                    return {
                        node: accountMessage,
                        cursor: Buffer.from(cursor, "utf8").toString("base64")
                    };
                });
                const endCursor = edges.length > 0
                    ? ramda_1.default.prop("cursor")(ramda_1.default.last(edges))
                    : null;
                let hasNextPage = false;
                return {
                    totalCount: filteredAccountMessages.length,
                    edges,
                    pageInfo: {
                        endCursor,
                        hasNextPage
                    }
                };
            }
        })
    ]);
}
exports.start = start;
async function stop() {
    await Promise.all(workers.map(worker => worker.stop()));
}
exports.stop = stop;
//# sourceMappingURL=message.js.map