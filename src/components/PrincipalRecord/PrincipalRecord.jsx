// Imports
import { useState, useEffect, useRef } from "react";
import "./PrincipalRecord.css";
import Button from "../Button/Button";
import { Tooltip } from "bootstrap";

const PRINCIPAL_RECORD_DRAFT_KEY = "mab_principal_record_draft";

// Code
const PrincipalRecord = ({
  canvasRef,
  startDrawing,
  draw,
  endDrawing,
  clearCanvas,
  sendInfoToServer,
}) => {
  const formRef = useRef(null);
  const birthDayRef = useRef(null);
  const birthMonthRef = useRef(null);
  const birthYearRef = useRef(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateParts, setBirthDateParts] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [age, setAge] = useState(null);
  const [showTextArea, setShowTextArea] = useState({
    vitaminasTextArea: false,
    anticonceptivosTextArea: false,
    hormonasTextArea: false,
    corticoidesTextArea: false,
    medicamentosTextArea: false,
    alergiasTextArea: false,
    intervencionesTextArea: false,
    implantesTextArea: false,
  });

  const calculateAge = (birthDateStr) => {
    const today = new Date();
    const birthDate = new Date(birthDateStr);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const isValidBirthDate = (year, month, day) => {
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) return false;

    const numericYear = Number(year);
    const numericMonth = Number(month);
    const numericDay = Number(day);

    if (
      !Number.isInteger(numericYear) ||
      !Number.isInteger(numericMonth) ||
      !Number.isInteger(numericDay) ||
      numericMonth < 1 ||
      numericMonth > 12 ||
      numericDay < 1
    ) {
      return false;
    }

    const candidateDate = new Date(`${year}-${month}-${day}T00:00:00`);

    return (
      !Number.isNaN(candidateDate.getTime()) &&
      candidateDate.getFullYear() === numericYear &&
      candidateDate.getMonth() + 1 === numericMonth &&
      candidateDate.getDate() === numericDay
    );
  };

  const updateBirthDateState = (nextParts) => {
    setBirthDateParts(nextParts);

    if (isValidBirthDate(nextParts.year, nextParts.month, nextParts.day)) {
      const formattedDate = `${nextParts.year}-${nextParts.month}-${nextParts.day}`;
      setBirthDate(formattedDate);
      setAge(calculateAge(formattedDate));
      return;
    }

    setBirthDate("");
    setAge(null);
  };

  const handleBirthDatePartChange = (part, maxLength, nextFieldRef) => (e) => {
    const sanitizedValue = e.target.value.replace(/\D/g, "").slice(0, maxLength);
    const nextParts = {
      ...birthDateParts,
      [part]: sanitizedValue,
    };

    updateBirthDateState(nextParts);

    if (sanitizedValue.length === maxLength && nextFieldRef?.current) {
      nextFieldRef.current.focus();
      nextFieldRef.current.select();
    }
  };

  const handleBirthDatePartKeyDown = (previousFieldRef, currentValue) => (e) => {
    if (e.key === "Backspace" && !currentValue && previousFieldRef?.current) {
      previousFieldRef.current.focus();
    }
  };

  const toggleTextArea = (textAreaId, show) => {
    setShowTextArea((prev) => ({
      ...prev,
      [textAreaId]: show,
    }));
  };

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const savedDraftRaw = localStorage.getItem(PRINCIPAL_RECORD_DRAFT_KEY);
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

      const savedBirthDate = savedDraft.fechaNacimiento || "";
      const savedBirthDateParts = savedBirthDate
        ? (() => {
            const [year = "", month = "", day = ""] = savedBirthDate.split("-");
            return { day, month, year };
          })()
        : {
            day: savedDraft.fechaNacimientoDia || "",
            month: savedDraft.fechaNacimientoMes || "",
            year: savedDraft.fechaNacimientoAnio || "",
          };

      setBirthDate(savedBirthDate);
      setBirthDateParts(savedBirthDateParts);
      setAge(savedBirthDate ? calculateAge(savedBirthDate) : null);

      setShowTextArea({
        vitaminasTextArea: savedDraft.vitaminas === "Sí",
        anticonceptivosTextArea: savedDraft.anticonceptivos === "Sí",
        hormonasTextArea: savedDraft.hormonas === "Sí",
        corticoidesTextArea: savedDraft.corticoides === "Sí",
        medicamentosTextArea: savedDraft.medicamentos === "Sí",
        alergiasTextArea: savedDraft.alergias === "Sí",
        intervencionesTextArea: savedDraft.cirugiasPrevias === "Sí",
        implantesTextArea: savedDraft.implantes === "Sí",
      });
    } catch {
      localStorage.removeItem(PRINCIPAL_RECORD_DRAFT_KEY);
    }
  }, []);

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

      draft[field.id || field.name] = field.value;
    });

    localStorage.setItem(PRINCIPAL_RECORD_DRAFT_KEY, JSON.stringify(draft));
  };

  const clearDraft = () => {
    localStorage.removeItem(PRINCIPAL_RECORD_DRAFT_KEY);
    if (formRef.current) formRef.current.reset();
    setBirthDate("");
    setBirthDateParts({ day: "", month: "", year: "" });
    setAge(null);
    setShowTextArea({
      vitaminasTextArea: false,
      anticonceptivosTextArea: false,
      hormonasTextArea: false,
      corticoidesTextArea: false,
      medicamentosTextArea: false,
      alergiasTextArea: false,
      intervencionesTextArea: false,
      implantesTextArea: false,
    });
    clearCanvas();
  };

  return (
    <div id="gestionFichas" className="d-flex">
      <form
        ref={formRef}
        id="newPatientForm"
        onSubmit={sendInfoToServer}
        onInput={persistDraft}
        onChange={persistDraft}
        noValidate
      >
        <legend>
          <strong>Ficha de primera vez</strong>
        </legend>
        {/* Sección 1: Datos personales */}
        <fieldset>
          <legend>Datos personales</legend>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre/s
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su nombre o nombres"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellido" className="form-label">
              Apellido/s
            </label>
            <input
              type="text"
              className="form-control"
              id="apellido"
              name="apellido"
              placeholder="Ingrese su apellido"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="documento" className="form-label">
              Documento
            </label>
            <input
              type="text"
              className="form-control"
              id="documento"
              name="documento"
              placeholder="Ingrese su documento"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Sexo</label>
            <div className="radio-group">
              <input
                type="radio"
                id="sexoMasculino"
                name="sexo"
                value="Masculino"
                required
              />
              <label htmlFor="sexoMasculino">Masculino</label>
              <input
                type="radio"
                id="sexoFemenino"
                name="sexo"
                value="Femenino"
              />
              <label htmlFor="sexoFemenino">Femenino</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="fechaNacimiento" className="form-label">
              Fecha de nacimiento
            </label>
            <div className="birth-date-fields" data-field-group="fechaNacimiento">
              <input
                ref={birthDayRef}
                type="text"
                className="form-control"
                id="fechaNacimientoDia"
                inputMode="numeric"
                autoComplete="bday-day"
                placeholder="DD"
                value={birthDateParts.day}
                onChange={handleBirthDatePartChange("day", 2, birthMonthRef)}
                onKeyDown={handleBirthDatePartKeyDown(null, birthDateParts.day)}
                aria-label="Día de nacimiento"
              />
              <span className="birth-date-fields__separator">/</span>
              <input
                ref={birthMonthRef}
                type="text"
                className="form-control"
                id="fechaNacimientoMes"
                inputMode="numeric"
                autoComplete="bday-month"
                placeholder="MM"
                value={birthDateParts.month}
                onChange={handleBirthDatePartChange("month", 2, birthYearRef)}
                onKeyDown={handleBirthDatePartKeyDown(birthDayRef, birthDateParts.month)}
                aria-label="Mes de nacimiento"
              />
              <span className="birth-date-fields__separator">/</span>
              <input
                ref={birthYearRef}
                type="text"
                className="form-control birth-date-fields__year"
                id="fechaNacimientoAnio"
                inputMode="numeric"
                autoComplete="bday-year"
                placeholder="AAAA"
                value={birthDateParts.year}
                onChange={handleBirthDatePartChange("year", 4, null)}
                onKeyDown={handleBirthDatePartKeyDown(birthMonthRef, birthDateParts.year)}
                aria-label="Año de nacimiento"
              />
            </div>
            <input
              type="hidden"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={birthDate}
              readOnly
            />
            {age !== null && <small>Edad: {age}</small>}
          </div>
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Número de teléfono
            </label>
            <input
              type="tel"
              className="form-control"
              id="telefono"
              name="telefono"
              placeholder="Ingrese su número de teléfono"
              pattern="[0-9]{8,15}"
              inputMode="numeric"
              required
            />
            <small id="numeroTelefonico" className="form-text text-muted">
              Ingresar código de país sin el + y código de área. Ejemplo
              2214567890
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Ingrese su email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Redes sociales
            </label>
            <input
              type="text"
              className="form-control"
              id="redes"
              name="redes"
              placeholder="Ingrese su red social"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="direccion"
              name="direccion"
              placeholder="Ingrese su dirección"
              required
            />
            <small id="numeroTelefonico" className="form-text text-muted">
              Número o nombre de calle y altura. Ejemplo "Calle Falsa 123"
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="Ciudad" className="form-label">
              Ciudad
            </label>
            <input
              type="text"
              className="form-control"
              id="ciudad"
              name="ciudad"
              placeholder="Ciudad"
              required
            />
            <label htmlFor="Provincia" className="form-label">
              Provincia
            </label>
            <input
              type="text"
              className="form-control"
              id="provincia"
              name="provincia"
              placeholder="Provincia"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profesion" className="form-label">
              Profesión
            </label>
            <input
              type="text"
              className="form-control"
              id="profesion"
              placeholder="Ingrese su profesión"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="medioConocido" className="form-label">
              ¿Medio por el cual llegó a nosotros?
            </label>
            <input
              type="text"
              className="form-control"
              id="medioConocido"
              placeholder="Ingrese el medio"
            />
          </div>
        </fieldset>

        {/* Sección 2: Datos de interés */}
        <fieldset>
          <legend>Datos de interés</legend>
          <div className="mb-3">
            <label className="form-label">¿Está embarazada?</label>
            <div className="radio-group">
              <input type="radio" id="embarazoSi" name="embarazo" value="Sí" />
              <label htmlFor="embarazoSi">Sí</label>
              <input type="radio" id="embarazoNo" name="embarazo" value="No" />
              <label htmlFor="embarazoNo">No</label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Ciclo menstrual</label>
            <div className="radio-group">
              <input
                type="radio"
                id="cicloRegular"
                name="cicloMenstrual"
                value="Regular"
              />
              <label htmlFor="cicloRegular">Regular</label>
              <input
                type="radio"
                id="cicloIrregular"
                name="cicloMenstrual"
                value="Irregular"
              />
              <label htmlFor="cicloIrregular">Irregular</label>
              <input
                type="radio"
                id="noMenstrua"
                name="cicloMenstrual"
                value="No menstrua"
              />
              <label htmlFor="noMenstrua">No menstrua</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="alteracionesHormonales" className="form-label">
              Alteraciones hormonales
            </label>
            <textarea
              className="form-control"
              id="alteracionesHormonales"
              rows="3"
              placeholder="Describa si tiene alteraciones hormonales"
            ></textarea>
          </div>
        </fieldset>

        {/* Sección 3: Medicamentos/Sustancias */}
        <fieldset>
          <legend>Medicamentos/Sustancias que toma habitualmente</legend>
          <div className="mb-3">
            <label className="form-label">¿Toma vitaminas?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="vitaminasSi"
                name="vitaminas"
                value="Sí"
                onClick={() => toggleTextArea("vitaminasTextArea", true)}
              />
              <label htmlFor="vitaminasSi">Sí</label>
              <input
                type="radio"
                id="vitaminasNo"
                name="vitaminas"
                value="No"
                onClick={() => toggleTextArea("vitaminasTextArea", false)}
              />
              <label htmlFor="vitaminasNo">No</label>
            </div>
            {showTextArea.vitaminasTextArea && (
              <textarea
                className="form-control mt-2"
                id="vitaminasTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">¿Toma anticonceptivos?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="anticonceptivosSi"
                name="anticonceptivos"
                value="Sí"
                onClick={() => toggleTextArea("anticonceptivosTextArea", true)}
              />
              <label htmlFor="anticonceptivosSi">Sí</label>
              <input
                type="radio"
                id="anticonceptivosNo"
                name="anticonceptivos"
                value="No"
                onClick={() => toggleTextArea("anticonceptivosTextArea", false)}
              />
              <label htmlFor="anticonceptivosNo">No</label>
            </div>
            {showTextArea.anticonceptivosTextArea && (
              <textarea
                className="form-control mt-2"
                id="anticonceptivosTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">¿Toma otras hormonas?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="hormonasSi"
                name="hormonas"
                value="Sí"
                onClick={() => toggleTextArea("hormonasTextArea", true)}
              />
              <label htmlFor="hormonasSi">Sí</label>
              <input
                type="radio"
                id="hormonasNo"
                name="hormonas"
                value="No"
                onClick={() => toggleTextArea("hormonasTextArea", false)}
              />
              <label htmlFor="hormonasNo">No</label>
            </div>
            {showTextArea.hormonasTextArea && (
              <textarea
                className="form-control mt-2"
                id="hormonasTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">¿Toma corticoides?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="corticoidesSi"
                name="corticoides"
                value="Sí"
                onClick={() => toggleTextArea("corticoidesTextArea", true)}
              />
              <label htmlFor="corticoidesSi">Sí</label>
              <input
                type="radio"
                id="corticoidesNo"
                name="corticoides"
                value="No"
                onClick={() => toggleTextArea("corticoidesTextArea", false)}
              />
              <label htmlFor="corticoidesNo">No</label>
            </div>
            {showTextArea.corticoidesTextArea && (
              <textarea
                className="form-control mt-2"
                id="corticoidesTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">¿Toma otros medicamentos?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="medicamentosSi"
                name="medicamentos"
                value="Sí"
                onClick={() => toggleTextArea("medicamentosTextArea", true)}
              />
              <label htmlFor="medicamentosSi">Sí</label>
              <input
                type="radio"
                id="medicamentosNo"
                name="medicamentos"
                value="No"
                onClick={() => toggleTextArea("medicamentosTextArea", false)}
              />
              <label htmlFor="medicamentosNo">No</label>
            </div>
            {showTextArea.medicamentosTextArea && (
              <textarea
                className="form-control mt-2"
                id="medicamentosTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
        </fieldset>

        {/* Sección 4: Más datos de interés */}
        <fieldset>
          <legend>Más datos de interés</legend>
          <div className="mb-3">
            <label className="form-label">¿Tiene alergias?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="alergiasSi"
                name="alergias"
                value="Sí"
                onClick={() => toggleTextArea("alergiasTextArea", true)}
              />
              <label htmlFor="alergiasSi">Sí</label>
              <input
                type="radio"
                id="alergiasNo"
                name="alergias"
                value="No"
                onClick={() => toggleTextArea("alergiasTextArea", false)}
              />
              <label htmlFor="alergiasNo">No</label>
            </div>
            {showTextArea.alergiasTextArea && (
              <textarea
                className="form-control mt-2"
                id="alergiasTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">
              ¿Ha tenido intervenciones quirúrgicas o estéticas?
            </label>
            <div className="radio-group">
              <input
                type="radio"
                id="intervencionesSi"
                name="cirugiasPrevias"
                value="Sí"
                onClick={() => toggleTextArea("intervencionesTextArea", true)}
              />
              <label htmlFor="intervencionesSi">Sí</label>
              <input
                type="radio"
                id="intervencionesNo"
                name="cirugiasPrevias"
                value="No"
                onClick={() => toggleTextArea("intervencionesTextArea", false)}
              />
              <label htmlFor="intervencionesNo">No</label>
            </div>
            {showTextArea.intervencionesTextArea && (
              <textarea
                className="form-control mt-2"
                id="intervencionesTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">¿Tiene marcapasos?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="marcapasosSi"
                name="marcapasos"
                value="Sí"
              />
              <label htmlFor="marcapasosSi">Sí</label>
              <input
                type="radio"
                id="marcapasosNo"
                name="marcapasos"
                value="No"
              />
              <label htmlFor="marcapasosNo">No</label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">¿Tiene implantes?</label>
            <div className="radio-group">
              <input
                type="radio"
                id="implantesSi"
                name="implantes"
                value="Sí"
                onClick={() => toggleTextArea("implantesTextArea", true)}
              />
              <label htmlFor="implantesSi">Sí</label>
              <input
                type="radio"
                id="implantesNo"
                name="implantes"
                value="No"
                onClick={() => toggleTextArea("implantesTextArea", false)}
              />
              <label htmlFor="implantesNo">No</label>
            </div>
            {showTextArea.implantesTextArea && (
              <textarea
                className="form-control mt-2"
                id="implantesTextArea"
                rows="2"
                placeholder="¿Cuáles?"
              ></textarea>
            )}
          </div>
        </fieldset>

        {/* Sección 5: Problemas de la piel */}
        <fieldset>
          <legend>Problemas de la piel</legend>
          <div className="mb-3">
            <label htmlFor="problemaPiel" className="form-label">
              ¿Problema de la piel que más le preocupa o quiere mejorar?
            </label>
            <textarea
              className="form-control"
              id="problemaPiel"
              name="problemaPiel"
              rows="2"
              placeholder="Describa el problema"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="desdeCuando" className="form-label">
              ¿Desde cuándo lo padece?
            </label>
            <input
              type="text"
              className="form-control"
              id="desdeCuando"
              placeholder="Ingrese el tiempo"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tratamientosPrevios" className="form-label">
              ¿Tratamientos realizados anteriormente?
            </label>
            <textarea
              className="form-control"
              id="tratamientosPrevios"
              rows="2"
              placeholder="Describa los tratamientos"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="reacciones" className="form-label">
              ¿Reacciones positivas o negativas observadas posterior al
              tratamiento?
            </label>
            <textarea
              className="form-control"
              id="reacciones"
              rows="2"
              placeholder="Describa las reacciones"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="fototipo" className="form-label">
              Fototipo{" "}
              <i
                className="bi bi-info-circle"
                data-bs-toggle="tooltip"
                title="Clasificación según la respuesta de la piel a la exposición solar. Ej: I (muy clara), VI (muy oscura)"
                style={{ cursor: "pointer" }}
              ></i>
            </label>
            <textarea
              className="form-control"
              id="fototipo"
              placeholder="Ingrese el fototipo del paciente"
              rows="1"
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="biotipo" className="form-label">
              Biotipo{" "}
              <i
                className="bi bi-info-circle"
                data-bs-toggle="tooltip"
                title="Clasificación morfológica del cuerpo: Ectomorfo (delgado), Mesomorfo (atlético), Endomorfo (tendencia a acumular grasa)"
                style={{ cursor: "pointer" }}
              ></i>
            </label>
            <textarea
              className="form-control"
              id="biotipo"
              placeholder="Ingrese el biotipo del paciente"
              rows="3"
            ></textarea>
          </div>
        </fieldset>

        {/* Sección 6: Autorización */}
        <fieldset>
          <legend>Autorización</legend>
          <div className="mb-3">
            <label className="form-label">
              ¿Autoriza a que MAB Estética tome fotografías confidenciales de su
              procedimiento estético con el único fin de observar los resultados
              y el avance de su tratamiento?
            </label>
            <div className="radio-group">
              <input
                type="radio"
                id="autorizaSi"
                name="autorizacion"
                value="Sí autorizo"
                required
              />
              <label htmlFor="autorizaSi">Sí autorizo</label>
              <input
                type="radio"
                id="autorizaNo"
                name="autorizacion"
                value="No autorizo"
              />
              <label htmlFor="autorizaNo">No autorizo</label>
            </div>
          </div>
        </fieldset>

        {/* Declaración */}
        <div className="form-check mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="declaracion"
            required
          />
          <label className="form-check-label" htmlFor="declaracion">
            Declaro que toda la información brindada anteriormente es totalmente
            verídica.
          </label>
        </div>

        {/* Canvas para dibujar */}
        <div className="mt-4">
          <label htmlFor="drawingCanvas" className="form-label">
            Firme aquí:
          </label>
          <canvas
            ref={canvasRef}
            id="drawingCanvas"
            className="signatureCanvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          ></canvas>
          <button
            id="clearCanvasBtn"
            type="button"
            className="btn btn-danger mt-2"
            onClick={clearCanvas}
          >
            Borrar firma
          </button>
        </div>

        {/* Botones de acción */}
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
export default PrincipalRecord;
