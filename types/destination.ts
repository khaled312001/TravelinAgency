export interface LocalizedString {
  en: string
  ar: string
}

export interface DestinationEvent {
  id: string
  title: LocalizedString
  description: LocalizedString
  date: string
  location: string
  image?: string
}

export interface TouristSpot {
  id: string
  name: LocalizedString
  description: LocalizedString
  image: string
  type: string
}

export interface Destination {
  id: string
  name: LocalizedString
  description: LocalizedString
  region: LocalizedString
  locationType: {
    id: string
    name: LocalizedString
  }
  destinationType: {
    id: string
    name: LocalizedString
  }
  mainImage: string
  gallery: string[]
  touristSpots: TouristSpot[]
  upcomingEvents: DestinationEvent[]
  coordinates: {
    latitude: number
    longitude: number
  }
}
