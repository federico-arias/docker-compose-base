import amqp from "amqplib";
import axios from "axios";
import express from "express";
import moment from "moment-timezone";
import pg from "pg";
import sharp, { OutputInfo } from "sharp";
import { getOffice, isWhatsAppEnabled } from "./office";
import { getConnection, UserModel } from "./preferences";
import { Consumer } from "./rabbit";
import { getUsers } from "./user";
//

const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="273" height="362.002" viewBox="0 0 273 362.002">
  <defs>
    <filter id="Sustracción_3" x="0" y="0" width="273" height="362.002" filterUnits="userSpaceOnUse">
      <feOffset input="SourceAlpha"/>
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feFlood flood-opacity="0.2"/>
      <feComposite operator="in" in2="blur"/>
      <feComposite in="SourceGraphic"/>
    </filter>
  </defs>
  <g id="Grupo_72" data-name="Grupo 72" transform="translate(-511.501 -702.5)">
    <g transform="matrix(1, 0, 0, 1, 511.5, 702.5)" filter="url(#Sustracción_3)">
      <path id="Sustracción_3-2" data-name="Sustracción 3" d="M-2648.638,11364H-2753a14.9,14.9,0,0,1-10.606-4.394A14.9,14.9,0,0,1-2768,11349v-207a14.9,14.9,0,0,1,4.393-10.606A14.9,14.9,0,0,1-2753,11127h104a21.869,21.869,0,0,0,1.729,8.564,21.923,21.923,0,0,0,4.715,6.992,21.924,21.924,0,0,0,6.993,4.716A21.883,21.883,0,0,0-2627,11149a21.88,21.88,0,0,0,8.563-1.729,21.93,21.93,0,0,0,6.993-4.716,21.917,21.917,0,0,0,4.715-6.992A21.866,21.866,0,0,0-2605,11127h148a14.907,14.907,0,0,1,10.609,4.394A14.9,14.9,0,0,1-2442,11142v207a14.9,14.9,0,0,1-4.394,10.606A14.907,14.907,0,0,1-2457,11364h-148.361a22.215,22.215,0,0,0,.363-4,21.861,21.861,0,0,0-1.729-8.563,21.936,21.936,0,0,0-4.715-6.993,21.922,21.922,0,0,0-6.993-4.715A21.857,21.857,0,0,0-2627,11338a21.862,21.862,0,0,0-8.564,1.729,21.931,21.931,0,0,0-6.993,4.715,21.941,21.941,0,0,0-4.715,6.993A21.863,21.863,0,0,0-2649,11360a22.217,22.217,0,0,0,.363,4Z" transform="translate(11382 2786) rotate(90)" fill="#fff"/>
    </g>
    <text id="A01" transform="translate(594 758.5)" fill="#145ab4" font-size="60" font-family="Roboto-Black, Roboto" font-weight="800"><tspan x="0" y="63">A01</tspan></text>
    <text id="Tu_número:" data-name="Tu número:" transform="translate(575 744.5)" fill="#828181" font-size="16" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="0" y="15">Número de ticket:</tspan></text>
    <line id="Línea_5" data-name="Línea 5" x1="153" transform="translate(572.5 861.5)" fill="none" stroke="#d8d8d8" stroke-width="1"/>
    <text id="Tu_número:-2" data-name="Tu número:" transform="translate(605 882.5)" fill="#828181" font-size="12" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="16.964" y="12">Sucursal:</tspan></text>
    <text id="Tu_número:-3" data-name="Tu número:" transform="translate(574 930.5)" fill="#828181" font-size="12" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="23.522" y="12">Fila de atención:</tspan></text>
    <text id="Tu_número:-4" data-name="Tu número:" transform="translate(556 900.5)" fill="#0065b3" font-size="16" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="8.572" y="15">Zero Q Demo Pública</tspan></text>
    <text id="Tu_número:-5" data-name="Tu número:" transform="translate(556 949.5)" fill="#0065b3" font-size="16" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="50.548" y="15">Fila Virtual</tspan></text>
    <text id="Personas_antes_de_ti:_" data-name="Personas antes de ti: " transform="translate(620 1012)" fill="#828181" font-size="12" font-family="Montserrat-Medium, Montserrat" font-weight="500"><tspan x="-62.664" y="0">Personas antes de ti: </tspan></text>
    <rect id="Rectángulo_42" data-name="Rectángulo 42" width="46" height="29" rx="14.5" transform="translate(690 993)" fill="#0065b3"/>
    <text id="_10" data-name="10" transform="translate(714 1013)" fill="#fff" font-size="18" font-family="Montserrat-Bold, Montserrat" font-weight="700"><tspan x="-9.963" y="0">10</tspan></text>
  </g>
</svg>
`;

const buf = Buffer.from(svgString, "utf8");
sharp(buf)
	.png()
	.toFile("new-file.png")
	.then(function(info: OutputInfo) {
		console.log(info);
	})
	.catch(function(err: Error) {
		console.log(err);
	});

const dsn = process.env.RABBIT_DSN || "";
const mongoDsn = process.env.MONGO_DSN;
const postgresDsn = process.env.POSTGRES_DSN;
if (!mongoDsn || !dsn || !postgresDsn) {
	throw new Error("fail");
}

const app = express();
const port = process.env.DOCKER_CONTAINER_PORT || 7004; // default port to listen

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
	office: string,
	line: string,
	code: string,
	insertedAt: string,
	name?: string
) =>
	`Hola, ${name}. 

Has tomado un turno en *${office}*, en la fila *${line}*:
Tu número de atención es el:  *${code}*

Ticket generado el ${insertedAt}.`;

app.listen(port, async () => {
	console.log(`Server started at http://localhost:${port}`);
	const connection = await amqp.connect(dsn);
	const pgClient = new pg.Client(postgresDsn);
	await pgClient.connect();
	await getConnection(mongoDsn);

	const consumer = new Consumer(connection, "webapi", "#");
	// const calls = new Consumer(connection, "webapi", "#");
	// const ticketCreated = new Consumer(connection, "webapi", "#");
	const ev = await consumer.getEvent();

	const user = new UserModel();
	ev.on("call", async msg => {
		const message = JSON.parse(msg);
		const {
			user_id,
			office_name,
			office,
			inserted_at,
			line_name,
			prefix,
			number: foo
		} = message.data;
		try {
			const prefs = await user.getPreferences(user_id);
			const u = await getUsers(pgClient)(user_id);
			const o = await getOffice(office);
			const wazapAllowed =
				prefs &&
				prefs.preferences &&
				prefs.preferences.web &&
				prefs.preferences.web.whatsapp;
			if (
				u &&
				u.phone &&
				wazapAllowed &&
				isWhatsAppEnabled(o)
			) {
				const { name, phone } = u;
				send(
					generateMessage(
						office_name,
						line_name,
						prefix + String(foo),
						moment
							.tz(inserted_at, o.timezone)
							.clone()
							.format("YYYY-MM-DD"),
						name
					),
					phone
				);
			}
		} catch (e) {
			console.log("foo");
			console.error(e);
		}
	});
});
