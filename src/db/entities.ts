export interface BasicPropertyData {
  photoURL: string;
  address: string;
  vendorName: string;
  terrain: TerrainData;
  price: PriceData;
  contract: number;
  bedroomsCount: number;
  bathroomsCount: number;
  garageSize: number;
  floorsCount: number;
}

/**
 * This entity should be used when displaying a list of properties.
 * @typedef {object} BasicPropertyData
 * @property {string} photoURL - Main property photo to display on the card
 * @property {string} address - Address of the property. Used as the card's title
 * @property {string} vendorName - User that is selling the property
 * @property {TerrainData} terrain - Contains both the width and height of the property
 * @property {PriceData} price - The property's price with the currency's data
 * @property {integer} contract - The type of contract which the property is being published on
 * @property {integer} bedroomsCount - The number of bedrooms available in the property
 * @property {number} bathroomsCount - The number of bedrooms available in the property. A .5 means a restroom (no shower or bath)
 * @property {integer} garageSize - The number of cars that fit in the property's garage
 * @property {integer} floorsCount - The number of floors that the property has
 */
function basicPropertyDocs() {}

export interface PropertyData {
  photos: PhotoData[];
  address: string;
  vendor: VendorData;
  terrain: TerrainData;
  price: PriceData;
  contract: number;
  bedroomsCount: number;
  bathroomsCount: number;
  garageSize: number;
  floorsCount: number;
  location: MapData;
}

/**
 * This entity contains all data of a property. Use this on the details page
 * @typedef {object} PropertyData
 * @property {array<PhotoData>} photos - Array containing all property photos
 * @property {string} address - Address of the property. Used as the page's title
 * @property {VendorData} vendor - Here you can find the seller's data
 * @property {TerrainData} terrain - Contains both the width and height of the property
 * @property {PriceData} price - The property's price with the currency's data
 * @property {integer} contract - The type of contract which the property is being published on
 * @property {integer} bedroomsCount - The number of bedrooms available in the property
 * @property {number} bathroomsCount - The number of bedrooms available in the property. A .5 means a restroom (no shower or bath)
 * @property {integer} garageSize - The number of cars that fit in the property's garage
 * @property {integer} floorsCount - The number of floors that the property has
 * @property {MapData} location - Contains the data to create a map showing the property's location
 */
function propertyDocs() {}

interface VendorData {
  name: string;
  score: number;
}

/**
 * Contains the name and the average score of the property seller
 * @typedef {object} VendorData
 * @property {string} name - The name of the seller
 * @property {integer} score - The average score of the seller
 */
function vendorDocs() {}

interface MapData {
  latitude: number;
  longitude: number;
}

/**
 * Contains the latitude and longitude of the property's location. Use it to create a map view
 * @typedef {object} MapData
 * @property {number} latitude - The latitude of the property
 * @property {number} longitude - The longitude of the property
 */
function mapDocs() {}

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

interface PriceData {
  number: number;
  symbol: string;
  code: string;
}

/**
 * Contains data to display the correct information of the property's price
 * @typedef {object} PriceData
 * @property {number} number - The actual price of the property
 * @property {string} symbol - Official symbol of the currency used by the seller. Place before the price number
 * @property {string} code - Official 3-letter code to identify the currency. Place after the price number
 */
function priceDocs() {}

interface TerrainData {
  width: number;
  height: number;
}

/**
 * Contains the width and height of the property's terrain in meters
 * @typedef {object} TerrainData
 * @property {number} width - Contains the width of the property's terrain in meters
 * @property {number} height - Contains the height and height of the property's terrain in meters
 */
function terrainDocs() {}
