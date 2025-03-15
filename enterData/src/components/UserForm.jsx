import CreatableCombobox from './CreatableCombobox';
import GetTime from './GetTime';
import inputData from '../../input.json';
import { useState } from 'react';

export default function UserForm({ data, setData }) {
  const [nameObject, setNameObject] = useState('');

  const [minWeek, setMinWeek] = useState(0);
  const [hourWeek, setHourWeek] = useState(0);
  const [minDay, setMinDay] = useState(0);
  const [hourDay, setHourDay] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.some((person) => person.name === nameObject.name)) {
      return;
    } else {
      setData([
        ...data,
        {
          name: nameObject.name,
          thisWeek: `${hourWeek}h ${minWeek}m`,
          today: `${hourDay}h ${minDay}m`
        }
      ]);
      setMinWeek(0);
      setHourWeek(0);
      setMinDay(0);
      setHourDay(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-indigo-600 rounded-2xl p-4 "
    >
      <CreatableCombobox
        selectedPerson={nameObject}
        setSelectedPerson={setNameObject}
        className="w-1/2"
      />
      <div className="flex gap-4">
        <GetTime
          target="Weekly"
          min={minWeek}
          onChangeMin={setMinWeek}
          hour={hourWeek}
          onChangeHour={setHourWeek}
        />
        <GetTime
          target="daily"
          min={minDay}
          onChangeMin={setMinDay}
          hour={hourDay}
          onChangeHour={setHourDay}
        />
      </div>
      <button
        type="submit"
        className="w-full mt-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs  hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </form>
  );
}
