import amqp from "amqplib";
import axios from "axios";
import express from "express";
import { Consumer } from "./rabbit";
import { getConnection, UserModel } from "./user";
// import { isWhatsappEnabled } from "./office";

const dsn = process.env.RABBIT_DSN || "";
const mongoDsn = process.env.MONGO_DSN;
if (!mongoDsn) {
	throw new Error("fail");
}

const app = express();
const port = process.env.DOCKER_CONTAINER_PORT || 1313; // default port to listen

const headers = {
	"Content-Type": "application/json",
	token:
		"802b7c0b2f3b10036993a54afe87fe9f644541e38beeb018fc9c649f628bba32a7e4abc8d590b4f0"
};

export function send(message: string, phone?: string) {
	if (!phone) {
		return;
	}
	axios.post(
		"https://api.wassenger.com/v1/messages",
		{
			message,
			phone
		},
		{
			headers
		}
	);
}

// todo
// check office
export const generateMessage = (
	name: string,
	office: string,
	line: string,
	code: string
) =>
	`Hola, ${name}. Tienes un ticket en la oficina ${office}, en la fila ${line}. Tu código es ${code}`;

interface IUser {
	name: string;
	phone?: string;
}

const getUsers = (id: number): IUser => {
	switch (id) {
		case 1241:
			return { name: "Hervis", phone: "+56988097822" };
		case 940:
			return { name: "Ernesto", phone: "+56994406036" };
		case 17:
			return { name: "Xania", phone: "+56981800296" };
		case 45240:
			return { name: "Kemberly", phone: "+56948931076" };
		case 131105:
			return { name: "Federico", phone: "+56954510152" };
		default:
			return { name: "f" };
	}
};

app.listen(port, async () => {
	// tslint:disable-next-line:no-console
	console.log(`Server started at http://localhost:${port}`);
	const connection = await amqp.connect(dsn);
	await getConnection(mongoDsn);

	const consumer = new Consumer(connection, "webapi", "#");
	const ev = await consumer.getEvent();

	const user = new UserModel();
	ev.on("call", async msg => {
		const message = JSON.parse(msg);
		const {
			user_id,
			office_name,
			line_name,
			prefix,
			number: foo
		} = message.data;
		const prefs = await user.getPreferences(user_id);
		const wazapAllowed =
			prefs &&
			prefs.preferences &&
			prefs.preferences.web &&
			prefs.preferences.web.whatsapp;
		if (getUsers(user_id).phone && wazapAllowed) {
			const { name, phone } = getUsers(user_id);
			send(
				generateMessage(
					name,
					office_name,
					line_name,
					prefix + String(foo)
				),
				phone
			);
		}
	});
});
