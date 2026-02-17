// Controller admin (login, dashboard)

exports.login = async (req, res) => {
  // TODO: validate credentials and create session/token
  res.json({ message: 'Admin login - implement' });
};

exports.dashboard = async (req, res) => {
  // Protected dashboard
  res.json({ message: 'Admin dashboard - implement' });
};
