import { useEffect, useMemo, useState } from "react";
import "./Appointments.css";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";

const STORAGE_KEY = "mab_appointments";

const dayKey = (date) => {
  const offset = date.getTimezoneOffset();
  const normalized = new Date(date.getTime() - offset * 60000);
  return normalized.toISOString().split("T")[0];
};

const monthLabel = (date) =>
  date.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

const weekdayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const Appointments = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => dayKey(new Date()));
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [formData, setFormData] = useState({
    time: "",
    patientId: "",
    patientName: "",
    note: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clinicalRecords`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) return;
        setPatients(Array.isArray(data.payload) ? data.payload : []);
      } catch {
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const days = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const selectedDayAppointments = useMemo(
    () => appointments
      .filter((appointment) => appointment.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  );

  const appointmentCountByDate = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      acc[appointment.date] = (acc[appointment.date] || 0) + 1;
      return acc;
    }, {});
  }, [appointments]);

  const selectedDayLabel = useMemo(() => {
    const date = new Date(`${selectedDate}T00:00:00`);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const handleCreateAppointment = (event) => {
    event.preventDefault();

    const selectedPatient = patients.find((patient) => String(patient.id) === formData.patientId);
    const resolvedName = selectedPatient
      ? `${selectedPatient.nombre} ${selectedPatient.apellido}`
      : formData.patientName.trim();

    if (!formData.time || !resolvedName) {
      return;
    }

    const newAppointment = {
      id: crypto.randomUUID(),
      date: selectedDate,
      time: formData.time,
      patientName: resolvedName,
      patientId: selectedPatient?.id || null,
      note: formData.note.trim(),
    };

    setAppointments((prev) => [...prev, newAppointment]);
    setFormData({ time: "", patientId: "", patientName: "", note: "" });
  };

  const removeAppointment = (id) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  };

  const goMonth = (delta) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <section className="appointments-page">
      <div className="appointments-page__hero">
        <p className="appointments-page__eyebrow">Agenda</p>
        <h2>Turnos mensuales</h2>
        <p>
          Seleccioná un día del calendario para cargar horario, paciente y notas de trabajo.
        </p>
      </div>

      <div className="appointments-layout">
        <article className="appointments-calendar">
          <header className="appointments-calendar__header">
            <Button
              text="‹"
              type="button"
              className="btn btn-outline-dark"
              onClick={() => goMonth(-1)}
            />
            <h3>{monthLabel(currentMonth)}</h3>
            <Button
              text="›"
              type="button"
              className="btn btn-outline-dark"
              onClick={() => goMonth(1)}
            />
          </header>

          <div className="appointments-calendar__grid appointments-calendar__grid--labels">
            {weekdayLabels.map((label) => (
              <span key={label} className="appointments-calendar__label">{label}</span>
            ))}
          </div>

          <div className="appointments-calendar__grid">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} className="appointments-calendar__day appointments-calendar__day--empty" />;
              }

              const key = dayKey(date);
              const isSelected = key === selectedDate;
              const count = appointmentCountByDate[key] || 0;

              return (
                <button
                  key={key}
                  type="button"
                  className={`appointments-calendar__day${isSelected ? " appointments-calendar__day--selected" : ""}`}
                  onClick={() => setSelectedDate(key)}
                >
                  <span>{date.getDate()}</span>
                  {count > 0 && <small>{count} turno{count > 1 ? "s" : ""}</small>}
                </button>
              );
            })}
          </div>
        </article>

        <article className="appointments-panel">
          <p className="appointments-panel__date">{selectedDayLabel}</p>

          <form onSubmit={handleCreateAppointment} className="appointments-form">
            <div>
              <label htmlFor="appointmentTime" className="form-label">Horario</label>
              <input
                id="appointmentTime"
                type="time"
                className="form-control"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="appointmentPatient" className="form-label">Paciente registrado (opcional)</label>
              <select
                id="appointmentPatient"
                className="form-control"
                value={formData.patientId}
                onChange={(e) => {
                  const value = e.target.value;
                  const patient = patients.find((item) => String(item.id) === value);
                  setFormData((prev) => ({
                    ...prev,
                    patientId: value,
                    patientName: patient ? `${patient.nombre} ${patient.apellido}` : prev.patientName,
                  }));
                }}
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nombre} {patient.apellido} - DNI {patient.documento}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="appointmentName" className="form-label">Paciente (manual)</label>
              <input
                id="appointmentName"
                type="text"
                className="form-control"
                value={formData.patientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                placeholder="Nombre del paciente"
                required
              />
            </div>

            <div>
              <label htmlFor="appointmentNote" className="form-label">Nota de tratamiento</label>
              <textarea
                id="appointmentNote"
                className="form-control"
                value={formData.note}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Ejemplo: limpieza profunda + dermaplaning"
              />
            </div>

            <Button
              text="Guardar turno"
              type="submit"
              className="btn btn-meli"
            />
          </form>

          <div className="appointments-list">
            <h4>Turnos del día</h4>
            {selectedDayAppointments.length === 0 ? (
              <p>No hay turnos cargados para esta fecha.</p>
            ) : (
              selectedDayAppointments.map((appointment) => (
                <div key={appointment.id} className="appointments-list__item">
                  <div>
                    <p className="appointments-list__time">{appointment.time}</p>
                    <p>{appointment.patientName}</p>
                    <small>{appointment.note || "Sin nota"}</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeAppointment(appointment.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Appointments;