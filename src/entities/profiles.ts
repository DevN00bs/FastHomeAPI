/**
 * This entity contains contact details and social media of a user
 * @typedef {object} UserDetails
 * @property {integer} userId - Ignore this field, please
 * @property {string} phone - The phone number of the user
 * @property {string} email - The email address of the user, can be different to the one used to register
 * @property {string} fbLink - A link to the user's Facebook profile
 * @property {string} instaLink - A link to the user's Instagram profile
 * @property {string} twitLink - A link to the user's Twitter account
 */
export class UserDetails {
  userId!: number;
  phone!: string;
  email!: string;
  fbLink!: string;
  instaLink!: string;
  twitLink!: string;
}
