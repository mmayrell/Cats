export default function BreedCard({ breed }) {
  return (
    <article className="breed-card">
      <h2>{breed.name}</h2>
      <p className="origin">Origin: {breed.origin}</p>
      <p className="temperament">{breed.temperament}</p>
      <ul className="specs">
        <li>
          <span className="label">Coat</span>
          {breed.coatLength}
        </li>
        <li>
          <span className="label">Weight</span>
          {breed.weightRange}
        </li>
        <li>
          <span className="label">Life expectancy</span>
          {breed.lifeExpectancy}
        </li>
        <li>
          <span className="label">Energy</span>
          {breed.energyLevel}
        </li>
        <li>
          <span className="label">Grooming</span>
          {breed.groomingEffort}
        </li>
      </ul>
      <p className="fun-fact">
        <strong>Fun fact:</strong> {breed.funFact}
      </p>
    </article>
  );
}
