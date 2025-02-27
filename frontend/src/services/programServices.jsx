import axios from 'axios'

// axios-instanssi
const api = axios.create({
  baseURL: '/api/gym'
})

// Apufunktio tokenin hakemiseen
const getToken = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  if (!loggedUserJSON || loggedUserJSON === 'null') {
    throw new Error('User is not logged in')
  }
  const user = JSON.parse(loggedUserJSON)
  return `Bearer ${user.token}`
}
// Apufunktio userid hakemiseen
const getUserId = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  if (!loggedUserJSON || loggedUserJSON === 'null') {
    throw new Error('User is not logged in')
  }
  const user = JSON.parse(loggedUserJSON)
  return user.userId
}

// Luo ohjelma
export const createProgram = async (program) => {
  try {
    const token = getToken()
    const response = await api.post('/programs',
      { program },
      {
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating program:', error)
    throw error
  }
}
// Tallenna ohjelma
export const saveProgram = async (programId, program) => {
  console.log('haloo ollaanko täälä')
  try {
    const token = getToken()
    const response = await api.put(`/programs/${programId}`,
      { program },
      {
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating program:', error)
    throw error
  }
}
// Hae saatavilla olevien ohjelmien tiedot
export const getProgramList = async () => {
  try {
    const token = getToken()
    const response = await api.get('/programs', {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw error
  }
}
// Hae ohjelma kokonaisuudessaan
export const getProgramDetails = async (programId) => {
  try {
    const token = getToken()
    const response = await api.get(`/programs/${programId}`, {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching program details:', error)
    throw error
  }
}

// In frontend/src/services/programServices.jsx

// Update the getOngoingProgram function
export const getOngoingProgram = async () => {
  try {
    const token = getToken()
    const response = await api.get('/programs/ongoing', {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching ongoing program:', error)
    throw error
  }
}

// Add a helper function to determine if a workout has been completed
export const isWorkoutCompleted = (workoutId, completedWorkouts) => {
  if (!completedWorkouts || !completedWorkouts.length) return false;
  
  return completedWorkouts.some(
    completedWorkout => completedWorkout.workoutId === workoutId
  );
}

// Add a function to get completed workout data for a specific workout
export const getCompletedWorkoutData = (workoutId, completedWorkouts) => {
  if (!completedWorkouts || !completedWorkouts.length) return null;
  
  return completedWorkouts.find(
    completedWorkout => completedWorkout.workoutId === workoutId
  ) || null;
}

// Similar to createWorkoutSession but with completed data incorporated
export const createWorkoutSessionWithHistory = (workout, completedWorkout = null) => {
  if (!workout?.WorkoutExercises) throw new Error('Invalid workout data');
  
  return {
    workoutId: workout.id,
    name: workout.name,
    isCompleted: !!completedWorkout,
    completedAt: completedWorkout?.createdAt || null,
    exercises: workout.WorkoutExercises.map(exercise => {
      // Find matching completed exercise if available
      const completedExercise = completedWorkout?.CompletedExercises?.find(
        ce => ce.exerciseId === exercise.exerciseId
      );
      
      return {
        exerciseId: exercise.exerciseId,
        name: exercise.Exercise.name,
        isCompleted: !!completedExercise,
        sets: exercise.Sets.map((set, index) => {
          // Find matching completed set if available
          const completedSet = completedExercise?.CompletedSets?.[index];
          
          return {
            setId: set.id,
            targetReps: set.reps,
            targetValue: set.value,
            completedReps: completedSet?.completedReps || null,
            completedValue: completedSet?.completedValue || null,
            weight: completedSet?.weight || null,
            isCompleted: !!completedSet?.isCompleted
          };
        })
      };
    })
  };
}

// In frontend/src/services/programServices.jsx
// Add a new function to save exercise progress

export const saveExerciseProgress = async (workoutData, exerciseId, updatedSets) => {
  try {
    const token = getToken();
    
    // Create a copy of the workout data with only the updated exercise
    const exerciseData = {
      workoutId: workoutData.workoutId,
      programExecutionId: workoutData.programExecutionId,
      name: workoutData.name,
      partialSave: true, // Flag to indicate this is not a complete workout save
      exercises: workoutData.exercises
        .filter(ex => ex.exerciseId === exerciseId)
        .map(ex => ({
          ...ex,
          sets: updatedSets
        }))
    };
    
    const response = await api.post('/programs/exercise-progress', 
      { exerciseData },
      {
        headers: { Authorization: token }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error saving exercise progress:', error);
    throw error;
  }
}


export const getSavedWorkoutProgress = async (programExecutionId, workoutId) => {
  try {
    const token = getToken();
    const response = await api.get(`/programs/exercise-progress`, {
      params: { programExecutionId, workoutId },
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved progress:', error);
    throw error;
  }
}

export const getExerciseHistory = async (exerciseId) => {
  try {
    const token = getToken();
    const response = await api.get(`/exercises/${exerciseId}/history`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    throw error;
  }
}

// zzz

export const createOngoingProgram = async (programId) => {
  try {
    const token = getToken()
    const userId = getUserId()
    const data = {
      userId: userId,
      programId: programId
    }
    const response = await api.post(`/programs/start/${programId}`,
      {data},
      {
      headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating ongoing program:', error)
    throw error
  }
}

export const startProgram = async (programId) => {
  try {
    const token = getToken()
    const response = await api.post(`/programs/start/${programId}`, {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error starting program:', error)
    throw error
  }
}

// Treenin suoritus
export const createCompletedWorkout = async (workoutData) => {
  try {
    const token = getToken()
    
    console.log('koitetaan tällänen laittaa,', workoutData)
    const response = await api.post('/programs/completed', 
      { workoutData },
      {
        headers: { Authorization: token }
      }
    )
    
    return response.data
  } catch (error) {
    console.error('Error saving completed workout:', error)
    throw error
  }
}

export const getProgram = () => {
  console.log('wtf, miksi ollaan täällä')
}
