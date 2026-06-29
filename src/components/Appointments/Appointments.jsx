import { useEffect, useMemo, useRef, useState } from "react";
import "./Appointments.css";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";

const ACCESS_TOKEN_KEY = "mab_access_token";

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
const statusLabels = {
  pendiente: "Pendiente",
  asistido: "Asistido",
  ausente: "Ausente",
};

const durationOptions = [15, 20, 30, 45, 60, 75, 90, 120];

const toMinutes = (hora) => {
  if (!hora) return 0;
  const parts = String(hora).split(":");
  const h = Number(parts[0] || 0);
  const m = Number(parts[1] || 0);
  return h * 60 + m;
};

const formatHour = (hora) => {
  if (!hora) return "--:--";
  const [h = "00", m = "00"] = String(hora).split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

const Appointments = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => dayKey(new Date()));
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState({});
  const [desktopTime, setDesktopTime] = useState({ hours: "", minutes: "" });
  const minutesInputRef = useRef(null);
  const [formData, setFormData] = useState({
    time: "",
    durationMinutes: 30,
    patientId: "",
    patientName: "",
    notasPublicas: "",
    notasPrivadas: "",
  });

  const isMobileDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  }, []);

  const getAuthHeaders = (withJson = false) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const headers = {};
    if (withJson) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const padTimePart = (value) => value.padStart(2, "0");

  const normalizeHour = (value) => {
    if (value === "") return "";
    const number = Number(value);
    if (Number.isNaN(number)) return "";
    return String(Math.max(0, Math.min(23, number))).padStart(2, "0");
  };

  const normalizeMinute = (value) => {
    if (value === "") return "";
    const number = Number(value);
    if (Number.isNaN(number)) return "";
    return String(Math.max(0, Math.min(59, number))).padStart(2, "0");
  };

  // Cargar pacientes y turnos al montar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar pacientes
        const patientsResponse = await fetch(`${API_BASE_URL}/clinicalRecords`, {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        const patientsData = await patientsResponse.json();
        if (patientsResponse.ok) {
          setPatients(Array.isArray(patientsData.payload) ? patientsData.payload : []);
        }

        // Cargar turnos del mes actual
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
        const firstDay = `${year}-${month}-01`;
        const lastDay = new Date(year, currentMonth.getMonth() + 1, 0);
        const lastDayStr = `${year}-${month}-${String(lastDay.getDate()).padStart(2, "0")}`;

        const appointmentsResponse = await fetch(
          `${API_BASE_URL}/appointments/range?fechaInicio=${firstDay}&fechaFin=${lastDayStr}`,
          { method: "GET", credentials: "include", headers: getAuthHeaders() }
        );
        const appointmentsData = await appointmentsResponse.json();
        if (appointmentsResponse.ok) {
          setAppointments(Array.isArray(appointmentsData.payload) ? appointmentsData.payload : []);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

  useEffect(() => {
    if (isMobileDevice) return;
    if (!desktopTime.hours || !desktopTime.minutes) {
      setFormData((prev) => ({ ...prev, time: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      time: `${padTimePart(desktopTime.hours)}:${padTimePart(desktopTime.minutes)}`,
    }));
  }, [desktopTime, isMobileDevice]);

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
      .filter((appointment) => appointment.fecha === selectedDate)
      .sort((a, b) => (a.hora || "").localeCompare(b.hora || "")),
    [appointments, selectedDate]
  );

  const selectedDayByStatus = useMemo(() => {
    return {
      pendiente: selectedDayAppointments.filter((item) => item.estado === "pendiente"),
      asistido: selectedDayAppointments.filter((item) => item.estado === "asistido"),
      ausente: selectedDayAppointments.filter((item) => item.estado === "ausente"),
    };
  }, [selectedDayAppointments]);

  const monthlySummary = useMemo(() => {
    const monthlyAppointments = appointments;

    return {
      total: monthlyAppointments.length,
      pendiente: monthlyAppointments.filter((item) => item.estado === "pendiente").length,
      asistido: monthlyAppointments.filter((item) => item.estado === "asistido").length,
      ausente: monthlyAppointments.filter((item) => item.estado === "ausente").length,
    };
  }, [appointments]);

  const appointmentCountByDate = useMemo(() => {
    return appointments.reduce((acc, appointment) => {
      acc[appointment.fecha] = (acc[appointment.fecha] || 0) + 1;
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

  const handleCreateAppointment = async (event) => {
    event.preventDefault();

    const selectedPatient = patients.find((patient) => String(patient.id) === formData.patientId);
    const resolvedName = selectedPatient
      ? `${selectedPatient.nombre} ${selectedPatient.apellido}`
      : formData.patientName.trim();

    if (!formData.time || !resolvedName) {
      alert("Complete los campos requeridos");
      return;
    }

    const start = toMinutes(formData.time);
    const duration = Number(formData.durationMinutes || 30);
    const end = start + duration;
    const overlap = selectedDayAppointments.some((appointment) => {
      const itemStart = toMinutes(appointment.hora);
      const itemEnd = itemStart + Number(appointment.duracionMinutos || 30);
      return start < itemEnd && itemStart < end;
    });

    if (overlap) {
      alert("Ese horario se superpone con otro turno ya agendado.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          fecha: selectedDate,
          hora: formData.time,
          duracionMinutos: duration,
          nombrePaciente: resolvedName,
          idPaciente: selectedPatient?.id || null,
          notasPublicas: formData.notasPublicas,
          notasPrivadas: formData.notasPrivadas,
          estado: "pendiente",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments((prev) => [...prev, data.payload]);
        setFormData({ time: "", durationMinutes: 30, patientId: "", patientName: "", notasPublicas: "", notasPrivadas: "" });
        setDesktopTime({ hours: "", minutes: "" });
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.message || data.error || "Error al crear el turno");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const removeAppointment = async (id) => {
    if (!window.confirm("¿Eliminar este turno?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateAppointmentStatus = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ nuevoEstado }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? data.payload : apt))
        );

        // Cargar historial
        const historyResponse = await fetch(`${API_BASE_URL}/appointments/history/${id}`, {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setAppointmentHistory((prev) => ({
            ...prev,
            [id]: Array.isArray(historyData.payload) ? historyData.payload : [],
          }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updatePrivateNotes = async (id, notasPrivadas) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ notasPrivadas }),
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? data.payload : apt))
        );
        setEditingNotes((prev) => ({ ...prev, [id]: false }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const goMonth = (delta) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleDesktopHourChange = (event) => {
    const raw = event.target.value.replace(/\D/g, "").slice(0, 2);
    setDesktopTime((prev) => ({ ...prev, hours: raw }));

    if (raw.length === 2) {
      const normalized = normalizeHour(raw);
      setDesktopTime((prev) => ({ ...prev, hours: normalized }));
      minutesInputRef.current?.focus();
    }
  };

  const handleDesktopMinuteChange = (event) => {
    const raw = event.target.value.replace(/\D/g, "").slice(0, 2);
    setDesktopTime((prev) => ({ ...prev, minutes: raw }));

    if (raw.length === 2) {
      const normalized = normalizeMinute(raw);
      setDesktopTime((prev) => ({ ...prev, minutes: normalized }));
    }
  };

  const handleDesktopHourBlur = () => {
    setDesktopTime((prev) => ({ ...prev, hours: normalizeHour(prev.hours) }));
  };

  const handleDesktopMinuteBlur = () => {
    setDesktopTime((prev) => ({ ...prev, minutes: normalizeMinute(prev.minutes) }));
  };

  if (loading) {
    return <div className="appointments-page" style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>;
  }

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

          <div className="appointments-metrics">
            <div className="appointments-metrics__card">
              <span>Total mes</span>
              <strong>{monthlySummary.total}</strong>
            </div>
            <div className="appointments-metrics__card appointments-metrics__card--pending">
              <span>Pendientes</span>
              <strong>{monthlySummary.pendiente}</strong>
            </div>
            <div className="appointments-metrics__card appointments-metrics__card--done">
              <span>Asistidos</span>
              <strong>{monthlySummary.asistido}</strong>
            </div>
            <div className="appointments-metrics__card appointments-metrics__card--missed">
              <span>Ausentes</span>
              <strong>{monthlySummary.ausente}</strong>
            </div>
          </div>
        </article>

        <article className="appointments-panel">
          <p className="appointments-panel__date">{selectedDayLabel}</p>

          <form onSubmit={handleCreateAppointment} className="appointments-form">
            <div>
              <label htmlFor="appointmentTime" className="form-label">Horario</label>
              {isMobileDevice ? (
                <input
                  id="appointmentTime"
                  type="time"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  step={60}
                  min="00:00"
                  max="23:59"
                  lang="en-GB"
                  required
                />
              ) : (
                <div className="appointments-time-inputs">
                  <input
                    id="appointmentTime"
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="HH"
                    aria-label="Hora"
                    value={desktopTime.hours}
                    onChange={handleDesktopHourChange}
                    onBlur={handleDesktopHourBlur}
                    maxLength={2}
                    required
                  />
                  <span className="appointments-time-separator">:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    placeholder="MM"
                    aria-label="Minutos"
                    value={desktopTime.minutes}
                    onChange={handleDesktopMinuteChange}
                    onBlur={handleDesktopMinuteBlur}
                    maxLength={2}
                    ref={minutesInputRef}
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="appointmentDuration" className="form-label">Duración del turno</label>
              <select
                id="appointmentDuration"
                className="form-control"
                value={formData.durationMinutes}
                onChange={(e) => setFormData((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                required
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>{duration} minutos</option>
                ))}
              </select>
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
              <label htmlFor="appointmentNotesPublic" className="form-label">Nota de tratamiento</label>
              <textarea
                id="appointmentNotesPublic"
                className="form-control"
                value={formData.notasPublicas}
                onChange={(e) => setFormData((prev) => ({ ...prev, notasPublicas: e.target.value }))}
                placeholder="Ejemplo: limpieza profunda + dermaplaning"
              />
            </div>

            <div>
              <label htmlFor="appointmentNotesPrivate" className="form-label">Notas privadas</label>
              <textarea
                id="appointmentNotesPrivate"
                className="form-control"
                value={formData.notasPrivadas}
                onChange={(e) => setFormData((prev) => ({ ...prev, notasPrivadas: e.target.value }))}
                placeholder="Notas internas (solo visible para profesionales)"
              />
            </div>

            <Button
              text="Guardar turno"
              type="submit"
              className="btn btn-meli"
            />
          </form>
        </article>
      </div>

      <article className="appointments-schedule">
        <header className="appointments-schedule__header">
          <h3>Turnos del día</h3>
          <p>{selectedDayLabel}</p>
        </header>

        <div className="appointments-schedule__grid">
          {selectedDayAppointments.length === 0 ? (
            <p className="appointments-board__empty">No hay turnos cargados para este día.</p>
          ) : (
            selectedDayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`appointments-list__item appointments-list__item--${appointment.estado}`}
              >
                <div>
                  <p className="appointments-list__time">{formatHour(appointment.hora)}</p>
                  <p className="appointments-list__duration">Duración: {appointment.duracionMinutos || 30} min</p>
                  <p>{appointment.nombrePaciente}</p>
                  <small>{appointment.notasPublicas || "Sin nota"}</small>
                  {appointment.notasPrivadas && (
                    <small style={{ display: "block", marginTop: "0.5rem", fontStyle: "italic", color: "#666" }}>
                      🔒 Privado: {appointment.notasPrivadas}
                    </small>
                  )}
                </div>

                <div className="appointments-list__actions">
                  {appointment.estado === "pendiente" ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => updateAppointmentStatus(appointment.id, "asistido")}
                      >
                        Asistió
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => updateAppointmentStatus(appointment.id, "ausente")}
                      >
                        Ausente
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateAppointmentStatus(appointment.id, "pendiente")}
                    >
                      Volver a pendiente
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setEditingNotes((prev) => ({ ...prev, [appointment.id]: !prev[appointment.id] }))}
                  >
                    Editar notas
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeAppointment(appointment.id)}
                  >
                    Cancelar
                  </button>
                </div>

                {editingNotes[appointment.id] && (
                  <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
                    <textarea
                      className="form-control form-control-sm"
                      value={appointment.notasPrivadas || ""}
                      onChange={(e) => {
                        setAppointments((prev) =>
                          prev.map((apt) =>
                            apt.id === appointment.id
                              ? { ...apt, notasPrivadas: e.target.value }
                              : apt
                          )
                        );
                      }}
                      placeholder="Editar notas privadas..."
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary mt-2"
                      onClick={() => updatePrivateNotes(appointment.id, appointment.notasPrivadas)}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
};

export default Appointments;