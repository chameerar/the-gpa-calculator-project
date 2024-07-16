import { ChangeEvent, FormEvent, useState } from 'react'
import './App.css'

interface Subject {
  name: string;
  grade: string;
  credit: string;
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([{ name: '', grade: '', credit: '' }]);
  const [gpa, setGpa] = useState<string | null>(null);
  const [gradingSystem, setGradingSystem] = useState<string>('4.0');

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...subjects];
    values[index][event.target.name as keyof Subject] = event.target.value;
    setSubjects(values);
  };

  const handleGradingSystemChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGradingSystem(event.target.value);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', grade: '', credit: '' }]);
  };

  const handleRemoveSubject = (index: number) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    calculateGpa();
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const gradePoints = getGradePoints(subject.grade);
      const credit = parseFloat(subject.credit);
      totalPoints += gradePoints * credit;
      totalCredits += credit;
    });

    const gpa = totalPoints / totalCredits;
    setGpa(gpa.toFixed(2));
  };

  const getGradePoints = (grade: string) => {
    const gradePointSystems: { [key: string]: { [key: string]: number } } = {
      '4.0': { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 },
      '5.0': { 'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0 }
    };

    const system = gradePointSystems[gradingSystem];
    return system[grade.toUpperCase()] || 0.0;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GPA Calculator</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Grading System: </label>
            <select value={gradingSystem} onChange={handleGradingSystemChange}>
              <option value="4.0">4.0</option>
              <option value="5.0">5.0</option>
            </select>
          </div>
          {subjects.map((subject, index) => (
            <div key={index} className="subject-row">
              <input
                type="text"
                name="name"
                placeholder="Subject Name"
                value={subject.name}
                onChange={event => handleInputChange(index, event)}
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade (A, B, C, D, F)"
                value={subject.grade}
                onChange={event => handleInputChange(index, event)}
              />
              <input
                type="number"
                name="credit"
                placeholder="Credit"
                value={subject.credit}
                onChange={event => handleInputChange(index, event)}
              />
              <button type="button" onClick={() => handleRemoveSubject(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubject}>Add Subject</button>
          <button type="submit">Calculate GPA</button>
        </form>
        {gpa && (
          <div className="result">
            <h2>Your GPA is: {gpa}</h2>
          </div>
        )}
      </header>
    </div>
  );
}

export default App
