import { AUTH_PATHS } from '@/shared/constants/path';

export function isAuthPath(path: string) {
  return AUTH_PATHS.some((authPath) => path.startsWith(authPath));
}
