import { NextRequest, NextResponse } from "next/server";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export const GET = async (request: NextRequest) => {
  if (!isLocal) {
    return NextResponse.json(
      { error: "Tina CMS is only available in local development mode" },
      { status: 503 }
    );
  }

  // Dynamic import only in local mode to avoid build-time dependency
  try {
    const { TinaNodeBackend, LocalBackendAuthProvider } = await import(
      "@tinacms/datalayer"
    );
    const { default: databaseClient } = await import(
      "../../../../../tina/__generated__/databaseClient"
    );

    const handler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    });

    return handler(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Tina CMS configuration error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  if (!isLocal) {
    return NextResponse.json(
      { error: "Tina CMS is only available in local development mode" },
      { status: 503 }
    );
  }

  // Dynamic import only in local mode to avoid build-time dependency
  try {
    const { TinaNodeBackend, LocalBackendAuthProvider } = await import(
      "@tinacms/datalayer"
    );
    const { default: databaseClient } = await import(
      "../../../../../tina/__generated__/databaseClient"
    );

    const handler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    });

    return handler(request);
  } catch (error) {
    return NextResponse.json(
      { error: "Tina CMS configuration error" },
      { status: 500 }
    );
  }
};
