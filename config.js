/*
  Frutiger Aero live wallpaper: settings.
  Edit this file to tweak the wallpaper. Times use a 24-hour clock in the time zone below,
  written as decimal hours (19.5 = 7:30 pm).
*/
window.AERO_CONFIG = {
  timeZone: 'Australia/Sydney',

  // Fixed daily schedule, based on Sydney in mid-November.
  // firstLight/lastLight are civil twilight; sunrise/sunset are when the sun crosses the horizon.
  schedule: { firstLight: 5.33, sunrise: 5.78, sunset: 19.53, lastLight: 19.99 },

  // Live weather for Sydney from Open-Meteo (free, no account). enabled:false = always clear.
  weather: { enabled: true, latitude: -33.8688, longitude: 151.2093, refreshMinutes: 15 },

  // Performance
  fps: 30,             // frames per second
  batteryFps: 15,      // used when the computer reports it is running on battery
  maxPixelRatio: 1.5,  // caps render resolution on high-DPI screens

  // Artwork. A missing file is fine: the wallpaper draws that part itself until the art exists.
  art: {
    plates: {
      night: 'art/plates/night.webp',
      dawn: 'art/plates/dawn.webp',
      day: 'art/plates/day.webp',
      sunset: 'art/plates/sunset.webp'
    },
    sprites: {
      globe: 'art/sprites/globe.png',
      dolphin: 'art/sprites/dolphin.png',
      clownfish: 'art/sprites/clownfish.png',
      bluetang: 'art/sprites/bluetang.png',
      yellowtang: 'art/sprites/yellowtang.png',
      angelfish: 'art/sprites/angelfish.png',
      turtle: 'art/sprites/turtle.png',
      sardine: 'art/sprites/sardine.png',
      jellyfish: 'art/sprites/jellyfish.png',
      jellyfish2: 'art/sprites/jellyfish2.png',
      cloud1: 'art/sprites/cloud1.png',
      cloud2: 'art/sprites/cloud2.png',
      cloud3: 'art/sprites/cloud3.png',
      cloud4: 'art/sprites/cloud4.png'
    },
    // How much of each jellyfish image (from the top) is the bell; the rest is tentacles.
    jellyBell: { jellyfish: 0.42, jellyfish2: 0.42 }
  },

  // Where things sit, as fractions of the 3:2 artwork (0,0 = top left, 1,1 = bottom right).
  // Screens that aren't 3:2 crop a little off the top and bottom, so keep key things inside 0.1–0.9.
  // Measured from the art-v1 plates.
  layout: {
    waterline: 0.577,    // the water surface cutting across the picture
    farShore: 0.493,     // where the far shore meets the lagoon
    globe: { x: 0.17, y: 0.17, r: 0.065 },
    rainbow: { x: 0.28, y: 0.62, r: 0.36, width: 0.05 },   // arcs over the meadow, clear of the city
    turbines: [           // standing on the hills on the left (y = where the tower meets the grass)
      { x: 0.06, y: 0.432, h: 0.12 },
      { x: 0.11, y: 0.428, h: 0.105 },
      { x: 0.16, y: 0.436, h: 0.09 },
      { x: 0.245, y: 0.452, h: 0.07 },
      { x: 0.295, y: 0.456, h: 0.06 },
      { x: 0.35, y: 0.462, h: 0.05 }
    ],
    city: { x0: 0.6, x1: 0.97 },
    cloudFadeX: [0.4, 0.55],  // with the artwork, drifting clouds fade out here, before the towers
    reefTop: 0.81,
    fishBand: [0.63, 0.79]
  },

  // Where the sun is in each artwork plate, so the lens flare comes from the right spot.
  artSun: { day: [0.5, 0.0], dawn: [0.07, 0.405], sunset: [0.77, 0.34] },

  dolphinsEvery: [20, 45]  // seconds between dolphin jumps (random in this range)
};
