import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "./db.js";

const passportInit = (app) => {
  const p = passport;

  app.use(p.initialize());
  app.use(p.session());

  p.serializeUser((user, done) => {
    console.log("serialize", user);
    done(null, user.id);
  });

  p.deserializeUser(async (id, done) => {
    await db.read();
    const user = db.data.users.find((element) => {
      if (element.id === id) {
        return element;
      }
    });
    console.log("deserialize", id, user);
    done(null, user);
  });

  p.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        await db.read();
        const user = db.data.users.find((element) => {
          if (element.email === email && element.password === password) {
            return element;
          }
        });
        console.log("LocalStrategy", email, password);
        if (user) {
          return done(null, user, { message: "Welcome." });
        } else {
          return done(null, false, { message: "Incorrect user information." });
        }
      },
    ),
  );

  return p;
};

export default passportInit;
