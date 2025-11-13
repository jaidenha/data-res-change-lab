// Case study data
const caseStudies = {
    saas: {
        icon: '🚀',
        title: 'SaaS Startup',
        overview: "You're pitching a B2B SaaS startup to a panel of Y Combinator partners. Your product helps mid-sized companies automate their workflow processes.",
        expectations: [
            'Questions about your customer acquisition strategy',
            'Deep dive into unit economics and revenue metrics',
            'Discussion of market size and competition',
            'Technical architecture and scalability questions'
        ],
        metrics: [
            'Monthly Recurring Revenue (MRR)',
            'Customer Acquisition Cost (CAC)',
            'Lifetime Value (LTV)',
            'Churn Rate'
        ],
        tips: [
            'Be ready to explain your product in one sentence',
            'Have specific numbers and growth metrics prepared',
            'Know your competitors and what makes you different',
            'Be honest about challenges and show how you\'ll overcome them'
        ]
    },
    healthtech: {
        icon: '🏥',
        title: 'HealthTech Innovation',
        overview: "You're presenting a healthcare technology solution that improves patient outcomes through AI-powered diagnostics. Navigate regulatory concerns while demonstrating impact.",
        expectations: [
            'FDA approval timeline and regulatory strategy',
            'Clinical validation and trial results',
            'Integration with existing healthcare systems',
            'Privacy and HIPAA compliance questions'
        ],
        metrics: [
            'Clinical accuracy rates',
            'Time to diagnosis improvement',
            'Cost savings per patient',
            'Number of healthcare providers onboarded'
        ],
        tips: [
            'Emphasize patient outcomes and safety',
            'Show understanding of healthcare regulations',
            'Demonstrate clinical validation with data',
            'Explain your go-to-market strategy for hospitals'
        ]
    },
    climatetech: {
        icon: '🌱',
        title: 'Climate Tech',
        overview: "You're pitching a climate technology solution that reduces carbon emissions for industrial manufacturers. Balance environmental impact with business viability.",
        expectations: [
            'Carbon reduction metrics and validation',
            'Scalability of the solution',
            'Cost comparison with traditional alternatives',
            'Partnership and deployment strategy'
        ],
        metrics: [
            'Tons of CO2 reduced per year',
            'Cost per ton of carbon reduction',
            'Payback period for customers',
            'Number of installations/deployments'
        ],
        tips: [
            'Lead with business case, not just environmental impact',
            'Show clear ROI for customers',
            'Explain competitive advantages',
            'Demonstrate technical feasibility'
        ]
    }
};

// Get case study from URL parameter
function getCaseStudyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('study') || 'saas';
}

// Populate the page with case study data
function populatePreview() {
    const studyKey = getCaseStudyFromURL();
    const study = caseStudies[studyKey] || caseStudies.saas;
    
    // Update icon and title
    document.getElementById('caseIcon').textContent = study.icon;
    document.getElementById('caseTitle').textContent = study.title;
    
    // Update overview
    document.getElementById('caseOverview').textContent = study.overview;
    
    // Update expectations list
    const expectationsList = document.getElementById('expectations');
    expectationsList.innerHTML = study.expectations.map(item => `<li>${item}</li>`).join('');
    
    // Update metrics list
    const metricsList = document.getElementById('metrics');
    metricsList.innerHTML = study.metrics.map(item => `<li>${item}</li>`).join('');
    
    // Update tips list
    const tipsList = document.getElementById('tips');
    tipsList.innerHTML = study.tips.map(item => `<li>${item}</li>`).join('');
    
    // Update the button to go to simulation with the case study parameter
    const startButton = document.getElementById('startSimulation');
    startButton.addEventListener('click', () => {
        window.location.href = `/simulation.html?study=${studyKey}`;
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', populatePreview);
