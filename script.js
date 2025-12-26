alert("HMS script loaded");
document.addEventListener('DOMContentLoaded', () => {
  try {
    const STORAGE_KEY = 'hms-suite-v1';
    const formLabels = {
      doctor: 'Save doctor',
      patient: 'Save patient',
      appointment: 'Schedule appointment'
    };

    const dom = {
    navLinks: document.querySelectorAll('.menu-link'),
    panels: document.querySelectorAll('.panel'),
    doctorForm: document.getElementById('doctorForm'),
    doctorFormSubmit: document.getElementById('doctorFormSubmit'),
    doctorId: document.getElementById('doctorId'),
    doctorName: document.getElementById('doctorName'),
    doctorSpecialization: document.getElementById('doctorSpecialization'),
    doctorExperience: document.getElementById('doctorExperience'),
    doctorDays: document.getElementById('doctorDays'),
    doctorTimeSlot: document.getElementById('doctorTimeSlot'),
    doctorFee: document.getElementById('doctorFee'),
    doctorPhone: document.getElementById('doctorPhone'),
    doctorEmail: document.getElementById('doctorEmail'),
    doctorBio: document.getElementById('doctorBio'),
    doctorsTableBody: document.getElementById('doctorsTableBody'),
    patientForm: document.getElementById('patientForm'),
    patientFormSubmit: document.getElementById('patientFormSubmit'),
    patientId: document.getElementById('patientId'),
    patientName: document.getElementById('patientName'),
    patientAge: document.getElementById('patientAge'),
    patientGender: document.getElementById('patientGender'),
    patientPhone: document.getElementById('patientPhone'),
    patientEmail: document.getElementById('patientEmail'),
    patientPrimaryDoctor: document.getElementById('patientPrimaryDoctor'),
    patientIssue: document.getElementById('patientIssue'),
    patientLastVisit: document.getElementById('patientLastVisit'),
    patientNotes: document.getElementById('patientNotes'),
    patientsTableBody: document.getElementById('patientsTableBody'),
    appointmentForm: document.getElementById('appointmentForm'),
    appointmentFormSubmit: document.getElementById('appointmentFormSubmit'),
    appointmentId: document.getElementById('appointmentId'),
    appointmentPatient: document.getElementById('appointmentPatient'),
    appointmentDoctor: document.getElementById('appointmentDoctor'),
    appointmentDate: document.getElementById('appointmentDate'),
    appointmentTime: document.getElementById('appointmentTime'),
    appointmentType: document.getElementById('appointmentType'),
    appointmentStatus: document.getElementById('appointmentStatus'),
    appointmentNotes: document.getElementById('appointmentNotes'),
    appointmentsTableBody: document.getElementById('appointmentsTableBody'),
    totalDoctors: document.getElementById('totalDoctors'),
    totalPatients: document.getElementById('totalPatients'),
    totalAppointments: document.getElementById('totalAppointments'),
    upcomingAppointmentsList: document.getElementById('upcomingAppointments'),
    doctorNotificationsList: document.getElementById('doctorNotifications'),
    pendingPatientsList: document.getElementById('pendingPatientsList'),
    appointmentAlerts: document.getElementById('appointmentAlerts'),
    patientDoctorCards: document.getElementById('patientDoctorCards'),
    patientDoctorSearch: document.getElementById('patientDoctorSearch'),
    patientAppointmentsList: document.getElementById('patientAppointmentsList'),
    doctorWorkspace: document.getElementById('doctorWorkspace'),
    toast: document.getElementById('appToast'),
    lastSavedPill: document.getElementById('lastSavedPill'),
    clearStorageBtn: document.getElementById('clearStorageBtn')
  };

  let state = loadState();
  bindEvents();
  renderAll();

  function bindEvents() {
    dom.navLinks.forEach((btn) => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });

    document.querySelectorAll('[data-shortcut]').forEach((btn) => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.shortcut));
    });

    document.querySelectorAll('[data-clear-form]').forEach((btn) => {
      btn.addEventListener('click', () => resetForm(btn.dataset.clearForm));
    });

    dom.doctorForm.addEventListener('submit', handleDoctorSubmit);
    dom.patientForm.addEventListener('submit', handlePatientSubmit);
    dom.appointmentForm.addEventListener('submit', handleAppointmentSubmit);

    dom.patientDoctorSearch.addEventListener('input', renderPatientPortal);

    dom.clearStorageBtn.addEventListener('click', resetStorage);

    document.addEventListener('click', handleActionButtons);
    document.addEventListener('click', handlePanelJump);
    document.addEventListener('click', handleBookAppointmentBtn);
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Unable to read storage', error);
    }
    const seed = getSeedState();
    persistState(seed);
    return seed;
  }

  function persistState(nextState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      state = nextState;
      updateSavedPill();
    } catch (error) {
      console.error('Unable to write storage', error);
    }
  }

  function updateSavedPill() {
    if (!dom.lastSavedPill) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dom.lastSavedPill.textContent = `Synced • ${time}`;
  }

  function getSeedState() {
    const today = new Date();
    const futureDate = (offset) => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    };

    return {
      doctors: [
        {
          id: 'doc-1',
          name: 'Dr. Riya Malhotra',
          specialization: 'Cardiology',
          experience: 12,
          availability: 'Mon-Fri • 09:00-13:00',
          fee: 1600,
          phone: '+91 98765 22113',
          email: 'riya.malhotra@hms.in',
          bio: 'Interventional cardiologist focusing on lifestyle programs.'
        },
        {
          id: 'doc-2',
          name: 'Dr. Kunal Menon',
          specialization: 'Dermatology',
          experience: 9,
          availability: 'Tue-Sat • 11:00-17:00',
          fee: 1200,
          phone: '+91 98300 44771',
          email: 'kunal.menon@hms.in',
          bio: 'Special interest in aesthetic dermatology and psoriasis clinics.'
        },
        {
          id: 'doc-3',
          name: 'Dr. Anika Bose',
          specialization: 'Neurology',
          experience: 15,
          availability: 'Mon, Wed, Fri • 15:00-20:00',
          fee: 1800,
          phone: '+91 90112 78890',
          email: 'anika.bose@hms.in',
          bio: 'Works on migraine, epilepsy and neuro-rehab protocols.'
        }
      ],
      patients: [
        {
          id: 'pat-1',
          name: 'Neha Patil',
          age: 32,
          gender: 'Female',
          phone: '+91 99887 33445',
          email: 'neha.patil@example.com',
          primaryDoctorId: 'doc-1',
          issue: 'Hypertension management',
          lastVisit: futureDate(-12),
          notes: 'Monitor BP log every morning. Needs lab review next visit.'
        },
        {
          id: 'pat-2',
          name: 'Rahul Verma',
          age: 45,
          gender: 'Male',
          phone: '+91 99110 66778',
          email: 'rahul.v@demo.com',
          primaryDoctorId: 'doc-2',
          issue: 'Chronic eczema flare-up',
          lastVisit: futureDate(-6),
          notes: 'Phototherapy twice a week, moisturiser routine check.'
        },
        {
          id: 'pat-3',
          name: 'Meera Shah',
          age: 28,
          gender: 'Female',
          phone: '+91 98220 99871',
          email: 'meera.shah@example.com',
          primaryDoctorId: 'doc-3',
          issue: 'Migraine & sleep hygiene',
          lastVisit: futureDate(-30),
          notes: 'Track aura frequency, share neuro report at next review.'
        }
      ],
      appointments: [
        {
          id: 'apt-1',
          patientId: 'pat-1',
          doctorId: 'doc-1',
          date: futureDate(1),
          time: '10:30',
          type: 'Follow-up',
          status: 'Confirmed',
          notes: 'Bring BP chart, fasting sugar'
        },
        {
          id: 'apt-2',
          patientId: 'pat-2',
          doctorId: 'doc-2',
          date: futureDate(2),
          time: '12:00',
          type: 'Consultation',
          status: 'Pending Assignment',
          notes: 'Phototherapy slot confirmation pending'
        }
      ]
    };
  }

  function renderAll() {
    renderStats();
    renderDoctors();
    renderPatients();
    renderAppointments();
    renderDashboard();
    renderPatientPortal();
    renderDoctorPortal();
  }

  function renderStats() {
    dom.totalDoctors.textContent = state.doctors.length;
    dom.totalPatients.textContent = state.patients.length;
    dom.totalAppointments.textContent = state.appointments.length;
  }

  function renderDoctors() {
    const rows = state.doctors
      .map(
        (doc) => `
      <tr>
        <td>
          <strong>${safe(doc.name)}</strong>
          <div class="muted small">${safe(doc.bio || 'No bio yet')}</div>
        </td>
        <td>${safe(doc.specialization)}</td>
        <td>${safe(doc.availability)}</td>
        <td>₹${formatCurrency(doc.fee)}</td>
        <td>
          <div class="small">${safe(doc.phone)}</div>
          <div class="small muted">${safe(doc.email)}</div>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn small ghost" data-entity="doctor" data-action="edit" data-id="${doc.id}">Edit</button>
            <button type="button" class="btn small ghost danger" data-entity="doctor" data-action="delete" data-id="${doc.id}">Delete</button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');

    dom.doctorsTableBody.innerHTML = rows || `<tr><td colspan="6">No doctors yet.</td></tr>`;
    updateDoctorSelects();
  }

  function renderPatients() {
    const rows = state.patients
      .map((patient) => {
        const doctor = getDoctor(patient.primaryDoctorId);
        return `
        <tr>
          <td>
            <strong>${safe(patient.name)}</strong>
            <div class="small muted">${safe(patient.gender)}, ${patient.age} yrs</div>
          </td>
          <td>${safe(patient.issue)}</td>
          <td>${doctor ? safe(doctor.name) : 'Unassigned'}</td>
          <td>
            <div class="small">${safe(patient.phone)}</div>
            <div class="small muted">${safe(patient.email || '—')}</div>
          </td>
          <td>${formatDate(patient.lastVisit) || '—'}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn small ghost" data-entity="patient" data-action="edit" data-id="${patient.id}">Edit</button>
              <button type="button" class="btn small ghost danger" data-entity="patient" data-action="delete" data-id="${patient.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');

    dom.patientsTableBody.innerHTML = rows || `<tr><td colspan="6">No patients registered.</td></tr>`;
    updatePatientSelect();
  }

  function renderAppointments() {
    const sorted = [...state.appointments].sort((a, b) => getAppointmentTime(a) - getAppointmentTime(b));
    const rows = sorted
      .map((appointment) => {
        const patient = getPatient(appointment.patientId);
        const doctor = getDoctor(appointment.doctorId);
        return `
        <tr>
          <td>${patient ? safe(patient.name) : 'Unknown'}</td>
          <td>${doctor ? safe(doctor.name) : '<span class="muted small">Awaiting assignment</span>'}</td>
          <td>
            ${formatDate(appointment.date) || 'TBD'}
            <div class="small muted">${formatTime(appointment.time)}</div>
          </td>
          <td>${safe(appointment.type)}</td>
          <td>${statusBadge(appointment.status)}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn small ghost" data-entity="appointment" data-action="edit" data-id="${appointment.id}">Edit</button>
              <button type="button" class="btn small ghost" data-entity="appointment" data-action="done" data-id="${appointment.id}">
                Done
              </button>
              <button type="button" class="btn small ghost danger" data-entity="appointment" data-action="cancel" data-id="${appointment.id}">
                Cancel
              </button>
              <button type="button" class="btn small ghost danger" data-entity="appointment" data-action="delete" data-id="${appointment.id}">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');

    dom.appointmentsTableBody.innerHTML = rows || `<tr><td colspan="6">No appointments scheduled.</td></tr>`;

    const alerts = state.appointments.filter((apt) => apt.status === 'Pending Assignment');
    dom.appointmentAlerts.innerHTML = alerts
      .map((apt) => {
        const patient = getPatient(apt.patientId);
        const doctor = getDoctor(apt.doctorId);
        return `<li>
            <strong>${patient ? safe(patient.name) : 'Unknown patient'}</strong>
            <span class="small muted">${apt.notes || 'Awaiting confirmation'}</span>
            <div class="small">${doctor ? `Preferred doctor: ${safe(doctor.name)}` : 'Doctor not assigned'}</div>
          </li>`;
      })
      .join('');
    toggleEmptyState(dom.appointmentAlerts, alerts.length === 0, 'All appointments are assigned.');
  }

  function renderDashboard() {
    const now = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(futureLimit.getDate() + 7);

    const upcoming = state.appointments
      .filter((appointment) => {
        if (!appointment.date) return false;
        const time = getAppointmentTime(appointment);
        if (Number.isNaN(time)) return false;
        const dateObj = new Date(time);
        return dateObj >= now && dateObj <= futureLimit && appointment.status !== 'Cancelled';
      })
      .sort((a, b) => getAppointmentTime(a) - getAppointmentTime(b))
      .slice(0, 5);

    dom.upcomingAppointmentsList.innerHTML = upcoming
      .map((apt) => {
        const patient = getPatient(apt.patientId);
        const doctor = getDoctor(apt.doctorId);
        return `<li>
            <strong>${formatDate(apt.date) || 'TBD'} • ${formatTime(apt.time)}</strong>
            <div class="details">
              <span>${patient ? safe(patient.name) : 'Unknown patient'} → ${doctor ? safe(doctor.name) : 'Assign doctor'}</span>
              <span class="status ${statusClass(apt.status)}">${safe(apt.status)}</span>
            </div>
            <span class="small muted">${apt.notes || 'No notes yet'}</span>
          </li>`;
      })
      .join('');
    toggleEmptyState(dom.upcomingAppointmentsList, upcoming.length === 0, 'No appointments in the next 7 days.');

    const notifications = state.appointments
      .filter((apt) => apt.status === 'Pending Assignment')
      .map((apt) => {
        const patient = getPatient(apt.patientId);
        return `<li>
            <strong>New booking: ${patient ? safe(patient.name) : 'Unknown'}</strong>
            <span class="small muted">${apt.notes || 'Waiting for confirmation'} </span>
            <div class="small">Requested doctor: ${apt.doctorId ? safe(getDoctorName(apt.doctorId)) : 'Any available'}</div>
          </li>`;
      });
    dom.doctorNotificationsList.innerHTML = notifications.join('');
    toggleEmptyState(dom.doctorNotificationsList, notifications.length === 0, 'No pending notifications.');

    const pendingPatients = state.appointments.filter((apt) => apt.status === 'Pending Assignment');
    dom.pendingPatientsList.innerHTML = pendingPatients
      .map((apt) => {
        const patient = getPatient(apt.patientId);
        const doctor = getDoctor(apt.doctorId);
        return `<li>
            <strong>${patient ? safe(patient.name) : 'Unknown patient'}</strong>
            <span class="small muted">${patient ? safe(patient.issue) : 'Medical issue pending'}</span>
            <div class="details">
              <span>${doctor ? `Waiting for ${safe(doctor.name)}` : 'Assign doctor'}</span>
              <button class="btn small primary" data-panel-jump="appointments" type="button">Schedule</button>
            </div>
          </li>`;
      })
      .join('');
    toggleEmptyState(dom.pendingPatientsList, pendingPatients.length === 0, 'All patients have scheduled visits.');
  }

  function renderPatientPortal() {
    const query = dom.patientDoctorSearch.value.trim().toLowerCase();
    const filtered = state.doctors.filter((doc) => {
      if (!query) return true;
      return (
        doc.name.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        (doc.bio || '').toLowerCase().includes(query)
      );
    });

    dom.patientDoctorCards.innerHTML = filtered
      .map(
        (doc) => `
      <div class="doctor-card">
        <div class="tag doctor">${safe(doc.specialization)}</div>
        <strong>${safe(doc.name)}</strong>
        <div class="meta">${doc.experience} yrs experience</div>
        <p class="small">${safe(doc.bio || 'Specialist')}</p>
        <div class="meta">Availability: ${safe(doc.availability)}</div>
        <div class="meta">Fee: ₹${formatCurrency(doc.fee)}</div>
        <button class="btn small primary" type="button" data-book-appointment="${doc.id}">Book Appointment</button>
      </div>`
      )
      .join('');
    toggleEmptyState(dom.patientDoctorCards, filtered.length === 0, 'No doctors match this search.');

    const upcoming = state.appointments
      .filter((apt) => apt.status !== 'Cancelled')
      .sort((a, b) => getAppointmentTime(a) - getAppointmentTime(b))
      .slice(0, 6);

    dom.patientAppointmentsList.innerHTML = upcoming
      .map((apt) => {
        const doctor = getDoctor(apt.doctorId);
        const patient = getPatient(apt.patientId);
        return `<li>
            <strong>${patient ? safe(patient.name) : 'Unknown patient'}</strong>
            <div class="details">
              <span>${doctor ? safe(doctor.name) : 'Doctor not assigned'}</span>
              <span>${formatDate(apt.date) || 'TBD'} · ${formatTime(apt.time)}</span>
            </div>
            <span class="status ${statusClass(apt.status)}">${safe(apt.status)}</span>
          </li>`;
      })
      .join('');
    toggleEmptyState(dom.patientAppointmentsList, upcoming.length === 0, 'No appointments booked yet.');
  }

  function renderDoctorPortal() {
    const cards = state.doctors.map((doc) => {
      const patients = state.patients.filter((patient) => patient.primaryDoctorId === doc.id);
      const upcoming = state.appointments
        .filter((apt) => apt.doctorId === doc.id && apt.status !== 'Cancelled')
        .sort((a, b) => getAppointmentTime(a) - getAppointmentTime(b))
        .slice(0, 4);

      const patientList =
        patients
          .map(
            (patient) => `
        <li>
          <strong>${safe(patient.name)}</strong>
          <div class="small muted">${safe(patient.issue)}</div>
          <div class="small">Last visit: ${formatDate(patient.lastVisit) || '—'}</div>
        </li>`
          )
          .join('') || '<li>No patients assigned.</li>';

      const upcomingList =
        upcoming
          .map(
            (apt) => `
        <li>
          <strong>${formatDate(apt.date) || 'TBD'} • ${formatTime(apt.time)}</strong>
          <div class="small">${safe(getPatientName(apt.patientId))}</div>
          <div class="small muted">${safe(apt.type)} — ${safe(apt.status)}</div>
        </li>`
          )
          .join('') || '<li>No upcoming follow-ups.</li>';

      return `
      <article class="workspace-card">
        <div class="card-head">
          <div>
            <strong>${safe(doc.name)}</strong>
            <div class="small muted">${safe(doc.specialization)}</div>
          </div>
          <span class="pill accent">${doc.experience} yrs</span>
        </div>
        <div class="small muted">Availability: ${safe(doc.availability)} • Fee: ₹${formatCurrency(doc.fee)}</div>
        <div>
          <p class="eyebrow muted">Patient list</p>
          <ul>${patientList}</ul>
        </div>
        <div>
          <p class="eyebrow muted">Upcoming / follow-up</p>
          <ul>${upcomingList}</ul>
        </div>
      </article>`;
    });

    dom.doctorWorkspace.innerHTML = cards.join('');
    toggleEmptyState(dom.doctorWorkspace, cards.length === 0, 'Add doctors to populate the workspace.');
  }

  function handleDoctorSubmit(event) {
    event.preventDefault();
    const payload = {
      id: dom.doctorId.value || generateId('doc'),
      name: dom.doctorName.value.trim(),
      specialization: dom.doctorSpecialization.value.trim(),
      experience: Number(dom.doctorExperience.value) || 0,
      availability: `${dom.doctorDays.value} • ${dom.doctorTimeSlot.value}`,
      fee: Number(dom.doctorFee.value) || 0,
      phone: dom.doctorPhone.value.trim(),
      email: dom.doctorEmail.value.trim(),
      bio: dom.doctorBio.value.trim()
    };

    if (!payload.name || !payload.specialization) return;

    const existingIndex = state.doctors.findIndex((doc) => doc.id === payload.id);
    if (existingIndex >= 0) {
      state.doctors[existingIndex] = payload;
      showToast('Doctor updated');
    } else {
      state.doctors.push(payload);
      showToast('Doctor added');
    }

    persistState({ ...state });
    renderAll();
    resetForm('doctor');
  }

  function handlePatientSubmit(event) {
    event.preventDefault();
    const payload = {
      id: dom.patientId.value || generateId('pat'),
      name: dom.patientName.value.trim(),
      age: Number(dom.patientAge.value) || 0,
      gender: dom.patientGender.value,
      phone: dom.patientPhone.value.trim(),
      email: dom.patientEmail.value.trim(),
      primaryDoctorId: dom.patientPrimaryDoctor.value,
      issue: dom.patientIssue.value.trim(),
      lastVisit: dom.patientLastVisit.value,
      notes: dom.patientNotes.value.trim()
    };

    if (!payload.name || !payload.issue) return;

    const existingIndex = state.patients.findIndex((pat) => pat.id === payload.id);
    if (existingIndex >= 0) {
      state.patients[existingIndex] = payload;
      showToast('Patient updated');
    } else {
      state.patients.push(payload);
      createPendingAppointment(payload.id, payload.primaryDoctorId);
      showToast('Patient added + appointment request created');
    }

    persistState({ ...state });
    renderAll();
    resetForm('patient');
  }

  function handleAppointmentSubmit(event) {
    event.preventDefault();
    const payload = {
      id: dom.appointmentId.value || generateId('apt'),
      patientId: dom.appointmentPatient.value,
      doctorId: dom.appointmentDoctor.value,
      date: dom.appointmentDate.value,
      time: dom.appointmentTime.value,
      type: dom.appointmentType.value,
      status: dom.appointmentStatus.value,
      notes: dom.appointmentNotes.value.trim()
    };

    if (!payload.patientId || !payload.doctorId) return;

    const existingIndex = state.appointments.findIndex((apt) => apt.id === payload.id);
    if (existingIndex >= 0) {
      state.appointments[existingIndex] = payload;
      showToast('Appointment updated');
    } else {
      const pendingIndex = state.appointments.findIndex(
        (apt) => apt.patientId === payload.patientId && apt.status === 'Pending Assignment'
      );
      if (pendingIndex >= 0) {
        state.appointments[pendingIndex] = { ...payload, id: state.appointments[pendingIndex].id };
      } else {
        state.appointments.push(payload);
      }
      showToast('Appointment scheduled');
    }

    persistState({ ...state });
    renderAll();
    resetForm('appointment');
  }

  function handleActionButtons(event) {
    const button = event.target.closest('button[data-entity]');
    if (!button) return;
    const { entity, action, id } = button.dataset;
    if (!entity || !action || !id) return;

    switch (entity) {
      case 'doctor':
        if (action === 'edit') startDoctorEdit(id);
        if (action === 'delete') deleteDoctor(id);
        break;
      case 'patient':
        if (action === 'edit') startPatientEdit(id);
        if (action === 'delete') deletePatient(id);
        break;
      case 'appointment':
        if (action === 'edit') startAppointmentEdit(id);
        if (action === 'delete') deleteAppointment(id);
        if (action === 'done') updateAppointmentStatus(id, 'Completed');
        if (action === 'cancel') updateAppointmentStatus(id, 'Cancelled');
        break;
      default:
        break;
    }
  }

  function handlePanelJump(event) {
    const jumpButton = event.target.closest('[data-panel-jump]');
    if (!jumpButton) return;
    switchPanel(jumpButton.dataset.panelJump);
  }

  function startDoctorEdit(id) {
    const doctor = getDoctor(id);
    if (!doctor) return;
    switchPanel('doctors');
    dom.doctorId.value = doctor.id;
    dom.doctorName.value = doctor.name;
    dom.doctorSpecialization.value = doctor.specialization;
    dom.doctorExperience.value = doctor.experience;
    // Split availability string into days and time slot
    if (doctor.availability && doctor.availability.includes('•')) {
      const [days, time] = doctor.availability.split('•').map(s => s.trim());
      dom.doctorDays.value = days || '';
      dom.doctorTimeSlot.value = time || '';
    } else {
      dom.doctorDays.value = '';
      dom.doctorTimeSlot.value = '';
    }
    dom.doctorFee.value = doctor.fee;
    dom.doctorPhone.value = doctor.phone;
    dom.doctorEmail.value = doctor.email;
    dom.doctorBio.value = doctor.bio;
    dom.doctorFormSubmit.textContent = 'Update doctor';
  }

  function deleteDoctor(id) {
    const doctor = getDoctor(id);
    if (!doctor) return;
    if (!confirm(`Delete ${doctor.name}? Assigned patients will become unassigned.`)) return;
    state.doctors = state.doctors.filter((doc) => doc.id !== id);
    state.patients = state.patients.map((patient) =>
      patient.primaryDoctorId === id ? { ...patient, primaryDoctorId: '' } : patient
    );
    state.appointments = state.appointments.map((apt) =>
      apt.doctorId === id ? { ...apt, doctorId: '', status: 'Pending Assignment' } : apt
    );
    persistState({ ...state });
    renderAll();
    showToast('Doctor removed');
  }

  function startPatientEdit(id) {
    const patient = getPatient(id);
    if (!patient) return;
    switchPanel('patients');
    dom.patientId.value = patient.id;
    dom.patientName.value = patient.name;
    dom.patientAge.value = patient.age;
    dom.patientGender.value = patient.gender;
    dom.patientPhone.value = patient.phone;
    dom.patientEmail.value = patient.email;
    setSelectValue(dom.patientPrimaryDoctor, patient.primaryDoctorId);
    dom.patientIssue.value = patient.issue;
    dom.patientLastVisit.value = patient.lastVisit || '';
    dom.patientNotes.value = patient.notes || '';
    dom.patientFormSubmit.textContent = 'Update patient';
  }

  function deletePatient(id) {
    const patient = getPatient(id);
    if (!patient) return;
    if (!confirm(`Delete patient record for ${patient.name}?`)) return;
    state.patients = state.patients.filter((pat) => pat.id !== id);
    state.appointments = state.appointments.filter((apt) => apt.patientId !== id);
    persistState({ ...state });
    renderAll();
    showToast('Patient removed');
  }

  function startAppointmentEdit(id) {
    const appointment = state.appointments.find((apt) => apt.id === id);
    if (!appointment) return;
    switchPanel('appointments');
    dom.appointmentId.value = appointment.id;
    setSelectValue(dom.appointmentPatient, appointment.patientId);
    setSelectValue(dom.appointmentDoctor, appointment.doctorId);
    dom.appointmentDate.value = appointment.date || '';
    dom.appointmentTime.value = appointment.time || '';
    dom.appointmentType.value = appointment.type;
    dom.appointmentStatus.value = appointment.status;
    dom.appointmentNotes.value = appointment.notes || '';
    dom.appointmentFormSubmit.textContent = 'Update appointment';
  }

  function deleteAppointment(id) {
    const appointment = state.appointments.find((apt) => apt.id === id);
    if (!appointment) return;
    if (!confirm('Delete this appointment permanently?')) return;
    state.appointments = state.appointments.filter((apt) => apt.id !== id);
    persistState({ ...state });
    renderAll();
    showToast('Appointment removed');
  }

  function updateAppointmentStatus(id, status) {
    const appointment = state.appointments.find((apt) => apt.id === id);
    if (!appointment) return;
    appointment.status = status;
    persistState({ ...state });
    renderAll();
    showToast(`Appointment ${status.toLowerCase()}`);
  }

  function resetForm(type) {
    switch (type) {
      case 'doctor':
        dom.doctorForm.reset();
        dom.doctorId.value = '';
        dom.doctorDays.value = '';
        dom.doctorTimeSlot.value = '';
        dom.doctorFormSubmit.textContent = formLabels.doctor;
        break;
      case 'patient':
        dom.patientForm.reset();
        dom.patientId.value = '';
        dom.patientFormSubmit.textContent = formLabels.patient;
        break;
      case 'appointment':
        dom.appointmentForm.reset();
        dom.appointmentId.value = '';
        dom.appointmentStatus.value = 'Confirmed';
        dom.appointmentType.value = 'Consultation';
        dom.appointmentFormSubmit.textContent = formLabels.appointment;
        break;
      default:
        break;
    }
  }

  function createPendingAppointment(patientId, preferredDoctorId) {
    const exists = state.appointments.some(
      (apt) => apt.patientId === patientId && apt.status === 'Pending Assignment'
    );
    if (exists) return;
    state.appointments.push({
      id: generateId('apt'),
      patientId,
      doctorId: preferredDoctorId || '',
      date: '',
      time: '',
      type: 'Consultation',
      status: 'Pending Assignment',
      notes: 'New patient intake – schedule first visit'
    });
  }

  function updateDoctorSelects() {
    const doctorOptions = state.doctors
      .map((doc) => `<option value="${doc.id}">${safe(doc.name)} · ${safe(doc.specialization)}</option>`)
      .join('');

    const patientValue = dom.patientPrimaryDoctor.value;
    dom.patientPrimaryDoctor.innerHTML = `<option value="">No doctor assigned yet</option>${doctorOptions}`;
    setSelectValue(dom.patientPrimaryDoctor, patientValue);

    const appointmentDoctorValue = dom.appointmentDoctor.value;
    dom.appointmentDoctor.innerHTML = `<option value="" disabled>Select doctor</option>${doctorOptions}`;
    setSelectValue(dom.appointmentDoctor, appointmentDoctorValue);
  }

  function updatePatientSelect() {
    const patientOptions = state.patients
      .map((pat) => `<option value="${pat.id}">${safe(pat.name)}</option>`)
      .join('');
    const appointmentPatientValue = dom.appointmentPatient.value;
    dom.appointmentPatient.innerHTML = `<option value="" disabled>Select patient</option>${patientOptions}`;
    setSelectValue(dom.appointmentPatient, appointmentPatientValue);
  }

  function setSelectValue(select, value) {
    if (!select) return;
    if (!value) {
      select.value = '';
      return;
    }
    const optionExists = Array.from(select.options).some((option) => option.value === value);
    if (optionExists) {
      select.value = value;
      return;
    }
    const tempOption = document.createElement('option');
    tempOption.value = value;
    tempOption.textContent = 'Unavailable';
    select.appendChild(tempOption);
    select.value = value;
  }

  function switchPanel(panelName) {
    if (!panelName) return;
    dom.navLinks.forEach((btn) => btn.classList.toggle('active', btn.dataset.panel === panelName));
    dom.panels.forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${panelName}`));
  }

  function getDoctor(id) {
    return state.doctors.find((doc) => doc.id === id);
  }

  function getDoctorName(id) {
    const doctor = getDoctor(id);
    return doctor ? doctor.name : 'Doctor';
  }

  function getPatient(id) {
    return state.patients.find((pat) => pat.id === id);
  }

  function getPatientName(id) {
    const patient = getPatient(id);
    return patient ? patient.name : 'Patient';
  }

  function getAppointmentTime(appointment) {
    if (!appointment || !appointment.date) return Number.POSITIVE_INFINITY;
    const time = appointment.time || '00:00';
    return new Date(`${appointment.date}T${time}`).getTime();
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date)) return '';
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(date);
  }

  function formatTime(value) {
    if (!value) return '—';
    const [hours, minutes = '0'] = value.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(date);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  function statusBadge(status) {
    return `<span class="status ${statusClass(status)}">${safe(status)}</span>`;
  }

  function statusClass(status) {
    switch (status) {
      case 'Pending Assignment':
        return 'pending';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'confirmed';
    }
  }

  function safe(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (char) => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return char;
      }
    });
  }

  function toggleEmptyState(node, isEmpty, message) {
    if (!node) return;
    if (isEmpty) {
      node.dataset.empty = 'true';
      node.dataset.emptyMessage = message || 'Nothing to show.';
      node.innerHTML = '';
    } else {
      delete node.dataset.empty;
      delete node.dataset.emptyMessage;
    }
  }

  // Book Appointment from Patient Portal
  function handleBookAppointmentBtn(event) {
    const btn = event.target.closest('button[data-book-appointment]');
    if (!btn) return;
    const doctorId = btn.getAttribute('data-book-appointment');
    // Simple prompt for patient, date, time (for demo)
    let patientName = prompt("Enter your name:");
    if (!patientName) return showToast("Patient name required");
    let date = prompt("Enter appointment date (YYYY-MM-DD):");
    if (!date) return showToast("Date required");
    let time = prompt("Enter appointment time (HH:MM):");
    if (!time) return showToast("Time required");
    // Try to find patient by name, else create new
    let patient = state.patients.find(p => p.name.toLowerCase() === patientName.trim().toLowerCase());
    if (!patient) {
      patient = {
        id: generateId('pat'),
        name: patientName.trim(),
        age: 0,
        gender: "Prefer not to say",
        phone: "",
        email: "",
        primaryDoctorId: doctorId,
        issue: "",
        lastVisit: "",
        notes: ""
      };
      state.patients.push(patient);
    }
    // Create appointment
    const appointment = {
      id: generateId('apt'),
      patientId: patient.id,
      doctorId: doctorId,
      date: date,
      time: time,
      type: "Consultation",
      status: "Confirmed",
      notes: ""
    };
    state.appointments.push(appointment);
    persistState({ ...state });
    renderAll();
    showToast("Appointment booked!");
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2200);
  }

  function generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function resetStorage() {
    if (!confirm('Reset demo data? This clears all stored entries.')) return;
    state = getSeedState();
    persistState({ ...state });
    renderAll();
    showToast('Demo data restored');
  }
  } catch (err) {
    alert("JS Error: " + err.message);
    console.error(err);
  }
});
