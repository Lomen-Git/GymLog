import React, { useEffect, useState, useRef } from 'react'
import mermaid from 'mermaid'

const Mermaid = () => {
  const [chart, setChart] = useState(`
erDiagram
    USERS ||--o{ PROGRAMS : creates
    USERS ||--o{ WORKOUT_SESSIONS : performs
    PROGRAMS ||--o{ WORKOUTS : contains
    WORKOUTS ||--o{ WORKOUT_EXERCISES : includes
    WORKOUT_EXERCISES ||--o{ SETS : has
    EXERCISES ||--o{ WORKOUT_EXERCISES : used_in
    WORKOUT_SESSIONS ||--o{ PERFORMED_SETS : records
    USERS ||--o{ PROGRAM_SHARES : receives
    PROGRAMS ||--o{ PROGRAM_SHARES : shared_with

    USERS {
        int id PK
        string username
        string email
        string password_hash
    }
    PROGRAMS {
        int id PK
        int creator_id FK
        string name
        text description
        boolean is_public
    }
    WORKOUTS {
        int id PK
        int program_id FK
        string name
        int order
    }
    EXERCISES {
        int id PK
        string name
        text description
    }
    WORKOUT_EXERCISES {
        int id PK
        int workout_id FK
        int exercise_id FK
        int order
    }
    SETS {
        int id PK
        int workout_exercise_id FK
        int reps
        float weight
    }
    WORKOUT_SESSIONS {
        int id PK
        int user_id FK
        int program_id FK
        int workout_id FK
        datetime date
    }
    PERFORMED_SETS {
        int id PK
        int workout_session_id FK
        int set_id FK
        int actual_reps
        float actual_weight
        int rpe
    }
    PROGRAM_SHARES {
        int id PK
        int program_id FK
        int user_id FK
        datetime share_date
        boolean can_edit
    }
  `)
  const [code, setCode] = useState(`
erDiagram
    USERS ||--o{ PROGRAMS : creates
    USERS ||--o{ WORKOUT_SESSIONS : performs
    PROGRAMS ||--o{ WORKOUTS : contains
    WORKOUTS ||--o{ WORKOUT_EXERCISES : includes
    WORKOUT_EXERCISES ||--o{ SETS : has
    EXERCISES ||--o{ WORKOUT_EXERCISES : used_in
    WORKOUT_SESSIONS ||--o{ PERFORMED_SETS : records
    USERS ||--o{ PROGRAM_SHARES : receives
    PROGRAMS ||--o{ PROGRAM_SHARES : shared_with

    USERS {
        int id PK
        string username
        string email
        string password_hash
    }
    PROGRAMS {
        int id PK
        int creator_id FK
        string name
        text description
        boolean is_public
    }
    WORKOUTS {
        int id PK
        int program_id FK
        string name
        int order
    }
    EXERCISES {
        int id PK
        string name
        text description
    }
    WORKOUT_EXERCISES {
        int id PK
        int workout_id FK
        int exercise_id FK
        int order
    }
    SETS {
        int id PK
        int workout_exercise_id FK
        int reps
        float weight
    }
    WORKOUT_SESSIONS {
        int id PK
        int user_id FK
        int program_id FK
        int workout_id FK
        datetime date
    }
    PERFORMED_SETS {
        int id PK
        int workout_session_id FK
        int set_id FK
        int actual_reps
        float actual_weight
        int rpe
    }
    PROGRAM_SHARES {
        int id PK
        int program_id FK
        int user_id FK
        datetime share_date
        boolean can_edit
    }
  `)
  const mermaidRef = useRef(null)

  const changeChart = () => {
    setChart(code)
  }

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true })
  }, [])

  useEffect(() => {
    const renderChart = async () => {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = ''
        
        // 500ms viive ennen renderöintiä
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        try {
          const { svg } = await mermaid.render('mermaid-diagram', chart)
          mermaidRef.current.innerHTML = svg
        } catch (error) {
          console.error("Mermaid rendering failed:", error)
          mermaidRef.current.innerHTML = "Error rendering diagram"
        }
      }
    }
    renderChart()
  }, [chart])

  return (
    <div>
      <div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '60%',
            minHeight: '200px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            resize: 'vertical'
          }}
          placeholder='
erDiagram
    USERS ||--o{ PROGRAMS : creates
    USERS ||--o{ WORKOUT_SESSIONS : performs
    PROGRAMS ||--o{ WORKOUTS : contains
    WORKOUTS ||--o{ WORKOUT_EXERCISES : includes
    WORKOUT_EXERCISES ||--o{ SETS : has
    EXERCISES ||--o{ WORKOUT_EXERCISES : used_in
    WORKOUT_SESSIONS ||--o{ PERFORMED_SETS : records
    USERS ||--o{ PROGRAM_SHARES : receives
    PROGRAMS ||--o{ PROGRAM_SHARES : shared_with

    USERS {
        int id PK
        string username
        string email
        string password_hash
    }
    PROGRAMS {
        int id PK
        int creator_id FK
        string name
        text description
        boolean is_public
    }
    WORKOUTS {
        int id PK
        int program_id FK
        string name
        int order
    }
    EXERCISES {
        int id PK
        string name
        text description
    }
    WORKOUT_EXERCISES {
        int id PK
        int workout_id FK
        int exercise_id FK
        int order
    }
    SETS {
        int id PK
        int workout_exercise_id FK
        int reps
        float weight
    }
    WORKOUT_SESSIONS {
        int id PK
        int user_id FK
        int program_id FK
        int workout_id FK
        datetime date
    }
    PERFORMED_SETS {
        int id PK
        int workout_session_id FK
        int set_id FK
        int actual_reps
        float actual_weight
        int rpe
    }
    PROGRAM_SHARES {
        int id PK
        int program_id FK
        int user_id FK
        datetime share_date
        boolean can_edit
    }
  '
        />
        <br />
        <button onClick={changeChart}>Render</button>
      </div>
      <div ref={mermaidRef}></div>
    </div>
  )
}

export default Mermaid