import { NextRequest } from "next/server";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

import databaseClient from "../../../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

if (!isLocal) {
  throw new Error(
    "Production authentication is not configured. Please set TINA_PUBLIC_IS_LOCAL=true for local development."
  );
}

const handler = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(),
  databaseClient,
});

export const GET = (request: NextRequest) => {
  return handler(request);
};

export const POST = (request: NextRequest) => {
  return handler(request);
};
