import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    fetchAllOpportunities, 
    fetchOpportunitiesByCategory 
} from './services/opportunityService';

export const loadOpportunities = createAsyncThunk(
    'opportunities/loadAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchAllOpportunities();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadOpportunitiesByCategory = createAsyncThunk(
    'opportunities/loadByCategory',
    async (category, { rejectWithValue }) => {
        try {
            if (category === 'All') {
                const response = await fetchAllOpportunities();
                return response.data;
            }
            const response = await fetchOpportunitiesByCategory(category);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const opportunitySlice = createSlice({
    name: 'opportunities',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        selectedOpportunity: null
    },
    reducers: {
        setSelectedOpportunity: (state, action) => {
            state.selectedOpportunity = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadOpportunities.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadOpportunities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(loadOpportunities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(loadOpportunitiesByCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadOpportunitiesByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.error = null;
            })
            .addCase(loadOpportunitiesByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setSelectedOpportunity } = opportunitySlice.actions;
export default opportunitySlice.reducer;


