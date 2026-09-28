import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tours: {
    search: '',
    priceRange: [0, 500000],
    duration: '',
    category: '',
    priceSort: '',
  },
  visas: {
    search: '',
    priceRange: [0, 100000],
    country: null,
    visaType: null,
    processingTime: null,
    validity: null,
  },
  attestations: {
    search: '',
    priceRange: [0, 50000],
    country: null,
    attestationType: null,
  },
  blog: {
    search: '',
    category: '',
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTourFilter: (state, action) => {
      state.tours = { ...state.tours, ...action.payload };
    },
    setVisaFilter: (state, action) => {
      state.visas = { ...state.visas, ...action.payload };
    },
    setAttestationFilter: (state, action) => {
      state.attestations = { ...state.attestations, ...action.payload };
    },
    setBlogFilter: (state, action) => {
      state.blog = { ...state.blog, ...action.payload };
    },
    resetFilters: () => {
      return initialState;
    }
  },
});

export const { setTourFilter, setVisaFilter, setAttestationFilter, setBlogFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
