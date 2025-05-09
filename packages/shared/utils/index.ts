export * from './assert';
export * from './error';
export * from './createQueries';

export const isAuthPath = (pathname: string): boolean => {
  const publicPaths = ['/login', '/signup', '/forgot-password'];
  return !publicPaths.includes(pathname);
};
