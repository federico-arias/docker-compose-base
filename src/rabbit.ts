import { Channel, Connection, ConsumeMessage } from "amqplib";
import * as events from "events";

export class Consumer {
	public event: events.EventEmitter;
	private channel: Promise<Channel>;
	private exchange: string;
	private routingKey: string;

	constructor(
		conn: Connection,
		exchange: string,
		routingKey: string
	) {
		this.channel = conn.createChannel();
		this.event = new events.EventEmitter();
		this.exchange = exchange;
		this.routingKey = routingKey;
	}

	public async getEvent(): Promise<events.EventEmitter> {
		const ch = await this.channel;
		await ch.assertExchange(this.exchange, "topic", {
			durable: false
		});
		const q = await ch.assertQueue("", { exclusive: true });
		await ch.bindQueue(q.queue, this.exchange, this.routingKey);
		ch.consume(q.queue, this.onMessage.bind(this));
		return this.event;
	}

	private onMessage(msg: ConsumeMessage | null) {
		if (!msg) {
			return;
		}
		this.event.emit("call", msg.content.toString("utf-8"));
	}
}

/*
pipe(
	checkUserPreferences,
	getUserPhone(sql),
	sendWhatsAppNotification
)(rabbitStream)
*/
