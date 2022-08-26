import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import reduxStore from '../Redux/configureStore';
import {
  GET_TAGS,
  GET_CATEGORIES,
  GET_STORES_BY_DISTANCE,
  GET_SERVICES,
} from '../GraphQL';
import loDebounce from 'lodash.debounce';
import { logEvent } from '../AppReporting';
import { Keyboard } from 'react-native';
import { animateLayout } from '../Helpers';

export const useMapSearchHook = (initialState) => {
  const [searchQuery, setSearchQuery] = useState(initialState);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchResultsPaginated, setSearchResultsPaginated] = useState({
    data: [],
    hasNextPage: false,
    nextPage: null,
    totalDocs: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  useQuery(GET_TAGS, {
    onCompleted: (data) => {
      setTags(data.getTags);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  useQuery(GET_SERVICES, {
    onCompleted: (data) => {
      setServices(data.getServices);
    },
  });

  useQuery(GET_CATEGORIES, {
    onCompleted: (data) => {
      setCategories(data.getCategories);
    },
    variables: { makeSort: true },
    fetchPolicy: 'no-cache',
  });

  const [getSearch, { fetchMore }] = useLazyQuery(GET_STORES_BY_DISTANCE, {
    onCompleted: (data) => {
      if (data && data.getStoresByUserLocation) {
        if (data.getStoresByUserLocation.length < 1) {
          setShowQuickFilters(true);
        }
        setSearchResults(data.getStoresByUserLocation);
        setSearchResultsPaginated((result=>({
          data:data.getStoresByUserLocation.data.slice(0,4),
          totalDocs:data.getStoresByUserLocation.totalDocs,
          nextPage:2,
          hasNextPage:data.getStoresByUserLocation.totalDocs>5,
        })))
        setIsLoading(false);
      }
    },
    fetchPolicy: 'no-cache',
  });

  
  const debounce = useCallback(() => {
    const search = loDebounce((_searchInputs) => {
      const query = _searchInputs ? _searchInputs : searchQuery;
      logEvent('search', {
        from: 'Search Screen',
        searched: _searchInputs.searchString,
      });

      animateLayout()
      if (query.searchString !== '') {
        setShowQuickFilters(false);
      }
      setIsLoading(true);
      getSearch({
        variables: {
          options: {
            page: 1,
            limit:99999999, //limitation of aggreate-pagination plugin
            searchString: query.searchString,
            filter: query?.filter,
          },
          serviceTypes: [],
          location: {
            longitude: query?.userLoc?.longitude,
            latitude: query?.userLoc?.latitude,
          },
        },
      });
    }, 1500);

    return {
      search,
      cancel: search.cancel,
    };
  }, []);

  const commenceSearch = (newQuery = false) => {
    const query = newQuery ? newQuery : searchQuery;
    logEvent('search', {
      from: 'Search Screen',
      searched: query.searchString,
    });
    Keyboard.dismiss();
    animateLayout()
    if (query.searchString !== '') {
      setShowQuickFilters(false);
    }
    setIsLoading(true);
    getSearch({
      variables: {
        options: {
          page: 1,
          limit: 99999999, //limitation of aggreate-pagination plugin
          filter: query?.filter,
        },
        serviceTypes: [],
        location: {
          longitude: query?.userLoc?.longitude,
          latitude: query?.userLoc?.latitude,
        },
      },
    });
  };

  const fetchMorePaginated = (callback) => {
    const {data,totalDocs} = searchResults;
    setSearchResultsPaginated((result=>{
      const startIndex = ((result.nextPage-1) *5) - 1;
      const hasNextPage = totalDocs > startIndex+6;
      callback();
      return {
        data:[...result.data,...data.slice(startIndex,startIndex+5)],
        totalDocs:totalDocs,
        nextPage:result.nextPage+1,
        hasNextPage:hasNextPage,
      }
    }))
  }

  return {
    searchQuery,
    setSearchQuery,
    showQuickFilters,
    setShowQuickFilters,
    searchResults,
    searchResultsPaginated,
    isLoading,
    debounce,
    commenceSearch,
    fetchMore,
    fetchMorePaginated,
    tags,
    categories,
    services,
  };
};

export const useDidStoreHyderate = () => {
  const [state, setState] = useState(false);
  useEffect(() => {
    reduxStore(() => {
      setState(true);
    });
  }, []);
  return state;
};
