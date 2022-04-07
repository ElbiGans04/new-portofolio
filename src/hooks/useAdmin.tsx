import { DocAdminDataPlural } from '@src/types/admin';
import { DocErrors } from '@src/types/jsonApi/index';
import { fetcherGeneric } from '@src/utils/fetcher';
import { useRef } from 'react';
import useSWR from 'swr';

export default function useAdmin(url: string) {
  const { data, error } = useSWR<DocAdminDataPlural, DocErrors>(
    url,
    fetcherGeneric,
  );
  const ref = useRef<HTMLDivElement>(null);

  return {
    ref,
    data,
    error,
  };
}
