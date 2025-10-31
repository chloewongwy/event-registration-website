// Global variables
let programmeData = [];
let selectedSchools = [];

// Load data from JSON file
async function loadProgrammeData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        programmeData = data.programmeData;
        renderProgrammes();
        populateEventOptions();
    } catch (error) {
        console.error('Error loading programme data:', error);
        document.getElementById('programmeList').innerHTML = 
            '<p class="error">Error loading programme data. Please refresh the page.</p>';
    }
}

// Render programmes grouped by day
function renderProgrammes(filterDay = null) {
    const container = document.getElementById('programmeList');
    
    if (!programmeData || programmeData.length === 0) {
        container.innerHTML = '<div class="loading">Loading programmes...</div>';
        return;
    }

    // Group programmes by day
    const groupedByDay = programmeData.reduce((acc, programme) => {
        const day = programme.day;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(programme);
        return acc;
    }, {});

    // Filter if day is specified
    const daysToShow = filterDay ? [filterDay] : Object.keys(groupedByDay).sort((a, b) => a - b);

    let html = '';

    daysToShow.forEach(day => {
        const programmes = groupedByDay[day];
        const dayDate = getDayDate(day);

        html += `
            <div class="day-section" data-day="${day}">
                <div class="day-header">
                    <h3>Day ${getDayNumber(day)}</h3>
                    <div class="day-date">${dayDate}</div>
                </div>
        `;

        programmes.forEach(programme => {
            html += renderProgrammeItem(programme);
        });

        html += '</div>';
    });

    container.innerHTML = html;
}

// Render individual programme item
function renderProgrammeItem(programme) {
    // Check if topic is exactly "Tea Break", "Lunch", or contains "Break" as a standalone word
    // Fixed: Use exact matching to avoid matching "tea" in "teaching"
    const topicLower = programme.topic.toLowerCase();
    const isBreak = topicLower === 'tea break' || 
                    topicLower === 'lunch' || 
                    topicLower.includes('tea break') ||
                    /\bbreak\b/.test(topicLower);  // Match "break" as whole word only

    let html = `
        <div class="programme-item ${isBreak ? 'break-item' : ''}" data-id="${programme.programmeId}">
            <div class="programme-header">
                <div class="programme-time">${programme.time}</div>
    `;

    if (programme.venue) {
        html += `<div class="programme-venue">${programme.venue}</div>`;
    }

    if (programme.language) {
        html += `<div class="programme-language">${programme.language}</div>`;
    }

    html += `</div>`;

    html += `<div class="programme-title">${programme.topic}</div>`;

    if (programme.synopsis) {
        html += `<div class="programme-synopsis">${programme.synopsis}</div>`;
    }

    if (programme.speaker && programme.speaker.length > 0) {
        const speakers = programme.speaker.join(', ');
        html += `<div class="programme-speaker"><strong>Speaker(s):</strong> ${speakers}</div>`;
    }

    if (programme.facilitator) {
        html += `<div class="programme-facilitator"><strong>Facilitator:</strong> ${programme.facilitator}</div>`;
    }

    if (programme.note) {
        html += `<div class="programme-note">${programme.note}</div>`;
    }

    html += `</div>`;

    return html;
}

// Get day date
function getDayDate(day) {
    const dates = {
        11: 'Monday, 11 August 2025',
        12: 'Tuesday, 12 August 2025',
        18: 'Monday, 18 August 2025',
        19: 'Tuesday, 19 August 2025'
    };
    return dates[day] || `${day} August 2025`;
}

// Get day number
function getDayNumber(day) {
    const dayNumbers = { 11: 1, 12: 2, 18: 3, 19: 4 };
    return dayNumbers[day] || day;
}

// Populate event options in registration form (now creates checkboxes in modal)
function populateEventOptions() {
    const eventCheckboxList = document.getElementById('eventCheckboxList');
    if (!eventCheckboxList || !programmeData) return;

    // Filter out break items and create unique events
    const events = programmeData.filter(p => {
        const topicLower = p.topic.toLowerCase();
        const isBreak = topicLower === 'tea break' || 
                        topicLower === 'lunch' || 
                        topicLower.includes('tea break') ||
                        /\bbreak\b/.test(topicLower);
        return !isBreak && p.topic.trim() !== '';
    });

    // Group events by day
    const eventsByDay = events.reduce((acc, programme) => {
        if (!acc[programme.day]) {
            acc[programme.day] = [];
        }
        acc[programme.day].push(programme);
        return acc;
    }, {});

    // Clear existing content
    eventCheckboxList.innerHTML = '';
    
    // Create checkboxes grouped by day
    Object.keys(eventsByDay).sort((a, b) => Number(a) - Number(b)).forEach(day => {
        // Add day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'event-day-header';
        dayHeader.textContent = `Day ${getDayNumber(day)} - ${getDayDate(day)}`;
        eventCheckboxList.appendChild(dayHeader);

        // Add events for this day
        eventsByDay[day].forEach(programme => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'event';
            checkbox.value = programme.programmeId;
            checkbox.id = `event-${programme.programmeId}`;
            
            const label = document.createElement('label');
            label.htmlFor = `event-${programme.programmeId}`;
            label.innerHTML = `
                <span class="event-time">${programme.time}</span>
                <span class="event-topic">${programme.topic}</span>
            `;
            
            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            eventCheckboxList.appendChild(checkboxItem);
        });
    });
}

// Modal functions
function openSchoolModal() {
    const modal = document.getElementById('schoolModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeSchoolModal() {
    const modal = document.getElementById('schoolModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmSchoolSelection() {
    const selectedRadio = document.querySelector('#schoolModal input[type="radio"]:checked');
    
    const displayField = document.getElementById('School_display');
    if (displayField) {
        if (selectedRadio) {
            displayField.value = selectedRadio.nextElementSibling.textContent;
            selectedSchools = [selectedRadio.value]; // Store as array for consistency
        } else {
            displayField.value = '';
            selectedSchools = [];
        }
    }
    
    closeSchoolModal();
}

// Event Modal functions
let selectedEvents = [];

function openEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmEventSelection() {
    const checkboxes = document.querySelectorAll('#eventModal input[type="checkbox"]:checked');
    selectedEvents = Array.from(checkboxes).map(cb => cb.value);
    
    const displayField = document.getElementById('event_display');
    const hiddenField = document.getElementById('event');
    const eventsList = document.getElementById('selectedEventsList');
    
    if (displayField && hiddenField) {
        // Create display text with event count
        if (selectedEvents.length === 0) {
            displayField.value = '';
            hiddenField.value = '';
            if (eventsList) {
                eventsList.style.display = 'none';
                eventsList.innerHTML = '';
            }
        } else if (selectedEvents.length === 1) {
            // Show full event name for single selection
            const event = programmeData.find(p => p.programmeId === selectedEvents[0]);
            displayField.value = event ? `${event.topic}` : selectedEvents[0];
            hiddenField.value = selectedEvents.join(',');
            
            // Hide list for single event (shown in input field)
            if (eventsList) {
                eventsList.style.display = 'none';
                eventsList.innerHTML = '';
            }
        } else {
            // Show count for multiple selections
            displayField.value = `${selectedEvents.length} events selected`;
            hiddenField.value = selectedEvents.join(',');
            
            // Show detailed list of selected events
            if (eventsList) {
                eventsList.style.display = 'block';
                eventsList.innerHTML = '<div class="selected-events-header">Selected Events:</div>';
                
                selectedEvents.forEach((eventId, index) => {
                    const event = programmeData.find(p => p.programmeId === eventId);
                    if (event) {
                        const eventItem = document.createElement('div');
                        eventItem.className = 'selected-event-item';
                        eventItem.innerHTML = `
                            <span class="event-number">${index + 1}.</span>
                            <div class="event-details">
                                <div class="event-name">${event.topic}</div>
                                <div class="event-info">
                                    <span class="event-date">${getDayDate(event.day)}</span>
                                    <span class="event-time-small">${event.time}</span>
                                </div>
                            </div>
                        `;
                        eventsList.appendChild(eventItem);
                    }
                });
            }
        }
    }
    
    closeEventModal();
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('yourname').value.trim();
    const email = document.getElementById('email').value.trim();
    const school = document.getElementById('School_display').value.trim();
    const eventIds = document.getElementById('event').value;

    if (!name || !email || !school || !eventIds) {
        alert('Please fill in all required fields');
        return;
    }

    // Handle multiple events
    const eventIdArray = eventIds.split(',');
    const selectedEventsList = eventIdArray.map(id => {
        const event = programmeData.find(p => p.programmeId === id);
        return event ? event.topic : id;
    });
    
    // Show success message
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.style.display = 'block';
        
        const eventText = selectedEventsList.length === 1 
            ? `<strong>${selectedEventsList[0]}</strong>` 
            : `<ul style="margin: 10px 0; padding-left: 20px; text-align: left;">${selectedEventsList.map(e => `<li>${e}</li>`).join('')}</ul>`;
        
        successMsg.innerHTML = `
            <strong>✓ Registration Successful!</strong><br>
            Thank you, ${name}! You have successfully registered for:<br>
            ${eventText}
            A confirmation email will be sent to ${email}.
        `;
        
        // Reset form
        document.getElementById('registerForm').reset();
        selectedSchools = [];
        selectedEvents = [];
        
        // Clear selected events list display
        const eventsList = document.getElementById('selectedEventsList');
        if (eventsList) {
            eventsList.style.display = 'none';
            eventsList.innerHTML = '';
        }
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 8 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 8000);
    }
}

// Clear registration form
function clearRegistrationForm() {
    document.getElementById('registerForm').reset();
    selectedSchools = [];
    selectedEvents = [];
    
    // Clear selected events list display
    const eventsList = document.getElementById('selectedEventsList');
    if (eventsList) {
        eventsList.style.display = 'none';
        eventsList.innerHTML = '';
    }
    
    // Uncheck all checkboxes in modals
    document.querySelectorAll('#schoolModal input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#eventModal input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// Filter programmes by day
function filterByDay(day) {
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((day === null && btn.dataset.day === 'all') || btn.dataset.day == day) {
            btn.classList.add('active');
        }
    });

    // Render filtered programmes
    renderProgrammes(day);
}

// Filter from overview card click
function filterFromOverview(day) {
    // Filter the programme by day
    filterByDay(day);
    
    // Scroll to programme section
    const programmeSection = document.getElementById('programme');
    if (programmeSection) {
        const headerOffset = 80; // Account for sticky header
        const elementPosition = programmeSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
function handleScroll() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load programme data
    loadProgrammeData();

    // Add form submit handler
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        const schoolModal = document.getElementById('schoolModal');
        const eventModal = document.getElementById('eventModal');
        
        if (event.target === schoolModal) {
            closeSchoolModal();
        }
        if (event.target === eventModal) {
            closeEventModal();
        }
    }

    // Scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Add filter button event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.dataset.day === 'all' ? null : parseInt(this.dataset.day);
            filterByDay(day);
        });
    });

    // Smooth scroll for navigation links (including Register Now button)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Account for sticky header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
