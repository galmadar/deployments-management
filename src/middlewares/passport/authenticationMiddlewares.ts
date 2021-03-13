import passport from "passport";

export const jwtAuthenticationMiddleware = passport.authenticate("jwt", {session: false});
