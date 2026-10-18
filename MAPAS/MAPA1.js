(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("MAPA1",
{ "compressionlevel":-1,
 "height":12,
 "infinite":false,
 "layers":[
        {
         "data":[2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051, 2052,
            2057, 2058, 2059, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2070, 2071, 2072, 2073, 2074, 2075, 2076,
            2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100,
            2105, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115, 2116, 2117, 2118, 2119, 2120, 2121, 2122, 2123, 2124,
            2129, 2130, 2131, 2132, 2133, 2134, 2135, 2136, 2137, 2138, 2139, 2140, 2141, 2142, 2143, 2144, 2145, 2146, 2147, 2148,
            2153, 2154, 2155, 2156, 2157, 2158, 2159, 2160, 2161, 2162, 2163, 2164, 2165, 2166, 2167, 2168, 2169, 2170, 2171, 2172,
            2177, 2178, 2179, 2180, 2181, 2182, 2183, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2191, 2192, 2193, 2194, 2195, 2196,
            2201, 2202, 2203, 2204, 2205, 2206, 2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220,
            2225, 2226, 2227, 2228, 2229, 2230, 2231, 2232, 2233, 2234, 2235, 2236, 2237, 2238, 2239, 2240, 2241, 2242, 2243, 2244,
            2249, 2250, 2251, 2252, 2253, 2254, 2255, 2256, 2257, 2258, 2259, 2260, 2261, 2262, 2263, 2264, 2265, 2266, 2267, 2268,
            2273, 2274, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2282, 2283, 2284, 2285, 2286, 2287, 2288, 2289, 2290, 2291, 2292,
            148, 149, 150, 151, 152, 153, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154, 154],
         "height":12,
         "id":1,
         "name":"Camada de Blocos 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 395, 395, 395, 396,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 395, 395, 395, 395, 396, 0, 0,
            0, 395, 395, 395, 395, 396, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 395, 395, 395, 395, 395, 396, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 395, 395, 395, 395, 396, 0,
            0, 0, 0, 0, 0, 0, 0, 395, 395, 395, 395, 396, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2274, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2282, 2283, 2284, 2285, 2286, 2287, 2288, 2289, 2290, 2291, 2292, 2293,
            480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480],
         "height":12,
         "id":2,
         "name":"Camada de Blocos 2",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":20,
         "x":0,
         "y":0
        }],
 "nextlayerid":3,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.12.2",
 "tileheight":32,
 "tilesets":[
        {
         "columns":14,
         "firstgid":1,
         "image":"..\/..\/..\/..\/..\/Downloads\/[BACKGROUND] Top sky.png",
         "imageheight":468,
         "imagewidth":468,
         "margin":0,
         "name":"[BACKGROUND] Top sky",
         "spacing":0,
         "tilecount":196,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":14,
         "firstgid":197,
         "image":"..\/..\/..\/..\/..\/Downloads\/[BACKGROUND] Mountain bg.png",
         "imageheight":468,
         "imagewidth":468,
         "margin":0,
         "name":"[BACKGROUND] Mountain bg",
         "spacing":0,
         "tilecount":196,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":9,
         "firstgid":393,
         "image":"..\/..\/..\/..\/..\/Downloads\/[TILESET] Tileset.png",
         "imageheight":300,
         "imagewidth":300,
         "margin":0,
         "name":"[TILESET] Tileset",
         "spacing":0,
         "tilecount":81,
         "tileheight":32,
         "tiles":[
                {
                 "animation":[
                        {
                         "duration":100,
                         "tileid":14
                        }],
                 "id":0
                }],
         "tilewidth":32
        }, 
        {
         "columns":7,
         "firstgid":474,
         "image":"..\/..\/..\/..\/..\/Downloads\/WhatsApp Image 2026-10-16 at 15.08.36.jpeg",
         "imageheight":32,
         "imagewidth":224,
         "margin":0,
         "name":"arielteste",
         "spacing":0,
         "tilecount":7,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":50,
         "firstgid":481,
         "image":"..\/..\/..\/..\/..\/Downloads\/castle-hero.webp",
         "imageheight":1000,
         "imagewidth":1600,
         "margin":0,
         "name":"castle-hero",
         "spacing":0,
         "tilecount":1550,
         "tileheight":32,
         "tilewidth":32
        }, 
        {
         "columns":24,
         "firstgid":2031,
         "image":"..\/..\/..\/..\/..\/Downloads\/floresta.jpg",
         "imageheight":360,
         "imagewidth":783,
         "margin":0,
         "name":"floresta",
         "spacing":0,
         "tilecount":264,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "type":"map",
 "version":"1.10",
 "width":20
});