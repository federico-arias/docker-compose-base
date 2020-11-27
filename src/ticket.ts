export interface ITicketBase {
	user_id: number;
	office_name: string;
	office: string;
	inserted_at: string;
	line_name: string;
	prefix: string;
	number: number;
}

export interface IPreferences extends ITicketBase {
	whatsapp: boolean;
}
