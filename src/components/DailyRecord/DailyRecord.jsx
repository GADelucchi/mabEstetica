// Imports
import "./DailyRecord.css";
import Button from "../Button/Button";

// Code
const DailyRecord = ({ sendInfoToServer }) => {
  return (
    <div id="gestionFichas" className="d-flex">
      <form id="dailyRecordForm">
        <legend>
          <strong>Ficha diaria</strong>
        </legend>
        <fieldset>
          <legend>Hábitos</legend>
          <div className="mb-3">
            <label htmlFor="horasSueno" className="form-label">
              Horas de sueño
            </label>
            <input
              type="text"
              className="form-control"
              id="horasSueno"
              placeholder="Ingrese las horas de sueño"
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
              placeholder="Describa su rutina de ejercicio"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exposicionSolar" className="form-label">
              Tiempo en horas de exposición solar durante el día
            </label>
            <input
              type="text"
              className="form-control"
              id="exposicionSolar"
              placeholder="Ingrese el tiempo"
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
              type="text"
              className="form-control"
              id="aguaDiaria"
              placeholder="Ingrese la cantidad"
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
              placeholder="Describa su nivel de estrés"
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
              placeholder="Ingrese el tratamiento actual"
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
              placeholder="Ingrese los aspectos a seguir abordando"
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
              placeholder="Ingrese los tratamientos realizados hoy"
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
              placeholder="Ingrese la rutina domiciliaria"
            />
          </div>
        </fieldset>

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
export default DailyRecord;
