export default function TickerBar() {
  const items = [
    '20+ Bank Partners',
    'Free Credit Score Check',
    'Expert Assistance',
    'Quick Loan Approvals',
    'Best Interest Rates',
    'No Hidden Charges',
    'Trusted by 1M+ Users',
    'Secure & Confidential',
  ];

  const ticker = items.map((item) => (
    <span key={item} className="flex items-center gap-4 whitespace-nowrap">
      <span className="text-sm font-medium">{item}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
    </span>
  ));

  return (
    <div className="relative h-[52px] overflow-hidden bg-[#1B1F6B] text-white">
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#1B1F6B] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#1B1F6B] to-transparent" />
      <div className="flex h-full items-center">
        <div className="animate-marquee flex items-center gap-4">
          {ticker}
          {ticker}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
