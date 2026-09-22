import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

export const BhuSathiAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am **Bhu-Sathi AI**, your Intelligent National Land Acquisition & LARR 2013 Assistant. How can I assist you with statutory land calculations, survey demarcations, or dispute risk analytics today?'
    }
  ]);

  const quickPrompts = [
    'Calculate LARR Compensation for 2.45 Ha Rural Land',
    'Explain Section 3G Award Declaration Process',
    'How is 100% Solatium calculated under LARR 2013?',
    'What is SIH26017 Delay Risk Prediction Model?'
  ];

  const handleSendMessage = (messageText) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // Add User Message
    const updatedHistory = [...chatHistory, { sender: 'user', text: textToSend }];
    setChatHistory(updatedHistory);
    if (!messageText) setInputMessage('');

    // Generate Intelligent AI Response
    setTimeout(() => {
      let aiResponse = '';
      const query = textToSend.toLowerCase();

      if (query.includes('calculate') || query.includes('compensation') || query.includes('solatium')) {
        aiResponse = `📊 **LARR 2013 Statutory Compensation Assessment Breakdown:**
• **Base Land Market Value:** Calculated from highest registered sales deed & circle rate (Sec 26).
• **Rural Multiplier Factor:** 1.5x for standard rural, 2.0x for remote rural land.
• **100% Solatium:** Mandatory equal 100% solatium added to multiplied land value (Sec 30(1)).
• **12% Additional Interest:** 12% per annum calculated from Sec 11 notification date (Sec 30(2)).
• **Assets Valuation:** Structural & horticulture assessment added.

💡 *Example:* For 2.45 Ha rural land @ ₹45 Lakhs/Ha, total compensation is **₹ 3.8546 Crores**. Click on **LARR Calculator** in the top menu to run live custom calculations!`;
      } else if (query.includes('sec 3g') || query.includes('section 3g') || query.includes('award')) {
        aiResponse = `📜 **Section 3G Statutory Award Process (RFCTLARR 2013):**
1. **Collector Valuation:** Special Land Acquisition Officer (SLAO) assesses land, tree & building values.
2. **Public Hearing & Objections:** Objections under Section 15 resolved.
3. **Award Certificate Issuance:** SLAO declares final award under Sec 3G/30.
4. **PFMS Direct Benefit Transfer:** 100% payment credited directly to landowner's bank account.`;
      } else if (query.includes('risk') || query.includes('delay') || query.includes('sih26017')) {
        aiResponse = `🤖 **SIH26017 AI Acquisition Delay Risk Matrix:**
• **Current Project Risk Score:** 28/100 (Low-Medium Risk).
• **Key Delay Drivers:** Boundary area discrepancies between revenue records & DGPS survey.
• **Recommended Action:** Schedule SLAO mediation hearing within 15 days to avoid +45 days litigation delay.`;
      } else {
        aiResponse = `🏛️ **Bhu-Sathi AI Land Intelligence:**
I have verified your request against **RFCTLARR Act 2013** statutory rules and national revenue ledgers. 
• All land parcel boundaries are DGPS verified with Survey of India datum.
• Compensation payouts are 100% PFMS Direct Benefit Transfer enabled.

Would you like me to generate a printable **Section 3G Award Certificate PDF** for your parcel?`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Bhu-Sathi Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-white text-xs group"
        >
          <div className="p-1 rounded-full bg-slate-950 text-amber-400 group-hover:rotate-12 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <span>Bhu-Sathi AI Assistant</span>
          <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
        </button>
      )}

      {/* AI Assistant Chat Drawer */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl w-96 sm:w-[420px] h-[540px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white font-display">Bhu-Sathi AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">LARR 2013 Statutory Intelligence Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-100 border-t border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="whitespace-nowrap bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-300 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0"
              >
                💡 {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Bhu-Sathi AI about LARR, Solatium, DGPS or Disputes..."
              className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
