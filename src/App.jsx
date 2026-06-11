import { useMemo, useState } from "react";
import breedData from "../data/breeds.json";
import BreedCard from "./BreedCard.jsx";

const breeds = [...breedData].sort((a, b) => a.name.localeCompare(b.name));

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

const coatLengths = uniqueSorted(breeds.map((b) => b.coatLength));
const energyLevels = uniqueSorted(breeds.map((b) => b.energyLevel));

function matches(breed, search, coat, energy) {
  if (coat && breed.coatLength !== coat) return false;
  if (energy && breed.energyLevel !== energy) return false;
  if (search) {
    const haystack = [breed.name, breed.origin, breed.temperament, breed.coatLength]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  return true;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [coat, setCoat] = useState("");
  const [energy, setEnergy] = useState("");

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return breeds.filter((breed) => matches(breed, needle, coat, energy));
  }, [search, coat, energy]);

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <h1>🐾 Wiskerpedia</h1>
          <p className="tagline">A curated encyclopedia of real cat breeds.</p>
        </div>
      </header>

      <main className="wrap">
        <section className="controls" aria-label="Search and filter breeds">
          <input
            type="search"
            placeholder="Search by breed, origin, or temperament…"
            aria-label="Search breeds"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Filter by coat length"
            value={coat}
            onChange={(e) => setCoat(e.target.value)}
          >
            <option value="">All coat lengths</option>
            {coatLengths.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by energy level"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
          >
            <option value="">All energy levels</option>
            {energyLevels.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <p className="count" role="status">
            Showing {visible.length} of {breeds.length} breeds
          </p>
        </section>

        <section className="breed-grid" aria-live="polite">
          {visible.map((breed) => (
            <BreedCard key={breed.name} breed={breed} />
          ))}
        </section>
        {visible.length === 0 && (
          <p className="empty">No breeds match your search.</p>
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>
            Wiskerpedia — data curated for educational use. Weights and life
            expectancies are typical ranges and vary by individual cat.
          </p>
        </div>
      </footer>
    </>
  );
}
