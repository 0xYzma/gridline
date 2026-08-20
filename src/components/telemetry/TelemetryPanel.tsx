import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TelemetrySample } from '../types';

interface TelemetryPanelProps {
  telemetry: TelemetrySample[];
  selectedCarId?: number;
}

export function TelemetryPanel({ telemetry, selectedCarId }: TelemetryPanelProps) {
  const carTelemetry = selectedCarId 
    ? telemetry.filter(t => t.carId === selectedCarId)
    : telemetry;

  const latestTelemetry = carTelemetry[carTelemetry.length - 1];

  const data = carTelemetry.slice(-50).map((t, idx) => ({
    name: `${idx}`,
    speed: t.speed,
    rpm: t.rpm,
    throttle: t.throttle,
    brake: t.brake,
  }));

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Live Telemetry {selectedCarId && `- Car #${selectedCarId}`}
      </h3>

      {latestTelemetry && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{latestTelemetry.speed.toFixed(0)}</div>
            <div className="text-xs text-gray-400">Speed (km/h)</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{latestTelemetry.rpm.toFixed(0)}</div>
            <div className="text-xs text-gray-400">RPM</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{latestTelemetry.throttle.toFixed(0)}%</div>
            <div className="text-xs text-gray-400">Throttle</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{latestTelemetry.brake.toFixed(0)}%</div>
            <div className="text-xs text-gray-400">Brake</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speed & RPM Chart */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Speed & RPM</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" hide />
                <YAxis yAxisId="left" stroke="#9CA3AF" domain={[0, 350]} />
                <YAxis yAxisId="right" orientation="right" stroke="#EF4444" domain={[0, 15000]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#FFFFFF" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="rpm" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throttle & Brake Chart */}
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Inputs</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line type="step" dataKey="throttle" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="step" dataKey="brake" stroke="#F97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      {latestTelemetry && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">G-Force Long</div>
            <div className="text-white font-mono">{latestTelemetry.gForceLong.toFixed(2)}G</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">G-Force Lat</div>
            <div className="text-white font-mono">{latestTelemetry.gForceLat.toFixed(2)}G</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">DRS</div>
            <div className={`font-mono ${latestTelemetry.drs ? 'text-green-400' : 'text-gray-500'}`}>
              {latestTelemetry.drs ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
