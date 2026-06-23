// Imports
import { useEffect, useMemo, useRef } from "react";
import "./DailyRecord.css";
import Button from "../Button/Button";

const DAILY_RECORD_DRAFT_KEY = "mab_daily_record_draft";

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const parsedDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return dateValue;

  return parsedDate.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Code
const DailyRecord = ({
  sendInfoToServer,
  patients = [],
  selectedPatient,
  onSelectPatient,
  patientSearchTerm,
  onPatientSearchTermChange,
  dailyHistory = [],
  dailyHistoryLoading = false,
}) => {
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const savedDraftRaw = localStorage.getItem(DAILY_RECORD_DRAFT_KEY);
    if (!savedDraftRaw) return;

    try {
      const savedDraft = JSON.parse(savedDraftRaw);

      Object.entries(savedDraft).forEach(([key, value]) => {
        const radioCandidates = form.querySelectorAll(`input[type="radio"][name="${key}"]`);
        if (radioCandidates.length > 0) {
          radioCandidates.forEach((radio) => {
            radio.checked = radio.value === value;
          });
          return;
        }

        const fieldById = form.querySelector(`#${key}`);
        if (!fieldById) return;

        if (fieldById.type === "checkbox") {
          fieldById.checked = Boolean(value);
          return;
        }

        fieldById.value = value;
      });
    } catch {
      localStorage.removeItem(DAILY_RECORD_DRAFT_KEY);
    }
  }, []);

  const filteredPatients = useMemo(() => {
    const term = patientSearchTerm.trim().toLowerCase();
    if (!term) return [];

    return patients
      .filter((patient) => {
        const fullName = `${patient.nombre || ""} ${patient.apellido || ""}`.toLowerCase();
        const documento = String(patient.documento || "").toLowerCase();
        return fullName.includes(term) || documento.includes(term);
      })
      .slice(0, 8);
  }, [patients, patientSearchTerm]);

  const persistDraft = () => {
    const form = formRef.current;
    if (!form) return;

    const draft = {};
    const fields = form.querySelectorAll("input, textarea, select");

    fields.forEach((field) => {
      if (field.type === "radio") {
        if (field.checked) {
          draft[field.name] = field.value;
        }
        return;
      }

      if (field.type === "checkbox") {
        draft[field.id || field.name] = field.checked;
        return;
      }

      if ((field.id || field.name) === "idFichaPrincipal") {
        return;
      }

      draft[field.id || field.name] = field.value;
    });

    localStorage.setItem(DAILY_RECORD_DRAFT_KEY, JSON.stringify(draft));
  };

  const clearDraft = () => {
    localStorage.removeItem(DAILY_RECORD_DRAFT_KEY);
    if (formRef.current) formRef.current.reset();
  };

  const handlePatientSelect = (patient) => {
    onSelectPatient(patient);
    onPatientSearchTermChange(`${patient.nombre || ""} ${patient.apellido || ""}`.trim());
  };

  return (
    <div id="gestionFichas" className="d-flex">
      <form
        ref={formRef}
        id="dailyRecordForm"
        onSubmit={sendInfoToServer}
        onInput={persistDraft}
        onChange={persistDraft}
        noValidate
      >
        <legend>
          <strong>Ficha diaria</strong>
        </legend>

        <fieldset>
          <legend>Paciente</legend>

          <div className="mb-3">
            <label htmlFor="dailyPatientSearch" className="form-label">
              Buscar paciente por nombre, apellido o documento
            </label>
            <input
              type="search"
              id="dailyPatientSearch"
              className="form-control"
              placeholder="Ejemplo: Ana, Pérez o 30111222"
              value={patientSearchTerm}
              onChange={(e) => onPatientSearchTermChange(e.target.value)}
            />
          </div>

          {patientSearchTerm.trim() && !selectedPatient && filteredPatients.length > 0 && (
            <div className="daily-record__search-results" role="listbox" aria-label="Resultados de pacientes">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  className="daily-record__search-item"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <strong>{patient.nombre} {patient.apellido}</strong>
                  <span>DNI {patient.documento}</span>
                </button>
              ))}
            </div>
          )}

          {patientSearchTerm.trim() && filteredPatients.length === 0 && !selectedPatient && (
            <p className="daily-record__empty">No se encontraron pacientes para esa búsqueda.</p>
          )}

          <input
            type="hidden"
            id="idFichaPrincipal"
            name="idFichaPrincipal"
            value={selectedPatient?.id ?? ""}
            readOnly
          />

          {selectedPatient ? (
            <div className="daily-record__patient-card" data-field-group="idFichaPrincipal">
              <p className="daily-record__patient-title">Paciente seleccionado</p>
              <h3>{selectedPatient.nombre} {selectedPatient.apellido}</h3>
              <p>DNI: {selectedPatient.documento}</p>
              <p>Email: {selectedPatient.email || "-"}</p>
              <p>Teléfono: {selectedPatient.telefono || "-"}</p>
            </div>
          ) : (
            <p className="daily-record__empty" data-field-group="idFichaPrincipal">
              Seleccioná un paciente antes de guardar la ficha diaria.
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend>Hábitos</legend>
          <div className="mb-3">
            <label htmlFor="horasSueno" className="form-label">
              Horas de sueño
            </label>
            <input
              type="number"
              className="form-control"
              id="horasSueno"
              name="horasSueno"
              placeholder="Ingrese las horas de sueño"
              min="0"
              max="24"
              step="0.5"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ejercicio" className="form-label">
              Ejercicio
            </label>
            <input
              type="text"
              className="form-control"
              id="ejercicio"
              name="ejercicio"
              placeholder="Describa su rutina de ejercicio"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exposicionSolar" className="form-label">
              Tiempo en horas de exposición solar durante el día
            </label>
            <input
              type="number"
              className="form-control"
              id="exposicionSolar"
              name="exposicionSolar"
              placeholder="Ingrese el tiempo"
              min="0"
              max="24"
              step="0.5"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">¿Usa protector solar?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="protectorSi"
                name="protectorSolar"
                value="Sí"
                required
              />
              <label htmlFor="protectorSi">Sí</label>
              <input
                type="radio"
                id="protectorNo"
                name="protectorSolar"
                value="No"
              />
              <label htmlFor="protectorNo">No</label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">¿Reaplica durante el día?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="reaplicaSi"
                name="reaplicacion"
                value="Sí"
                required
              />
              <label htmlFor="reaplicaSi">Sí</label>
              <input
                type="radio"
                id="reaplicaNo"
                name="reaplicacion"
                value="No"
              />
              <label htmlFor="reaplicaNo">No</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="aguaDiaria" className="form-label">
              Cantidad de agua que toma al día
            </label>
            <input
              type="number"
              className="form-control"
              id="aguaDiaria"
              name="aguaDiaria"
              placeholder="Ingrese la cantidad"
              min="0.1"
              max="15"
              step="0.1"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Consumo de alimentos</label>
            <div className="radio-group">
              <input
                type="radio"
                id="alimentosBueno"
                name="alimentos"
                value="Bueno"
                required
              />
              <label htmlFor="alimentosBueno">Bueno</label>
              <input
                type="radio"
                id="alimentosBalanceado"
                name="alimentos"
                value="Balanceado/Regular"
              />
              <label htmlFor="alimentosBalanceado">Balanceado/Regular</label>
              <input
                type="radio"
                id="alimentosMalo"
                name="alimentos"
                value="Malo"
              />
              <label htmlFor="alimentosMalo">Malo</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="estres" className="form-label">
              Exposición al estrés
            </label>
            <input
              type="text"
              className="form-control"
              id="estres"
              name="estres"
              placeholder="Describa su nivel de estrés"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rutinaActual" className="form-label">
              Rutina facial actual
            </label>
            <textarea
              type="text"
              className="form-control"
              id="rutinaActual"
              name="rutinaActual"
              placeholder="Ingrese el tratamiento actual"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="aspectos" className="form-label">
              ¿Qué aspectos seguimos abordando?
            </label>
            <textarea
              type="text"
              className="form-control"
              id="aspectos"
              name="aspectos"
              placeholder="Ingrese los aspectos a seguir abordando"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tratamientosHoy" className="form-label">
              Tratamientos realizados en la sesión
            </label>
            <textarea
              type="text"
              className="form-control"
              id="tratamientosHoy"
              name="tratamientosHoy"
              placeholder="Ingrese los tratamientos realizados hoy"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rutinaDomiciliaria" className="form-label">
              Rutina domiciliaria
            </label>
            <textarea
              type="text"
              className="form-control"
              id="rutinaDomiciliaria"
              name="rutinaDomiciliaria"
              placeholder="Ingrese la rutina domiciliaria"
              required
            />
          </div>
        </fieldset>

        {selectedPatient && (
          <fieldset>
            <legend>Historial diario del paciente</legend>

            {dailyHistoryLoading ? (
              <p className="daily-record__empty">Cargando historial...</p>
            ) : dailyHistory.length === 0 ? (
              <p className="daily-record__empty">Aún no hay fichas diarias registradas para este paciente.</p>
            ) : (
              <div className="daily-record__history">
                {dailyHistory.map((record) => (
                  <article key={record.id} className="daily-record__history-card">
                    <p className="daily-record__history-date">Sesión: {formatDate(record.fechaSesion)}</p>
                    <p><strong>Tratamiento:</strong> {record.tratamientosHoy || "-"}</p>
                    <p><strong>Aspectos a trabajar:</strong> {record.aspectos || "-"}</p>
                    <p><strong>Rutina domiciliaria:</strong> {record.rutinaDomiciliaria || "-"}</p>
                  </article>
                ))}
              </div>
            )}
          </fieldset>
        )}

        <div className="d-flex justify-content-center gap-3">
          <Button
            text="Borrar borrador"
            type="button"
            onClick={clearDraft}
            className={"btn btn-outline-secondary"}
          />
          <Button
            text="Enviar"
            type="submit"
            className={"btn btn-meli"}
          />
        </div>
      </form>
    </div>
  );
};

// Exports
export default DailyRecord;