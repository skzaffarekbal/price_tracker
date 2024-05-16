'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  priceHistory: { date: string; price: number | null }[];
}

function CustomTick({ x, y, payload }: any) {
  // Split the date and time
  const [date, time] = payload.value.split(' ');

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fontSize={12} textAnchor='middle' fill='#666'>
        {date}
      </text>
      <text x={0} y={20} dy={16} fontSize={12} textAnchor='middle' fill='#666'>
        {time}
      </text>
    </g>
  );
}

function CustomTooltip({ active, payload, label, mrp }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${
          payload[0].value ? 'bg-white' : 'bg-red-100'
        } p-4 rounded-lg border-gray-300 border-[1px]`}
      >
        <p className='label'>
          <span className='text-black opacity-50'>{label} : </span>
          <span className={payload[0].value ? 'text-[#8884d8]' : 'text-red-400'}>
            {payload[0].value ? payload[0].value + '/-' : 'Currently Unavailable'}
          </span>
        </p>
        <p>
          <span className='text-black opacity-50'>Discount : </span>
          <span className={payload[0].value ? 'text-[#8884d8]' : 'text-red-400'}>
            {payload[0].value && mrp ? Math.round(((mrp - payload[0].value) / mrp) * 100) + '%' : '0%'}
          </span>
        </p>
      </div>
    );
  }

  return null;
}

function PriceDateChart({ priceHistory }: Props) {
  return (
    <div className='w-full h-96 rounded-10 border-l-[3px] bg-white-100 px-5 py-8'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          width={500}
          height={300}
          data={priceHistory}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' tick={<CustomTick />} />
          <YAxis />
          <Tooltip content={<CustomTooltip mrp={priceHistory[0].price} />} />
          <Legend verticalAlign='top' height={32} />
          <Line
            type='monotone'
            dataKey='price'
            stroke='#8884d8'
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceDateChart;
