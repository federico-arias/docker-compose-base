db.auth('mongouser', 'mongopassword')

db.createUser({
  user: 'test-user',
  pwd: 'test-password',
  roles: [
    {
      role: 'root',
      db: 'test',
    },
  ],
});

