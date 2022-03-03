import useUser from '@src/hooks/useUser';
import { DocDataDiscriminated, DocErrors } from '@src/types/jsonApi/index';
import { fetcherGeneric } from '@src/utils/fetcher';
import { useRef } from 'react';
import useSWR from 'swr';
import { DATA } from '@src/types/admin';

export default function useAdmin(url: string) {
  const { data, error } = useSWR<DocDataDiscriminated<DATA[]>, DocErrors>(
    url,
    fetcherGeneric,
  );
  const ref = useRef<HTMLDivElement>(null);
  const user = useUser({ redirectTo: '/login', redirectIfFound: false });

  return {
    ref,
    user,
    data,
    error,
  };
}
