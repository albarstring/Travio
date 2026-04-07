import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses')
    }
  }
)

export const fetchCourse = createAsyncThunk(
  'course/fetchCourse',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${slug}`)
      return response.data.course
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course')
    }
  }
)

export const fetchFeaturedCourses = createAsyncThunk(
  'course/fetchFeaturedCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses/featured')
      return response.data.courses
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured courses')
    }
  }
)

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    featuredCourses: [],
    currentCourse: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.courses = action.payload.courses
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentCourse = action.payload
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featuredCourses = action.payload
      })
  },
})

export const { clearCurrentCourse } = courseSlice.actions
export default courseSlice.reducer

