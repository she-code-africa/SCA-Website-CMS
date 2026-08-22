"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // <html>
    //   <body>
    //     <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //       <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
    //       <button
    //         onClick={() => reset()}
    //         className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
    //       >
    //         Try again
    //       </button>
    //     </div>
    //   </body>
    // </html>

    <></>
  );
}

export const dynamic = "force-dynamic";
