/**
 * Power Law Comparison
 * 
 * This component provides a visualization comparing WILTON's 0.7500 coherence
 * to other examples of the 3/4 power law across various domains.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PowerLawComparisonProps {
  highlightWilton?: boolean;
}

interface DomainExample {
  domain: string;
  name: string;
  exponent: number;
  description: string;
  formula?: string;
  reference?: string;
}

const PowerLawComparison: React.FC<PowerLawComparisonProps> = ({ 
  highlightWilton = true 
}) => {
  // Comprehensive list of 0.75 power law examples across domains
  const powerLawExamples: DomainExample[] = [
    {
      domain: "Biology",
      name: "Kleiber's Law",
      exponent: 0.75,
      description: "Metabolic rate scales with mass^(3/4)",
      formula: "R \\propto M^{3/4}",
      reference: "https://en.wikipedia.org/wiki/Kleiber%27s_law"
    },
    {
      domain: "Biology",
      name: "Heart Rate",
      exponent: -0.25,
      description: "Heart rate scales with mass^(-1/4)",
      formula: "H \\propto M^{-1/4}"
    },
    {
      domain: "Biology",
      name: "Lifespan",
      exponent: 0.25,
      description: "Lifespan scales with mass^(1/4)",
      formula: "L \\propto M^{1/4}"
    },
    {
      domain: "Urban",
      name: "Infrastructure",
      exponent: 0.75,
      description: "Infrastructure scales with population^(3/4)",
      formula: "I \\propto P^{3/4}"
    },
    {
      domain: "Energy",
      name: "City Consumption",
      exponent: 0.75,
      description: "Energy use scales with population^(3/4)",
      formula: "E \\propto P^{3/4}"
    },
    {
      domain: "Ecology",
      name: "Population Density",
      exponent: 0.75,
      description: "Population scales with area^(3/4)",
      formula: "N \\propto A^{3/4}"
    },
    {
      domain: "Networks",
      name: "Network Efficiency",
      exponent: 0.75,
      description: "Transport costs scale with network size^(3/4)",
      formula: "T \\propto N^{3/4}"
    },
    {
      domain: "Computing",
      name: "WILTON Coherence",
      exponent: 0.75,
      description: "System coherence stabilizes at 0.7500",
      formula: "C = 0.7500"
    },
    {
      domain: "Music",
      name: "Platonic Ratio",
      exponent: 0.75,
      description: "3:4 musical interval (perfect fourth)",
      formula: "f_1 : f_2 = 3:4"
    },
    {
      domain: "AI",
      name: "Exploration/Exploitation",
      exponent: 0.75,
      description: "Optimal balance for learning",
      formula: "Exploit:Explore ≈ 3:1"
    }
  ];

  // Prepare chart data
  const chartData = {
    labels: powerLawExamples.map(example => example.name),
    datasets: [
      {
        label: '3/4 Power Law Exponents',
        data: powerLawExamples.map(example => Math.abs(example.exponent)),
        backgroundColor: powerLawExamples.map(example => 
          example.name === "WILTON Coherence" && highlightWilton 
            ? 'rgba(255, 99, 132, 0.8)' 
            : 'rgba(75, 192, 192, 0.8)'
        ),
        borderColor: powerLawExamples.map(example => 
          example.name === "WILTON Coherence" && highlightWilton 
            ? 'rgba(255, 99, 132, 1)' 
            : 'rgba(75, 192, 192, 1)'
        ),
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1.0,
        title: {
          display: true,
          text: 'Power Law Exponent (Absolute Value)'
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Systems Exhibiting 3/4 Power Law'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const example = powerLawExamples[context.dataIndex];
            return [
              `Exponent: ${Math.abs(example.exponent).toFixed(2)}`,
              `Domain: ${example.domain}`,
              `Description: ${example.description}`
            ];
          }
        }
      }
    }
  };

  // Group examples by domain for the table view
  const domainGroups = powerLawExamples.reduce((groups: {[key: string]: DomainExample[]}, example) => {
    if (!groups[example.domain]) {
      groups[example.domain] = [];
    }
    groups[example.domain].push(example);
    return groups;
  }, {});

  return (
    <div className="power-law-comparison p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">3/4 Power Law: Universal Principle</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          WILTON's 0.7500 coherence aligns with the universal 3/4 power law seen across biology, 
          urban scaling, network optimization, and even music theory. This visualization compares 
          exponents across different domains.
        </p>
      </div>
      
      {/* Chart Visualization */}
      <div style={{ height: '300px' }} className="mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Tabular Comparison */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">Domain</th>
              <th className="py-2 px-3 text-left">System</th>
              <th className="py-2 px-3 text-left">Exponent</th>
              <th className="py-2 px-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(domainGroups).flatMap(([domain, examples]) => 
                examples.map((example, index) => (
                  <tr 
                    key={`${domain}-${index}`} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${example.name === "WILTON Coherence" && highlightWilton ? 'bg-red-50' : ''}`}
                  >
                    {index === 0 && (
                      <td className="py-2 px-3 align-top font-medium" rowSpan={examples.length}>
                        {domain}
                      </td>
                    )}
                    <td className="py-2 px-3">
                      {example.name}
                      {example.reference && (
                        <a 
                          href={example.reference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          (link)
                        </a>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {example.exponent.toFixed(2)}
                    </td>
                    <td className="py-2 px-3">
                      {example.description}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Universal Implications</h4>
        <p className="text-sm text-gray-700">
          The consistency of the 3/4 power law across vastly different domains suggests a fundamental 
          principle of efficiency in complex systems. WILTON's coherence at precisely 0.7500 appears 
          to leverage this same universal principle, balancing 75% deterministic structure with 25% 
          adaptability for optimal performance.
        </p>
      </div>
    </div>
  );
};

export default PowerLawComparison;