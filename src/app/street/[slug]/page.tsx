import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { streetIntelligenceService } from '@/lib/services/street-intelligence';
import { getAllStreetSlugs } from '@/lib/data/streets';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp, Home, MapPin, History } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllStreetSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const streetData = await streetIntelligenceService.getStreetData(params.slug);

  if (!streetData) {
    return {
      title: 'Street Not Found',
    };
  }

  return {
    title: `Planning Permission & Property History for ${streetData.name}, ${streetData.postcode}`,
    description: `Detailed planning history, approval rates, and property insights for ${streetData.name} in ${streetData.borough}. See what neighbors have built.`,
  };
}

export default async function StreetPage({ params }: PageProps) {
  const streetData = await streetIntelligenceService.getStreetData(params.slug);

  if (!streetData) {
    notFound();
  }

  const { analysis, marketData, localKnowledge } = streetData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/areas" className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Areas
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  {streetData.borough}
                </span>
                {streetData.conservationArea && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    {streetData.conservationArea} Conservation Area
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {streetData.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {streetData.postcode} • Planning History & Property Intelligence
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm text-gray-500">Average Value</div>
              <div className="text-2xl font-bold text-gray-900">
                £{marketData.averageSoldPrice1Year.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-emerald-600 flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" />
                +{marketData.priceGrowth5Year.toFixed(1)}% (5yr)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Planning Analysis */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Planning Approval Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {analysis.approvalRate.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Approval Rate</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {analysis.totalApplications}
                  </div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {analysis.averageDecisionTime.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Days to Decision</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Most Common Projects</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.mostCommonProjects.map((project, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100">
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Planning Insights</h3>
                  <div className="space-y-3">
                    {analysis.insights.map((insight, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${
                        insight.type === 'success_pattern' ? 'bg-emerald-50 border-emerald-100' :
                        insight.type === 'warning' ? 'bg-red-50 border-red-100' :
                        'bg-blue-50 border-blue-100'
                      }`}>
                        <div className="font-medium text-gray-900 mb-1">{insight.title}</div>
                        <div className="text-sm text-gray-600">{insight.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Applications */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Recent Applications
              </h2>
              
              <div className="space-y-4">
                {analysis.precedents.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                    <div className={`mt-1 min-w-[24px] ${
                      app.decision === 'approved' ? 'text-emerald-500' : 
                      app.decision === 'refused' ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {app.decision === 'approved' ? <CheckCircle className="w-6 h-6" /> : 
                       app.decision === 'refused' ? <XCircle className="w-6 h-6" /> : 
                       <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{app.address}</span>
                        <span className="text-xs text-gray-500">• {app.decisionDate}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {app.applicationType}
                        </span>
                        {app.extensionDepth && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {app.extensionDepth}m depth
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8">
            
            {/* Local Knowledge */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Local Knowledge
              </h2>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-1">History</div>
                  <p className="text-gray-600 leading-relaxed">{localKnowledge.history}</p>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">Architecture</div>
                  <p className="text-gray-600 leading-relaxed">{localKnowledge.architecturalStyle}</p>
                </div>

                {localKnowledge.famousResidents && localKnowledge.famousResidents.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Notable Residents</div>
                    <ul className="list-disc list-inside text-gray-600">
                      {localKnowledge.famousResidents.map((resident, i) => (
                        <li key={i}>{resident}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <div className="font-medium text-gray-900 mb-1">Transport</div>
                  <div className="flex flex-wrap gap-2">
                    {localKnowledge.nearestTransport.map((station, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {station}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Planning a Project Here?</h3>
              <p className="text-emerald-100 text-sm mb-6">
                Get a detailed feasibility report for your specific property on {streetData.name}.
              </p>
              <Link 
                href={`/?address=${encodeURIComponent(streetData.name + ', ' + streetData.postcode)}`}
                className="block w-full bg-white text-emerald-900 text-center font-medium py-3 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Check My Property
              </Link>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
