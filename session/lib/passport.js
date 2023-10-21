import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { compare } from "bcrypt";
import { config } from "dotenv";
import db from "./db.js";

config();

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
          if (element.email === email) {
            return element;
          }
        });
        console.log("LocalStrategy", email, password);
        if (user) {
          compare(password, user.password, (err, result) => {
            if (result) {
              return done(null, user, { message: "Welcome." });
            } else {
              return done(null, false, { message: "Password is not correct." });
            }
          });
        } else {
          return done(null, false, { message: "There is no email." });
        }
      },
    ),
  );

  p.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URI,
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOrCreate(
          {
            googleId: profile.id,
          },
          (err, user) => {
            return done(err, user);
          },
        );
      },
    ),
  );

  return p;
};

export default passportInit;
