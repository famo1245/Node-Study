const auth = {
  isOwner: function (req, res) {
    return !!req.user;
  },

  statusUI: function (req, res) {
    let authStatusUI = `<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>`;
    if (this.isOwner(req, res)) {
      authStatusUI = `${req.user.nickname} |  <a href="/auth/logout">logout</a>`;
    }

    return authStatusUI;
  },
};

export default auth;
