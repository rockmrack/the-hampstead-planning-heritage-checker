/**
 * ROI Calculator Page
 * Interactive calculator showing project costs vs value increase
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ROI Calculator | Extension Value Calculator | The Hampstead Planning & Heritage Checker',
  description: 'Calculate the return on investment for your home extension project. See costs, value increase, and whether your project is worth doing in Hampstead, Highgate & NW London.',
  keywords: 'extension ROI calculator, loft conversion value, basement value increase, property value extension, Hampstead property value',
};

const PROJECT_TYPES = [
  { id: 'rear-extension-single', name: 'Single Storey Rear Extension', icon: '🏠' },
  { id: 'rear-extension-double', name: 'Double Storey Rear Extension', icon: '🏢' },
  { id: 'side-return', name: 'Side Return Extension', icon: '↔️' },
  { id: 'loft-conversion', name: 'Loft Conversion', icon: '🔺' },
  { id: 'basement', name: 'Basement Extension', icon: '⬇️' },
  { id: 'garden-room', name: 'Garden Room / Office', icon: '🌳' },
  { id: 'garage-conversion', name: 'Garage Conversion', icon: '🚗' },
  { id: 'wrap-around', name: 'Wrap-Around Extension', icon: '🔄' },
];

const SAMPLE_DATA = {
  'NW3': { label: 'Hampstead', pricePerSqFt: 1450, avgValue: 2500000 },
  'N6': { label: 'Highgate', pricePerSqFt: 1100, avgValue: 1800000 },
  'N10': { label: 'Muswell Hill', pricePerSqFt: 750, avgValue: 1200000 },
  'N8': { label: 'Crouch End', pricePerSqFt: 700, avgValue: 1100000 },
  'NW1': { label: 'Primrose Hill', pricePerSqFt: 1200, avgValue: 2200000 },
};

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-emerald-700 text-emerald-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Financial Planning Tool
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Extension ROI Calculator
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Calculate whether your extension project is worth the investment. 
              See realistic costs, estimated value increase, and net return.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Input Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Property Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Your Property</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., NW3 1AA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We use this to find local cost and value data
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Property Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <input
                        type="number"
                        placeholder="1,500,000"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your estimate or recent valuation
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heritage Status
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="GREEN">Not in conservation area</option>
                      <option value="AMBER">Conservation area</option>
                      <option value="RED">Listed building</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Heritage properties have higher build costs
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Project Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Your Project</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="">Select a project type...</option>
                      {PROJECT_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (optional)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Leave blank for typical size"
                        className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">sqm</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter custom size or we&apos;ll use typical dimensions
                    </p>
                  </div>
                  
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-lg transition-colors">
                    Calculate ROI
                  </button>
                </div>
              </div>
            </div>
            
            {/* Results Section (Sample) */}
            <div className="border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-semibold mb-8 text-center">Sample Results: Loft Conversion in NW3</h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Cost Card */}
                <div className="bg-red-50 rounded-xl p-6">
                  <div className="text-red-600 text-sm font-medium mb-2">Project Cost</div>
                  <div className="text-3xl font-bold text-red-700 mb-2">£75,000 - £100,000</div>
                  <ul className="text-sm text-red-600 space-y-1">
                    <li>• Construction: £65k-85k</li>
                    <li>• Professional fees: £8k-12k</li>
                    <li>• Other costs: £2k-3k</li>
                  </ul>
                </div>
                
                {/* Value Card */}
                <div className="bg-emerald-50 rounded-xl p-6">
                  <div className="text-emerald-600 text-sm font-medium mb-2">Value Increase</div>
                  <div className="text-3xl font-bold text-emerald-700 mb-2">£130,000 - £180,000</div>
                  <ul className="text-sm text-emerald-600 space-y-1">
                    <li>• +15% property value</li>
                    <li>• 40sqm new space</li>
                    <li>• £1,450/sqft area value</li>
                  </ul>
                </div>
                
                {/* ROI Card */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="text-blue-600 text-sm font-medium mb-2">Net Gain</div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">£55,000 - £80,000</div>
                  <div className="text-4xl font-bold text-blue-600 mt-2">+73% ROI</div>
                  <div className="text-sm text-blue-600 mt-2">✓ Worth doing</div>
                </div>
              </div>
              
              {/* Comparison Table */}
              <h3 className="text-xl font-semibold mb-4">Compare Alternative Projects</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Project Type</th>
                      <th className="px-4 py-3 font-medium text-right">Est. Cost</th>
                      <th className="px-4 py-3 font-medium text-right">Value Add</th>
                      <th className="px-4 py-3 font-medium text-right">ROI</th>
                      <th className="px-4 py-3 font-medium text-center">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-emerald-50">
                      <td className="px-4 py-3 font-medium">🔺 Loft Conversion</td>
                      <td className="px-4 py-3 text-right">£88k</td>
                      <td className="px-4 py-3 text-right">£155k</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">+76%</td>
                      <td className="px-4 py-3 text-center">⭐ Best ROI</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">↔️ Side Return</td>
                      <td className="px-4 py-3 text-right">£48k</td>
                      <td className="px-4 py-3 text-right">£65k</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">+35%</td>
                      <td className="px-4 py-3 text-center">✓ Good value</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">🏠 Rear Extension</td>
                      <td className="px-4 py-3 text-right">£58k</td>
                      <td className="px-4 py-3 text-right">£78k</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">+34%</td>
                      <td className="px-4 py-3 text-center">✓ Good value</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">⬇️ Basement</td>
                      <td className="px-4 py-3 text-right">£260k</td>
                      <td className="px-4 py-3 text-right">£310k</td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-600">+19%</td>
                      <td className="px-4 py-3 text-center">△ Consider carefully</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Area Data */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Property Values by Area</h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            {Object.entries(SAMPLE_DATA).map(([postcode, data]) => (
              <div key={postcode} className="bg-white rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">{postcode}</div>
                <div className="text-gray-600 mb-4">{data.label}</div>
                <div className="text-sm text-gray-500">Avg. value</div>
                <div className="font-semibold">£{(data.avgValue / 1000000).toFixed(1)}m</div>
                <div className="text-sm text-gray-500 mt-2">Price/sqft</div>
                <div className="font-semibold">£{data.pricePerSqFt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get a detailed feasibility report for your specific property, 
            including heritage status, planning likelihood, and recommended approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/check"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Check Your Property
            </Link>
            <Link
              href="/builders"
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-lg border-2 border-gray-200 transition-colors"
            >
              Find Local Builders
            </Link>
          </div>
        </div>
      </section>
      
      {/* Company Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            The Hampstead Planning & Heritage Checker is a free resource provided by
          </p>
          <h3 className="text-2xl font-bold mb-2">Pearson Architectural Design</h3>
          <p className="text-gray-400 mb-6">
            Award-winning architects specializing in heritage properties across NW London
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <span>📍 Hampstead, London</span>
            <span>📞 020 7123 4567</span>
            <span>✉️ info@pearsonarchitects.co.uk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
