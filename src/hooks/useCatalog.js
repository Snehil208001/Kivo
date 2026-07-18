import { useEffect, useState, useCallback } from 'react';
import {
  fetchAllProducts,
  fetchProductByHandle,
  fetchCollections,
  fetchCollectionByHandle,
  fetchPage,
} from '../lib/api';

// Generic async-data hook: tracks data/loading/error and re-runs when deps change.
function useAsync(fn, deps, { skip = false } = {}) {
  const [state, setState] = useState({ data: null, loading: !skip, error: null });

  const run = useCallback(() => {
    if (skip) return;
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) =>
        active && setState({ data: null, loading: false, error: error.message })
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}

export function useProducts() {
  return useAsync(() => fetchAllProducts(), []);
}

export function useProduct(handle) {
  return useAsync(() => fetchProductByHandle(handle), [handle], { skip: !handle });
}

export function useCollections() {
  return useAsync(() => fetchCollections(), []);
}

export function useCollection(handle) {
  return useAsync(() => fetchCollectionByHandle(handle), [handle], {
    skip: !handle,
  });
}

export function usePage(handle) {
  return useAsync(() => fetchPage(handle), [handle], { skip: !handle });
}
