abstract class Property {
  address!: string;
  username!: string;
  terrainHeight!: number;
  terrainWidth!: number;
  price!: number;
  contractType!: number;
  bedroomAmount!: number;
  bathroomAmount!: number;
  garageSize!: number;
  floorAmount!: number;
  latitude!: number;
  longitude!: number;
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
export class PropertyData extends Property {
  userRating!: string;
  currencySymbol!: string;
  currencyCode!: string;
}

/**
 * This entity contains all the data of a property to be posted or updated
 * @typedef {object} PropertyRequest
 * @property {string} address - Address of the property. Used as the page's title.
 * @property {string} description - Description of property, not characteristics.
 * @property {number} price - Price of property.
 * @property {number} latitude - Latitude for maps integration.
 * @property {number} longitude - Longitude for maps integration.
 * @property {number} terrainHeight - Height of the property's terrain in meters.
 * @property {number} terrainWidth - Width of the property's terrain in metters.
 * @property {number} bedroomAmount - The number of bedrooms available in the property.
 * @property {number} bathroomAmount - The number of bathrooms available in the property.
 * @property {number} floorAmount - The number of floors that the property has
 * @property {number} garageSize - The number of cars that fit in the property's garage.
 * @property {number} vendorUserId - Id number relationated to the vendor details
 * @property {number} contractType - Id of the type of property's contract
 * @property {number} currencyId - Id of the type of price currency
 */
export class PropertyRequest extends Property {
  currencyId!: string;
}

/**
 * This entity should be used when displaying a list of properties.
 * @typedef {object} BasicPropertyData
 * @property {integer} propertyId - The id of the property stored in the database. Use this to request the property's details
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
export class BasicPropertyData extends Property {
  propertyId!: number;
  photoURL!: string;
  username!: string;
  currencySymbol!: string;
  currencyCode!: string;
}

/**
 * Contains the URL and the description of a photo.
 * @typedef {object} PhotoData
 * @property {string} url - The URL that points to a property's image
 * @property {string} description - A brief description of the photo. This is optional
 */
export class PhotoData {
  url!: string;
  description?: string;
}
