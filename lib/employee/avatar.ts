const REMOTE_AVATAR_PREFIXES = ["http://", "https://", "/"];

export function isRemoteAvatarSrc(src: string): boolean {
  return REMOTE_AVATAR_PREFIXES.some((prefix) => src.startsWith(prefix));
}
