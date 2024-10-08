// used for simplifying validations.
import * as zod from "zod";

export class ZodError extends Error {
  constructor(errors: zod.ZodError<any>) {
    super(errors?.["issues"]?.pop()?.["message"]);
  }
}

const type = (title: string, type: string) => {
  return {
    required_error: `${title} is required.`,
    invalid_type_error: `${title} must be ${type}.`,
  };
};

const string = (title: string) => {
  return zod.string(type(title, "string")).min(1, `${title} is required.`);
};

const stringNotRequired = (title: string) => {
  return zod.string(type(title, "string"));
};

const number = (title: string) => {
  return zod.number(type(title, "number"));
};

const date = (title: string) => {
  return zod.date(type(title, "date"));
};

const boolean = (title: string) => {
  return zod.boolean(type(title, "boolean"));
};

export const z = {
  ...zod,
  type,
  string,
  stringNotRequired,
  boolean,
  date,
  number,
};
