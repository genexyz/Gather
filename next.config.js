/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "avatars.githubusercontent.com",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "localhost",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "img.freepik.com",
      "scontent.fros9-2.fna.fbcdn.net",
      "www.mykhel.com",
      "i.imgur.com",
    ],
  },
};

module.exports = nextConfig;
