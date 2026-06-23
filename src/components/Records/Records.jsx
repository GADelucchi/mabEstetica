// Imports
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Records.css";
import PrincipalRecord from "../PrincipalRecord/PrincipalRecord";
import DailyRecord from "../DailyRecord/DailyRecord";
import Button from "../Button/Button";
import { API_BASE_URL } from "../../config/apiConfig";

// Code
const Records = () => {
  const [activeForm, setActiveForm] = useState("new");
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("info");
  const [formErrors, setFormErrors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dailyHistory, setDailyHistory] = useState([]);
  const [dailyHistoryLoading, setDailyHistoryLoading] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (activeForm !== "new") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000";
    ctxRef.current = context;

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
  }, [activeForm]);

  useEffect(() => {
    setFormMessage("");
    setFormErrors([]);
    setFormMessageType("info");
  }, [activeForm]);

  const fetchPatients = useCallback(async () => {
    setPatientsLoading(true);
    setPatientsError("");

    try {
      const response = await fetch(`${API_BASE_URL}/clinicalRecords`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudieron cargar las fichas principales.");
      }

      setPatients(Array.isArray(data.payload) ? data.payload : []);
    } catch (error) {
      setPatientsError(error.message || "Error al cargar pacientes.");
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const fetchDailyHistory = async () => {
      if (!selectedPatient?.id) {
        setDailyHistory([]);
        return;
      }

      setDailyHistoryLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/dailyRecords/ficha/${selectedPatient.id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudo cargar el historial diario.");
        }

        setDailyHistory(Array.isArray(data.payload) ? data.payload : []);
      } catch {
        setDailyHistory([]);
      } finally {
        setDailyHistoryLoading(false);
      }
    };

    fetchDailyHistory();
  }, [selectedPatient]);

  const filteredPatients = useMemo(() => {
    const term = patientSearchTerm.trim().toLowerCase();
    if (!term) return patients.slice(0, 10);

    return patients
      .filter((patient) => {
        const fullName = `${patient.nombre || ""} ${patient.apellido || ""}`.toLowerCase();
        const documento = String(patient.documento || "").toLowerCase();
        return fullName.includes(term) || documento.includes(term);
      })
      .slice(0, 10);
  }, [patientSearchTerm, patients]);

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(`${patient.nombre || ""} ${patient.apellido || ""}`.trim());
    if (activeForm !== "daily") {
      setActiveForm("daily");
    }
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setDailyHistory([]);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (!ctxRef.current) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const pos = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const pos = getPos(e);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    if (!ctxRef.current) return;

    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;

    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const clearValidationStyles = (form) => {
    form.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
    });

    form.querySelectorAll('[data-field-group].is-invalid').forEach((group) => {
      group.classList.remove("is-invalid");
    });

    form.querySelectorAll(".radio-group--invalid").forEach((group) => {
      group.classList.remove("radio-group--invalid");
    });

    const signatureCanvas = form.querySelector("#drawingCanvas");
    if (signatureCanvas) {
      signatureCanvas.classList.remove("signatureCanvas--invalid");
    }
  };

  const applyValidationStyles = (form, invalidFields, invalidRadioGroups, signatureInvalid) => {
    invalidFields.forEach((fieldId) => {
      const fieldGroup = form.querySelector(`[data-field-group="${fieldId}"]`);
      if (fieldGroup) {
        fieldGroup.classList.add("is-invalid");
      }

      const field = form.querySelector(`#${fieldId}`);
      if (field) {
        field.classList.add("is-invalid");
      }
    });

    invalidRadioGroups.forEach((groupName) => {
      const radioInputs = form.querySelectorAll(`input[name="${groupName}"]`);
      radioInputs.forEach((input) => input.classList.add("is-invalid"));

      const radioGroup = form.querySelector(`input[name="${groupName}"]`)?.closest(".radio-group");
      if (radioGroup) {
        radioGroup.classList.add("radio-group--invalid");
      }
    });

    if (signatureInvalid) {
      const signatureCanvas = form.querySelector("#drawingCanvas");
      if (signatureCanvas) {
        signatureCanvas.classList.add("signatureCanvas--invalid");
      }
    }
  };

  const getFieldValue = (form, id) => {
    const element = form.querySelector(`#${id}`);
    return element ? element.value.trim() : "";
  };

  const validatePrincipalForm = (form) => {
    const errors = [];
    const invalidFields = [];
    const invalidRadioGroups = [];
    let signatureInvalid = false;
    const requiredFields = [
      ["nombre", "Completá nombre/s."],
      ["apellido", "Completá apellido/s."],
      ["documento", "Completá documento."],
      ["fechaNacimiento", "Seleccioná la fecha de nacimiento."],
      ["telefono", "Completá el teléfono."],
      ["email", "Completá el email."],
      ["direccion", "Completá la dirección."],
      ["ciudad", "Completá la ciudad."],
      ["provincia", "Completá la provincia."],
      ["problemaPiel", "Describí el problema principal de piel."],
    ];

    requiredFields.forEach(([fieldId, message]) => {
      if (!getFieldValue(form, fieldId)) {
        errors.push(message);
        invalidFields.push(fieldId);
      }
    });

    const email = getFieldValue(form, "email");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Ingresá un email con formato válido.");
      invalidFields.push("email");
    }

    const phone = getFieldValue(form, "telefono");
    if (phone && !/^\d{8,15}$/.test(phone)) {
      errors.push("El teléfono debe contener entre 8 y 15 dígitos.");
      invalidFields.push("telefono");
    }

    const selectedGender = form.querySelector('input[name="sexo"]:checked');
    if (!selectedGender) {
      errors.push("Seleccioná un sexo.");
      invalidRadioGroups.push("sexo");
    }

    const selectedAuth = form.querySelector('input[name="autorizacion"]:checked');
    if (!selectedAuth) {
      errors.push("Indicá si autorizás fotografías del procedimiento.");
      invalidRadioGroups.push("autorizacion");
    }

    const declaration = form.querySelector("#declaracion");
    if (declaration && !declaration.checked) {
      errors.push("Debes aceptar la declaración de veracidad.");
      invalidFields.push("declaracion");
    }

    if (!hasSignature) {
      errors.push("Necesitás registrar la firma digital en el recuadro.");
      signatureInvalid = true;
    }

    const conditionalDetails = [
      ["vitaminas", "vitaminasTextArea", "Indicá qué vitaminas tomás."],
      ["anticonceptivos", "anticonceptivosTextArea", "Indicá qué anticonceptivos tomás."],
      ["hormonas", "hormonasTextArea", "Indicá qué hormonas tomás."],
      ["corticoides", "corticoidesTextArea", "Indicá qué corticoides tomás."],
      ["medicamentos", "medicamentosTextArea", "Indicá qué medicamentos tomás."],
      ["alergias", "alergiasTextArea", "Indicá qué alergias tenés."],
      ["cirugiasPrevias", "intervencionesTextArea", "Indicá qué intervenciones previas tuviste."],
      ["implantes", "implantesTextArea", "Indicá qué implantes tenés."],
    ];

    conditionalDetails.forEach(([radioName, detailId, message]) => {
      const selectedOption = form.querySelector(`input[name="${radioName}"]:checked`);
      if (selectedOption?.value === "Sí" && !getFieldValue(form, detailId)) {
        errors.push(message);
        invalidFields.push(detailId);
      }
    });

    return {
      errors,
      invalidFields,
      invalidRadioGroups,
      signatureInvalid,
    };
  };

  const validateDailyForm = (form) => {
    const errors = [];
    const invalidFields = [];
    const invalidRadioGroups = [];
    const idFichaPrincipal = Number(getFieldValue(form, "idFichaPrincipal"));
    const hoursSleep = Number(getFieldValue(form, "horasSueno"));
    const solarExposure = Number(getFieldValue(form, "exposicionSolar"));
    const water = Number(getFieldValue(form, "aguaDiaria"));

    if (!Number.isInteger(idFichaPrincipal) || idFichaPrincipal <= 0) {
      errors.push("Seleccioná un paciente para asociar la ficha diaria.");
      invalidFields.push("idFichaPrincipal");
    }

    if (!Number.isFinite(hoursSleep) || hoursSleep < 0 || hoursSleep > 24) {
      errors.push("Las horas de sueño deben estar entre 0 y 24.");
      invalidFields.push("horasSueno");
    }

    if (!getFieldValue(form, "ejercicio")) {
      errors.push("Completá el campo de ejercicio.");
      invalidFields.push("ejercicio");
    }

    if (!Number.isFinite(solarExposure) || solarExposure < 0 || solarExposure > 24) {
      errors.push("La exposición solar debe estar entre 0 y 24 horas.");
      invalidFields.push("exposicionSolar");
    }

    if (!Number.isFinite(water) || water <= 0 || water > 15) {
      errors.push("La cantidad de agua diaria debe ser mayor a 0 y menor o igual a 15 litros.");
      invalidFields.push("aguaDiaria");
    }

    if (!form.querySelector('input[name="protectorSolar"]:checked')) {
      errors.push("Indicá si usa protector solar.");
      invalidRadioGroups.push("protectorSolar");
    }

    if (!form.querySelector('input[name="reaplicacion"]:checked')) {
      errors.push("Indicá si reaplica protector durante el día.");
      invalidRadioGroups.push("reaplicacion");
    }

    if (!form.querySelector('input[name="alimentos"]:checked')) {
      errors.push("Seleccioná una opción en consumo de alimentos.");
      invalidRadioGroups.push("alimentos");
    }

    const requiredTextAreas = [
      ["estres", "Completá el nivel de estrés."],
      ["rutinaActual", "Completá la rutina facial actual."],
      ["aspectos", "Indicá los aspectos a seguir abordando."],
      ["tratamientosHoy", "Indicá los tratamientos realizados hoy."],
      ["rutinaDomiciliaria", "Completá la rutina domiciliaria."],
    ];

    requiredTextAreas.forEach(([fieldId, message]) => {
      if (!getFieldValue(form, fieldId)) {
        errors.push(message);
        invalidFields.push(fieldId);
      }
    });

    return {
      errors,
      invalidFields,
      invalidRadioGroups,
      signatureInvalid: false,
    };
  };

  const buildPrincipalPayload = (form) => {
    const v = (id) => {
      const el = form.querySelector(`#${id}`);
      return el ? el.value.trim() : "";
    };
    const radio = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
    const checked = (id) => form.querySelector(`#${id}`)?.checked ?? false;
    const canvas = canvasRef.current;
    const firmaDigital = canvas ? canvas.toDataURL("image/png") : "";

    return {
      nombre: v("nombre"),
      apellido: v("apellido"),
      documento: v("documento"),
      sexo: radio("sexo"),
      fechaNacimiento: v("fechaNacimiento"),
      telefono: v("telefono"),
      email: v("email"),
      redes: v("redes"),
      direccion: v("direccion"),
      ciudad: v("ciudad"),
      provincia: v("provincia"),
      profesion: v("profesion"),
      medioConocimiento: v("medioConocimiento"),
      embarazo: radio("embarazo"),
      cicloMenstrual: radio("cicloMenstrual"),
      alteracionesHormonales: v("alteracionesHormonales"),
      vitaminas: radio("vitaminas"),
      vitaminasDetalle: v("vitaminasTextArea"),
      anticonceptivos: radio("anticonceptivos"),
      anticonceptivosDetalle: v("anticonceptivosTextArea"),
      hormonas: radio("hormonas"),
      hormonasDetalle: v("hormonasTextArea"),
      corticoides: radio("corticoides"),
      corticoidesDetalle: v("corticoidesTextArea"),
      medicamentos: radio("medicamentos"),
      medicamentosDetalle: v("medicamentosTextArea"),
      alergias: radio("alergias"),
      alergiasDetalle: v("alergiasTextArea"),
      cirugiasPrevias: radio("cirugiasPrevias"),
      cirugiasPreviasDetalle: v("intervencionesTextArea"),
      marcapasos: radio("marcapasos"),
      implantes: radio("implantes"),
      implantesDetalle: v("implantesTextArea"),
      problemaPiel: v("problemaPiel"),
      desdeCuando: v("desdeCuando"),
      tratamientosPrevios: v("tratamientosPrevios"),
      reacciones: v("reacciones"),
      fototipo: v("fototipo"),
      biotipo: v("biotipo"),
      acne: v("acne"),
      autorizacion: radio("autorizacion"),
      declaracion: checked("declaracion"),
      firmaDigital,
    };
  };

  const buildDailyPayload = (form) => {
    const v = (id) => {
      const el = form.querySelector(`#${id}`);
      return el ? el.value.trim() : "";
    };
    const radio = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value ?? null;

    return {
      idFichaPrincipal: Number(v("idFichaPrincipal")) || undefined,
      fechaSesion: v("fechaSesion") || new Date().toISOString().split("T")[0],
      horasSueno: Number(v("horasSueno")),
      ejercicio: v("ejercicio"),
      exposicionSolar: Number(v("exposicionSolar")),
      protectorSolar: radio("protectorSolar"),
      reaplicacion: radio("reaplicacion"),
      aguaDiaria: Number(v("aguaDiaria")),
      alimentos: radio("alimentos"),
      estres: v("estres"),
      rutinaActual: v("rutinaActual"),
      aspectos: v("aspectos"),
      tratamientosHoy: v("tratamientosHoy"),
      rutinaDomiciliaria: v("rutinaDomiciliaria"),
    };
  };

  const sendInfoToServer = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const isPrincipalForm = form.id === "newPatientForm";
    const validationResult = isPrincipalForm
      ? validatePrincipalForm(form)
      : validateDailyForm(form);

    clearValidationStyles(form);

    const { errors, invalidFields, invalidRadioGroups, signatureInvalid } = validationResult;

    if (errors.length > 0) {
      applyValidationStyles(form, invalidFields, invalidRadioGroups, signatureInvalid);
      setFormMessageType("danger");
      setFormMessage("Hay campos pendientes o inválidos. Revisá el detalle.");
      setFormErrors(errors);
      return;
    }

    const payload = isPrincipalForm ? buildPrincipalPayload(form) : buildDailyPayload(form);
    const endpoint = isPrincipalForm
      ? `${API_BASE_URL}/clinicalRecords`
      : `${API_BASE_URL}/dailyRecords`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo guardar el registro.");
      }

      setFormMessageType("success");
      setFormErrors([]);
      setFormMessage(
        isPrincipalForm
          ? "Ficha principal guardada correctamente."
          : "Registro diario guardado correctamente."
      );

      if (isPrincipalForm && data?.payload) {
        setSelectedPatient(data.payload);
        setPatientSearchTerm(`${data.payload.nombre || ""} ${data.payload.apellido || ""}`.trim());
        fetchPatients();
      }

      if (!isPrincipalForm && selectedPatient?.id) {
        const historyResponse = await fetch(`${API_BASE_URL}/dailyRecords/ficha/${selectedPatient.id}`, {
          method: "GET",
          credentials: "include",
        });
        const historyData = await historyResponse.json();
        if (historyResponse.ok) {
          setDailyHistory(Array.isArray(historyData.payload) ? historyData.payload : []);
        }
      }

      localStorage.removeItem(isPrincipalForm ? "mab_principal_record_draft" : "mab_daily_record_draft");
      form.reset();
      if (isPrincipalForm) clearCanvas();
    } catch (err) {
      setFormMessageType("danger");
      setFormErrors([]);
      setFormMessage(err.message || "Error al guardar. Intentá nuevamente.");
    }
  };

  return (
    <section className="records-page">
      <div className="records-page__header">
        <div>
          <p className="records-page__eyebrow">Fichas clínicas</p>
          <h2>Gestión de pacientes</h2>
          <p className="records-page__text">
            Alterná entre la ficha inicial y el registro diario sin salir de la
            misma pantalla.
          </p>
        </div>
      </div>

      <section className="records-page__search">
        <div className="records-page__search-head">
          <div>
            <p className="records-page__eyebrow">Buscador de pacientes</p>
            <h3>Encontrá una ficha por nombre o documento</h3>
          </div>
          <Button
            text="Actualizar lista"
            type="button"
            className="btn btn-outline-dark"
            onClick={fetchPatients}
            disabled={patientsLoading}
          />
        </div>

        <div className="records-page__search-grid">
          <div>
            <label htmlFor="patientSearch" className="form-label">Buscar paciente</label>
            <input
              id="patientSearch"
              type="search"
              className="form-control"
              placeholder="Ejemplo: Ana Pérez o 30111222"
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
            />

            {patientsLoading && <p className="records-page__helper">Cargando pacientes...</p>}
            {patientsError && <p className="records-page__helper records-page__helper--error">{patientsError}</p>}

            <div className="records-page__result-list">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  className="records-page__result-item"
                  onClick={() => selectPatient(patient)}
                >
                  <strong>{patient.nombre} {patient.apellido}</strong>
                  <span>DNI {patient.documento}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="records-page__selected-card">
            {selectedPatient ? (
              <>
                <p className="records-page__eyebrow">Paciente seleccionado</p>
                <h4>{selectedPatient.nombre} {selectedPatient.apellido}</h4>
                <p>DNI: {selectedPatient.documento}</p>
                <p>Teléfono: {selectedPatient.telefono || "-"}</p>
                <p>Email: {selectedPatient.email || "-"}</p>
                <p>
                  Último tratamiento: {dailyHistory[0]?.tratamientosHoy || "Sin fichas diarias aún"}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <Button
                    text="Usar en ficha diaria"
                    type="button"
                    className="btn btn-meli"
                    onClick={() => setActiveForm("daily")}
                  />
                  <Button
                    text="Quitar selección"
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearSelectedPatient}
                  />
                </div>
              </>
            ) : (
              <p className="records-page__helper">Seleccioná un paciente para ver su resumen rápido.</p>
            )}
          </div>
        </div>
      </section>

      <div className="d-flex gap-2 justify-content-center mb-4" id="botonesFormulario">
        <Button
          text="+ Nuevo Paciente"
          onClick={() => setActiveForm("new")}
          className={`btn ${activeForm === "new" ? "btn-meli" : "btn-outline-dark"} records-page__switch`}
        />

        <Button
          text="+ Registro Diario"
          onClick={() => setActiveForm("daily")}
          className={`btn ${activeForm === "daily" ? "btn-meli" : "btn-outline-dark"} records-page__switch`}
        />
      </div>

      {formMessage && (
        <div className={`alert alert-${formMessageType} records-page__alert`} role="alert">
          <p>{formMessage}</p>
          {formErrors.length > 0 && (
            <ul className="records-page__errors">
              {formErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="contenedorFormularios">
        {activeForm === "new" && (
          <PrincipalRecord
            canvasRef={canvasRef}
            startDrawing={startDrawing}
            draw={draw}
            endDrawing={endDrawing}
            clearCanvas={clearCanvas}
            sendInfoToServer={sendInfoToServer}
          />
        )}

        {activeForm === "daily" && (
          <DailyRecord
            sendInfoToServer={sendInfoToServer}
            patients={patients}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            patientSearchTerm={patientSearchTerm}
            onPatientSearchTermChange={setPatientSearchTerm}
            dailyHistory={dailyHistory}
            dailyHistoryLoading={dailyHistoryLoading}
          />
        )}
      </div>
    </section>
  );
};

// Exports
export default Records;
