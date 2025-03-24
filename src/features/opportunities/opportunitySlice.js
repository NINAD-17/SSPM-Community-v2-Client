import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from './services/opportunityService';

export const loadOpportunities = createAsyncThunk(
    'opportunities/loadAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await opportunityService.fetchAllOpportunities();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadOpportunitiesByCategory = createAsyncThunk(
    'opportunities/loadByCategory',
    async (category, { rejectWithValue }) => {
        try {
            if (category === 'All') {
                const response = await opportunityService.fetchAllOpportunities();
                return response.data;
            } else {
                const response = await opportunityService.fetchOpportunitiesByCategory(category);
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadOpportunityById = createAsyncThunk(
    'opportunities/loadById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await opportunityService.fetchOpportunityById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createOpportunity = createAsyncThunk(
    'opportunities/create',
    async (opportunityData, { rejectWithValue }) => {
        try {
            const response = await opportunityService.createOpportunity(opportunityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateOpportunity = createAsyncThunk(
    'opportunities/update',
    async ({ id, opportunityData }, { rejectWithValue }) => {
        try {
            const response = await opportunityService.updateOpportunity(id, opportunityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteOpportunity = createAsyncThunk(
    'opportunities/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await opportunityService.deleteOpportunity(id);
            return { id, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    data: [],
    selectedOpportunity: null,
    status: 'idle',
    error: null,
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle'
};

const opportunitySlice = createSlice({
    name: 'opportunities',
    initialState,
    reducers: {
        resetCreateStatus: (state) => {
            state.createStatus = 'idle';
        },
        resetUpdateStatus: (state) => {
            state.updateStatus = 'idle';
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
        },
        clearSelectedOpportunity: (state) => {
            state.selectedOpportunity = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadOpportunities.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadOpportunities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload || [];
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
                state.data = action.payload || [];
                state.error = null;
            })
            .addCase(loadOpportunitiesByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(loadOpportunityById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadOpportunityById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedOpportunity = action.payload;
                state.error = null;
            })
            .addCase(loadOpportunityById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createOpportunity.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(createOpportunity.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                state.data.unshift(action.payload);
            })
            .addCase(createOpportunity.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOpportunity.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateOpportunity.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                const index = state.data.findIndex(
                    (opportunity) => opportunity._id === action.payload._id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
                if (state.selectedOpportunity?._id === action.payload._id) {
                    state.selectedOpportunity = action.payload;
                }
            })
            .addCase(updateOpportunity.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteOpportunity.pending, (state) => {
                state.deleteStatus = 'loading';
            })
            .addCase(deleteOpportunity.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.data = state.data.filter(
                    (opportunity) => opportunity._id !== action.payload.id
                );
                if (state.selectedOpportunity?._id === action.payload.id) {
                    state.selectedOpportunity = null;
                }
            })
            .addCase(deleteOpportunity.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetCreateStatus, resetUpdateStatus, resetDeleteStatus, clearSelectedOpportunity } = opportunitySlice.actions;

export const selectOpportunities = (state) => state.opportunities;
export const selectOpportunityById = (state, id) => {
    return state.opportunities.data.find((opportunity) => opportunity._id === id);
};

export default opportunitySlice.reducer;


