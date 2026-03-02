"use client";

import ErrorPage from "@/components/ErrorPage";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ERROR_TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  418: "I'm a Teapot",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

function toStatusCode(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (value < 100 || value > 599) {
    return null;
  }

  return Math.trunc(value);
}

function statusFromMessage(message: string) {
  const match = message.match(/(?:status|code|forced)\D*(\d{3})/i);
  if (!match) {
    return null;
  }

  return toStatusCode(Number(match[1]));
}

function getStatusCode(error: Error & { status?: unknown; cause?: unknown }) {
  const ownStatus = toStatusCode(error.status);
  if (ownStatus) {
    return ownStatus;
  }

  if (typeof error.cause === "object" && error.cause !== null) {
    const cause = error.cause as { status?: unknown; code?: unknown };
    const causeStatus = toStatusCode(cause.status) ?? toStatusCode(cause.code);
    if (causeStatus) {
      return causeStatus;
    }
  }

  const messageStatus = statusFromMessage(error.message);
  if (messageStatus) {
    return messageStatus;
  }

  return 500;
}

export default function Error({ error, reset }: ErrorProps) {
  const statusCode = getStatusCode(error);
  const title = ERROR_TITLES[statusCode] ?? "Unexpected Error";
  const isServerError = statusCode >= 500;

  void reset;

  return (
    <ErrorPage
      code={statusCode}
      title={title}
      heroSymbol={isServerError ? "!!" : "*"}
      marker={isServerError ? "!!!" : ">>>"}
    />
  );
}
