const axios = require('axios');

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = 'caaba35a777245c6851df2ad0f60a39a';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const USER_ID = '12142121799';

if (CLIENT_SECRET == null) {
  throw Error('SPOTIFY_CLIENT_SECRET not found');
}

async function getAccessToken() {
  const b64 = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  return (
    await axios({
      method: 'POST',
      url: AUTH_URL,
      data: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${b64}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
  ).data;
}

async function getPlaylists(token) {
  return (
    await axios({
      method: 'GET',
      url: `${API_URL}/users/${USER_ID}/playlists`,
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      params: {
        limit: 50,
      },
    })
  ).data.items;
}

module.exports = async function fetchPlaylists() {
  if (process.env.ELEVENTY_ENV !== 'production') {
    return [
      {
        name: '30 NOVEMBER',
        url:'https://open.spotify.com/playlist/6ZGjibZYUdb0kkPmqnRmHX?si=377b9f1bbb0d45a2',
        description: 'for when you know you&#x27;re going to code for a while',
        image:
          'https://i.scdn.co/image/ab67706c0000bebba02d8328058f5aa25064d0ce',
      },
      {
        name: ' REAL ME ',
        url: 'https://open.spotify.com/playlist/0qEzzF002VdlGplBzo0pd3?si=d958b45515f04eb4',
        description: ' moment that you missing her 🥹😋',
        image:
          'https://i.scdn.co/image/ab67706c0000bebb91471f262ee375f823633ee5',
      },
      {
        name: '寛 nostalgia',
        url: 'https://open.spotify.com/playlist/7ySBYdjfzOOttkZg6Fz5e3?si=da80ab8030f74eef',
        description: 'for chilled nostalgic moments',
        image:
          'https://i.scdn.co/image/ab67706c0000bebbc79a05be2cd83766bd94ec67',
      },
      {
        name: ' YO ! ',
        url: 'https://open.spotify.com/playlist/4wnJe2ilAuQlf4j2V9Dae5?si=579cbb4028a44e04',
        description: 'post rock for contemplating life',
        image:
          'https://i.scdn.co/image/ab67706c0000bebb666bf1679f180a6ed8a26429',
      },
    ];
  }

  const { access_token: token } = await getAccessToken();

  const playlists = await getPlaylists(token);

  const relevantPlaylists = playlists
    .filter((p) => p.description.startsWith('@') && p.description.endsWith('@'))
    .map((p) => {
      return {
        name: p.name,
        url: p.external_urls.spotify,
        description: p.description.slice(1, p.description.length - 1).trim(),
        image: p.images[0].url,
      };
    });

  return relevantPlaylists;
};
