module.exports = {
  port: 3000,
  appRoot: __dirname,
  db: {
    connectionLimit: 20,  // 크게 고려 안해도 됨
    host: 'localhost', //'165.132.105.36',
    user: 'root',
	  port: 3306,
    password: 'crush9244',
    database: 'no_team',
  },
};
