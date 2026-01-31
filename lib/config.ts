function getRequiredEnvironmentVariable(variableName: string): string {
  const variableValue: string | undefined = process.env[variableName];
  if (!variableValue) {
    if (variableName === "NEXT_PUBLIC_SITE_URL") {
      if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000";
      }
      // Fallback for build/CI when env is not set (e.g. GitHub Actions)
      return "https://example.com";
    }
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
  return variableValue;
}

export const config = {
  siteUrl: getRequiredEnvironmentVariable("NEXT_PUBLIC_SITE_URL"),
} as const;
