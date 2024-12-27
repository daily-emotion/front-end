import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[ interactionPlugin, dayGridPlugin ]}
        initialView="dayGridPlugin"
        selectable={true}
      />
    </div>
  );
};

export default Calendar;
