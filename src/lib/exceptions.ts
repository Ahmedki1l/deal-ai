import * as z from "zod";

// on api, use response
export class ZodErrorResponse extends Response {
  constructor(errors: z.ZodError<any>) {
    super(
      // JSON.stringify(
      //   error.issues.map((err) => ({
      //     path: err?.["path"],
      //     message: err?.["message"],
      //   }))
      // )

      // TODO: try to send all, and handle then in frontend
      errors?.["issues"]?.pop()?.["message"],
      { status: 422 }
    );
  }
}

export class RequiresLoginResponse extends Response {
  constructor(message = "this action needs you to be logged in.") {
    super(message, { status: 403 });
  }
}

export class RequiresAccessResponse extends Response {
  constructor(message = "you don't have access to do this action") {
    super(message, { status: 403 });
  }
}

// on server side, use error
export class ZodError extends Error {
  constructor(errors: z.ZodError<any>) {
    super(errors?.["issues"]?.pop()?.["message"]);
  }
}

export class RequiresLoginError extends Error {
  constructor(message = "this action needs you to be logged in.") {
    super(message);
  }
}

export class RequiresAccessError extends Error {
  constructor(message = "you don't have access to do this action") {
    super(message);
  }
}
