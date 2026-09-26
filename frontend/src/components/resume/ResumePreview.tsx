"use client";

import { useState, useEffect } from "react";
import { useResumeStore, defaultCustomization } from "@/store/useResumeStore";
import { Download, Printer, CheckCircle, AlertTriangle, FileText, User } from "lucide-react";
import { exportApi } from "@/lib/api";
import { ResumeData } from "@/types/resume";
import { TemplateCustomizationConfig } from "@/types/template";

interface ResumePreviewProps {
  customResume?: ResumeData;
  customConfig?: Partial<TemplateCustomizationConfig>;
  hideToolbar?: boolean;
  scale?: number;
}

export default function ResumePreview({
  customResume,
  customConfig,
  hideToolbar = false,
  scale = 1,
}: ResumePreviewProps) {
  const { resume: storeResume, customization: storeConfig } = useResumeStore();
  const resume = customResume || storeResume;
  const config: TemplateCustomizationConfig = {
    ...storeConfig,
    ...(customConfig || {}),
  };

  const { personal_info: p, experiences, education, skills, projects, certifications } = resume;

  const [zoom, setZoom] = useState<number>(scale);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640 && scale === 1) {
      setZoom(0.55);
    }
  }, [scale]);

  const handlePrint = () => {
    window.print();
  };

  // Font family resolver
  const getFontFamily = (font: string) => {
    switch (font.toLowerCase()) {
      case "roboto":
        return "'Roboto', sans-serif";
      case "open sans":
        return "'Open Sans', sans-serif";
      case "lato":
        return "'Lato', sans-serif";
      case "poppins":
        return "'Poppins', sans-serif";
      case "montserrat":
        return "'Montserrat', sans-serif";
      case "merriweather":
        return "'Merriweather', serif";
      case "georgia":
        return "Georgia, serif";
      case "inter":
      default:
        return "'Inter', sans-serif";
    }
  };

  // Font size resolver
  const getFontSizeClasses = () => {
    switch (config.font_size) {
      case "sm":
        return {
          body: "text-[11px]",
          sub: "text-[10px]",
          name: "text-xl",
          sectionHeading: "text-xs",
        };
      case "lg":
        return {
          body: "text-sm",
          sub: "text-xs",
          name: "text-3xl",
          sectionHeading: "text-sm",
        };
      case "md":
      default:
        return {
          body: "text-xs",
          sub: "text-[11px]",
          name: "text-2xl",
          sectionHeading: "text-xs",
        };
    }
  };

  // Spacing resolver
  const getSpacingClasses = () => {
    const sectionMargin =
      config.section_spacing === "compact"
        ? "mb-3"
        : config.section_spacing === "relaxed"
        ? "mb-6"
        : "mb-4";
    const lineSpacing =
      config.line_spacing === "compact"
        ? "leading-snug"
        : config.line_spacing === "relaxed"
        ? "leading-loose"
        : "leading-relaxed";
    const padding =
      config.page_margin === "narrow"
        ? "p-5 sm:p-6"
        : config.page_margin === "wide"
        ? "p-8 sm:p-12"
        : "p-6 sm:p-8";

    return { sectionMargin, lineSpacing, padding };
  };

  const fontSizes = getFontSizeClasses();
  const { sectionMargin, lineSpacing, padding } = getSpacingClasses();
  const accentColor = config.color_theme || "#2563eb";
  const isAtsOptimal = config.layout_format === "single" || config.layout_format === "compact";

  // Section heading renderer
  const renderSectionHeader = (title: string) => (
    <div
      className="border-b pb-1 mb-2 font-bold uppercase tracking-wider flex items-center justify-between"
      style={{ borderColor: accentColor }}
    >
      <span style={{ color: accentColor }} className={fontSizes.sectionHeading}>
        {title}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      {/* Top Action Header (unless hideToolbar is true) */}
      {!hideToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Preview</span>
            {isAtsOptimal ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                <CheckCircle className="h-3 w-3" /> ATS Verified 100%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                <AlertTriangle className="h-3 w-3" /> Visual Format (ATS Advisory)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Zoom Controls */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
              {[
                { label: "Fit", val: 0.55 },
                { label: "75%", val: 0.75 },
                { label: "100%", val: 1 },
              ].map((z) => (
                <button
                  key={z.label}
                  type="button"
                  onClick={() => setZoom(z.val)}
                  className={`px-2 py-0.5 rounded transition ${
                    zoom === z.val ? "bg-white text-blue-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" /> PDF
            </button>
            {resume.id && (
              <>
                <a
                  href={exportApi.getDocxExportUrl(resume.id)}
                  download
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  title="Download Microsoft Word .docx"
                >
                  <Download className="h-3.5 w-3.5" /> Word
                </a>
                <a
                  href={exportApi.getTxtExportUrl(resume.id)}
                  download
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  title="Download Plain-Text ATS Copy"
                >
                  <FileText className="h-3.5 w-3.5" /> TXT
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rendered Resume Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 flex justify-center items-start">
        <div
          id="resume-printable"
          style={{
            fontFamily: getFontFamily(config.font_family),
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: "top center",
            marginBottom: zoom < 1 ? `-${(1 - zoom) * 850}px` : undefined,
          }}
          className={`w-full max-w-[820px] bg-white min-h-[1050px] shadow-lg border border-slate-200 text-slate-900 transition-all ${padding} ${fontSizes.body}`}
        >
          {/* HEADER SECTION */}
          {config.header_style === "banner" ? (
            <div
              className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 sm:p-8 mb-6 text-white"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className={`${fontSizes.name} font-bold tracking-tight uppercase`}>
                    {p.fullName || "Your Full Name"}
                  </h1>
                  {p.headline && (
                    <p className="text-sm font-medium opacity-95 mt-1">{p.headline}</p>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-90 mt-2.5">
                    {p.email && <span>✉️ {p.email}</span>}
                    {p.phone && <span>📞 {p.phone}</span>}
                    {p.location && <span>📍 {p.location}</span>}
                    {p.linkedin && <span>🔗 {p.linkedin}</span>}
                    {p.github && <span>💻 {p.github}</span>}
                  </div>
                </div>
                {config.show_photo && (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center text-white shrink-0">
                    <User className="h-10 w-10 opacity-90" />
                  </div>
                )}
              </div>
            </div>
          ) : config.header_style === "center" ? (
            <div className={`text-center border-b pb-4 mb-5`} style={{ borderColor: accentColor }}>
              <div className="flex flex-col items-center">
                {config.show_photo && (
                  <div
                    className="h-16 w-16 rounded-full border-2 mb-2 flex items-center justify-center text-slate-600 bg-slate-100 shrink-0"
                    style={{ borderColor: accentColor }}
                  >
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                )}
                <h1
                  className={`${fontSizes.name} font-bold tracking-tight uppercase text-slate-900`}
                  style={{ color: accentColor }}
                >
                  {p.fullName || "Your Full Name"}
                </h1>
                {p.headline && (
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">{p.headline}</p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2">
                  {p.email && <span>{p.email}</span>}
                  {p.phone && <span>• {p.phone}</span>}
                  {p.location && <span>• {p.location}</span>}
                  {p.linkedin && <span>• {p.linkedin}</span>}
                  {p.github && <span>• {p.github}</span>}
                </div>
              </div>
            </div>
          ) : (
            /* Left Aligned Header (Classic & ATS Default) */
            <div className={`border-b-2 pb-3 mb-5 flex items-center justify-between gap-4`} style={{ borderColor: accentColor }}>
              <div>
                <h1 className={`${fontSizes.name} font-bold tracking-tight uppercase text-slate-900`}>
                  {p.fullName || "Your Full Name"}
                </h1>
                {p.headline && (
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">{p.headline}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                  {p.email && <span>📧 {p.email}</span>}
                  {p.phone && <span>📱 {p.phone}</span>}
                  {p.location && <span>📍 {p.location}</span>}
                  {p.linkedin && <span>🔗 {p.linkedin}</span>}
                  {p.github && <span>💻 {p.github}</span>}
                </div>
              </div>
              {config.show_photo && (
                <div
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 flex items-center justify-center text-slate-600 bg-slate-50 shrink-0"
                  style={{ borderColor: accentColor }}
                >
                  <User className="h-9 w-9 text-slate-400" />
                </div>
              )}
            </div>
          )}

          {/* LAYOUT MODES */}
          {config.layout_format === "two-column" ? (
            /* TWO-COLUMN SPLIT LAYOUT */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sidebar Column (4 of 12) */}
              <div className="md:col-span-4 space-y-5 border-r border-slate-100 pr-0 md:pr-4">
                {/* Summary */}
                {p.summary && (
                  <div>
                    {renderSectionHeader("About")}
                    <p className={`${lineSpacing} text-slate-700`}>{p.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                  <div>
                    {renderSectionHeader("Core Skills")}
                    <div className="space-y-3">
                      {skills.map((cat, i) => (
                        <div key={i}>
                          <span className="font-semibold text-slate-900 text-[11px] block">{cat.category}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cat.items.map((item, j) => (
                              <span
                                key={j}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                  <div>
                    {renderSectionHeader("Education")}
                    <div className="space-y-2.5">
                      {education.map((edu) => (
                        <div key={edu.id}>
                          <div className="font-semibold text-slate-900">{edu.institution}</div>
                          <div className="text-slate-600 text-[11px]">{edu.degree}</div>
                          <div className="text-slate-500 text-[10px]">
                            {edu.startDate} — {edu.endDate} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <div>
                    {renderSectionHeader("Certifications")}
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="text-[11px]">
                          <div className="font-semibold text-slate-900">{cert.name}</div>
                          <div className="text-slate-600">{cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Main Column (8 of 12) */}
              <div className="md:col-span-8 space-y-5">
                {/* Work Experience */}
                {experiences && experiences.length > 0 && (
                  <div>
                    {renderSectionHeader("Work Experience")}
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span style={{ color: accentColor }}>{exp.title || "Job Title"}</span>
                            <span className="font-normal text-slate-500 text-[11px]">
                              {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600 italic text-[11px] mb-1">
                            <span>{exp.company}</span>
                            <span>{exp.location}</span>
                          </div>
                          {exp.bullets && exp.bullets.length > 0 && (
                            <ul className="list-disc ml-4 space-y-1 text-slate-700">
                              {exp.bullets.map((b, i) => (
                                <li key={i} className={lineSpacing}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                  <div>
                    {renderSectionHeader("Key Projects")}
                    <div className="space-y-3">
                      {projects.map((proj) => (
                        <div key={proj.id}>
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span style={{ color: accentColor }}>{proj.title}</span>
                            {proj.technologies && proj.technologies.length > 0 && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {proj.technologies.join(", ")}
                              </span>
                            )}
                          </div>
                          {proj.description && (
                            <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                          )}
                          {proj.bullets && proj.bullets.length > 0 && (
                            <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-1">
                              {proj.bullets.map((b, i) => (
                                <li key={i} className={lineSpacing}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : config.layout_format === "timeline" ? (
            /* VISUAL TIMELINE LAYOUT */
            <div className="space-y-6">
              {/* Summary */}
              {p.summary && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Professional Profile")}
                  <p className={`${lineSpacing} text-slate-700`}>{p.summary}</p>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Skills Matrix")}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {skills.map((cat, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-900 block mb-1">{cat.category}</span>
                        <span className="text-slate-600 text-[11px]">{cat.items.join(" • ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Experience */}
              {experiences && experiences.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Career Progression (Timeline)")}
                  <div className="relative pl-6 space-y-6 border-l-2 ml-2" style={{ borderColor: `${accentColor}33` }}>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative">
                        {/* Timeline Node Bullet */}
                        <div
                          className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full border-2 bg-white"
                          style={{ borderColor: accentColor }}
                        />
                        <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span className="text-sm" style={{ color: accentColor }}>{exp.title}</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <div className="text-slate-600 italic text-[11px] mb-1.5">
                          {exp.company} {exp.location ? `• ${exp.location}` : ""}
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc ml-4 space-y-1 text-slate-700">
                            {exp.bullets.map((b, i) => (
                              <li key={i} className={lineSpacing}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Featured Projects")}
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                        <div className="flex justify-between items-baseline font-semibold text-slate-900">
                          <span style={{ color: accentColor }}>{proj.title}</span>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="text-[10px] font-mono text-slate-500">
                              {proj.technologies.join(", ")}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-slate-600 text-[11px] mt-1">{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-1.5">
                            {proj.bullets.map((b, i) => (
                              <li key={i} className={lineSpacing}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Education & Credentials")}
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <div className="font-semibold text-slate-900">{edu.institution}</div>
                          <div className="text-slate-600 text-[11px]">
                            {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                            {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                          </div>
                        </div>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* SINGLE-COLUMN / COMPACT ONE-PAGE LAYOUT (ATS Optimized) */
            <div>
              {/* Summary */}
              {p.summary && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Professional Summary")}
                  <p className={`${lineSpacing} text-slate-700`}>{p.summary}</p>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Technical Skills")}
                  <div className="space-y-1.5">
                    {skills.map((cat, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-semibold text-slate-900 min-w-[130px]">{cat.category}:</span>
                        <span className="text-slate-700">{cat.items.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experiences && experiences.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Work Experience")}
                  <div className="space-y-3.5">
                    {experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span style={{ color: accentColor }}>{exp.title || "Job Title"}</span>
                          <span className="font-normal text-slate-500 text-[11px]">
                            {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600 italic text-[11px] mb-1">
                          <span>{exp.company || "Company"}</span>
                          <span>{exp.location}</span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc ml-4 space-y-1 text-slate-700">
                            {exp.bullets.map((b, i) => (
                              <li key={i} className={lineSpacing}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Technical Projects")}
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id}>
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span style={{ color: accentColor }}>{proj.title}</span>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="text-[11px] font-mono text-slate-500">
                              {proj.technologies.join(", ")}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                        )}
                        {proj.bullets && proj.bullets.length > 0 && (
                          <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-1">
                            {proj.bullets.map((b, i) => (
                              <li key={i} className={lineSpacing}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education && education.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Education")}
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{edu.institution}</span>
                          <span className="font-normal text-slate-500 text-[11px]">
                            {edu.startDate} — {edu.endDate}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px]">
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                          {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className={sectionMargin}>
                  {renderSectionHeader("Certifications")}
                  <div className="space-y-1 text-xs">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between">
                        <span className="font-medium text-slate-800">{cert.name}</span>
                        <span className="text-slate-500 text-[11px]">{cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
