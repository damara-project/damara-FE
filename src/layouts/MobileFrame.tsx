export default function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-[#E9EAEE] flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
}
