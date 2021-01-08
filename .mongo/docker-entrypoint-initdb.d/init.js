db = db.getSiblingDB("admin");

db.auth("mongouser", "mongopassword");

// this is strange but necessary
// https://docs.mongodb.com/manual/reference/method/db.getSiblingDB/#example
db = db.getSiblingDB("test");

/*
db.createUser({
	user: "test-user",
	pwd: "test-password",
	roles: [
		{
			role: "root",
			db: "test"
		}
	]
});
*/

db.createCollection("user.preferences");

db.user.preferences.insert({
	user_id: 1,
	preferences: { web: { notifications: { whatsapp: true } } }
});
