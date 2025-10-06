const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoicmNhcmlubyIsImEiOiJjbWc5N2FoMDIwZzh3MmtvYzNkamZmcWtuIn0.KC5l5IutqBddRKnB855Rlw"; 

export function getCountryMap(lat, lng) {
  if (!lat || !lng) return "";

  // Mapbox needs lon,lat → so order is (lng, lat)
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},4,0/600x400?access_token=${MAPBOX_ACCESS_TOKEN}`;
}
