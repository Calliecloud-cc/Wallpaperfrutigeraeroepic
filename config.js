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
      turtle: 'art/sprites/turtle.png'
    }
  },

  // Where things sit, as fractions of the 3:2 artwork (0,0 = top left, 1,1 = bottom right).
  // Screens that aren't 3:2 crop a little off the top and bottom, so keep key things inside 0.1–0.9.
  layout: {
    waterline: 0.56,     // the water surface cutting across the picture
    farShore: 0.525,     // where the far shore meets the distant water
    globe: { x: 0.19, y: 0.2, r: 0.07 },
    rainbow: { x: 0.5, y: 0.7, r: 0.46, width: 0.055 },
    turbines: [
      { x: 0.05, y: 0.505, h: 0.13 },
      { x: 0.105, y: 0.51, h: 0.11 },
      { x: 0.155, y: 0.514, h: 0.09 },
      { x: 0.2, y: 0.517, h: 0.075 },
      { x: 0.24, y: 0.519, h: 0.06 }
    ],
    city: { x0: 0.6, x1: 0.97 },
    reefTop: 0.8,
    fishBand: [0.62, 0.83]
  },

  dolphinsEvery: [20, 45]  // seconds between dolphin jumps (random in this range)
};
