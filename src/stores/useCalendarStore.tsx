import { create } from 'zustand';
import { CalendarApi } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import React from 'react';

interface CalendarState {
  calendarRef: React.RefObject<FullCalendar> | null;
  calendarApi: CalendarApi | null;
  setCalendarRef: (ref: React.RefObject<FullCalendar>) => void;
  setCalendarApi: (api: CalendarApi) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendarRef: null,
  calendarApi: null,
  setCalendarRef: (ref) => {
    set({ calendarRef: ref });
    console.log('calendarRef 전역 변경');
  },
  setCalendarApi: (api) => {
    set({ calendarApi: api });
    console.log('calendarApi 전역 변경');
  },
}));
