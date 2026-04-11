// Location data for countries, states, cities, and phone codes
export const locationData = {
  countries: {
    US: {
      name: "United States",
      code: "+1",
      states: {
        CA: {
          name: "California",
          cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"]
        },
        NY: {
          name: "New York",
          cities: ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"]
        },
        TX: {
          name: "Texas",
          cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"]
        },
        FL: {
          name: "Florida",
          cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"]
        }
      }
    },
    AU: {
      name: "Australia",
      code: "+61",
      states: {
        NSW: {
          name: "New South Wales",
          cities: ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Albury"]
        },
        VIC: {
          name: "Victoria",
          cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"]
        },
        QLD: {
          name: "Queensland",
          cities: ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Toowoomba"]
        },
        WA: {
          name: "Western Australia",
          cities: ["Perth", "Fremantle", "Bunbury", "Geraldton", "Kalgoorlie"]
        }
      }
    },
    GB: {
      name: "United Kingdom",
      code: "+44",
      states: {
        ENG: {
          name: "England",
          cities: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"]
        },
        SCT: {
          name: "Scotland",
          cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling"]
        },
        WLS: {
          name: "Wales",
          cities: ["Cardiff", "Swansea", "Newport", "Wrexham", "Bangor"]
        },
        NIR: {
          name: "Northern Ireland",
          cities: ["Belfast", "Derry", "Lisburn", "Newtownabbey", "Bangor"]
        }
      }
    },
    CA: {
      name: "Canada",
      code: "+1",
      states: {
        ON: {
          name: "Ontario",
          cities: ["Toronto", "Ottawa", "Hamilton", "London", "Windsor"]
        },
        BC: {
          name: "British Columbia",
          cities: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"]
        },
        QC: {
          name: "Quebec",
          cities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"]
        },
        AB: {
          name: "Alberta",
          cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"]
        }
      }
    }
  }
};

export const getCountryOptions = () => {
  return Object.entries(locationData.countries).map(([code, data]) => ({
    value: code,
    label: data.name,
    phoneCode: data.code
  }));
};

export const getStateOptions = (countryCode) => {
  if (!countryCode || !locationData.countries[countryCode]) return [];
  
  return Object.entries(locationData.countries[countryCode].states).map(([code, data]) => ({
    value: code,
    label: data.name
  }));
};

export const getCityOptions = (countryCode, stateCode) => {
  if (!countryCode || !stateCode || 
      !locationData.countries[countryCode] || 
      !locationData.countries[countryCode].states[stateCode]) return [];
  
  return locationData.countries[countryCode].states[stateCode].cities.map(city => ({
    value: city,
    label: city
  }));
};

export const getPhoneCode = (countryCode) => {
  if (!countryCode || !locationData.countries[countryCode]) return "+1";
  return locationData.countries[countryCode].code;
};