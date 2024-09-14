import { DiscordSnowflake } from '@sapphire/snowflake';

export function generateUniqueIdSnowflake() {
  return DiscordSnowflake.generate();
}
