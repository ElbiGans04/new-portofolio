import { useEffect } from 'react';
import Router from 'next/router';
import fetcher from '@module/fetcher';
import useSWR from 'swr';
import { DocErrors, DocMeta } from '@typess/jsonApi';

type argument = {
  redirectTo: boolean | string;
  redirectIfFound: boolean;
};

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
}: argument) {
  const { data: user, mutate: mutateUser } = useSWR<DocMeta, DocErrors>(
    '/api/auth/user',
    fetcher,
  );

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (
      (typeof redirectTo === 'boolean' && redirectTo === false) ||
      typeof user === 'undefined'
    )
      return;

    // if (
    //   // If redirectTo is set, redirect if the user was not found.
    //   (redirectTo && !redirectIfFound && !user?.meta?.isLoggedIn) ||
    //   // If redirectIfFound is also set, redirect if the user was found
    //   (redirectIfFound && user?.meta?.isLoggedIn)
    // ) {
    //   Router.push(redirectTo);
    // }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (typeof redirectTo === 'string' &&
        redirectIfFound === false &&
        typeof user?.meta?.isLoggedIn === 'boolean' &&
        user?.meta?.isLoggedIn === false) ||
      // If redirectIfFound is also set, redirect if the user was found
      (typeof redirectTo === 'string' &&
        redirectIfFound === true &&
        typeof user?.meta?.isLoggedIn === 'boolean' &&
        user?.meta?.isLoggedIn === true)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}
