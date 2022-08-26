import React from 'react';
import { Modal } from 'react-native';
import SearchFilter from '../SearchFilter';

const SearchFilterSortModal = (props) => {
  const {
    viewSortFilter,
    toggleSortFilter,
    tags,
    searchQuery,
    setSearchQuery,
    categories,
    commenceSearch,
    requestLocation,
    services,
    defaultFilter,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={viewSortFilter}
      onRequestClose={() => toggleSortFilter()}>
      {viewSortFilter && (
        <SearchFilter
          requestLocation={requestLocation}
          commenceSearch={commenceSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tagsList={tags}
          categoriesList={categories}
          toggleSortFilter={toggleSortFilter}
          servicesList={services}
          defaultFilter={defaultFilter}
        />
      )}
    </Modal>
  );
};

export default SearchFilterSortModal;
