import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CameraIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (file: File) => void;
}

export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  console.log(`🚀 ~ file: Camera.tsx:14 ~ isCameraActive:`, isCameraActive);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log(
        `🚀 ~ file: Camera.tsx:22 ~ videoRef.current:`,
        videoRef.current
      );
      console.log(`🚀 ~ file: Camera.tsx:20 ~ stream:`, stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log(
          `🚀 ~ file: Camera.tsx:27 ~  videoRef.current.srcObject:`,
          videoRef.current.srcObject
        );
        setIsCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Unable to access the camera. Please check your permissions and try again."
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 300);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            onCapture(file);
          }
        }, "image/jpeg");
      }
    }
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4 flex flex-col">
      <Button
        className="w-full"
        onClick={isCameraActive ? stopCamera : startCamera}
      >
        <CameraIcon className="mr-2 h-4 w-4" />
        {isCameraActive ? "Stop Camera" : "Start Camera"}
      </Button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full ${!isCameraActive ? "hidden" : ""} `}
      />
      {isCameraActive && (
        <Button onClick={takeSelfie} className="w-full">
          Capture
        </Button>
      )}

      {cameraError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={300}
        height={300}
      />
    </div>
  );
}
