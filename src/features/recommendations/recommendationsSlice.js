import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRecommendedGroups } from './services/recommendationService';

export const loadRecommendedGroups = createAsyncThunk(
    'recommendations/loadGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchRecommendedGroups();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState: {
        groups: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadRecommendedGroups.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadRecommendedGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.status = 'succeeded';
            })
            .addCase(loadRecommendedGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default recommendationsSlice.reducer; 