import React, { useState, useRef, useCallback } from 'react';
import { useCheckIn, useCheckOut, useTodayAttendance, useStartLunch, useEndLunch, useRequestRegularization } from '../api/useAttendance';
import api from '@/lib/api';
import axios from 'axios';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, MapPin, Loader2, CheckCircle, Home, Utensils, Coffee, CheckCircle2, Clock, AlertCircle, Send, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AttendanceCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceCheckInModal = ({ isOpen, onClose }: AttendanceCheckInModalProps) => {
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const startLunchMutation = useStartLunch();
  const endLunchMutation = useEndLunch();
  const { data: todayStatus, isLoading: isStatusLoading } = useTodayAttendance();

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [punchMode, setPunchMode] = useState<'office' | 'wfh'>('office');

  const hasApprovedWfh = Boolean((todayStatus as any)?.has_approved_wfh || (todayStatus as any)?.work_type === 'wfh');
  const isCheckedIn = Boolean(todayStatus && todayStatus.check_in_time);
  const isCheckedOut = Boolean(todayStatus && todayStatus.check_out_time);
  const isOnLunch = Boolean((todayStatus as any)?.is_on_lunch);

  // If staff has approved WFH or already punched in as WFH, default to WFH mode
  React.useEffect(() => {
    if (hasApprovedWfh || (todayStatus as any)?.work_type === 'wfh') {
      setPunchMode('wfh');
    }
  }, [hasApprovedWfh, todayStatus]);

  const isWfh = punchMode === 'wfh' || hasApprovedWfh || (todayStatus as any)?.work_type === 'wfh';

  const regularizeMutation = useRequestRegularization();
  const [showOutOfGeofence, setShowOutOfGeofence] = useState(false);
  const [outPunchTime, setOutPunchTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [outPunchReason, setOutPunchReason] = useState('Left office premises, forgot to punch checkout');

  const handleRequestOutOfGeofence = () => {
    if (!outPunchTime) {
      toast.error('Please enter your departure time');
      return;
    }
    regularizeMutation.mutate(
      {
        date: todayStatus?.date || new Date().toISOString().split('T')[0],
        attendance_id: todayStatus?.id,
        requested_checkout: `${outPunchTime}:00`,
        reason: outPunchReason.trim() || 'Out of geofence departure request',
      },
      {
        onSuccess: () => {
          toast.success('Out-of-geofence departure request submitted to manager!');
          setShowOutOfGeofence(false);
        },
      }
    );
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera not supported. Please use HTTPS or localhost.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Camera error: ${err.message || 'Permission denied'}`);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'attendance.jpg', { type: 'image/jpeg' });
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(blob));
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      () => {
        toast.error('Unable to retrieve your location');
        setIsGettingLocation(false);
      }
    );
  };

  const handleAction = async () => {
    if (!photo) {
      toast.error('Please take a verification photo first');
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Get Presigned URL
      const { data: presignData } = await api.post('/upload/presigned-url', {
        extension: 'jpg',
        folder: 'attendance/checks'
      });
      
      const { upload_url, path } = presignData.data;

      // 2. Upload to storage
      await axios.put(upload_url, photo, {
        headers: {
          'Content-Type': photo.type
        }
      });

      // 3. Complete check-in / check-out
      const payload: any = { photo: path };
      if (location) {
        payload.latitude = location.lat;
        payload.longitude = location.lng;
      }
      if (isWfh) {
        payload.work_type = 'wfh';
      } else {
        payload.work_type = 'office';
      }

      const mutation = isCheckedIn ? checkOutMutation : checkInMutation;

      mutation.mutate(payload, {
        onSuccess: () => {
          onClose();
          setPhoto(null);
          setPhotoPreview(null);
        }
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to process attendance');
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up camera on close
  React.useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setPhoto(null);
      setPhotoPreview(null);
      setLocation(null);
    }
  }, [isOpen, stopCamera]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Attendance"
    >
      <div className="space-y-5">
        {/* Punch Mode Selection (In-Office vs WFH) */}
        {!isCheckedIn && !isCheckedOut && (
          <div className="flex p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setPunchMode('office')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                punchMode === 'office'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-zinc-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>🏢 Office Punch</span>
            </button>
            <button
              type="button"
              onClick={() => setPunchMode('wfh')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                punchMode === 'wfh'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>🏠 Work From Home (WFH)</span>
            </button>
          </div>
        )}

        {/* Free Late Grace Passes Info (When checking in) */}
        {!isCheckedIn && !isCheckedOut && todayStatus && (todayStatus.enable_late_deduction ?? true) && (
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/60 rounded-xl flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Late Grace Passes:
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-300">
              <strong className="text-amber-600 dark:text-amber-400">{todayStatus.free_lates_remaining ?? 0}</strong> of {todayStatus.late_free_waiver_count ?? 2} free passes remaining this month
            </span>
          </div>
        )}

        {/* WFH Notification Banner */}
        {isWfh && !isCheckedIn && !isCheckedOut && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 rounded-xl flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
            <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                Work From Home (WFH) Punch Mode
                <Badge variant="success" className="text-[10px] uppercase font-black tracking-wider">Geofence Waived</Badge>
              </div>
              <p className="mt-1 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Geofence verification is waived. Only a selfie or workstation photo is required to mark attendance.
              </p>
            </div>
          </div>
        )}

        {/* Past 7 PM Reminder Alert (If checked in past alert time) */}
        {isCheckedIn && !isCheckedOut && todayStatus?.should_alert_checkout && (
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <div className="font-extrabold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                Evening Check-Out Reminder
                <Badge variant="warning" className="text-[10px] uppercase font-black tracking-wider">Past 7:00 PM</Badge>
              </div>
              <p className="mt-1 text-amber-800 dark:text-amber-300 leading-relaxed">
                {todayStatus?.alert_message || 'You have not checked out yet. If you are already out of the hotel/office geofence area, please submit an Out-of-Geofence Departure Request below.'}
              </p>
            </div>
          </div>
        )}

        {/* Pending Regularization / Departure Request */}
        {isCheckedIn && !isCheckedOut && todayStatus?.regularization_status === 'pending' && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800/60 rounded-xl flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                Departure Request Submitted
                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-wider border-blue-400 text-blue-600">Pending Admin Approval</Badge>
              </div>
              <p className="mt-1 text-blue-800 dark:text-blue-300 leading-relaxed">
                Requested check-out time: <strong>{todayStatus.regularization_requested_checkout || 'Evening'}</strong> ({todayStatus.regularization_reason || 'Out of geofence'}). Once verified by admin, your shift will be completed without penalty.
              </p>
            </div>
          </div>
        )}

        {/* Out-of-Geofence Request Box (When Checked In) */}
        {isCheckedIn && !isCheckedOut && todayStatus?.regularization_status !== 'pending' && (
          <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOutOfGeofence(!showOutOfGeofence)}
              className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-blue-50/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
                  Left Office / Out of Geofence? Request Admin Out-Punch
                </span>
              </div>
              {showOutOfGeofence ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
            </button>

            {showOutOfGeofence && (
              <div className="p-3.5 pt-0 space-y-3 border-t border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  If you are already outside the hotel GPS boundary, enter the time you left the premises. Your manager will approve it to ensure full shift credit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Actual Departure Time *
                    </label>
                    <Input
                      type="time"
                      value={outPunchTime}
                      onChange={(e) => setOutPunchTime(e.target.value)}
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Reason / Note
                    </label>
                    <Input
                      type="text"
                      value={outPunchReason}
                      onChange={(e) => setOutPunchReason(e.target.value)}
                      placeholder="e.g. Left at 6:30 PM, forgot to punch"
                      className="h-9 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={handleRequestOutOfGeofence}
                  disabled={regularizeMutation.isPending}
                  className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {regularizeMutation.isPending ? 'Submitting Request...' : 'Submit Departure Request to Admin'}
                </Button>
              </div>
            )}
          </div>
        )}

        {isCheckedOut ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-lg font-bold">You're done for today!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Checked in at <strong>{todayStatus?.check_in_time}</strong> — Checked out at <strong>{todayStatus?.check_out_time}</strong>
              </p>
            </div>

            {/* Dual Time Calculation Summary */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-700 max-w-md mx-auto text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">Office Present Time</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {(todayStatus as any)?.office_present_hours ?? (todayStatus as any)?.gross_presence_hours ?? '—'}h
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block">Lunch Time</span>
                <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                  {(todayStatus as any)?.lunch_minutes || 0}m
                </span>
              </div>
              <div className="bg-emerald-500/10 rounded-lg py-1 border border-emerald-500/20">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">Exact Working Hour</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                  {(todayStatus as any)?.exact_working_hours ?? todayStatus?.actual_hours ?? '—'}h
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Geolocation Section (Only for in-office staff; bypassed for WFH) */}
            {!isWfh && (
              <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-xs flex items-center gap-2">
                      <MapPin size={15} className="text-primary-500" /> Current Location
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Required for hotel geofence validation</p>
                  </div>
                  {location ? (
                    <Badge variant="success">Acquired</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={getLocation} disabled={isGettingLocation} className="text-xs h-8">
                      {isGettingLocation ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-1" /> : null}
                      {isGettingLocation ? 'Acquiring...' : 'Get Location'}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Lunch Break Management Section (When staff is checked in and on duty) */}
            {isCheckedIn && (
              <div className="p-3.5 bg-amber-500/[0.07] border border-amber-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Lunch Break
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isOnLunch 
                          ? `On lunch since ${(todayStatus as any)?.lunch_start_time || 'now'}` 
                          : (todayStatus as any)?.lunch_minutes 
                            ? `${(todayStatus as any)?.lunch_minutes} mins lunch break recorded` 
                            : 'Take lunch break to deduct from working hours'}
                      </p>
                    </div>
                  </div>

                  {isOnLunch ? (
                    <Button
                      size="sm"
                      onClick={() => endLunchMutation.mutate()}
                      isLoading={endLunchMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      End Lunch
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startLunchMutation.mutate()}
                      isLoading={startLunchMutation.isPending}
                      className="border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold h-8 cursor-pointer"
                    >
                      <Coffee className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      Take Lunch Break
                    </Button>
                  )}
                </div>

                {/* Live Two-Time Calculations */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-500/15 text-center">
                  <div className="bg-white/80 dark:bg-zinc-800/80 p-2 rounded-lg border border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-semibold text-slate-500 block">Office Present</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {(todayStatus as any)?.office_present_hours !== undefined && (todayStatus as any)?.office_present_hours !== null
                        ? `${(todayStatus as any)?.office_present_hours}h`
                        : 'On Duty'}
                    </span>
                  </div>
                  <div className="bg-white/80 dark:bg-zinc-800/80 p-2 rounded-lg border border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block">Lunch Time</span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                      {isOnLunch ? 'Active' : `${(todayStatus as any)?.lunch_minutes || 0}m`}
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">Exact Working</span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                      {(todayStatus as any)?.exact_working_hours !== undefined && (todayStatus as any)?.exact_working_hours !== null
                        ? `${(todayStatus as any)?.exact_working_hours}h`
                        : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Verification Section */}
            <div>
              <h4 className="font-bold text-xs mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Camera size={15} className="text-primary-500" /> 
                {isWfh ? 'Selfie / Workstation Photo Verification' : 'Photo Verification'}
              </h4>
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="absolute bottom-3 right-3 text-xs h-8 font-bold"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                        startCamera();
                      }}
                    >
                      Retake
                    </Button>
                  </>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`} />
                    {isCameraOn ? (
                      <Button 
                        onClick={takePhoto}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full h-11 w-11 p-0 shadow-lg hover:scale-105 transition-transform bg-primary-600 text-white"
                      >
                        <Camera size={18} />
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={startCamera} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 text-white text-xs font-bold">
                        <Camera size={15} className="mr-2" /> Start Camera
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Action Check In / Check Out Button */}
            <Button 
              className={`w-full h-11 text-sm font-bold shadow-sm ${
                isCheckedIn 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
              onClick={handleAction}
              disabled={!photo || isUploading || (!isWfh && !location) || checkInMutation.isPending || checkOutMutation.isPending}
            >
              {(isUploading || checkInMutation.isPending || checkOutMutation.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isUploading ? 'Uploading Verification Photo...' : 'Processing Attendance...'}
                </>
              ) : (
                isCheckedIn ? 'Check Out for Today' : (isWfh ? '🏠 WFH Check In (Photo Verified)' : '🏢 In-Office Check In')
              )}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
