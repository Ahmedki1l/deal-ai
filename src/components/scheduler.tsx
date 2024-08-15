"use client";
import { useLocale } from "@/hooks/use-locale";
import { LocaleProps } from "@/types/locale";
import {
  Week,
  Month,
  Agenda,
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
  ResourcesDirective,
  ResourceDirective,
  Inject,
  Resize,
  DragAndDrop,
  Day,
  TimelineViews,
} from "@syncfusion/ej2-react-schedule";
// import { registerLicense } from "@syncfusion/ej2-basee";
// registerLicense(
//   "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhBYVF0WmFZfVpgdVdMZVhbRnFPMyBoS35RckVrWHpecHFRRGdZVUx+",
// );

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

type SchedulerProps = {} & LocaleProps;
export function Scheduler({ lang }: SchedulerProps) {
  const eventSettings: EventSettingsModel = {
    dataSource: timelineResourceData,
  };
  const group = { byGroupID: false, resources: ["Projects", "Categories"] };

  const projectData: Object[] = [
    { text: "PROJECT 1", id: 1, color: "#cb6bb2" },
  ];
  const categoryData: Object[] = [
    { text: "Development", id: 1, color: "#1aaa55" },
    { text: "Testing", id: 2, color: "#7fa900" },
  ];
  return (
    <ScheduleComponent
      height="550px"
      locale="ar"
      showQuickInfo={false}
      selectedDate={new Date(2018, 1, 15)}
      eventSettings={eventSettings}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="TimelineWorkWeek" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <ResourcesDirective>
        <ResourceDirective
          field="ProjectId"
          title="Choose Project"
          name="Projects"
          allowMultiple={false}
          dataSource={projectData}
          textField="text"
          idField="id"
          colorField="color"
        />
      </ResourcesDirective>

      <Inject services={[Day, Week, Month, TimelineViews]} />
    </ScheduleComponent>
  );
  // return (
  //   <div>
  //     <ScheduleComponent
  //       width="100%"
  //       height="100%"
  //       currentView="Month"
  //       selectedDate={new Date(2024, 3, 4)}
  //       eventSettings={eventSettings}
  //       group={group}
  //     >
  //       <ViewsDirective>
  //         <ViewDirective option="Week" />
  //         <ViewDirective option="Month" />
  //         <ViewDirective option="Agenda" />
  //       </ViewsDirective>
  // <ResourcesDirective>
  //   <ResourceDirective
  //     field="ProjectId"
  //     title="Choose Project"
  //     name="Projects"
  //     allowMultiple={false}
  //     dataSource={projectData}
  //     textField="text"
  //     idField="id"
  //     colorField="color"
  //   />
  //       </ResourcesDirective>
  //       <Inject services={[Week, Month, Agenda, Resize, DragAndDrop]} />
  //     </ScheduleComponent>
  //   </div>
  // );
}
