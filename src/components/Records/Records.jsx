// Imports
import { useEffect, useRef, useState } from "react";
import "./Records.css";
import PrincipalRecord from "../PrincipalRecord/PrincipalRecord";
import DailyRecord from "../DailyRecord/DailyRecord";
import Button from "../Button/Button";

// Code
const Records = () => {
  const [activeForm, setActiveForm] = useState(null)

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (!activeForm === "new") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000";
    setCtx(context);

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
  }, [activeForm === "new"]);

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
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const sendInfoToServer = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="d-flex gap-2 justify-content-center mt-5 mb-4" id="botonesFormulario">
        <Button
          text="+ Nuevo Paciente"
          onClick={() => setActiveForm("new")}
          className={"btn btn-meli m-4"}
        />

        <Button
          text="+ Registro Diario"
          onClick={() => setActiveForm("daily")}
          className={"btn btn-meli m-4"}
        />
      </div>

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
    </>
  );
};

// Exports
export default Records;
