import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Shield, 
  Sparkles, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  Check, 
  Flame, 
  Heart, 
  Crown, 
  AlertCircle,
  HelpCircle,
  Brain,
  Info,
  Sparkle
} from "lucide-react";
import { MALE_QUESTIONS, FEMALE_QUESTIONS } from "./questions";
import { Answer, Question, AnalysisResult } from "./types";

export default function App() {
  // Navigation states: 'welcome' | 'test' | 'loading' | 'result'
  const [screen, setScreen] = useState<"welcome" | "test" | "loading" | "result">("welcome");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [customText, setCustomText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  const isFemale = gender === "female";
  const questionsList = isFemale ? FEMALE_QUESTIONS : MALE_QUESTIONS;

  // Theme configuration dynamically adapted to chosen gender
  const theme = {
    accentText: isFemale ? "text-rose-400" : "text-amber-400",
    textHeadingHover: isFemale ? "text-rose-500 hover:text-rose-400" : "text-amber-500 hover:text-amber-400",
    subtleHeader: isFemale ? "text-rose-500/10 border-rose-500/20 text-rose-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400",
    bgPulse: isFemale ? "bg-rose-500" : "bg-amber-500",
    borderHeader: isFemale ? "border-rose-500/25 text-rose-400 bg-rose-500/10" : "border-amber-500/25 text-amber-400 bg-amber-500/10",
    gradientBg: isFemale ? "rose-gradient-bg" : "gold-gradient-bg",
    glowOrb: isFemale ? "bg-rose-500/5" : "bg-amber-500/5",
    glowOrb2: isFemale ? "bg-rose-500/3 blur-[120px]" : "bg-amber-500/5 blur-[120px]",
    starPulse: isFemale ? "bg-rose-400" : "bg-amber-400",
    
    // Buttons
    primaryBtn: isFemale
      ? "bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 font-bold transition-colors duration-150"
      : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 font-bold transition-colors duration-150",
    
    // Radio Option Selectors
    optionCardSelected: isFemale 
      ? "bg-rose-500/10 border-rose-500 text-rose-100 shadow-md shadow-rose-500/5" 
      : "bg-amber-500/10 border-amber-500 text-amber-100 shadow-md shadow-amber-500/5",
    
    optionMarkerFill: isFemale ? "border-rose-500 bg-rose-500 text-slate-950" : "border-amber-500 bg-amber-500 text-slate-950",
    inputFocusBorder: isFemale ? "focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20" : "focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20",
    selectionHighlightColor: isFemale ? "selection:bg-rose-600/30" : "selection:bg-amber-600/30",
    textStrongColor: isFemale ? "text-rose-300 font-semibold" : "text-amber-300 font-semibold",
    subHeadingText: isFemale ? "text-rose-200" : "text-amber-200",
    midSectionHeader: isFemale ? "text-rose-100 border-b border-rose-950 pb-1" : "text-amber-100 border-b border-slate-900 pb-1",
    copyCopiedBtn: isFemale ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  };

  // Pre-configured loading phrases to make the wait engaging
  const loadingPhrases = isFemale ? [
    "Инициация психологического аудита личности...",
    "Сканирование подсознательных триггеров и защитных реакций...",
    "Анализ баланса базовых сил: Артемида, Афина, Гера, Деметра...",
    "Поиск скрытых теневых аспектов и точек подавления...",
    "Реконструкция комплиментарного союза с мужским началом...",
    "Синтез индивидуального психологического паспорта...",
    "Завершение тонких юнгианских настроек вашего архетипа..."
  ] : [
    "Инициация психологического аудита личности...",
    "Сканирование подсознательных триггеров и защитных реакций...",
    "Анализ баланса базовых сил: Воин, Мудрец, Царь и Искатель...",
    "Поиск скрытых теневых аспектов и точек подавления...",
    "Реконструкция комплиментарного союза с женским началом...",
    "Синтез индивидуального психологического паспорта...",
    "Завершение тонких юнгианских настроек вашего архетипа..."
  ];

  useEffect(() => {
    let interval: any;
    if (screen === "loading") {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [screen, loadingPhrases.length]);

  const currentQuestion = questionsList[currentQuestionIndex];

  // Pick or select an option
  const handleSelectOption = (optionId: string, optionText: string) => {
    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      selectedOptionText: optionText,
      customDetails: customText // Store currently typed custom details
    };

    if (existingIndex > -1) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);
  };

  // Safe navigation to next question
  const handleNext = () => {
    // Ensure an option was selected
    const activeAnswer = answers.find(a => a.questionId === currentQuestion.id);
    if (!activeAnswer) return;

    // Save current custom text into the answer final state
    const updatedAnswers = answers.map(ans => {
      if (ans.questionId === currentQuestion.id) {
        return { ...ans, customDetails: customText };
      }
      return ans;
    });
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questionsList.length - 1) {
      // Clear or load next custom text
      const nextAnswer = answers.find(a => a.questionId === questionsList[currentQuestionIndex + 1].id);
      setCustomText(nextAnswer ? (nextAnswer.customDetails || "") : "");
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question completed, invoke analyses API
      triggerAnalysis(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      // Save current custom text before leaving
      const updatedAnswers = answers.map(ans => {
        if (ans.questionId === currentQuestion.id) {
          return { ...ans, customDetails: customText };
        }
        return ans;
      });
      setAnswers(updatedAnswers);

      const prevAnswer = answers.find(a => a.questionId === questionsList[currentQuestionIndex - 1].id);
      setCustomText(prevAnswer ? (prevAnswer.customDetails || "") : "");
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Listen for Enter key to proceed to the next step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen === "test" && e.key === "Enter") {
        // Prevent triggering if user is currently typing inside textarea
        if (document.activeElement?.tagName === "TEXTAREA") {
          return;
        }
        
        // If an option is selected for the current question, go to the next step
        const activeAnswer = answers.find(a => a.questionId === currentQuestion?.id);
        if (activeAnswer) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screen, currentQuestionIndex, answers, customText, currentQuestion]);

  const resetAudit = () => {
    setScreen("welcome");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCustomText("");
    setResult(null);
    setError(null);
  };

  const triggerAnalysis = async (finalAnswers: Answer[]) => {
    setScreen("loading");
    setError(null);

    // Prepare payload matching server expectations
    const payloadAnswers = finalAnswers.map(ans => {
      const gq = questionsList.find(q => q.id === ans.questionId);
      return {
        questionId: ans.questionId,
        questionText: gq?.questionText || "",
        selectedOptionText: ans.selectedOptionText,
        customDetails: ans.customDetails || ""
      };
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payloadAnswers, gender })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Не удалось завершить психологический расчет");
      }

      setResult({ rawResponse: data.rawResponse });
      setScreen("result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Связь с сервером прервана");
      setScreen("result");
    }
  };

  // Helper function to extract structured markdown blocks returned from LLM
  const parseResultSections = (text: string) => {
    const sections = {
      profile: "",
      archetype: "",
      idealFemale: "",
      strategy: "",
      other: ""
    };

    if (!text) return sections;

    const lines = text.split(/\r?\n/);
    let currentSection: keyof typeof sections = "other";
    const lineBundles: Record<keyof typeof sections, string[]> = {
      profile: [],
      archetype: [],
      idealFemale: [],
      strategy: [],
      other: []
    };

    for (const line of lines) {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();
      
      let isHeader = false;
      let matchedSection: keyof typeof sections = "other";
      let headerPrefixRegex: RegExp | null = null;

      if ((trimmed.includes("⚡") || lower.includes("юнгианский профиль")) && (lower.includes("профиль") || lower.includes("личности"))) {
        isHeader = true;
        matchedSection = "profile";
        headerPrefixRegex = /^[\s*\-#]*⚡\s*юнгианский\s*профиль\s*личности\s*(?::|\s*\*\*)*\s*/i;
      } else if ((trimmed.includes("🎭") || lower.includes("доминирующий")) && lower.includes("архетип")) {
        isHeader = true;
        matchedSection = "archetype";
        headerPrefixRegex = /^[\s*\-#]*🎭\s*(?:твой\s*)?доминирующий\s*(?:мужской|женский\s*)?архетип\s*(?::|\s*\*\*)*\s*/i;
      } else if ((trimmed.includes("👑") || lower.includes("идеальный архетип")) && (lower.includes("женщины") || lower.includes("мужчины") || lower.includes("союза"))) {
        isHeader = true;
        matchedSection = "idealFemale";
        headerPrefixRegex = /^[\s*\-#]*👑\s*идеальный\s*архетип\s*(?:женщины|мужчины)\s*(?:\((?:синергия|комплиментарный)\s*союза\))?\s*(?::|\s*\*\*)*\s*/i;
      } else if ((trimmed.includes("🚀") || lower.includes("стратегия")) && (lower.includes("силы") || lower.includes("синтеза") || lower.includes("активации\s*силы") || lower.includes("женственности"))) {
        isHeader = true;
        matchedSection = "strategy";
        headerPrefixRegex = /^[\s*\-#]*🚀\s*стратегия\s*(?:активации\s*мужской\s*силы|синтеза\s*силы\s*и\s*женственности)\s*(?::|\s*\*\*)*\s*/i;
      }

      if (isHeader) {
        currentSection = matchedSection;
        let remainingText = trimmed;
        if (headerPrefixRegex) {
          remainingText = trimmed.replace(headerPrefixRegex, "").trim();
        }
        remainingText = remainingText.replace(/^[:\s*\-*#]+/g, "").trim();
        remainingText = remainingText.replace(/^\*\*+|\*\*+$/g, "").trim();
        
        if (remainingText.length > 0) {
          lineBundles[currentSection].push(remainingText);
        }
        continue;
      }

      lineBundles[currentSection].push(line);
    }

    const cleanSectionContent = (contentLines: string[]) => {
      let content = contentLines.join("\n").trim();
      // Remove leading colons or initial whitespace remnants safely, preserving markdown lists
      content = content.replace(/^[:\s]+/g, "").trim();
      return content;
    };

    sections.profile = cleanSectionContent(lineBundles.profile);
    sections.archetype = cleanSectionContent(lineBundles.archetype);
    sections.idealFemale = cleanSectionContent(lineBundles.idealFemale);
    sections.strategy = cleanSectionContent(lineBundles.strategy);
    sections.other = cleanSectionContent(lineBundles.other);

    // fallback if split fails to yield results
    if (!sections.profile && !sections.archetype && !sections.idealFemale && !sections.strategy) {
      sections.other = text;
    }

    return sections;
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.warn("Fallback copy command was unsuccessful");
      }
    } catch (err) {
      console.error("Fallback writing to clipboard failed", err);
    }
    document.body.removeChild(textArea);
  };

  const copyResultToClipboard = () => {
    if (!result?.rawResponse) return;
    const textToCopy = result.rawResponse;

    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch((err) => {
            console.warn("Clipboard API failed, trying fallback:", err);
            fallbackCopyText(textToCopy);
          });
      } else {
        fallbackCopyText(textToCopy);
      }
    } catch (e) {
      console.warn("Clipboard API exception, trying fallback:", e);
      fallbackCopyText(textToCopy);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  // Render HTML markup from simpler markdown formats (bullet points, bold text), cleaning stray asterisk tokens
  const renderMarkdownAlternative = (mdText: string) => {
    if (!mdText) return null;

    const lines = mdText.split(/\r?\n/);
    const elements: React.ReactNode[] = [];
    let currentListItems: React.ReactNode[] = [];

    const flushList = (groupId: number) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${groupId}`} className="space-y-3 mt-4 list-disc list-inside text-slate-300">
            {...currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList(index);
        return;
      }

      // Check if it's a list item (starts with *, -, •, or digits followed by . or ) )
      const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
      const isNumeric = /^\d+[\.\)]\s+/.test(trimmed);

      if (isBullet || isNumeric) {
        let cleanedContent = trimmed;
        if (isBullet) {
          cleanedContent = trimmed.substring(2).trim();
        } else {
          cleanedContent = trimmed.replace(/^\d+[\.\)]\s+/, "").trim();
        }

        currentListItems.push(
          <li key={`li-${index}`} className={`leading-relaxed font-sans text-sm md:text-base ${theme.selectionHighlightColor}`}>
            {formatBoldText(cleanedContent)}
          </li>
        );
      } else if (trimmed.startsWith("###")) {
        flushList(index);
        elements.push(
          <h4 key={`h4-${index}`} className={`text-lg font-semibold ${theme.subHeadingText} mt-5 mb-2 font-display uppercase tracking-wide`}>
            {trimmed.replace(/^###\s*/, "").replace(/\*/g, "").trim()}
          </h4>
        );
      } else if (trimmed.startsWith("##")) {
        flushList(index);
        elements.push(
          <h3 key={`h3-${index}`} className={`text-xl font-bold ${theme.midSectionHeader} mt-6 mb-3 font-display uppercase tracking-wide`}>
            {trimmed.replace(/^##\s*/, "").replace(/\*/g, "").trim()}
          </h3>
        );
      } else {
        flushList(index);
        elements.push(
          <p key={`p-${index}`} className={`leading-relaxed text-sm md:text-base text-slate-300 font-sans my-3 ${theme.selectionHighlightColor}`}>
            {formatBoldText(trimmed)}
          </p>
        );
      }
    });

    flushList(lines.length);

    return elements;
  };

  const formatBoldText = (text: string) => {
    if (!text) return "";
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        // Strip any remaining stray formatting asterisks
        const normalSeg = text.substring(lastIndex, match.index).replace(/\*/g, "");
        parts.push(normalSeg);
      }
      parts.push(
        <strong key={match.index} className={theme.textStrongColor}>
          {match[1].replace(/\*/g, "")}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingSeg = text.substring(lastIndex).replace(/\*/g, "");
      parts.push(remainingSeg);
    }

    return parts.length > 0 ? parts : text.replace(/\*/g, "");
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between font-sans ${theme.selectionHighlightColor} shadow-inner relative overflow-hidden`}>
      
      {/* Mystical Background Layers */}
      <div className={`absolute inset-0 ${theme.gradientBg} pointer-events-none z-0 transition-all duration-1000`} />
      <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full ${theme.glowOrb2} pointer-events-none transition-all duration-1000`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full ${theme.glowOrb} blur-[120px] pointer-events-none transition-all duration-1000`} />

      {/* Decorative Constellation Stars (CSS-only) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[2px] h-[2px] bg-white rounded-full animate-pulse" />
        <div className="absolute top-[35%] left-[80%] w-[2px] h-[2px] bg-white rounded-full animate-pulse" />
        <div className={`absolute top-[75%] left-[15%] w-[3px] h-[3px] rounded-full ${theme.starPulse}`} />
        <div className="absolute top-[85%] left-[65%] w-[2px] h-[2px] bg-white rounded-full animate-pulse" />
        <div className="absolute top-[50%] left-[10%] w-[1px] h-[1px] bg-white rounded-full" />
        <div className="absolute top-[15%] left-[90%] w-[1px] h-[1px] bg-white rounded-full" />
      </div>

      {/* Header Container */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900/50 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetAudit}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-700 ${theme.borderHeader}`}>
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className={`text-base font-bold font-display uppercase tracking-widest transition-colors ${theme.textHeadingHover}`}>
              Carl Jung
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Analytical Mentoring
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-900/40 border border-slate-800/40 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${theme.bgPulse} animate-pulse`} />
          <span>System active</span>
        </div>
      </header>

      {/* Main Sandbox Area */}
      <main className="w-full max-w-4xl mx-auto px-4 py-8 flex-grow flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: WELCOME / INTRO */}
          {screen === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center w-full max-w-2xl px-4 py-8 md:py-12"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.subtleHeader} text-xs font-semibold uppercase tracking-widest mb-6`}>
                <Brain className="w-3.5 h-3.5" />
                Юнгианский психоанализ • Мужской и женский аудит
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight text-white mb-6">
                АУДИТ <span className="text-amber-500">МУЖСКОЙ СИЛЫ</span> И <span className="text-rose-400">ЖЕНСКОЙ ЛИЧНОСТИ</span> В АРХЕТИПАХ СОЮЗА
              </h2>

              <p className="text-base md:text-lg text-slate-400 font-sans max-w-xl mx-auto leading-relaxed mb-6">
                Глубинное психологическое исследование структуры мужской и женской психики. Бескомпромиссная честность без эзотерики и шаблонов ИИ. Выберите спектр личности ниже и проверьте доминирующий архетип прямо сейчас.
              </p>

              {/* GENDER SELECTOR CARDS */}
              <div className="mb-10 text-left">
                <label className="block text-center text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 font-semibold">
                  Выберите спектр личности для анализа:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => setGender("male")}
                    className={`p-5 rounded-xl border text-left transition-all duration-300 flex items-start gap-4 ${
                      !isFemale
                        ? "bg-amber-500/10 border-amber-500 text-amber-100 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/20"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!isFemale ? "bg-amber-500/20 text-amber-400" : "bg-slate-900 text-slate-600"}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-wide uppercase font-display">Мужской паспорт</div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Классические квадры власти и силы духа.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setGender("female")}
                    className={`p-5 rounded-xl border text-left transition-all duration-300 flex items-start gap-4 ${
                      isFemale
                        ? "bg-rose-500/10 border-rose-500 text-rose-100 shadow-md shadow-rose-500/5 ring-1 ring-rose-500/20"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFemale ? "bg-rose-500/20 text-rose-400" : "bg-slate-900 text-slate-600"}`}>
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-wide uppercase font-display">Женский паспорт</div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Структура богинь и теневой амазонки.</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
                <button
                  id="activate-audit-btn"
                  onClick={() => setScreen("test")}
                  className={`w-full sm:w-auto px-10 py-4 rounded-xl ${theme.primaryBtn} uppercase tracking-wider text-sm flex items-center justify-center gap-3 group`}
                >
                  Активировать аудит
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 text-left border-t border-slate-900/60 pt-10">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <div className={`${theme.accentText} font-bold font-display text-sm uppercase tracking-wide mb-1 flex items-center gap-2`}>
                    <Shield className="w-4 h-4 shrink-0" />
                    7 Точных Вопросов
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">Каждый вопрос бьет прямо в ядро вашей поведенческой модели.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <div className={`${theme.accentText} font-bold font-display text-sm uppercase tracking-wide mb-1 flex items-center gap-2`}>
                    <Target className="w-4 h-4 shrink-0" />
                    Теневой Анализ
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">Вскрытие внутренних сговоров с собой и скрытых компромиссов.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <div className={`${theme.accentText} font-bold font-display text-sm uppercase tracking-wide mb-1 flex items-center gap-2`}>
                    {isFemale ? (
                      <Sparkles className="w-4 h-4 shrink-0 text-rose-400" />
                    ) : (
                      <Crown className="w-4 h-4 shrink-0 text-amber-500" />
                    )}
                    Карта Союза
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    {isFemale 
                      ? "Определение комплиментарного архетипа синергичного мужчины." 
                      : "Определение комплиментарного архетипа гармоничной женщины."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN: TEST QUESTIONS */}
          {screen === "test" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl bg-slate-950/40 border border-slate-900 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl relative"
            >
              {/* Question progress and category flag */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                <span className={`text-xs font-mono uppercase tracking-widest ${theme.accentText} font-semibold bg-slate-900/60 px-3 py-1 rounded border border-slate-900 inline-block self-start`}>
                  {currentQuestion.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Шаг <strong className="text-white">{currentQuestionIndex + 1}</strong> из <strong className="text-white">{questionsList.length}</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-8">
                <div 
                  className={`h-full ${theme.bgPulse} transition-all duration-500 ease-out`}
                  style={{ width: `${((currentQuestionIndex + 1) / questionsList.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg md:text-xl font-display font-medium text-slate-100 leading-relaxed mb-6">
                {currentQuestion.questionText}
              </h3>

              {/* Options buttons */}
              <div className="space-y-4 my-6">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswer?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`opt-${opt.id}`}
                      onClick={() => handleSelectOption(opt.id, opt.text)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex gap-4 items-start ${
                        isSelected 
                          ? theme.optionCardSelected 
                          : "bg-slate-950/80 border-slate-900 text-slate-300 hover:border-slate-850 hover:bg-slate-900/55"
                      }`}
                    >
                      {/* Check dot / custom select marker */}
                      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? theme.optionMarkerFill : "border-slate-700 bg-slate-900"
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      
                      <span className="text-sm md:text-base leading-relaxed font-sans">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Textarea for details to allow deep customization */}
              <div className="mt-8 border-t border-slate-900/80 pt-6">
                <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Info className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  Раскрой ответ подробнее (необязательно, сильно повышает глубину разбора)
                </label>
                <textarea
                  id="custom-details-textarea"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Опиши пример из своей жизни, личные чувства или переживания..."
                  className={`w-full bg-slate-1050 border border-slate-900 rounded-xl px-4 py-3 text-slate-200 text-sm font-sans leading-relaxed resize-none h-24 transition-colors ${theme.inputFocusBorder}`}
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-900/40">
                <button
                  id="prev-btn"
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2.5 rounded-lg border text-xs font-display uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors duration-150 ${
                    currentQuestionIndex === 0 
                      ? "border-slate-900/30 text-slate-600 cursor-not-allowed" 
                      : "border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Назад
                </button>

                <button
                  id="next-btn"
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`px-5 py-2.5 rounded-lg text-xs font-display uppercase tracking-wider font-bold flex items-center gap-2 transition-colors duration-150 ${
                    currentAnswer 
                      ? theme.primaryBtn + " cursor-pointer" 
                      : "bg-slate-900 border border-slate-850 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {currentQuestionIndex === questionsList.length - 1 ? (
                    <>
                      Сформировать аудит
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </>
                  ) : (
                    <>
                      Далее
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN: LOADING RESPONSES */}
          {screen === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full max-w-md px-6 py-12 flex flex-col items-center justify-center"
            >
              <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 border-dashed ${isFemale ? "border-rose-500/20" : "border-amber-500/20"} animate-spin-slow`} />
                <div className={`absolute inset-2 rounded-full border border-double ${isFemale ? "border-rose-400/35" : "border-amber-400/35"} animate-spin`} style={{ animationDirection: "reverse", animationDuration: "10s" }} />
                <div className={`absolute inset-4 rounded-full ${isFemale ? "bg-rose-500/5" : "bg-amber-500/5"} flex items-center justify-center`}>
                  <Compass className={`w-10 h-10 ${theme.accentText} animate-pulse`} />
                </div>
              </div>

              <h3 className="text-xl font-display uppercase tracking-widest text-white mb-4">
                СИНТЕЗ КЛИЕНТСКОГО ПОРТРЕТА
              </h3>

              <div className="h-6 overflow-hidden relative w-full mb-8">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={loadingPhraseIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm font-sans font-medium text-slate-400 w-full text-center"
                  >
                    {loadingPhrases[loadingPhraseIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="w-48 h-1 bg-slate-900/60 rounded-full overflow-hidden">
                <div className={`h-full ${theme.bgPulse} rounded-full w-full animate-bar-glow origin-left`} />
              </div>
            </motion.div>
          )}

          {/* SCREEN: RESULTS / AUDIT DISCLOSURE */}
          {screen === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-4xl"
            >
              {error ? (
                /* ERROR OUTCOME STATE */
                <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-8 backdrop-blur text-center max-w-lg mx-auto">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-display uppercase tracking-widest text-red-400 font-bold mb-2">
                    Ошибка Расчета
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {error}
                  </p>
                  <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-xl text-left mb-6">
                    <h5 className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> Подсказка для исправления:
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Пожалуйста, проверьте наличие или корректность настроенного <b>OPENAI_API_KEY</b> в панели <b>Settings &gt; Secrets</b>.
                    </p>
                  </div>
                  <button
                    onClick={resetAudit}
                    className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-display uppercase tracking-wider flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Попробовать снова
                  </button>
                </div>
              ) : (
                /* EXQUISITE ANALYSIS MARVEL */
                <div className="space-y-8">
                  {/* Top Intro Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
                    <div>
                      <span className={`text-xs font-mono ${theme.accentText} uppercase tracking-widest`}>Аналитическая Сводка</span>
                      <h2 className="text-3xl md:text-4xl font-semibold font-display tracking-tight text-white mt-1">
                        ТВОЙ ЮНГИАНСКИЙ ПАСПОРТ
                      </h2>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={copyResultToClipboard}
                        className={`px-4 py-2.5 rounded-lg border text-xs font-display uppercase tracking-wider flex items-center gap-2 transition-all ${
                          copied 
                            ? theme.copyCopiedBtn
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Скопировано!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Копировать отчет
                          </>
                        )}
                      </button>

                      <button
                        onClick={resetAudit}
                        className={`px-4 py-2.5 rounded-lg ${theme.primaryBtn} text-xs font-display uppercase tracking-wider font-bold flex items-center gap-2 transition-colors duration-150`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 font-bold" />
                        Пройти заново
                      </button>
                    </div>
                  </div>

                  {/* Parse and layout sections logically */}
                  {(() => {
                    const parsed = parseResultSections(result?.rawResponse || "");
                    const hasIntro = parsed.other && parsed.other.trim().length > 30;

                    return (
                      <div className="grid grid-cols-1 gap-8">
                        {/* If there's general commentary/introduction from AI */}
                        {hasIntro && (
                          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                            <div className={`flex items-center gap-2 ${theme.accentText} text-xs uppercase font-mono tracking-widest mb-4`}>
                              <Compass className="w-4 h-4 animate-spin-slow" />
                              Введение Ментора
                            </div>
                            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-sans">
                              {renderMarkdownAlternative(parsed.other)}
                            </div>
                          </div>
                        )}

                        {/* Bento boxes container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          {/* Bento: profile */}
                          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 focus-within:border-slate-800 transition-all flex flex-col justify-between">
                            <div>
                              <div className={`flex items-center gap-3 ${theme.accentText} uppercase font-mono tracking-wider text-xs mb-4 pb-2 border-b border-slate-900`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFemale ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  {isFemale ? (
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                  ) : (
                                    <Flame className="w-4 h-4 animate-pulse" />
                                  )}
                                </div>
                                <span className="text-white font-semibold font-display">⚡ Юнгианский Профиль Личности</span>
                              </div>
                              <div className="prose prose-invert max-w-none text-slate-300">
                                {parsed.profile ? renderMarkdownAlternative(parsed.profile) : (
                                  <p className="text-xs text-slate-500 italic">Академический синтетик формируется...</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bento: archetype */}
                          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 focus-within:border-slate-800 transition-all flex flex-col justify-between">
                            <div>
                              <div className={`flex items-center gap-3 ${theme.accentText} uppercase font-mono tracking-wider text-xs mb-4 pb-2 border-b border-slate-900`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFemale ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  <Crown className="w-4 h-4" />
                                </div>
                                <span className="text-white font-semibold font-display">
                                  🎭 Доминирующий {isFemale ? "Женский" : "Мужской"} Архетип
                                </span>
                              </div>
                              <div className="prose prose-invert max-w-none text-slate-300">
                                {parsed.archetype ? renderMarkdownAlternative(parsed.archetype) : (
                                  <p className="text-xs text-slate-500 italic">Определение доминанты...</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bento: idealFemale */}
                          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 focus-within:border-slate-800 transition-all flex flex-col justify-between">
                            <div>
                              <div className={`flex items-center gap-3 ${theme.accentText} uppercase font-mono tracking-wider text-xs mb-4 pb-2 border-b border-slate-900`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFemale ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-white font-semibold font-display">
                                  👑 Идеальный Архетип {isFemale ? "Мужчины" : "Женщины"}
                                </span>
                              </div>
                              <div className="prose prose-invert max-w-none text-slate-300">
                                {parsed.idealFemale ? renderMarkdownAlternative(parsed.idealFemale) : (
                                  <p className="text-xs text-slate-500 italic">Связующая модель подбирается...</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bento: strategy */}
                          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-6 focus-within:border-slate-800 transition-all flex flex-col justify-between">
                            <div>
                              <div className={`flex items-center gap-3 ${theme.accentText} uppercase font-mono tracking-wider text-xs mb-4 pb-2 border-b border-slate-900`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFemale ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                  <Target className="w-4 h-4" />
                                </div>
                                <span className="text-white font-semibold font-display">
                                  🚀 {isFemale ? "Стратегия Синтеза Сил" : "Стратегия Активации Силы"}
                                </span>
                              </div>
                              <div className="prose prose-invert max-w-none text-slate-300">
                                {parsed.strategy ? renderMarkdownAlternative(parsed.strategy) : (
                                  <p className="text-xs text-slate-500 italic">Шаги роста духа моделируются...</p>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer credits lines */}
      <footer className="w-full text-center py-6 border-t border-slate-900/40 text-[10px] sm:text-xs font-mono text-slate-600 z-10 uppercase tracking-widest flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>© 2026 Jungian Audit System</span>
        <span className="hidden sm:inline">•</span>
        <span>Based on Classical Analytical Psychology Typologies</span>
      </footer>

    </div>
  );
}
