import MapPlaceholder from "@/components/MapPlaceholder";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          DAYZ SUITE
        </h1>
        <p className="text-xl text-zinc-400">Maps for survivors</p>
        <MapPlaceholder />
        <p className="text-sm text-zinc-600">
          Chernarus map coming in the next milestone
        </p>
      </div>
    </main>
  );
}
