"use client";
import { cn, getMonth } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { Image as ImageType, Post } from "@prisma/client";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { platforms } from "@/db/enums";
import { PostUpdateForm } from "./post-update-form";
import { DialogResponsive } from "./dialog";
import { Image } from "./image";

type SchedulerProps = {
  posts: (Post & { image: ImageType | null })[];
} & Dictionary["post-update-form"] &
  Dictionary["image-form"] &
  Dictionary["post-form"] &
  Dictionary["dialog"] &
  Dictionary["back-button"];

export function Scheduler({ dic, posts }: SchedulerProps) {
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

      <Month dic={dic} month={currenMonth} posts={posts} />
    </div>
  );
}

export function Month({
  dic,
  month,
  posts,
}: {
  month: dayjs.Dayjs[][];
  posts: (Post & { image: ImageType | null })[];
} & Dictionary["post-update-form"] &
  Dictionary["image-form"] &
  Dictionary["post-form"] &
  Dictionary["dialog"] &
  Dictionary["back-button"]) {
  return (
    <div className="grid flex-1 grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <Fragment key={i}>
          {row.map((day, idx) => (
            <Day dic={dic} day={day} key={idx} rowIdx={i} posts={posts} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

export function Day({
  dic,
  day,
  rowIdx,
  posts,
}: {
  day: dayjs.Dayjs;
  rowIdx: number;
  posts: (Post & { image: ImageType | null })[];
} & Dictionary["post-update-form"] &
  Dictionary["image-form"] &
  Dictionary["post-form"] &
  Dictionary["dialog"] &
  Dictionary["back-button"]) {
  const [open, setOpen] = useState(false);
  const filteredPosts = posts.filter(
    (p) => day.format("DD-MM-YY") === dayjs(p?.["postAt"]).format("DD-MM-YY"),
  );

  return (
    <div
      className={cn(
        "flex flex-1 flex-col border border-muted-foreground p-0.5",
      )}
    >
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
        className="flex flex-1 cursor-pointer flex-col gap-0.5"
        onClick={() => {
          // setDaySelected(day);
          // setShowEventModal(true);
        }}
      >
        {filteredPosts?.map((evt, i) => {
          const p = platforms.find((p) => p?.["value"] === evt?.["platform"]);
          const Icon = Icons?.[p?.["icon"]!] ?? null;

          return (
            <DialogResponsive
              key={i}
              dic={dic}
              content={
                <>
                  <PostUpdateForm key={i} post={evt} dic={dic} />
                </>
              }
              title={""}
              description={""}
              open={open}
              setOpen={setOpen}
            >
              <Button className="justify-between gap-2 px-1">
                <div className="flex items-center">
                  {/* <Image
                    src={evt?.["image"]?.["src"]!}
                    alt=""
                    className="h-4 w-4"
                  /> */}
                  {evt?.["title"]}
                </div>

                <div>{Icon && <Icon />}</div>
              </Button>
            </DialogResponsive>
          );
        })}
      </div>
    </div>
  );
}
