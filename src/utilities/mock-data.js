export const users = [
  {
    id: 1,
    firstName: "Generic",
    lastName: "User",
    email: "generic.user@lau.edu",
    rating: 4.6,
    completedRides: 2, // Should be fetched from SQL (join or union)
    numberOfReviews: 4
  },
  {
    id: 2,
    firstName: "Khaled",
    lastName: "Jalloul",
    email: "khaled.jalloul@lau.edu",
    rating: 3.7,
    completedRides: 0,
    numberOfReviews: 0
  },
  {
    id: 3,
    firstName: "Hadi",
    lastName: "Youness",
    email: "hadi.youness@lau.edu",
    rating: 4.2,
    completedRides: 1,
    numberOfReviews: 2
  },
  {
    id: 4,
    firstName: "Sara",
    lastName: "Al Arab",
    email: "sara.alarab@lau.edu",
    rating: 4,
    completedRides: 2,
    numberOfReviews: 3
  },
];

export const rides = [
  {
    id: 1,
    dateOfDeparture: new Date(),
    departureCoordinates: { latitude: 34.1155614, longitude: 35.6744347 },
    departureLocation: "LAU Byblos",
    destinationCoordinates: { latitude: 33.7821927, longitude: 35.5312037 },
    destinationLocation: "Bchamoun",
    numberOfRiders: 3,
    pricePerRider: 1,
    driverID: 3,
  },
  {
    id: 2,
    dateOfDeparture: new Date(),
    departureCoordinates: { latitude: 33.7821927, longitude: 35.5312037 },
    departureLocation: "Bchamoun",
    destinationCoordinates: { latitude: 34.1155614, longitude: 35.6744347 },
    destinationLocation: "LAU Byblos",
    numberOfRiders: 4,
    pricePerRider: 2,
    driverID: 4,
  },
  {
    id: 3,
    dateOfDeparture: new Date(),
    departureCoordinates: { latitude: 34.1155614, longitude: 35.6744347 },
    departureLocation: "AUB Main Gate",
    destinationCoordinates: { latitude: 33.7821927, longitude: 35.5312037 },
    destinationLocation: "Mazraa, Beirut",
    numberOfRiders: 3,
    pricePerRider: 1.5,
    driverID: 1,
  },
  {
    id: 4,
    dateOfDeparture: new Date(),
    departureCoordinates: { latitude: 34.1155614, longitude: 35.6744347 },
    departureLocation: "South Lebanon",
    destinationCoordinates: { latitude: 33.7821927, longitude: 35.5312037 },
    destinationLocation: "LAU Beirut",
    numberOfRiders: 3,
    pricePerRider: 2,
    driverID: 1,
  },
  {
    id: 5,
    dateOfDeparture: new Date(),
    departureCoordinates: { latitude: 34.1155614, longitude: 35.6744347 },
    departureLocation: "LAU Byblos",
    destinationCoordinates: { latitude: 33.7821927, longitude: 35.5312037 },
    destinationLocation: "Bchamoun",
    numberOfRiders: 3,
    pricePerRider: 1,
    driverID: 4,
  }
];

export const stopRequests = [
  {
    id: 1,
    requestStatus: "Pending",
    location: { latitude: 33.7821927, longitude: 35.5312037 },
    note: "Pls pick me up",
    studentID: 1,
    rideID: 1,
    dateOfRequest: new Date(),
  },
  {
    id: 2,
    requestStatus: "Approved",
    location: { latitude: 33.7821927, longitude: 35.5312037 },
    note: "Pls pick me up",
    studentID: 1,
    rideID: 2,
    dateOfRequest: new Date(),
  },
  {
    id: 3,
    requestStatus: "Approved",
    location: { latitude: 33.7821927, longitude: 35.5312037 },
    note: "Pls pick me up",
    studentID: 2,
    rideID: 2,
    dateOfRequest: new Date(),
  },
  {
    id: 4,
    requestStatus: "Approved",
    location: { latitude: 33.7821927, longitude: 35.5312037 },
    note: "Pls pick me up",
    studentID: 3,
    rideID: 2,
    dateOfRequest: new Date(),
  },
  {
    id: 5,
    requestStatus: "Approved",
    location: { latitude: 33.7821927, longitude: 35.5312037 },
    note: "Pls pick me up",
    studentID: 4,
    rideID: 3,
    dateOfRequest: new Date(),
  },
];
