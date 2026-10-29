-- Initial MboaScribe work catalog. Safe to rerun.
INSERT INTO task_types (code, name, category, description, is_system, is_active) VALUES
('TRANSCRIBE_AUDIO', 'Transcribe audio', 'TRANSCRIPTION', 'Create a transcript from an audio source.', true, true),
('TRANSCRIBE_VIDEO', 'Transcribe video', 'TRANSCRIPTION', 'Create a transcript from a video source.', true, true),
('SPEAKER_IDENTIFICATION', 'Speaker identification', 'TRANSCRIPTION', 'Identify and label speakers.', true, true),
('TIMESTAMPING', 'Timestamping', 'TRANSCRIPTION', 'Add requested timestamps to a transcript.', true, true),
('TRANSLATE', 'Translate', 'TRANSLATION', 'Translate source content into the requested target language.', true, true),
('PROOFREAD', 'Proofread', 'QUALITY', 'Review language, grammar, spelling and consistency.', true, true),
('QUALITY_REVIEW', 'Quality review', 'QUALITY', 'Perform final quality review before delivery.', true, true),
('FORMAT_DOCUMENT', 'Document formatting', 'WRITING', 'Format a document to the requested presentation standard.', true, true),
('ACADEMIC_REVIEW', 'Academic review', 'ACADEMIC', 'Provide feedback and revision support for academic writing.', true, true),
('RESEARCH_ASSISTANCE', 'Research assistance', 'ACADEMIC', 'Support research, source organization and synthesis.', true, true),
('LITERATURE_REVIEW_SUPPORT', 'Literature review support', 'ACADEMIC', 'Support literature search, organization and synthesis.', true, true),
('CITATION_FORMATTING', 'Citation & referencing', 'ACADEMIC', 'Format and check citations and references.', true, true),
('ESSAY_SUPPORT', 'Essay support', 'ACADEMIC', 'Provide planning, feedback, editing and learning support for essays.', true, true),
('ASSIGNMENT_SUPPORT', 'Assignment support', 'ACADEMIC', 'Provide tutoring, explanation, feedback and revision support for assignments.', true, true)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, description = EXCLUDED.description, is_active = EXCLUDED.is_active;
