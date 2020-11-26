import axios from "axios";
import { pathOr } from "./utils";
// check for office preferences

interface IOffice {
	options: IOptions;
}

interface IOptions {
	notifications: INotificationOptions;
}

interface INotificationOptions {
	whatsapp: boolean;
}

export const isWhatsappEnabled = async (
	officeId: number
): Promise<boolean> => {
	return axios
		.get(`https://zeroq.cl/api/v1/offices/${officeId}`)
		.then(
			(res: IOffice) =>
				res &&
				res.data &&
				res.data.data &&
				res.data.options &&
				res.data.options.notifications &&
				res.data.options.notifications.whatsapp &&
		);
};
