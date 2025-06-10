import { Tooltip } from "primereact/tooltip";
import React, { useState, useEffect, useContext } from "react";
import { BsFillMicFill } from "react-icons/bs";
import {
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

let tooltipIdCounter = 0; // Counter for generating unique IDs

function AudioRecorder({ onAudioRecorded, onRecordingStateChange, disabled, isRecording, customClass, customStyle, customParentClassName }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const { localeJson } = useContext(LayoutContext);
  let audioChunks = [];
  const tooltipId = `mic-tooltip-${tooltipIdCounter++}`;

  useEffect(() => {
    setRecording(isRecording);
  }, [isRecording]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          onAudioRecorded(audioBlob);
          audioChunks = [];
        };
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
        onRecordingStateChange(true); // Notify parent of recording start
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      onRecordingStateChange(false); // Notify parent of recording stop
    }
  };

  return (
    <>
      <i className={`w-2rem ${customParentClassName}`}>
        <div>
          {!disabled && !recording && (
            <Tooltip target={`#${tooltipId}`} position="top" content={translate(localeJson, "mic_text")} className="shadow-none" />
          )}
          <BsFillMicFill
            id={tooltipId}
            onClick={() => { if (!disabled) { (recording) ? stopRecording() : startRecording() } }}
            cursor={disabled ? "not-allowed" : "pointer"}
            className={`w-full mic-icon  ${recording ? "text-red-700" : ""} ${customClass}`}
            style={customStyle}
          />
        </div>
      </i>
    </>
  );
}

export default AudioRecorder;