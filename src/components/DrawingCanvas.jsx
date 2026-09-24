import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";

function DrawingCanvas({
  isDrawer,
  disabled,
  color = "#000000",
  brushSize = 4,
  clearSignal,
}) {
  const canvasRef = useRef(null);

  const lastPosition = useRef({
    x: 0,
    y: 0,
  });

  const [isDrawing, setIsDrawing] = useState(false);

  const getPosition = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        ((event.clientX - rect.left) /
          rect.width) *
        canvas.width,

      y:
        ((event.clientY - rect.top) /
          rect.height) *
        canvas.height,
    };
  };

  const drawLine = (
    x,
    y,
    previousX,
    previousY,
    drawColor = color,
    width = brushSize
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.moveTo(previousX, previousY);

    ctx.lineTo(x, y);

    ctx.strokeStyle = drawColor;

    ctx.lineWidth = width;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();
  };

  const handlePointerDown = (event) => {
    if (!isDrawer || disabled) return;

    const position = getPosition(event);

    lastPosition.current = position;

    setIsDrawing(true);

    socket.emit("draw_start", {
      x: position.x,
      y: position.y,
      color,
      brushSize,
    });
  };

  const handlePointerMove = (event) => {
    if (
      !isDrawer ||
      !isDrawing ||
      disabled
    ) {
      return;
    }

    const position = getPosition(event);

    const previous =
      lastPosition.current;

    drawLine(
      position.x,
      position.y,
      previous.x,
      previous.y,
      color,
      brushSize
    );

    socket.emit("draw_move", {
      x: position.x,
      y: position.y,

      previousX: previous.x,
      previousY: previous.y,

      color,
      brushSize,
    });

    lastPosition.current = position;
  };

  const handlePointerUp = () => {
    if (!isDrawer || disabled) return;

    setIsDrawing(false);

    socket.emit("draw_end");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  /*
   * Clear whenever clearSignal changes.
   */
  useEffect(() => {
    if (clearSignal === 0) return;

    clearCanvas();
  }, [clearSignal]);

  /*
   * Clear when component mounts.
   */
  useEffect(() => {
    clearCanvas();
  }, []);

  /*
   * Remote drawing
   */
  useEffect(() => {
    const handleRemoteDrawStart = ({
      x,
      y,
    }) => {
      lastPosition.current = {
        x,
        y,
      };
    };

    const handleRemoteDrawMove = ({
      x,
      y,
      previousX,
      previousY,
      color: remoteColor,
      brushSize: remoteBrushSize,
    }) => {
      drawLine(
        x,
        y,
        previousX,
        previousY,
        remoteColor || "#000000",
        remoteBrushSize || 4
      );

      lastPosition.current = {
        x,
        y,
      };
    };

    const handleRemoteClear = () => {
      clearCanvas();
    };

    socket.on(
      "draw_start",
      handleRemoteDrawStart
    );

    socket.on(
      "draw_move",
      handleRemoteDrawMove
    );

    socket.on(
      "clear_drawing",
      handleRemoteClear
    );

    return () => {
      socket.off(
        "draw_start",
        handleRemoteDrawStart
      );

      socket.off(
        "draw_move",
        handleRemoteDrawMove
      );

      socket.off(
        "clear_drawing",
        handleRemoteClear
      );
    };
  }, []);

  return (
    <div className="drawing-container">

      <canvas
        ref={canvasRef}
        width={800}
        height={500}

        onPointerDown={
          handlePointerDown
        }

        onPointerMove={
          handlePointerMove
        }

        onPointerUp={
          handlePointerUp
        }

        onPointerLeave={
          handlePointerUp
        }

        style={{
          width: "100%",
          height: "100%",

          background: "white",

          cursor:
            isDrawer && !disabled
              ? "crosshair"
              : "default",

          touchAction: "none",

          opacity: disabled
            ? 0.75
            : 1,
        }}
      />

    </div>
  );
}

export default DrawingCanvas;