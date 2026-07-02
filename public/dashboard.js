// State Configuration & Mock Data Setup
const DEFAULT_APPOINTMENTS = [
    {
        id: "appt-1",
        patientName: "Carlos Mendoza",
        time: "08:00",
        duration: "60",
        treatment: "Ortodoncia",
        status: "Completado"
    },
    {
        id: "appt-2",
        patientName: "Sofía Delgado",
        time: "10:00",
        duration: "60",
        treatment: "Blanqueamiento",
        status: "Completado"
    },
    {
        id: "appt-3",
        patientName: "Juan Carlos Ortega",
        time: "11:00",
        duration: "90",
        treatment: "Carilla de Resina",
        status: "En sala"
    },
    {
        id: "appt-4",
        patientName: "Mariana Solís",
        time: "14:00",
        duration: "60",
        treatment: "Profilaxis",
        status: "Pendiente"
    },
    {
        id: "appt-5",
        patientName: "Alejandro Ramos",
        time: "16:00",
        duration: "60",
        treatment: "Endodoncia",
        status: "Pendiente"
    }
];

const DEFAULT_TASKS = [
    {
        id: "task-1",
        text: "Llamar al laboratorio dental por corona de zirconio de Mariana S.",
        completed: true
    },
    {
        id: "task-2",
        text: "Hacer pedido de anestesia con epinefrina y gasas quirúrgicas",
        completed: false
    },
    {
        id: "task-3",
        text: "Revisar facturación semanal de la clínica",
        completed: false
    },
    {
        id: "task-4",
        text: "Calibrar autoclave y verificar nivel de agua destilada",
        completed: true
    },
    {
        id: "task-5",
        text: "Enviar recordatorios de citas de mañana por WhatsApp",
        completed: false
    }
];

// Initialize State from LocalStorage or default mock data
let appointments = JSON.parse(localStorage.getItem('dentist_appointments')) || DEFAULT_APPOINTMENTS;
let tasks = JSON.parse(localStorage.getItem('dentist_tasks')) || DEFAULT_TASKS;

// Save State Helper
function saveState() {
    localStorage.setItem('dentist_appointments', JSON.stringify(appointments));
    localStorage.setItem('dentist_tasks', JSON.stringify(tasks));
}

// Format date in Spanish
function initDate() {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const today = new Date();
    
    const dayName = days[today.getDay()];
    const dateNum = today.getDate();
    const monthName = months[today.getMonth()];
    const year = today.getFullYear();
    
    document.getElementById('current-day-name').textContent = dayName;
    document.getElementById('current-date-text').textContent = `${dateNum} de ${monthName}, ${year}`;
}

// Get Greeting based on hour
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById('welcome-text');
    const greetingIcon = document.getElementById('greeting-icon');
    
    if (hour >= 6 && hour < 12) {
        greetingText.textContent = "Buen día, Dr. Mercado";
        greetingIcon.textContent = "☀️";
    } else if (hour >= 12 && hour < 19) {
        greetingText.textContent = "Buenas tardes, Dr. Mercado";
        greetingIcon.textContent = "⛅";
    } else {
        greetingText.textContent = "Buenas noches, Dr. Mercado";
        greetingIcon.textContent = "🌙";
    }
}

// Update counters and progress widgets
function updateStatsAndCounters() {
    const pendingAppointments = appointments.filter(a => a.status === 'Pendiente').length;
    const completedAppointments = appointments.filter(a => a.status === 'Completado').length;
    const inRoomAppointments = appointments.filter(a => a.status === 'En sala').length;
    
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    
    // Header summary counters
    document.getElementById('appointments-count').textContent = appointments.length;
    document.getElementById('tasks-count').textContent = pendingTasks;
    
    // Sidebar/right side stats
    document.getElementById('stat-completed-appointments').textContent = completedAppointments;
    document.getElementById('stat-in-room').textContent = inRoomAppointments;
    document.getElementById('stat-pending-tasks').textContent = pendingTasks;
    document.getElementById('todo-badge').textContent = `${pendingTasks} Pendientes`;
    
    // Efficiency calculation (Percent of completed actions)
    const totalItems = appointments.length + totalTasks;
    const completedItems = completedAppointments + (totalTasks - pendingTasks);
    const efficiency = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    document.getElementById('efficiency-percent').textContent = `${efficiency}%`;
    document.getElementById('efficiency-bar').style.width = `${efficiency}%`;
}

// Render Timeline slots (from 8:00 to 20:00)
function renderTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';
    
    // Generate hours from 8 to 19 (which represents 8:00 AM to 7:00 PM, ending at 8:00 PM)
    for (let hour = 8; hour <= 19; hour++) {
        const hourStr = `${hour.toString().padStart(2, '0')}:00`;
        const hourLabel = hour < 12 ? `${hour}:00 AM` : (hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`);
        
        // Find if there is an appointment scheduled for this exact hour
        const apptsAtHour = appointments.filter(a => {
            const apptHour = parseInt(a.time.split(':')[0]);
            return apptHour === hour;
        });

        // Create hour slot container
        const slotDiv = document.createElement('div');
        slotDiv.className = "flex items-start space-x-4 border-b border-slate-100 pb-4 last:border-b-0";
        
        // Time indicator column
        const timeCol = document.createElement('div');
        timeCol.className = "w-20 text-right shrink-0 py-1.5";
        timeCol.innerHTML = `
            <span class="text-sm font-semibold text-slate-500">${hourLabel}</span>
        `;
        slotDiv.appendChild(timeCol);

        // Content slot column
        const contentCol = document.createElement('div');
        contentCol.className = "flex-1 space-y-3";

        if (apptsAtHour.length > 0) {
            // Render Appointment Cards
            apptsAtHour.forEach(appt => {
                const card = createAppointmentCard(appt);
                contentCol.appendChild(card);
            });
        } else {
            // Empty slot, click to add appointment
            const emptyBtn = document.createElement('button');
            emptyBtn.className = "w-full text-left py-2.5 px-4 rounded-xl border border-dashed border-slate-200 hover:border-brand-chair/40 hover:bg-white text-slate-400 hover:text-brand-chair text-xs font-medium transition-all flex items-center justify-between group";
            emptyBtn.innerHTML = `
                <span>Espacio disponible</span>
                <span class="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-brand-chair font-bold">
                    + Agendar cita <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </span>
            `;
            emptyBtn.onclick = () => {
                // Open modal and pre-select hour
                openAppointmentModal(hourStr);
            };
            contentCol.appendChild(emptyBtn);
        }
        
        slotDiv.appendChild(contentCol);
        timelineContainer.appendChild(slotDiv);
    }
    
    // Re-initialize Lucide Icons for dynamic content
    lucide.createIcons();
}

// Create Card element for an appointment
function createAppointmentCard(appt) {
    const card = document.createElement('div');
    
    // Status style mapping
    let borderStyle = "";
    let badgeStyle = "";
    let iconColor = "";
    
    if (appt.status === 'Completado') {
        borderStyle = "border-l-4 border-l-brand-mint border-slate-200";
        badgeStyle = "bg-emerald-50 text-brand-mint border border-emerald-200";
        iconColor = "text-brand-mint";
    } else if (appt.status === 'En sala') {
        borderStyle = "border-l-4 border-l-brand-chair border-slate-200";
        badgeStyle = "bg-sky-50 text-brand-chair border border-sky-100";
        iconColor = "text-brand-chair";
    } else {
        // Pendiente
        borderStyle = "border-l-4 border-l-amber-500 border-slate-200";
        badgeStyle = "bg-amber-50 text-amber-600 border border-amber-100";
        iconColor = "text-amber-500";
    }
    
    card.className = `bg-white p-4 rounded-xl shadow-sm border ${borderStyle} transition-all duration-300 hover:shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4`;
    
    card.innerHTML = `
        <div class="flex items-start space-x-3.5">
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                <i data-lucide="user-check" class="w-5 h-5 ${iconColor}"></i>
            </div>
            <div>
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h4 class="text-sm font-bold text-slate-800">${appt.patientName}</h4>
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeStyle}">
                        ${appt.status}
                    </span>
                </div>
                <div class="flex items-center space-x-4 mt-1.5 text-xs text-slate-500">
                    <span class="flex items-center">
                        <i data-lucide="clock" class="w-3.5 h-3.5 mr-1 text-slate-400"></i>
                        ${appt.time} (${appt.duration} min)
                    </span>
                    <span class="flex items-center">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 mr-1 text-slate-400"></i>
                        ${appt.treatment}
                    </span>
                </div>
            </div>
        </div>

        <!-- Action tools inside card -->
        <div class="flex items-center space-x-2 md:self-center self-end border-t md:border-t-0 border-slate-100 pt-3.5 md:pt-0 w-full md:w-auto justify-end">
            <!-- Dropdown or quick buttons to change status -->
            <button onclick="changeAppointmentStatus('${appt.id}', 'Pendiente')" title="Marcar Pendiente" class="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all">
                <span class="block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            </button>
            <button onclick="changeAppointmentStatus('${appt.id}', 'En sala')" title="Marcar En Sala" class="p-1.5 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-brand-chair transition-all">
                <span class="block w-2.5 h-2.5 rounded-full bg-brand-chair"></span>
            </button>
            <button onclick="changeAppointmentStatus('${appt.id}', 'Completado')" title="Marcar Completado" class="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-brand-mint transition-all">
                <span class="block w-2.5 h-2.5 rounded-full bg-brand-mint"></span>
            </button>
            <div class="w-px h-5 bg-slate-200 mx-1"></div>
            <button onclick="deleteAppointment('${appt.id}')" title="Eliminar cita" class="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-brand-coral transition-all">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Render Tasks To-Do List
function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="text-center py-8 text-slate-400">
                <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
                <p class="text-xs">No hay tareas pendientes para hoy.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 bg-white hover:shadow-sm ${task.completed ? 'border-slate-100 opacity-60 bg-slate-50/50' : 'border-slate-200'}`;
        
        taskDiv.innerHTML = `
            <div class="flex items-center space-x-3 flex-1 min-w-0">
                <label class="relative flex items-center cursor-pointer select-none">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')" class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:bg-brand-chair checked:border-brand-chair focus:outline-none transition-all">
                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </span>
                </label>
                <span class="text-sm font-medium text-slate-700 truncate ${task.completed ? 'line-through text-slate-400 font-normal' : ''}">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask('${task.id}')" class="p-1 rounded-lg text-slate-400 hover:text-brand-coral hover:bg-slate-100 transition-all shrink-0">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;
        tasksContainer.appendChild(taskDiv);
    });
    
    lucide.createIcons();
}

// Change Appointment Status
window.changeAppointmentStatus = function(apptId, newStatus) {
    appointments = appointments.map(a => a.id === apptId ? { ...a, status: newStatus } : a);
    saveState();
    updateStatsAndCounters();
    renderTimeline();
};

// Delete Appointment
window.deleteAppointment = function(apptId) {
    if (confirm("¿Está seguro de eliminar esta cita?")) {
        appointments = appointments.filter(a => a.id !== apptId);
        saveState();
        updateStatsAndCounters();
        renderTimeline();
    }
};

// Toggle Task Complete State
window.toggleTask = function(taskId) {
    tasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    saveState();
    updateStatsAndCounters();
    renderTasks();
};

// Delete Task
window.deleteTask = function(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveState();
    updateStatsAndCounters();
    renderTasks();
};

// Handle Add Task Form Submit
window.handleAddTask = function(e) {
    e.preventDefault();
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if (!text) return;
    
    const newTask = {
        id: `task-${Date.now()}`,
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    input.value = '';
    
    saveState();
    updateStatsAndCounters();
    renderTasks();
};

// Modal Control
window.openAppointmentModal = function(preselectedHour = '') {
    const modal = document.getElementById('appointment-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
    
    // Set pre-selected hour if supplied
    if (preselectedHour) {
        document.getElementById('appointment-hour').value = preselectedHour;
    }
};

window.closeAppointmentModal = function() {
    const modal = document.getElementById('appointment-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    
    // Reset form
    document.getElementById('appointment-form').reset();
};

// Handle Create Appointment
window.handleCreateAppointment = function(e) {
    e.preventDefault();
    
    const patientName = document.getElementById('patient-name').value.trim();
    const time = document.getElementById('appointment-hour').value;
    const duration = document.getElementById('appointment-duration').value;
    const treatment = document.getElementById('appointment-treatment').value;
    const status = document.querySelector('input[name="initial-status"]:checked').value;
    
    if (!patientName) return;

    const newAppt = {
        id: `appt-${Date.now()}`,
        patientName,
        time,
        duration,
        treatment,
        status
    };
    
    appointments.push(newAppt);
    
    // Sort appointments by time
    appointments.sort((a, b) => a.time.localeCompare(b.time));
    
    saveState();
    closeAppointmentModal();
    updateStatsAndCounters();
    renderTimeline();
};

// Initialize Application
function init() {
    initDate();
    updateGreeting();
    updateStatsAndCounters();
    renderTimeline();
    renderTasks();
}

// Run init on load
window.addEventListener('DOMContentLoaded', init);
