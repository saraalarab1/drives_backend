export const users = [
  {
    id: 1,
    firstName: "Khaled",
    lastName: "Jalloul",
    email: "khaled.jalloul@lau.edu",
  },
  {
    id: 2,
    firstName: "Hadi",
    lastName: "Youness",
    email: "hadi.youness@lau.edu",
  },
  {
    id: 3,
    firstName: "Sara",
    lastName: "Al Arab",
    email: "sara.alarab@lau.edu",
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
    pricePerRider: 30000,
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
    pricePerRider: 20000,
    driverID: 2,
  },
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
    note: "Pls pick me up x2",
    studentID: 3,
    rideID: 2,
    dateOfRequest: new Date(),
  },
];
