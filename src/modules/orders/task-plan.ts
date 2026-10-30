export type PlannedTask = { code: string; title: string; description?: string };

export function buildTaskPlan(input: {
  serviceType: "TRANSCRIPTION" | "TRANSLATION" | "WRITING_SUPPORT";
  speakerIdentification?: boolean;
  timestamps?: boolean;
  proofreading?: boolean;
  formatting?: boolean;
  writingTask?: string;
}): PlannedTask[] {
  if (input.serviceType === "TRANSCRIPTION") {
    const tasks: PlannedTask[] = [
      { code: "TRANSCRIPTION", title: "Transcribe source recording" },
    ];
    if (input.speakerIdentification)
      tasks.push({
        code: "SPEAKER_IDENTIFICATION",
        title: "Identify speakers",
      });
    if (input.timestamps)
      tasks.push({ code: "TIMESTAMPING", title: "Add timestamps" });
    tasks.push({
      code: "QUALITY_REVIEW",
      title: "Quality review transcription",
    });
    return tasks;
  }
  if (input.serviceType === "TRANSLATION") {
    const tasks: PlannedTask[] = [
      { code: "TRANSLATION", title: "Translate source document" },
    ];
    if (input.formatting)
      tasks.push({
        code: "DOCUMENT_FORMATTING",
        title: "Preserve document formatting",
      });
    if (input.proofreading)
      tasks.push({ code: "PROOFREADING", title: "Proofread translation" });
    tasks.push({ code: "QUALITY_REVIEW", title: "Quality review translation" });
    return tasks;
  }
  const code = input.writingTask || "ACADEMIC_REVIEW";
  return [
    { code, title: "Complete writing-support task" },
    { code: "QUALITY_REVIEW", title: "Quality review writing support" },
  ];
}
