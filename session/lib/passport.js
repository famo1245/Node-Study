import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { compare } from "bcrypt";
import { config } from "dotenv";
import db from "./db.js";
import shortid from "shortid";

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
      async (accessToken, refreshToken, profile, done) => {
        // console.log("Google Strategy", accessToken, refreshToken, profile);
        const email = profile.emails[0].value;
        await db.read();
        let user = db.data.users.find((element) => {
          if (element.email === email) {
            return element;
          }
        });

        if (user !== undefined) {
          user.googleId = profile.id;
        } else {
          user = {
            id: shortid.generate(),
            email: email,
            displayName: profile.displayName,
            googleId: profile.id,
          };
          db.data.users.push(user);
        }
        await db.write();
        done(null, user);
        // const user =
        // User.findOrCreate(
        //   {
        //     googleId: profile.id,
        //   },
        //   (err, user) => {
        //     return done(err, user);
        //   },
        // );
      },
    ),
  );

  p.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "emails", "name"],
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Facebook Strategy", accessToken, refreshToken, profile);
      },
    ),
  );

  app.get(
    "/auth/google",
    p.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    p.authenticate("google", {
      failureRedirect: "/auth/login",
    }),
    (req, res) => {
      res.redirect("/");
    },
  );

  app.get("/auth/facebook", p.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    p.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login",
    }),
  );

  return p;
};

export default passportInit;
