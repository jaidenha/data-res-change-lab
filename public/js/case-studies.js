// Case study data
const caseStudies = {
    template1: {
        icon: '�',
        title: 'Template 1',
        overview: "[Add scenario description here. Example: You're pitching a [TYPE OF PRODUCT/SERVICE] to [TARGET AUDIENCE]. Your solution helps [BENEFIT].]",
        expectations: [
            '[Expected question or topic 1]',
            '[Expected question or topic 2]',
            '[Expected question or topic 3]',
            '[Expected question or topic 4]'
        ],
        metrics: [
            '[Key metric 1]',
            '[Key metric 2]',
            '[Key metric 3]',
            '[Key metric 4]'
        ],
        tips: [
            '[Preparation tip 1]',
            '[Preparation tip 2]',
            '[Preparation tip 3]',
            '[Preparation tip 4]'
        ]
    },
    template2: {
        icon: '📋',
        title: 'Template 2',
        overview: "[Add scenario description here. Example: You're pitching a [TYPE OF PRODUCT/SERVICE] to [TARGET AUDIENCE]. Your solution helps [BENEFIT].]",
        expectations: [
            '[Expected question or topic 1]',
            '[Expected question or topic 2]',
            '[Expected question or topic 3]',
            '[Expected question or topic 4]'
        ],
        metrics: [
            '[Key metric 1]',
            '[Key metric 2]',
            '[Key metric 3]',
            '[Key metric 4]'
        ],
        tips: [
            '[Preparation tip 1]',
            '[Preparation tip 2]',
            '[Preparation tip 3]',
            '[Preparation tip 4]'
        ]
    },
    template3: {
        icon: '📋',
        title: 'Template 3',
        overview: "[Add scenario description here. Example: You're pitching a [TYPE OF PRODUCT/SERVICE] to [TARGET AUDIENCE]. Your solution helps [BENEFIT].]",
        expectations: [
            '[Expected question or topic 1]',
            '[Expected question or topic 2]',
            '[Expected question or topic 3]',
            '[Expected question or topic 4]'
        ],
        metrics: [
            '[Key metric 1]',
            '[Key metric 2]',
            '[Key metric 3]',
            '[Key metric 4]'
        ],
        tips: [
            '[Preparation tip 1]',
            '[Preparation tip 2]',
            '[Preparation tip 3]',
            '[Preparation tip 4]'
        ]
    }
};

// Get case study from URL parameter
function getCaseStudyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('study') || 'template1';
}

// Populate the page with case study data
function populatePreview() {
    const studyKey = getCaseStudyFromURL();
    const study = caseStudies[studyKey] || caseStudies.template1;
    
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
