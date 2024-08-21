export function getDebugMode() {
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";
  return debug;
}
