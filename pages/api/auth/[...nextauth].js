import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		// Providers.GitHub({
		// 	clientId: process.env.GITHUB_ID,
		// 	clientSecret: process.env.GITHUB_SECRET
		// }),
		Providers.Twitter({
			clientId: process.env.TWITTER_KEY,
			clientSecret: process.env.TWITTER_SECRET,
		}),
		// ...add more providers here
	],

	// A database is optional, but required to persist accounts in a database
	// database: process.env.DATABASE_URL,

	jwt: {
		secret: process.env.SECRET,
	},

	callbacks: {
		/**
		 * @param  {string} url      URL provided as callback URL by the client
		 * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
		 * @return {string}          URL the client will be redirect to
		 */
		async redirect(url, baseUrl) {
			// console.log("redirect", { url, baseUrl });
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
		/**
		 * @param  {object}  token     Decrypted JSON Web Token
		 * @param  {object}  user      User object      (only available on sign in)
		 * @param  {object}  account   Provider account (only available on sign in)
		 * @param  {object}  profile   Provider profile (only available on sign in)
		 * @param  {boolean} isNewUser True if new user (only available on sign in)
		 * @return {object}            JSON Web Token that will be saved
		 */
		async jwt(token, user, account, profile, isNewUser) {
			// console.log({ token, user, account, profile, isNewUser });
			// Add access_token to the token right after signin
			if (account?.accessToken) {
				token.accessToken = account.accessToken;
			}
			if (account?.id) {
				token.id = account.id;
			}
			if (account?.oauth_token) {
				token.oauth_token = account.oauth_token;
			}
			if (account?.oauth_token_secret) {
				token.oauth_token_secret = account.oauth_token_secret;
			}
			return token;
		},
	},
});
