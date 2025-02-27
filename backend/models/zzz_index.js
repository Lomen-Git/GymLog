// AAA AAA AAA AAA AAA AAA
const User = require('./a_user')
const Session = require('./a_session')

// GYM GYM GYM GYM GYM GYM GYM GYM GYM
const Exercise = require('./g_exercise')
const UserExercise  = require('./g_userExercise')
const Program = require('./g_program')
const Workout = require('./g_workout')
const WorkoutExercise = require('./g_workout_exercises')
const Set = require('./g_set')
const Week = require('./g_week')
const ProgramExecution = require('./g_program_execution')
const CompletedWorkout = require('./g_completed_workout')
const CompletedExercise = require('./g_completed_exercise')
const CompletedSet = require('./g_completed_set')
const TempWorkoutProgress = require('./g_temp_workout_progress')

// FORUM FORUM FORUM FORUM FORUM FORUM
const ForumPost = require('./f_forumPost')
const Comment = require('./f_comment')
const Like = require('./f_like')


// AAA AAA AAA AAA AAA AAA
User.hasOne(Session)
Session.belongsTo(User)

// GYM GYM GYM GYM GYM GYM GYM GYM GYM GYM
Exercise.hasMany(UserExercise, { foreignKey: 'exercise_id' })
UserExercise.belongsTo(Exercise, { foreignKey: 'exercise_id' })

UserExercise.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(UserExercise, { foreignKey: 'user_id' })

User.hasMany(Program, { foreignKey: 'user_id' })
Program.belongsTo(User, { foreignKey: 'user_id' })

Program.hasMany(Week, { foreignKey: 'program_id', onDelete: 'CASCADE' })
Week.belongsTo(Program, { foreignKey: 'program_id' })

Week.hasMany(Workout, { foreignKey: 'week_id', onDelete: 'CASCADE' })
Workout.belongsTo(Week, { foreignKey: 'week_id' })

Exercise.hasMany(WorkoutExercise, { foreignKey: 'exercise_id' })
WorkoutExercise.belongsTo(Exercise, { foreignKey: 'exercise_id' })

WorkoutExercise.belongsTo(Workout, { foreignKey: 'workout_id' })
Workout.hasMany(WorkoutExercise, { foreignKey: 'workout_id', onDelete: 'CASCADE' })

WorkoutExercise.hasMany(Set, { foreignKey: 'workout_exercise_id', onDelete: 'CASCADE' })

// uusia exercisemukana
ProgramExecution.belongsTo(User, { foreignKey: 'userId', as: 'user' })
ProgramExecution.belongsTo(Program, { foreignKey: 'programId', as: 'program' })

User.hasMany(ProgramExecution, {
  foreignKey: 'userId',
  as: 'programExecutions',
  ondelete: 'CASCADE'
})

Program.hasMany(ProgramExecution, {
  foreignKey: 'programId',
  as: 'programExecutions',
  ondelete: 'CASCADE'
})

CompletedWorkout.belongsTo(ProgramExecution, {
  foreignKey: 'programExecutionId'
})
ProgramExecution.hasMany(CompletedWorkout, {
  foreignKey: 'programExecutionId',
})

CompletedWorkout.hasMany(CompletedExercise, {
  foreignKey: 'completed_workout_id'
})
CompletedExercise.belongsTo(CompletedWorkout, {
  foreignKey: 'completed_workout_id'
})

CompletedExercise.belongsTo(Exercise, {
  foreignKey: 'exercise_id'
})
Exercise.hasMany(CompletedExercise, {
  foreignKey: 'exercise_id'
})

CompletedExercise.hasMany(CompletedSet, {
  foreignKey: 'completedExerciseId'
})
CompletedSet.belongsTo(CompletedExercise, {
  foreignKey: 'completedExerciseId'
})

CompletedWorkout.belongsTo(Workout, {
  foreignKey: 'workout_id'
})
Workout.hasMany(CompletedWorkout, {
  foreignKey: 'workout_id'
})

TempWorkoutProgress.belongsTo(User, {
  foreignKey: 'userId'
});
TempWorkoutProgress.belongsTo(ProgramExecution, {
  foreignKey: 'programExecutionId'
});
TempWorkoutProgress.belongsTo(Workout, {
  foreignKey: 'workoutId'
});


/// FORUM FORUM FORUM FORUM FORUM FORUM FORUM
// User
User.hasMany(ForumPost, {
  foreignKey: 'userId',
  as: 'posts',
  onDelete: 'CASCADE'
})

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
})

User.hasMany(Like, {
  foreignKey: 'userId',
  as: 'likes',
  onDelete: 'CASCADE'
})

// ForumPost
ForumPost.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',
  onDelete: 'CASCADE'
})

ForumPost.hasMany(Like, {
  foreignKey: 'postId',
  as: 'likes',
  onDelete: 'CASCADE'
})

ForumPost.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
  onDelete: 'CASCADE'
})

// Comment
Comment.belongsTo(ForumPost, {
  foreignKey: 'postId',
  as: 'post',
  onDelete: 'CASCADE'
})

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
})

// Likes
Like.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
})

Like.belongsTo(ForumPost, {
  foreignKey: 'postId',
  as: 'post',
  onDelete: 'CASCADE'
})



module.exports = {
    User,
    Session,

    Exercise,
    UserExercise,
    Program,
    Workout,
    WorkoutExercise,
    Set,
    Week,
    ProgramExecution,
    CompletedWorkout,
    CompletedExercise,
    CompletedSet,
    TempWorkoutProgress,

    User,
    ForumPost,
    Comment,
    Like,
}