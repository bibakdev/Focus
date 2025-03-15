'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label
} from '@headlessui/react';
import usersData from '../../input.json';

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

export default function CreatableCombobox({
  selectedPerson,
  setSelectedPerson,
  className
}) {
  const [people, setPeople] = useState(usersData);
  console.log();
  const [query, setQuery] = useState('');

  const [isNewItem, setIsNewItem] = useState(false); // کنترل تغییر رنگ مرز

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && query.trim() !== '') {
      const exists = people.some(
        (person) => person.name.toLowerCase() === query.toLowerCase()
      );

      if (!exists) {
        const newPerson = { id: people.length + 1, name: query.trim() };
        setPeople([...people, newPerson]); // اضافه کردن مقدار جدید
        setSelectedPerson(newPerson); // انتخاب مقدار جدید
        setIsNewItem(true); // تغییر رنگ مرز

        // بعد از ۲ ثانیه رنگ مرز را به حالت عادی برگردان
        setTimeout(() => setIsNewItem(false), 2000);
      }

      setQuery(''); // پاک کردن `input`
    }
  };

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(person) => {
        setQuery('');
        setSelectedPerson(person);
      }}
      className={className}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        Name:
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          autoComplete="false"
          className={`w-full rounded-md border-2 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm 
          ring-1 ring-inset sm:text-sm sm:leading-6
          ${
            isNewItem
              ? 'border-green-500 ring-green-500'
              : 'border-gray-300 ring-gray-300'
          }
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600`}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown} // مدیریت زدن Enter
          displayValue={(person) => person?.name || ''}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredPeople.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <ComboboxOption
                key={`${person.name}-${Math.random()}`}
                value={person}
                className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                <span className="block truncate group-data-[selected]:font-semibold">
                  {person.name}
                </span>

                <span className="absolute inset-y-0 left-0 hidden items-center pl-1.5 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
