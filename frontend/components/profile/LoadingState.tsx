export function LoadingState() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#080808] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to wallet...</p>
        </div>
      </div>
    </div>
  );
}
