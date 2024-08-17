// "use client";
// import { useLocale } from "@/hooks/use-locale";
// import { LocaleProps } from "@/types/locale";
// import {
//   Week,
//   Month,
//   Agenda,
//   ScheduleComponent,
//   ViewsDirective,
//   ViewDirective,
//   EventSettingsModel,
//   ResourcesDirective,
//   ResourceDirective,
//   Inject,
//   Resize,
//   DragAndDrop,
//   Day,
//   TimelineViews,
// } from "@syncfusion/ej2-react-schedule";
// // import { registerLicense } from "@syncfusion/ej2-basee";
// // registerLicense(
// //   "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhBYVF0WmFZfVpgdVdMZVhbRnFPMyBoS35RckVrWHpecHFRRGdZVUx+",
// // );

// export const timelineResourceData: Object[] = [
//   {
//     Id: 61,
//     Subject: "Decoding",
//     StartTime: new Date(2024, 3, 4, 9, 30),
//     EndTime: new Date(2024, 3, 4, 10, 30),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 62,
//     Subject: "Bug Automation",
//     StartTime: new Date(2024, 3, 4, 13, 30),
//     EndTime: new Date(2024, 3, 4, 16, 30),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 63,
//     Subject: "Functionality testing",
//     StartTime: new Date(2024, 3, 4, 9),
//     EndTime: new Date(2024, 3, 4, 10, 30),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 64,
//     Subject: "Resolution-based testing",
//     StartTime: new Date(2024, 3, 4, 12),
//     EndTime: new Date(2024, 3, 4, 13),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 65,
//     Subject: "Test report Validation",
//     StartTime: new Date(2024, 3, 4, 15),
//     EndTime: new Date(2024, 3, 4, 18),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 66,
//     Subject: "Test case correction",
//     StartTime: new Date(2024, 3, 4, 14),
//     EndTime: new Date(2024, 3, 4, 16),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 67,
//     Subject: "Bug fixing",
//     StartTime: new Date(2024, 3, 4, 14, 30),
//     EndTime: new Date(2024, 3, 4, 18, 30),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 68,
//     Subject: "Run test cases",
//     StartTime: new Date(2024, 3, 4, 17, 30),
//     EndTime: new Date(2024, 3, 4, 19, 30),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
//   {
//     Id: 70,
//     Subject: "Bug Automation",
//     StartTime: new Date(2024, 3, 5, 18, 30),
//     EndTime: new Date(2024, 3, 5, 20),
//     IsAllDay: false,
//     ProjectId: 1,
//     TaskId: 1,
//   },
// ];

// type SchedulerProps = {} & LocaleProps;
// export function Scheduler({ lang }: SchedulerProps) {
//   const eventSettings: EventSettingsModel = {
//     dataSource: timelineResourceData,
//   };
//   const group = { byGroupID: false, resources: ["Projects", "Categories"] };

//   const projectData: Object[] = [
//     { text: "PROJECT 1", id: 1, color: "#cb6bb2" },
//   ];
//   const categoryData: Object[] = [
//     { text: "Development", id: 1, color: "#1aaa55" },
//     { text: "Testing", id: 2, color: "#7fa900" },
//   ];
//   return (
//     <ScheduleComponent
//       height="550px"
//       locale="ar"
//       showQuickInfo={false}
//       selectedDate={new Date(2018, 1, 15)}
//       eventSettings={eventSettings}
//     >
//       <ViewsDirective>
//         <ViewDirective option="Day" />
//         <ViewDirective option="Week" />
//         <ViewDirective option="TimelineWorkWeek" />
//         <ViewDirective option="Month" />
//       </ViewsDirective>
//       <ResourcesDirective>
//         <ResourceDirective
//           field="ProjectId"
//           title="Choose Project"
//           name="Projects"
//           allowMultiple={false}
//           dataSource={projectData}
//           textField="text"
//           idField="id"
//           colorField="color"
//         />
//       </ResourcesDirective>

//       <Inject services={[Day, Week, Month, TimelineViews]} />
//     </ScheduleComponent>
//   );
// }

"use client";
import { cn, getMonth } from "@/lib/utils";
import { LocaleProps } from "@/types/locale";
import { Post } from "@prisma/client";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export const timelineResourceData: Object[] = [
  {
    Id: 61,
    Subject: "Decoding",
    StartTime: new Date(2024, 3, 4, 9, 30),
    EndTime: new Date(2024, 3, 4, 10, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 62,
    Subject: "Bug Automation",
    StartTime: new Date(2024, 3, 4, 13, 30),
    EndTime: new Date(2024, 3, 4, 16, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 63,
    Subject: "Functionality testing",
    StartTime: new Date(2024, 3, 4, 9),
    EndTime: new Date(2024, 3, 4, 10, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 64,
    Subject: "Resolution-based testing",
    StartTime: new Date(2024, 3, 4, 12),
    EndTime: new Date(2024, 3, 4, 13),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 65,
    Subject: "Test report Validation",
    StartTime: new Date(2024, 3, 4, 15),
    EndTime: new Date(2024, 3, 4, 18),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 66,
    Subject: "Test case correction",
    StartTime: new Date(2024, 3, 4, 14),
    EndTime: new Date(2024, 3, 4, 16),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 67,
    Subject: "Bug fixing",
    StartTime: new Date(2024, 3, 4, 14, 30),
    EndTime: new Date(2024, 3, 4, 18, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 68,
    Subject: "Run test cases",
    StartTime: new Date(2024, 3, 4, 17, 30),
    EndTime: new Date(2024, 3, 4, 19, 30),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
  {
    Id: 70,
    Subject: "Bug Automation",
    StartTime: new Date(2024, 3, 5, 18, 30),
    EndTime: new Date(2024, 3, 5, 20),
    IsAllDay: false,
    ProjectId: 1,
    TaskId: 1,
  },
];

type SchedulerProps = { posts: Post[] } & LocaleProps;
export function Scheduler({ lang, posts }: SchedulerProps) {
  // Month
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const [monthIndex, setMonthIndex] = useState(dayjs().month());

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month(),
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex items-center gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleReset}>
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <Icons.chevronLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <Icons.chevronRight />
          </Button>
        </div>

        <h2 className="font-bold">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </h2>
      </header>

      <Month month={currenMonth} />
    </div>
  );
}

export function Month({ month }: { month: dayjs.Dayjs[][] }) {
  return (
    <div className="grid flex-1 grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export function Day({ day, rowIdx }: { day: dayjs.Dayjs; rowIdx: number }) {
  const [dayEvents, setDayEvents] = useState([]);
  // const {
  //   setDaySelected,
  //   setShowEventModal,
  //   filteredEvents,
  //   setSelectedEvent,
  // } = useContext(GlobalContext);

  // useEffect(() => {
  //   const events = filteredEvents.filter(
  //     (evt) => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY"),
  //   );
  //   setDayEvents(events);
  // }, [filteredEvents, day]);

  return (
    <div className={cn("flex flex-1 flex-col border border-muted-foreground")}>
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="mt-1 text-sm">{day.format("ddd").toUpperCase()}</p>
        )}
        <p
          className={cn(
            "my-1 p-1 text-center text-xs",
            // today classes
            day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
              ? "w-7 rounded-full bg-primary text-primary-foreground"
              : "",
            // day.format("MM") !== dayjs().format("MM")
            //   ? "text-destructive line-through"
            //   : "",
          )}
        >
          {day.format("DD")}
        </p>
      </header>

      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          // setDaySelected(day);
          // setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            // onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt?.["label"]}-200 mb-1 mr-3 truncate rounded p-1 text-sm text-muted-foreground`}
          >
            {evt?.["title"]}
          </div>
        ))}
      </div>
    </div>
  );
}
