import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
const passportInit = (app) => {
  const authData = {
    email: "famo1245",
    password: "1234",
    nickname: "young",
  };

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    console.log("serialize", user);
    done(null, user.email);
  });

  passport.deserializeUser((id, done) => {
    console.log("deserialize", id);
    done(null, authData);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (username, password, done) => {
        console.log("LocalStrategy", username, password);
        if (username === authData.email) {
          console.log(1);
          if (password === authData.password) {
            console.log(2);
            return done(null, authData, { message: "Welcome." });
          } else {
            console.log(3);
            return done(null, false, { message: "Incorrect password." });
          }
        } else {
          console.log(4);
          return done(null, false, { message: "Incorrect username." });
        }
      },
    ),
  );

  return passport;
};

export default passportInit;
