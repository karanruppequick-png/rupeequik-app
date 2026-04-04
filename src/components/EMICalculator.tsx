'use client';

import { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const banks = ['HDFC', 'ICICI', 'Axis', 'Kotak', 'More'];

const quickAmounts = [
  { label: '1L', value: 100000 },
  { label: '5L', value: 500000 },
  { label: '10L', value: 1000000 },
  { label: '25L', value: 2500000 },
  { label: '50L', value: 5000000 },
];

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function EMICalculator() {
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [tenureValue, setTenureValue] = useState(5);
  const [tenureUnit, setTenureUnit] = useState<'Yr' | 'Mo'>('Yr');

  const tenureMonths = tenureUnit === 'Yr' ? tenureValue * 12 : tenureValue;

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = tenureMonths;
    if (r === 0) {
      const emi = loanAmount / n;
      return { emi, totalInterest: 0, totalPayment: loanAmount };
    }
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    return { emi, totalInterest, totalPayment };
  }, [loanAmount, rate, tenureMonths]);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-[#1B1F6B] md:text-3xl">
          Calculate Your <span className="text-[#F59E0B]">EMI</span>
        </h2>
        <p className="mb-8 text-sm text-gray-500">
          Plan your finances with our easy-to-use EMI calculator.
        </p>

        {/* Bank pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {banks.map((bank) => (
            <button
              key={bank}
              onClick={() => setSelectedBank(bank)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                selectedBank === bank
                  ? 'bg-[#1B1F6B] text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:border-[#1B1F6B] hover:text-[#1B1F6B]'
              }`}
            >
              {bank}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left - sliders */}
          <div className="flex flex-col gap-8">
            {/* Loan Amount */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                <span className="text-sm font-bold text-[#1B1F6B]">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#1B1F6B]"
              />
              <div className="mt-2 flex justify-between text-[11px] text-gray-400">
                <span>50K</span>
                <span>50L</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setLoanAmount(q.value)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      loanAmount === q.value
                        ? 'bg-[#1B1F6B] text-white'
                        : 'border border-gray-300 text-gray-600 hover:border-[#1B1F6B]'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate of Interest */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Rate of Interest</label>
                <span className="text-sm font-bold text-[#1B1F6B]">{rate}%</span>
              </div>
              <input
                type="range"
                min={8}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#1B1F6B]"
              />
              <div className="mt-2 flex justify-between text-[11px] text-gray-400">
                <span>8%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1B1F6B]">
                    {tenureValue} {tenureUnit === 'Yr' ? (tenureValue === 1 ? 'Year' : 'Years') : (tenureValue === 1 ? 'Month' : 'Months')}
                  </span>
                  <div className="ml-2 flex rounded-md border border-gray-300 text-xs">
                    {(['Mo', 'Yr'] as const).map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          if (unit !== tenureUnit) {
                            setTenureUnit(unit);
                            setTenureValue(unit === 'Yr' ? 5 : 60);
                          }
                        }}
                        className={`px-3 py-1 font-medium transition-colors ${
                          tenureUnit === unit
                            ? 'bg-[#1B1F6B] text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={tenureUnit === 'Yr' ? 1 : 1}
                max={tenureUnit === 'Yr' ? 10 : 120}
                step={1}
                value={tenureValue}
                onChange={(e) => setTenureValue(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#1B1F6B]"
              />
              <div className="mt-2 flex justify-between text-[11px] text-gray-400">
                <span>{tenureUnit === 'Yr' ? '1 Yr' : '1 Mo'}</span>
                <span>{tenureUnit === 'Yr' ? '10 Yr' : '120 Mo'}</span>
              </div>
            </div>
          </div>

          {/* Right - results panel */}
          <div className="rounded-2xl border border-gray-200 bg-[#F8F9FF] p-6">
            <h3 className="mb-6 text-sm font-semibold text-gray-500">
              {selectedBank} Bank - EMI Breakdown
            </h3>

            <div className="mb-2 text-center">
              <p className="text-xs text-gray-500">Monthly EMI</p>
              <p className="text-3xl font-extrabold text-[#1B1F6B]">{formatCurrency(Math.round(emi))}</p>
            </div>

            <div className="my-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm text-gray-600">Principal Amount</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm text-gray-600">Total Interest</span>
                <span className="text-sm font-bold text-[#F59E0B]">{formatCurrency(Math.round(totalInterest))}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm text-gray-600">Total Payment</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(Math.round(totalPayment))}</span>
              </div>
            </div>

            <Link
              href="/get-started"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B1F6B] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2A2F8A]"
            >
              Get Instant Loan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
