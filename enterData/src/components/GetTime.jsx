import { Input } from '@headlessui/react';
import { useState } from 'react';

export default function GetTime({
  target,
  min,
  hour,
  onChangeMin,
  onChangeHour
}) {
  return (
    <div className="flex items-center my-4">
      <p className="pr-2">{target}:</p>
      <div className="border-3 border-blue-400 rounded-md px-4 flex gap-4">
        <div className="flex items-center">
          <label
            htmlFor="weekly"
            className="block text-sm/6 font-medium text-gray-900"
          >
            h:
          </label>
          <div className="ml-2 my-5">
            <input
              id="weekly"
              type="text"
              value={hour || ''}
              onChange={(e) => onChangeHour(Number(e.target.value))}
              className="block w-15 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="weekly"
            className="block text-sm/6 font-medium text-gray-900"
          >
            m:
          </label>
          <div className="ml-2 my-5">
            <input
              id="weekly"
              type="text"
              value={min || ''}
              onChange={(e) => onChangeMin(Number(e.target.value))}
              className="block w-15 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
