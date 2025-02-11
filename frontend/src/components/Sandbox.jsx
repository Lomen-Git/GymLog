import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Sandbox.module.css'

const Sandbox = () => {

  // React Hook Formin käyttöönotto
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  // Viikkojen lukumäärän tila
  const [weekCount, setWeekCount] = useState(0);

  // Lomakkeen lähetystoiminto
  const onSubmit = (data) => {
    console.log(data); // Voit käsitellä tiedot täällä tai lähettää ne palvelimelle
  };

  // Tarkkaile viikkojen lukumäärä -kenttää
  const watchedWeekCount = watch('weekCount', 0);

  // Päivitä viikkojen lukumäärä -kenttä
  const handleWeekCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setWeekCount(value || 0); // Päivitä viikkojen lukumäärän tila
    // Tyhjennetään vanhat viikkonimet
    for (let i = 1; i <= weekCount; i++) {
      setValue(`weekName${i}`, ''); // Tyhjennetään aiemmin annetut kentät
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Nimikenttä */}
      <div>
        <label htmlFor="name">Recipe Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true, maxLength: 100 })}
        />
        {errors.name && <span>This field is required and should be max 100 characters</span>}
      </div>

      {/* Viikkojen lukumäärä kenttä */}
      <div>
        <label htmlFor="weekCount">Number of Weeks</label>
        <input
          id="weekCount"
          type="number"
          {...register('weekCount', { required: true, min: 1 })}
          onChange={handleWeekCountChange}
        />
        {errors.weekCount && <span>This field is required and should be at least 1</span>}
      </div>

      {/* Dynaamisesti luotavat viikkonimikentät */}
      {Array.from({ length: watchedWeekCount }).map((_, index) => (
        <div key={index}>
          <label htmlFor={`weekName${index + 1}`}>Week {index + 1} Name</label>
          <input
            id={`weekName${index + 1}`}
            type="text"
            {...register(`weekName${index + 1}`, { required: true })}
          />
          {errors[`weekName${index + 1}`] && <span>This field is required</span>}
        </div>
      ))}

      {/* Lähetä-painike */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Sandbox