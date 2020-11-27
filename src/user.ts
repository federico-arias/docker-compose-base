import { Client } from "pg";

interface IUser {
	name?: string;
	phone?: string;
}

export const getUsers = (client: Client) => (
	id: number
): Promise<IUser> => {
	const query = `
			SELECT
				name, phone
			FROM
				users
			WHERE
				id = $1`;
	const queryResult = client.query<IUser>(query, [id]);
	return queryResult.then(qr => qr.rows[0]);
};
