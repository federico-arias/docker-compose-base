import axios, { AxiosResponse } from "axios";
// check for office preferences

interface IOffice {
	options: IOptions;
	timezone: string;
}

interface IOptions {
	notifications: INotificationOptions;
}

interface INotificationOptions {
	whatsapp: boolean;
}

export const getOffice = async (
	officeSlug: string
): Promise<IOffice> => {
	return axios
		.get<IOffice>(`https://zeroq.cl/api/v1/state/${officeSlug}`)
		.then((res: AxiosResponse<IOffice>) => res.data);
};

export const isWhatsAppEnabled = (office: IOffice): boolean => {
	return (
		office &&
		office.options &&
		office.options.notifications &&
		office.options.notifications.whatsapp
	);
};
