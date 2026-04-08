// Imports
import { useEffect, useRef, useState } from "react";
import "./Records.css";
import PrincipalRecord from "../PrincipalRecord/PrincipalRecord";
import DailyRecord from "../DailyRecord/DailyRecord";
import Button from "../Button/Button";

// Code
const Records = () => {
  const [activeForm, setActiveForm] = useState("new");
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("info");
  const [formErrors, setFormErrors] = useState([]);

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
    const hoursSleep = Number(getFieldValue(form, "horasSueno"));
    const solarExposure = Number(getFieldValue(form, "exposicionSolar"));
    const water = Number(getFieldValue(form, "aguaDiaria"));

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

  const sendInfoToServer = (e) => {
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

    setFormMessageType("success");
    setFormErrors([]);
    setFormMessage(
      "Formulario validado correctamente. El próximo paso es conectarlo al backend para persistir la información."
    );

    localStorage.removeItem(
      isPrincipalForm ? "mab_principal_record_draft" : "mab_daily_record_draft"
    );
    form.reset();
    if (isPrincipalForm) clearCanvas();
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
          <DailyRecord sendInfoToServer={sendInfoToServer} />
        )}
      </div>
    </section>
  );
};

// Exports
export default Records;
