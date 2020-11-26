import mongoose, { Document, Model, Mongoose } from "mongoose";

export const getConnection = async (
	dsn: string
): Promise<Mongoose> => {
	return mongoose.connect(dsn, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
};

const UserPreferences = {
	preferences: { type: Object },
	user_id: { type: Number, index: true }
};

export interface IUserPreferences extends Document {
	preferences?: IPreferences;
}

interface IPreferences {
	web?: IWebPreferences;
}

interface IWebPreferences {
	whatsapp?: boolean;
}

export class UserModel {
	private model: Model<IUserPreferences>;

	constructor() {
		this.model = mongoose.model(
			"UserPreferences",
			new mongoose.Schema(UserPreferences, {
				collection: "user.preferences"
			})
		);
	}
	public async getPreferences(
		userId: number
	): Promise<IUserPreferences | null> {
		return this.model.findOne({ user_id: userId });
	}
}

/*
const getPreferences = async (userId: int, UserPreferences) =>{
	try {
		const u = await UserPreferences.findOne({
			user_id: user.id
		});
		if (!u) {
			return res
				.status(404)
				.json({ error: "no tiene preferencias" });
		}
		return res.json({ data: u.preferences });
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ error });
	}
};
*/
