export default function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute -top-[18%] left-[5%] h-[58vw] w-[58vw] rounded-full bg-[radial-gradient(closest-side,rgba(201,79,43,0.17),transparent_70%)] blur-3xl animate-[aurora-a_26s_ease-in-out_infinite]" />
      <div className="absolute top-[28%] -right-[18%] h-[62vw] w-[62vw] rounded-full bg-[radial-gradient(closest-side,rgba(217,122,84,0.11),transparent_70%)] blur-3xl animate-[aurora-b_34s_ease-in-out_infinite]" />
      <div className="absolute -bottom-[28%] left-[22%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgba(122,70,48,0.16),transparent_70%)] blur-3xl animate-[aurora-c_42s_ease-in-out_infinite]" />
      <div className="absolute top-[6%] right-[18%] h-[32vw] w-[32vw] rounded-full bg-[radial-gradient(closest-side,rgba(244,241,236,0.055),transparent_70%)] blur-3xl animate-[aurora-b_34s_ease-in-out_infinite]" />
    </div>
  );
}
