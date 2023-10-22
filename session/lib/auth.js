const auth = {
  isOwner: function (req, res) {
    return !!req.user;
  },

  statusUI: function (req, res) {
    let authStatusUI = `<a href="/auth/login">login</a> | <a href="/auth/register">Register</a> | <a href="/auth/google">Login with Google</a>`;
    if (this.isOwner(req, res)) {
      authStatusUI = `${req.user.displayName} |  <a href="/auth/logout">logout</a>`;
    }

    return authStatusUI;
  },
};

export default auth;
