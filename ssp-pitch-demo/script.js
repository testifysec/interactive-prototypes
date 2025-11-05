// Global state management
let currentPhase = 0;
let demoState = {
    signupCompleted: false,
    githubInstalled: false,
    gitlabInstalled: false,
    reposLoaded: false,
    preselectedRepos: [],
    guidanceShown: false,
    productCreated: false,
    sspGenerated: false
};

// Sample data for demonstrations
const sampleRepos = [
    { name: 'web-app', description: 'Main web application', language: 'JavaScript', stars: 24 },
    { name: 'api-service', description: 'Backend API service', language: 'Python', stars: 12 },
    { name: 'mobile-app', description: 'Mobile application', language: 'React Native', stars: 8 },
    { name: 'infrastructure', description: 'Terraform infrastructure', language: 'HCL', stars: 5 },
    { name: 'docs', description: 'Documentation site', language: 'Markdown', stars: 3 }
];

// Utility functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    document.getElementById(pageId).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLoadingOverlay(title, subtitle) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingTitle').textContent = title;
    document.getElementById('loadingSubtext').textContent = subtitle;
    overlay.classList.remove('hidden');
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Navigation functions
function startDemo() {
    currentPhase = 1;
    showPage('phase1');
}

function goToLanding() {
    currentPhase = 0;
    showPage('landing');
}

function goToPhase(phase) {
    currentPhase = phase;
    showPage(`phase${phase}`);
    
    // Initialize Phase 3 with repositories visible
    if (phase === 3) {
        populateRepositoryChecklist();
    }
    
    // Auto-start SSP generation when entering Phase 4
    if (phase === 4) {
        setTimeout(() => {
            startSSPGeneration();
        }, 800); // Small delay to let the page load
    }
}

function nextPhase() {
    if (currentPhase < 4) {
        currentPhase++;
        showPage(`phase${currentPhase}`);
        
        // Initialize Phase 3 with repositories visible
        if (currentPhase === 3) {
            populateRepositoryChecklist();
        }
        
        // Auto-start SSP generation when entering Phase 4
        if (currentPhase === 4) {
            setTimeout(() => {
                startSSPGeneration();
            }, 800); // Small delay to let the page load
        }
    }
}

// Phase 1: Signup & Organization Setup
function simulateGitHubAuth() {
    showLoadingOverlay('Authenticating with GitHub...', 'Redirecting to GitHub OAuth');
    
    setTimeout(() => {
        // Simulate GitHub metadata detection
        const orgInput = document.getElementById('org-name');
        const autoDetectBadge = document.getElementById('autoDetect');
        
        orgInput.value = 'TestifySec Inc.';
        autoDetectBadge.classList.remove('hidden');
        
        hideLoadingOverlay();
        
        // Show completion animation
        setTimeout(() => {
            completeSignup();
        }, 1500);
    }, 2000);
}

function simulateGitLabAuth() {
    showLoadingOverlay('Authenticating with GitLab...', 'Redirecting to GitLab OAuth');
    
    setTimeout(() => {
        // Simulate GitLab metadata detection
        const orgInput = document.getElementById('org-name');
        const autoDetectBadge = document.getElementById('autoDetect');
        
        orgInput.value = 'TestifySec Inc.';
        autoDetectBadge.classList.remove('hidden');
        autoDetectBadge.textContent = '✨ Auto-detected from GitLab';
        
        hideLoadingOverlay();
        
        // Show completion animation
        setTimeout(() => {
            completeSignup();
        }, 1500);
    }, 2000);
}

function completeSignup() {
    demoState.signupCompleted = true;
    showLoadingOverlay('Creating your account...', 'Setting up your organization');
    
    setTimeout(() => {
        hideLoadingOverlay();
        nextPhase();
    }, 1500);
}

// Phase 2: Integration Installation
function simulateGitHubInstall() {
    demoState.githubInstalled = true;
    showLoadingOverlay('Installing GitHub App...', 'Requesting repository permissions');
    
    setTimeout(() => {
        showLoadingOverlay('Installation successful!', 'Loading your repositories...');
        
        setTimeout(() => {
            hideLoadingOverlay();
            
            // Update GitHub status and button
            updateIntegrationStatus('github');
            
            // Show repo list if not already visible
            document.getElementById('repoList').classList.remove('hidden');
            document.getElementById('loadingRepos').classList.remove('hidden');
            
            // Simulate loading repositories
            setTimeout(() => {
                loadRepositories();
            }, 1000);
        }, 1000);
    }, 2500);
}

function simulateGitLabInstall() {
    demoState.gitlabInstalled = true;
    showLoadingOverlay('Installing GitLab App...', 'Requesting repository permissions');
    
    setTimeout(() => {
        showLoadingOverlay('Installation successful!', 'Loading your repositories...');
        
        setTimeout(() => {
            hideLoadingOverlay();
            
            // Update GitLab status and button
            updateIntegrationStatus('gitlab');
            
            // Show repo list if not already visible
            document.getElementById('repoList').classList.remove('hidden');
            document.getElementById('loadingRepos').classList.remove('hidden');
            
            // Simulate loading repositories (merge with existing)
            setTimeout(() => {
                loadRepositories();
            }, 1000);
        }, 1000);
    }, 2500);
}

function updateIntegrationStatus(provider) {
    const statusElement = document.getElementById(`${provider}Status`);
    const buttonElement = document.getElementById(`${provider}InstallBtn`);
    const sidebarButton = document.getElementById(`sidebar${provider.charAt(0).toUpperCase() + provider.slice(1)}Btn`);
    
    if (statusElement && buttonElement) {
        statusElement.textContent = 'Connected';
        statusElement.classList.add('connected');
        
        buttonElement.textContent = '✓ Connected';
        buttonElement.classList.add('completed');
        buttonElement.disabled = true;
    }
    
    // Update sidebar button
    if (sidebarButton) {
        sidebarButton.textContent = `✓ ${provider.charAt(0).toUpperCase() + provider.slice(1)} Connected`;
        sidebarButton.classList.add('completed');
        sidebarButton.disabled = true;
    }
    
    // Check if we should animate the next step button
    checkAndAnimateNextStep();
}

function checkAndAnimateNextStep() {
    // For Phase 2: animate next step if either GitHub or GitLab is installed
    if (currentPhase === 2 && (demoState.githubInstalled || demoState.gitlabInstalled)) {
        const nextBtn = document.getElementById('phase3NextBtn');
        if (nextBtn) {
            nextBtn.classList.add('next-step-animated');
        }
    }
    
    // For Phase 3: animate next step if guidance was shown
    if (currentPhase === 3 && demoState.guidanceShown) {
        const nextBtn = document.getElementById('phase4NextBtn');
        if (nextBtn) {
            nextBtn.classList.add('next-step-animated');
        }
    }
}

function loadRepositories() {
    const reposContainer = document.getElementById('repos');
    const loadingDiv = document.getElementById('loadingRepos');
    const repoCountSpan = document.getElementById('repoCount');
    
    // Hide loading, show repos
    loadingDiv.classList.add('hidden');
    repoCountSpan.textContent = sampleRepos.length;
    
    // Add repositories with staggered animation
    sampleRepos.forEach((repo, index) => {
        setTimeout(() => {
            const repoElement = createRepoElement(repo);
            reposContainer.appendChild(repoElement);
        }, index * 200);
    });
    
    // Add selection controls after all repos are loaded
    setTimeout(() => {
        addRepoSelectionControls();
    }, sampleRepos.length * 200 + 500);
    
    demoState.reposLoaded = true;
}

function addRepoSelectionControls() {
    const repoList = document.getElementById('repoList');
    
    // Add selection controls
    const selectionControls = document.createElement('div');
    selectionControls.className = 'repo-selection-controls';
    selectionControls.innerHTML = `
        <div class="selection-summary">
            <span id="selectedCount">0</span> repositories selected
        </div>
        <div class="selection-actions">
            <button class="selection-btn" onclick="selectAllRepos()">Select All</button>
            <button class="selection-btn" onclick="clearRepoSelection()">Clear</button>
        </div>
        <div class="continue-section hidden" id="continueSection">
            <button class="primary-btn continue-btn" onclick="continueWithSelectedRepos()">
                Continue with Selected Repositories →
            </button>
            <p class="continue-help">Create product with pre-selected repositories</p>
        </div>
    `;
    
    repoList.appendChild(selectionControls);
}

function updateRepoSelection() {
    const checkboxes = document.querySelectorAll('#repos input[type="checkbox"]');
    const selectedRepos = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedCountSpan = document.getElementById('selectedCount');
    const continueSection = document.getElementById('continueSection');
    
    // Update state
    demoState.preselectedRepos = selectedRepos;
    
    // Update UI
    if (selectedCountSpan) {
        selectedCountSpan.textContent = selectedRepos.length;
    }
    
    // Show/hide continue button
    if (continueSection) {
        if (selectedRepos.length > 0) {
            continueSection.classList.remove('hidden');
        } else {
            continueSection.classList.add('hidden');
        }
    }
}

function selectAllRepos() {
    const checkboxes = document.querySelectorAll('#repos input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateRepoSelection();
}

function clearRepoSelection() {
    const checkboxes = document.querySelectorAll('#repos input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateRepoSelection();
}

function continueWithSelectedRepos() {
    if (demoState.preselectedRepos.length === 0) return;
    
    // Go to Phase 3 with pre-selected repositories
    currentPhase = 3;
    showPage('phase3');
    
    // Initialize Phase 3 with repositories and pre-select the chosen ones
    setTimeout(() => {
        populateRepositoryChecklist();
        preSelectRepositories(demoState.preselectedRepos);
    }, 100);
}

function preSelectRepositories(selectedRepoNames) {
    const checkboxes = document.querySelectorAll('#repoChecklist input[type="checkbox"]');
    
    // Clear all selections first
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Select the pre-selected repositories
    selectedRepoNames.forEach(repoName => {
        const checkbox = Array.from(checkboxes).find(cb => cb.value === repoName);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Update the selection count and validate form
    updateSelectedCount();
    validateProductForm();
    
    // Show helpful animation for pre-selected items
    setTimeout(() => {
        selectedRepoNames.forEach(repoName => {
            const checkbox = Array.from(checkboxes).find(cb => cb.value === repoName);
            if (checkbox) {
                checkbox.parentElement.classList.add('auto-selected');
                setTimeout(() => {
                    checkbox.parentElement.classList.remove('auto-selected');
                }, 2000);
            }
        });
    }, 500);
}

function generateAutoProduct(selectedRepos) {
    // Smart product generation based on repository patterns
    const repoTypes = {
        frontend: selectedRepos.filter(name => ['web-app', 'mobile-app'].includes(name)),
        backend: selectedRepos.filter(name => ['api-service'].includes(name)),
        infrastructure: selectedRepos.filter(name => ['infrastructure'].includes(name)),
        docs: selectedRepos.filter(name => ['docs'].includes(name))
    };
    
    let productName = '';
    let productDescription = '';
    
    if (repoTypes.frontend.length > 0 && repoTypes.backend.length > 0) {
        productName = 'Customer Portal Platform';
        productDescription = 'Web application and API service for customer-facing portal with mobile support and infrastructure automation.';
    } else if (repoTypes.infrastructure.length > 0) {
        productName = 'Core Infrastructure System';
        productDescription = 'Backend services and deployment infrastructure with automated provisioning and monitoring capabilities.';
    } else if (repoTypes.docs.length > 0) {
        productName = 'Developer Documentation Hub';
        productDescription = 'Internal and external documentation system with automated content generation and version control.';
    } else {
        productName = 'Custom Application System';
        productDescription = `System comprising ${selectedRepos.join(', ')} repositories for comprehensive compliance coverage.`;
    }
    
    return { name: productName, description: productDescription, repositories: selectedRepos };
}

function createRepoElement(repo) {
    const repoDiv = document.createElement('div');
    repoDiv.className = 'repo-item selectable-repo';
    repoDiv.innerHTML = `
        <label class="repo-selector">
            <input type="checkbox" value="${repo.name}" onchange="updateRepoSelection()">
            <div class="repo-content">
                <div class="repo-info">
                    <h4>${repo.name}</h4>
                    <p>${repo.description}</p>
                </div>
                <div class="repo-meta">
                    <span class="language-tag">${repo.language}</span>
                    <span class="stars">⭐ ${repo.stars}</span>
                </div>
            </div>
        </label>
    `;
    return repoDiv;
}

// Phase 3: Product Creation
function showNamingGuidance() {
    // Check if guidance panel already exists
    let guidancePanel = document.querySelector('.guidance-drawer');
    
    if (!guidancePanel) {
        // Create guidance drawer
        guidancePanel = document.createElement('div');
        guidancePanel.className = 'guidance-drawer';
        guidancePanel.innerHTML = `
            <div class="guidance-overlay" onclick="closeNamingGuidance()"></div>
            <div class="guidance-panel">
                <div class="guidance-header">
                    <div class="guidance-title">
                        <div class="docs-icon">📚</div>
                        <h3>Documentation & Guidance</h3>
                    </div>
                    <button class="guidance-close" onclick="closeNamingGuidance()">&times;</button>
                </div>
                <div class="guidance-content">
                    <div class="guidance-breadcrumb">
                        <span>Product Creation</span> > <span>Naming Guidance</span>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>What makes a good product name?</h4>
                        <ul>
                            <li><strong>Descriptive:</strong> Clearly indicates the system's purpose</li>
                            <li><strong>Specific:</strong> Distinguishes from other systems</li>
                            <li><strong>Business-focused:</strong> Uses terms your organization understands</li>
                        </ul>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>Examples based on your repositories:</h4>
                        <div class="examples-grid">
                            <div class="example-card selectable" onclick="selectExample('Customer Portal Platform', 'Web application and API service for customer-facing portal with mobile support and infrastructure automation.', ['web-app', 'api-service', 'mobile-app'])">
                                <div class="example-name">Customer Portal Platform</div>
                                <div class="example-repos">web-app, api-service, mobile-app</div>
                                <div class="example-desc">Customer-facing web and mobile applications</div>
                                <div class="select-indicator">Click to use this example</div>
                            </div>
                            <div class="example-card selectable" onclick="selectExample('Core Infrastructure System', 'Backend services and deployment infrastructure with automated provisioning and monitoring capabilities.', ['infrastructure', 'api-service'])">
                                <div class="example-name">Core Infrastructure System</div>
                                <div class="example-repos">infrastructure, api-service</div>
                                <div class="example-desc">Backend services and deployment infrastructure</div>
                                <div class="select-indicator">Click to use this example</div>
                            </div>
                            <div class="example-card selectable" onclick="selectExample('Developer Documentation Hub', 'Internal and external documentation system with automated content generation and version control.', ['docs'])">
                                <div class="example-name">Developer Documentation Hub</div>
                                <div class="example-repos">docs</div>
                                <div class="example-desc">Internal and external documentation system</div>
                                <div class="select-indicator">Click to use this example</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="guidance-section">
                        <h4>Repository Selection Tips:</h4>
                        <ul>
                            <li><strong>Group by function:</strong> Repositories that work together to deliver a service</li>
                            <li><strong>Consider compliance scope:</strong> What needs to be covered in your SSP?</li>
                            <li><strong>Start small:</strong> You can always create additional products later</li>
                        </ul>
                    </div>
                    
                    <div class="guidance-section">
                        <div class="help-note">
                            <div class="help-note-icon">💡</div>
                            <div>
                                <strong>Need more help?</strong><br>
                                This documentation drawer provides contextual guidance throughout your TestifySec Platform experience.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append to the screen content area instead of body
        const screenContent = document.querySelector('#phase3 .screen-content');
        if (screenContent) {
            screenContent.appendChild(guidancePanel);
        } else {
            document.body.appendChild(guidancePanel);
        }
    }
    
    // Show the drawer with slide-in animation
    guidancePanel.classList.add('active');
    
    // Update state to track that guidance was shown
    demoState.guidanceShown = true;
    updateGuidanceButton();
    checkAndAnimateNextStep();
}

function selectExample(name, description, repositories) {
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    
    // Populate form with selected example
    productName.value = name;
    productDescription.value = description;
    
    // Select the specified repositories
    const checkboxes = document.querySelectorAll('#repoChecklist input[type="checkbox"]');
    const repoLabels = document.querySelectorAll('#repoChecklist .repo-checkbox-label');
    
    // Clear all selections first
    checkboxes.forEach(checkbox => checkbox.checked = false);
    repoLabels.forEach(label => label.classList.remove('auto-selected'));
    
    // Select matching repositories with visual feedback
    repositories.forEach(repoName => {
        const checkbox = Array.from(checkboxes).find(cb => cb.value === repoName);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.parentElement.classList.add('auto-selected');
            
            // Remove visual feedback after a delay
            setTimeout(() => {
                checkbox.parentElement.classList.remove('auto-selected');
            }, 2000);
        }
    });
    
    updateSelectedCount();
    validateProductForm();
    
    // Update guidance button state
    demoState.guidanceShown = true;
    updateGuidanceButton();
    checkAndAnimateNextStep();
    
    // Close the drawer
    closeNamingGuidance();
}

function closeNamingGuidance() {
    const guidanceDrawer = document.querySelector('.guidance-drawer');
    if (guidanceDrawer) {
        guidanceDrawer.classList.remove('active');
    }
}

function populateExampleData() {
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    
    // Populate with example data
    productName.value = 'Customer Portal Platform';
    productDescription.value = 'Web application and API service for customer-facing portal with mobile support and infrastructure automation.';
    
    // Auto-select 2-3 most relevant repositories
    const checkboxes = document.querySelectorAll('#repoChecklist input[type="checkbox"]');
    if (checkboxes.length >= 3) {
        checkboxes[0].checked = true; // web-app
        checkboxes[1].checked = true; // api-service
        checkboxes[2].checked = true; // mobile-app
        
        // Add visual feedback for auto-selection
        checkboxes[0].parentElement.classList.add('auto-selected');
        checkboxes[1].parentElement.classList.add('auto-selected');
        checkboxes[2].parentElement.classList.add('auto-selected');
        
        setTimeout(() => {
            checkboxes[0].parentElement.classList.remove('auto-selected');
            checkboxes[1].parentElement.classList.remove('auto-selected');
            checkboxes[2].parentElement.classList.remove('auto-selected');
        }, 2000);
    }
    
    updateSelectedCount();
    validateProductForm();
}

function updateGuidanceButton() {
    const sidebarButton = document.getElementById('guidanceBtn');
    if (sidebarButton) {
        // Don't disable the button - allow reopening
        sidebarButton.textContent = '📚 View Naming Guidance';
        sidebarButton.classList.add('completed');
    }
}

function populateRepositoryChecklist() {
    const checklist = document.getElementById('repoChecklist');
    checklist.innerHTML = '';
    
    sampleRepos.forEach(repo => {
        const checklistItem = document.createElement('div');
        checklistItem.className = 'repo-checkbox-item';
        checklistItem.innerHTML = `
            <label class="repo-checkbox-label">
                <input type="checkbox" value="${repo.name}" onchange="updateSelectedCount(); validateProductForm();">
                <div class="repo-checkbox-info">
                    <h4>${repo.name}</h4>
                    <p>${repo.description}</p>
                    <div class="repo-meta">
                        <span class="language-tag">${repo.language}</span>
                        <span class="stars">⭐ ${repo.stars}</span>
                    </div>
                </div>
            </label>
        `;
        checklist.appendChild(checklistItem);
    });
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('#repoChecklist input[type="checkbox"]:checked');
    const countSpan = document.querySelector('.selected-count');
    const count = checkboxes.length;
    countSpan.textContent = `${count} selected`;
}

function filterRepositories() {
    const searchInput = document.getElementById('repoSearch');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const repoItems = document.querySelectorAll('#repoChecklist .repo-checkbox-item');
    
    repoItems.forEach(item => {
        const repoName = item.querySelector('h4').textContent.toLowerCase();
        const repoDesc = item.querySelector('p').textContent.toLowerCase();
        const repoLanguage = item.querySelector('.language-tag').textContent.toLowerCase();
        
        const matchesSearch = repoName.includes(searchTerm) || 
                             repoDesc.includes(searchTerm) || 
                             repoLanguage.includes(searchTerm);
        
        if (matchesSearch || searchTerm === '') {
            item.style.display = 'block';
            item.style.opacity = '1';
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
    
    // Show no results message if needed
    const visibleItems = Array.from(repoItems).filter(item => item.style.display !== 'none');
    let noResultsMessage = document.getElementById('noResultsMessage');
    
    if (visibleItems.length === 0 && searchTerm !== '') {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.id = 'noResultsMessage';
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div class="text-center py-8 text-slate-500">
                    <p>No repositories found matching "${searchTerm}"</p>
                    <p class="text-sm mt-2">Try searching by name, description, or language</p>
                </div>
            `;
            document.getElementById('repoChecklist').appendChild(noResultsMessage);
        }
        noResultsMessage.style.display = 'block';
    } else if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
}

function validateProductForm() {
    const productName = document.getElementById('product-name').value.trim();
    const selectedRepos = document.querySelectorAll('#repoChecklist input[type="checkbox"]:checked');
    const createButton = document.getElementById('createProductBtn');
    
    if (productName && selectedRepos.length > 0) {
        createButton.disabled = false;
        createButton.classList.remove('disabled');
    } else {
        createButton.disabled = true;
        createButton.classList.add('disabled');
    }
}

function createProduct() {
    const productName = document.getElementById('product-name').value;
    const selectedRepos = Array.from(document.querySelectorAll('#repoChecklist input[type="checkbox"]:checked'))
                               .map(cb => cb.value);
    
    if (!productName || selectedRepos.length === 0) {
        return;
    }
    
    showLoadingOverlay('Creating Product...', `Setting up "${productName}" with ${selectedRepos.length} repositories`);
    
    setTimeout(() => {
        demoState.productCreated = true;
        hideLoadingOverlay();
        nextPhase();
    }, 2000);
}

// Phase 4: SSP Generation
function startSSPGeneration() {
    const thinkingState = document.getElementById('thinkingState');
    const completedState = document.getElementById('completedState');
    
    // Reset states
    thinkingState.classList.remove('hidden');
    completedState.classList.add('hidden');
    
    // Start AI agent simulation
    simulateAIAgent();
}

function simulateAIAgent() {
    const activities = [
        { text: 'Analyzing repository structure and dependencies...', progress: 15 },
        { text: 'Scanning code for security controls and frameworks...', progress: 30 },
        { text: 'Identifying compliance mappings and requirements...', progress: 45 },
        { text: 'Generating control implementation evidence...', progress: 60 },
        { text: 'Cross-referencing with compliance standards...', progress: 75 },
        { text: 'Compiling SSP documentation and artifacts...', progress: 90 },
        { text: 'Finalizing report and recommendations...', progress: 100 }
    ];
    
    let currentStep = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const activityStatus = document.getElementById('activityStatus');
    const logEntries = document.querySelector('.log-entries');
    
    function updateProgress() {
        if (currentStep < activities.length) {
            const activity = activities[currentStep];
            
            // Update status and progress with smooth transitions
            activityStatus.style.opacity = '0.5';
            setTimeout(() => {
                activityStatus.textContent = activity.text;
                activityStatus.style.opacity = '1';
            }, 200);
            
            progressFill.style.width = `${activity.progress}%`;
            progressText.textContent = `${activity.progress}%`;
            
            // Add log entry with fade-in animation
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.style.opacity = '0';
            logEntry.style.transform = 'translateY(10px)';
            logEntry.innerHTML = `
                <span class="log-time">${new Date().toLocaleTimeString()}</span>
                <span class="log-message">${activity.text}</span>
            `;
            logEntries.appendChild(logEntry);
            
            // Animate log entry in
            setTimeout(() => {
                logEntry.style.transition = 'all 0.3s ease-out';
                logEntry.style.opacity = '1';
                logEntry.style.transform = 'translateY(0)';
            }, 100);
            
            // Scroll log to bottom smoothly
            setTimeout(() => {
                logEntries.scrollTo({
                    top: logEntries.scrollHeight,
                    behavior: 'smooth'
                });
            }, 200);
            
            currentStep++;
            
            if (currentStep < activities.length) {
                setTimeout(updateProgress, 1200 + Math.random() * 400);
            } else {
                // Complete the generation with smooth transition
                setTimeout(() => {
                    const thinkingState = document.getElementById('thinkingState');
                    const completedState = document.getElementById('completedState');
                    
                    thinkingState.style.transition = 'opacity 0.5s ease-out';
                    thinkingState.style.opacity = '0';
                    
                    setTimeout(() => {
                        thinkingState.classList.add('hidden');
                        completedState.classList.remove('hidden');
                        completedState.style.opacity = '0';
                        
                        setTimeout(() => {
                            completedState.style.transition = 'opacity 0.5s ease-in';
                            completedState.style.opacity = '1';
                            demoState.sspGenerated = true;
                        }, 50);
                    }, 500);
                }, 800);
            }
        }
    }
    
    updateProgress();
}

// Results page functions
function calculateROI() {
    const signups = parseInt(document.getElementById('signupsInput').value) || 150;
    
    // Calculate metrics based on signups
    const timesSaved = Math.round((signups * 0.67 * 6)); // 67% improvement * 6 hours saved per user
    const supportCost = Math.round(signups * 0.6 * 80); // 60% reduction * $80 per ticket
    const additionalConversions = Math.round(signups * 0.57); // 57% improvement in completion rate
    
    document.getElementById('timesSaved').textContent = timesSaved.toLocaleString();
    document.getElementById('supportReduction').textContent = `$${supportCost.toLocaleString()}`;
    document.getElementById('conversionIncrease').textContent = additionalConversions.toLocaleString();
}

function showSSPAnalysis() {
    showPage('ssp-analysis');
}

function showResults() {
    showPage('results');
    calculateROI();
}

// Initialize demo on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page by default
    showPage('landing');
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            goToLanding();
        } else if (e.key === 'ArrowRight' && currentPhase > 0 && currentPhase < 4) {
            nextPhase();
        } else if (e.key === 'ArrowLeft' && currentPhase > 1) {
            goToPhase(currentPhase - 1);
        }
    });
    
    // Add click handlers for interactive elements
    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const tooltip = this.nextElementSibling;
            if (tooltip) {
                tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
                tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
            }
        });
    });
    
    // Populate Phase 3 repository checklist if we're starting there
    if (currentPhase === 3) {
        populateRepositoryChecklist();
    }
    
    // Add form validation listeners for Phase 3
    const productNameInput = document.getElementById('product-name');
    if (productNameInput) {
        productNameInput.addEventListener('input', validateProductForm);
    }
});