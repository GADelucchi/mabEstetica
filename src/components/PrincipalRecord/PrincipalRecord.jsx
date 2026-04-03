// Imports
import { useState, useEffect } from "react";
import "./PrincipalRecord.css";
import Button from "../Button/Button";
import { Tooltip } from "bootstrap";

// Code
const PrincipalRecord = ({
  canvasRef,
  startDrawing,
  draw,
  endDrawing,
  clearCanvas,
  sendInfoToServer,
}) => {
  const [birthDate, setBirthDate] = useState("");
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

  const handleBirthDateChange = (e) => {
    const newDate = e.target.value;
    setBirthDate(newDate);

    const ageCalculated = calculateAge(newDate);
    setAge(ageCalculated);
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

  return (
    <div id="gestionFichas" className="d-flex">
      <form id="newPatientForm">
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
              placeholder="Ingrese su nombre o nombres"
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
              placeholder="Ingrese su apellido"
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
              placeholder="Ingrese su documento"
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
            <input
              type="date"
              className="form-control"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={birthDate}
              onChange={handleBirthDateChange}
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
              placeholder="Ingrese su número de teléfono"
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
              type="text"
              className="form-control"
              id="email"
              placeholder="Ingrese su email"
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
              placeholder="Ingrese su dirección"
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
              placeholder="Ciudad"
            />
            <label htmlFor="Provincia" className="form-label">
              Provincia
            </label>
            <input
              type="text"
              className="form-control"
              id="provincia"
              placeholder="Provincia"
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
              rows="2"
              placeholder="Describa el problema"
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

        {/* Botón de envío */}
        <div className="d-flex justify-content-center">
          <Button
            text="Enviar"
            onClick={sendInfoToServer}
            className={"btn btn-meli"}
          />
        </div>
      </form>
    </div>
  );
};

// Exports
export default PrincipalRecord;
