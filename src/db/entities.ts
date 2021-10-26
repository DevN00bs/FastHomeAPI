export interface BasicPropertyData {
  photoURL: string;
  address: string;
  username: string;
  terrainHeight: number;
  terrainWidth: number;
  price: number;
  currencySymbol: string;
  currencyCode: string;
  contractType: number;
  bedroomAmount: number;
  bathroomAmount: number;
  garageSize: number;
  floorAmount: number;
}

/**
 * This entity should be used when displaying a list of properties.
 * @typedef {object} BasicPropertyData
 * @property {string} photoURL - Main property photo to display on the card
 * @property {string} address - Address of the property. Used as the card's title
 * @property {string} username - User that is selling the property
 * @property {number} terrainHeight - Height of the property's terrain in meters
 * @property {number} terrainWidth - Width of the property's terrain in meters
 * @property {number} price - The property's price
 * @property {string} currencySymbol - Official symbol of the property's currency
 * @property {string} currencyCode - Official code of the property's currency
 * @property {integer} contractType - The type of contract which the property is being published on
 * @property {integer} bedroomAmount - The number of bedrooms available in the property
 * @property {number} bathroomAmount - The number of bedrooms available in the property. A .5 means a restroom (no shower or bath)
 * @property {integer} garageSize - The number of cars that fit in the property's garage
 * @property {integer} floorAmount - The number of floors that the property has
 */
function basicPropertyDocs() {}

export interface PropertyData {
  address: string;
  username: string;
  userRating: number;
  terrainHeight: number;
  terrainWidth: number;
  price: number;
  currencySymbol: string;
  currencyCode: string;
  contractType: number;
  bedroomAmount: number;
  bathroomAmount: number;
  garageSize: number;
  floorAmount: number;
  latitude: number;
  longitude: number;
}

/**
 * This entity contains all data of a property. Use this on the details page
 * @typedef {object} PropertyData
 * @property {string} address - Address of the property. Used as the page's title
 * @property {string} username - User that is selling the property
 * @property {number} userRating - Average score of a user based on buyers' reviews
 * @property {number} terrainHeight - Height of the property's terrain in meters
 * @property {number} terrainWidth - Width of the property's terrain in meters
 * @property {number} price - The property's price
 * @property {string} currencySymbol - Official symbol of the property's currency
 * @property {string} currencyCode - Official code of the property's currency
 * @property {integer} contractType - The type of contract which the property is being published on
 * @property {integer} bedroomAmount - The number of bedrooms available in the property
 * @property {number} bathroomAmount - The number of bedrooms available in the property. A .5 means a restroom (no shower or bath)
 * @property {integer} garageSize - The number of cars that fit in the property's garage
 * @property {integer} floorAmount - The number of floors that the property has
 * @property {number} latitude - Latitude of the property's coordinates. Use it for create a map
 * @property {number} longitude - Latitude of the property's coordinates. Use it for create a map
 */
function propertyDocs() {}

interface PhotoData {
  url: string;
  description?: string;
}

/**
 * Contains the URL and the description of a photo.
 * @typedef {object} PhotoData
 * @property {string} url - The URL that points to a property's image
 * @property {string} description - A brief description of the photo. This is optional
 */
function photoDocs() {}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

/**
 * Used to register new users only
 * @typedef {object} RegistrationData
 * @property {string} username - User's username
 * @property {string} email - User's email. Both client and server check if it's valid
 * @property {string} password - User's password. Will be encrypted server-side
 */
function registrationDocs() {}

export interface LoginData {
  username: string;
  password: string;
}

export interface ControllerResponse<T> {
  isSuccessful: boolean;
  result?: T;
}
