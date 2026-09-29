import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  X,
  Eye,
  Download,
  Calendar,
  CheckCircle2,
  Sparkles,
  Phone
} from 'lucide-react';
import { useFieldProofs, useFieldStaff, type TaskProofItem } from '../api/useFieldTasks';

export default function ProofGalleryPage() {
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeProof, setActiveProof] = useState<TaskProofItem | null>(null);
  const [showRawToggle, setShowRawToggle] = useState<boolean>(false);

  const { data: staffList = [] } = useFieldStaff();
  const { data: proofsData, isLoading, refetch } = useFieldProofs({
    staff_id: selectedStaff !== 'all' ? Number(selectedStaff) : undefined,
    date: selectedDate || undefined,
  });

  const proofs = proofsData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Field Proofs & Watermark Gallery
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Cryptographically stamped work verification photos with technician GPS coordinates and tamper-resistant timestamps.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm self-start md:self-auto font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Gallery</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#121316] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Staff Filter */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Technician:</span>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="all">All Technicians</option>
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-medium"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Total Proofs: <span className="text-purple-600 dark:text-purple-400 font-bold">{proofs.length}</span>
        </div>
      </div>

      {/* Gallery Grid */}
      {proofs.length === 0 ? (
        <div className="p-16 bg-white dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <Camera className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-400">No Watermarked Proofs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When technicians complete tasks and upload camera photos through WhatsApp, they will be watermarked and displayed here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {proofs.map((proof) => (
            <div
              key={proof.id}
              onClick={() => {
                setActiveProof(proof);
                setShowRawToggle(false);
              }}
              className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 hover:border-purple-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group flex flex-col shadow-sm"
            >
              {/* Image Preview Container */}
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={proof.watermarked_photo_url || proof.raw_photo_url}
                  alt="Work proof"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    Click to inspect high-res watermark
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 flex-wrap justify-end">
                  {proof.ai_confidence ? (
                    <div className="px-2 py-0.5 rounded-full bg-purple-950/90 backdrop-blur-md border border-purple-500/60 text-[10px] font-bold text-purple-300 flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      AI: {Math.round(proof.ai_confidence)}%
                    </div>
                  ) : null}
                  <div className="px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">
                    {proof.task?.title || 'Field Work'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{proof.task?.site_name || 'Client Site'}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center text-[9px] font-bold">
                      {proof.staff?.name?.charAt(0) || 'T'}
                    </div>
                    <span className="truncate font-medium text-slate-700 dark:text-slate-300">{proof.staff?.name || 'Technician'}</span>
                  </div>

                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                    {new Date(proof.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIGHTBOX / ZOOM INSPECTION MODAL */}
      {activeProof && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl my-8 flex flex-col lg:flex-row">
            {/* Image Preview (Left / Top) */}
            <div className="lg:w-7/12 bg-slate-950 flex flex-col items-center justify-center p-4 relative min-h-[400px]">
              <img
                src={showRawToggle ? activeProof.raw_photo_url : (activeProof.watermarked_photo_url || activeProof.raw_photo_url)}
                alt="Enlarged proof"
                className="max-h-[600px] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Raw vs Watermarked Toggle */}
              {activeProof.raw_photo_url && (
                <div className="mt-3 flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setShowRawToggle(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      !showRawToggle ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Watermarked Output
                  </button>
                  <button
                    onClick={() => setShowRawToggle(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      showRawToggle ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Raw Camera Capture
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Sidebar (Right / Bottom) */}
            <div className="lg:w-5/12 p-6 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">Proof Verification</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Proof #{activeProof.id}</h3>
                  </div>
                  <button
                    onClick={() => setActiveProof(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Task Details */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Task:</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-0.5">{activeProof.task?.title || 'Field Task'}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Site / Location:</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 mt-0.5">{activeProof.task?.site_name || 'Client Location'}</p>
                  </div>

                  {activeProof.task?.client_name && (
                    <div>
                      <span className="text-slate-500 font-medium">Customer:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{activeProof.task.client_name}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    <span className="text-slate-500 font-medium">Technician:</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{activeProof.staff?.name} ({activeProof.staff?.phone})</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Captured & Stamped At:</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(activeProof.created_at).toLocaleString()}
                    </p>
                  </div>

                  {activeProof.lat && activeProof.lng && (
                    <div>
                      <span className="text-slate-500 font-medium">GPS Coordinates:</span>
                      <a
                        href={`https://maps.google.com/?q=${activeProof.lat},${activeProof.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono mt-0.5 font-medium"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {activeProof.lat}, {activeProof.lng}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Gemini Vision AI Inspection Breakdown */}
                  {activeProof.ai_analysis && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          Gemini 1.5 Flash Vision AI
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {activeProof.ai_confidence ? `${Math.round(activeProof.ai_confidence)}% Confidence` : 'Verified'}
                        </span>
                      </div>

                      {activeProof.ai_analysis.detected_objects && activeProof.ai_analysis.detected_objects.length > 0 && (
                        <div>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400/80 font-medium">Detected Equipment & Scenery:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {activeProof.ai_analysis.detected_objects.map((obj, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-[10px] font-medium border border-purple-200 dark:border-purple-500/30">
                                {obj}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeProof.ai_analysis.summary_hindi && (
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 italic pt-1 border-t border-purple-200 dark:border-purple-500/20">
                          "{activeProof.ai_analysis.summary_hindi}"
                        </p>
                      )}
                    </div>
                  )}

                  {activeProof.notes && !activeProof.ai_analysis && (
                    <div>
                      <span className="text-slate-500 font-medium">Bot Notes:</span>
                      <p className="text-slate-600 dark:text-slate-300 italic mt-0.5">{activeProof.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
                <a
                  href={activeProof.watermarked_photo_url || activeProof.raw_photo_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Watermark
                </a>
                <button
                  onClick={() => setActiveProof(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
