const auth = {
  isOwner: function (req, res) {
    return !!req.session.is_logined;
  },

  statusUI: function (req, res) {
    let authStatusUI = `<a href="/auth/login">login</a>`;
    if (this.isOwner(req, res)) {
      authStatusUI = `${req.session.nickname} |  <a href="/auth/logout">logout</a>`;
    }

    return authStatusUI;
  },
};

export default auth;
